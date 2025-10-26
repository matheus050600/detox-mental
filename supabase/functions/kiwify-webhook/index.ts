import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Receber payload da Kiwify
    const payload = await req.json()
    console.log('📩 Webhook recebido da Kiwify:', JSON.stringify(payload, null, 2))

    // Extrair dados do cliente
    const customerEmail = payload.Customer?.email || payload.customer_email
    const customerName = payload.Customer?.full_name || payload.Customer?.first_name || payload.customer_name
    const orderId = payload.order_id
    const subscriptionId = payload.subscription_id
    const orderStatus = payload.order_status
    const subscriptionStatus = payload.Subscription?.status

    console.log('📧 Email:', customerEmail)
    console.log('📦 Order ID:', orderId)
    console.log('💰 Status:', orderStatus, '/', subscriptionStatus)

    // Verificar se é um pagamento válido
    if (!customerEmail) {
      console.error('❌ Email do cliente não encontrado no payload')
      return new Response(
        JSON.stringify({ success: false, error: 'Email não encontrado' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Conectar ao Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // 1. Salvar webhook no log
    console.log('💾 Salvando webhook no log...')
    await supabase.from('kiwify_webhooks').insert({
      order_id: orderId,
      order_status: orderStatus,
      webhook_event_type: payload.webhook_event_type,
      customer_email: customerEmail,
      customer_name: customerName,
      subscription_id: subscriptionId,
      subscription_status: subscriptionStatus,
      raw_payload: payload,
      processed: false
    })

    // 2. Processar pagamento apenas se for 'paid' ou 'active'
    if (orderStatus === 'paid' || subscriptionStatus === 'active') {
      console.log('✅ Pagamento confirmado! Liberando acesso...')

      // Chamar função SQL para liberar acesso
      const { data, error } = await supabase.rpc('grant_access_after_purchase', {
        p_email: customerEmail,
        p_customer_name: customerName,
        p_order_id: orderId,
        p_subscription_id: subscriptionId
      })

      if (error) {
        console.error('❌ Erro ao liberar acesso:', error)
        throw error
      }

      console.log('🎉 Acesso liberado:', data)

      // Marcar webhook como processado
      await supabase
        .from('kiwify_webhooks')
        .update({ processed: true, processed_at: new Date().toISOString() })
        .eq('order_id', orderId)

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Webhook processado com sucesso',
          result: data
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )

    } else if (orderStatus === 'refunded' || subscriptionStatus === 'canceled') {
      console.log('❌ Pagamento cancelado/reembolsado. Removendo acesso...')

      // Desativar token
      await supabase
        .from('access_tokens')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('email', customerEmail)
        .eq('token', 'rsmplzhq7p9')

      // Atualizar usuário para blocked
      await supabase
        .from('users')
        .update({
          has_active_token: false,
          plan_type: 'blocked',
          updated_at: new Date().toISOString()
        })
        .eq('email', customerEmail)

      // Atualizar assinatura
      await supabase
        .from('subscriptions')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', supabase.from('users').select('id').eq('email', customerEmail).single())

      console.log('✅ Acesso removido')

      return new Response(
        JSON.stringify({ success: true, message: 'Acesso revogado' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )

    } else {
      console.log('ℹ️ Status não requer ação:', orderStatus, subscriptionStatus)

      return new Response(
        JSON.stringify({ success: true, message: 'Webhook recebido mas não processado' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
