# 🚀 Sistema de Acesso Automático ao Dashboard após Compra

## ✅ Como Funciona

O sistema libera acesso automaticamente quando a pessoa compra na Kiwify e se cadastra no site.

---

## 🔄 Fluxo Automático

### **Cenário 1: Pessoa compra ANTES de se cadastrar**

```
1. Cliente compra no link Kiwify → https://pay.kiwify.com.br/aj7NocQ
2. Kiwify envia webhook para seu site
3. Sistema cria "token pendente" com o email do cliente
4. Cliente acessa detoxmental.site e clica em "Criar conta"
5. Cliente preenche formulário com MESMO EMAIL da compra
6. Sistema detecta token pendente automaticamente
7. ✅ Cliente é liberado como PREMIUM e vai direto pro dashboard!
```

### **Cenário 2: Pessoa se cadastra ANTES de comprar**

```
1. Cliente acessa detoxmental.site e cria conta (fica como FREE)
2. Cliente vê página "Acesso Negado" e clica em "Assinar Agora"
3. Cliente compra no link Kiwify
4. Kiwify envia webhook para seu site
5. Sistema encontra usuário pelo email
6. ✅ Cliente é atualizado para PREMIUM automaticamente!
7. Cliente faz login e entra direto no dashboard!
```

---

## 📋 Passo a Passo para Ativar

### **1. Executar Migration no Supabase**

1. Acesse: https://app.supabase.com/
2. Selecione seu projeto: `uetgenymwhiadqczpicc`
3. Vá em **SQL Editor** → **New Query**
4. Abra o arquivo: `supabase/migrations/20250124_auto_access_on_purchase.sql`
5. Copie **TODO** o conteúdo
6. Cole no SQL Editor
7. Clique em **RUN** (Ctrl+Enter)

Você verá mensagens de sucesso! ✅

### **2. Configurar Webhook na Kiwify**

1. Acesse: https://dashboard.kiwify.com.br/
2. Selecione seu produto **Detox Mental**
3. Vá em **Configurações** → **Webhooks**
4. Clique em **Adicionar Webhook**
5. Cole a URL:
   ```
   https://detoxmental.site/api/webhook/kiwify
   ```
6. Selecione os eventos:
   - ✅ `order.paid` (Pedido pago)
   - ✅ `order.refunded` (Pedido reembolsado)
   - ✅ `subscription.started` (Assinatura iniciada)
   - ✅ `subscription.canceled` (Assinatura cancelada)
7. Salve!

### **3. Criar Endpoint de Webhook (Edge Function)**

Você precisa criar uma função serverless para receber os webhooks da Kiwify.

**Arquivo:** `supabase/functions/kiwify-webhook/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json()
    console.log('📩 Webhook recebido:', payload)

    // Criar cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Processar webhook usando a função SQL
    const { data, error } = await supabase.rpc('process_kiwify_webhook', {
      payload: payload
    })

    if (error) {
      console.error('❌ Erro ao processar webhook:', error)
      throw error
    }

    console.log('✅ Webhook processado:', data)

    return new Response(
      JSON.stringify({ success: true, result: data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('❌ Erro:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
```

**Deploy da Edge Function:**

```bash
# No terminal, na pasta do projeto
supabase functions deploy kiwify-webhook

# Ou via Supabase Dashboard:
# Edge Functions → New Function → kiwify-webhook
```

---

## 🧪 Como Testar

### **Teste 1: Simular compra de pessoa SEM cadastro**

No Supabase SQL Editor:

```sql
-- Simular compra de pessoa que não tem cadastro
SELECT public.grant_access_after_purchase(
    'joao@example.com',
    'João Silva',
    'ORDER-TEST-001',
    'SUB-TEST-001'
);

-- Verificar token pendente criado
SELECT * FROM public.access_tokens
WHERE email = 'joao@example.com';
```

Agora vá no site e cadastre com email `joao@example.com` → deve entrar direto no dashboard como PREMIUM!

### **Teste 2: Simular compra de pessoa que JÁ tem cadastro**

```sql
-- Primeiro, criar um usuário manualmente (ou use um que já existe)
-- Depois simular compra:
SELECT public.grant_access_after_purchase(
    'maria@example.com',  -- Use email de usuário existente
    'Maria Silva',
    'ORDER-TEST-002',
    'SUB-TEST-002'
);

-- Verificar se foi liberado
SELECT public.check_user_access(
    (SELECT id FROM public.users WHERE email = 'maria@example.com')
);
```

Agora faça login com `maria@example.com` → deve entrar direto no dashboard!

### **Teste 3: Ver todos os acessos ativos**

```sql
SELECT
    u.name,
    u.email,
    u.plan_type,
    u.has_active_token,
    at.is_active as token_ativo,
    at.granted_at as liberado_em,
    s.plan as plano_assinatura,
    s.status as status_assinatura
FROM public.users u
LEFT JOIN public.access_tokens at ON u.id = at.user_id AND at.token = 'rsmplzhq7p9'
LEFT JOIN public.subscriptions s ON u.id = s.user_id
WHERE u.has_active_token = TRUE
ORDER BY u.created_at DESC;
```

---

## 🔍 Verificar Status de um Usuário

```sql
-- Substituir pelo ID real do usuário
SELECT public.check_user_access('UUID-DO-USUARIO-AQUI');
```

Retorna JSON completo com:
- ✅ Status de acesso
- ✅ Tipo de plano (free/premium)
- ✅ Token ativo
- ✅ Dados da assinatura

---

## 🛠️ Funções SQL Criadas

### `grant_access_after_purchase()`
Libera acesso automaticamente após compra. Chamada pelo webhook.

**Parâmetros:**
- `p_email` - Email do cliente
- `p_customer_name` - Nome do cliente (opcional)
- `p_order_id` - ID do pedido Kiwify (opcional)
- `p_subscription_id` - ID da assinatura Kiwify (opcional)

### `auto_grant_access_on_signup()` (Trigger)
Executado automaticamente quando pessoa se cadastra. Vincula token pendente se existir.

### `process_kiwify_webhook()`
Processa webhook da Kiwify e chama as funções acima automaticamente.

### `check_user_access()`
Verifica status completo de acesso de um usuário.

---

## 📊 Monitorar Webhooks Recebidos

```sql
-- Ver últimos webhooks recebidos
SELECT
    id,
    order_id,
    customer_email,
    customer_name,
    order_status,
    subscription_status,
    processed,
    processed_at,
    created_at
FROM public.kiwify_webhooks
ORDER BY created_at DESC
LIMIT 20;

-- Ver webhooks não processados
SELECT * FROM public.kiwify_webhooks
WHERE processed = FALSE
ORDER BY created_at DESC;
```

---

## ⚠️ Troubleshooting

### **Problema: Pessoa comprou mas não consegue entrar no dashboard**

**Verificar:**

1. **Token foi criado?**
```sql
SELECT * FROM public.access_tokens
WHERE email = 'EMAIL_DO_CLIENTE';
```

2. **Usuário foi atualizado?**
```sql
SELECT
    email,
    has_active_token,
    plan_type,
    token_granted_at
FROM public.users
WHERE email = 'EMAIL_DO_CLIENTE';
```

3. **Webhook foi recebido?**
```sql
SELECT * FROM public.kiwify_webhooks
WHERE customer_email = 'EMAIL_DO_CLIENTE'
ORDER BY created_at DESC;
```

### **Problema: Webhook não está sendo recebido**

1. Verifique se Edge Function está deployada:
   - Dashboard Supabase → Edge Functions → deve aparecer `kiwify-webhook`

2. Teste manualmente a Edge Function:
   ```bash
   curl -X POST https://SEU-PROJETO.supabase.co/functions/v1/kiwify-webhook \
     -H "Authorization: Bearer SEU_ANON_KEY" \
     -H "Content-Type: application/json" \
     -d '{"order_id":"TEST","order_status":"paid","Customer":{"email":"teste@example.com"}}'
   ```

3. Verifique logs da Edge Function:
   - Dashboard → Edge Functions → kiwify-webhook → Logs

### **Problema: Email do cadastro diferente da compra**

Se o cliente comprou com um email e se cadastrou com outro, você pode vincular manualmente:

```sql
-- Transferir token para novo email
UPDATE public.access_tokens
SET
    email = 'email_do_cadastro@example.com',
    user_id = (SELECT id FROM public.users WHERE email = 'email_do_cadastro@example.com')
WHERE email = 'email_da_compra@example.com';

-- Atualizar usuário
UPDATE public.users
SET
    has_active_token = TRUE,
    plan_type = 'premium',
    token_granted_at = NOW()
WHERE email = 'email_do_cadastro@example.com';
```

---

## 🎯 Checklist de Implementação

- [ ] Executar migration `20250124_auto_access_on_purchase.sql` no Supabase
- [ ] Criar Edge Function `kiwify-webhook`
- [ ] Fazer deploy da Edge Function
- [ ] Configurar webhook na Kiwify apontando para Edge Function
- [ ] Testar cenário 1: Compra antes de cadastro
- [ ] Testar cenário 2: Cadastro antes de compra
- [ ] Testar cancelamento/reembolso
- [ ] Monitorar logs de webhooks recebidos

---

## 🚀 Está Pronto!

Agora o sistema funciona 100% automaticamente:

✅ Cliente compra → Sistema detecta via webhook
✅ Cliente se cadastra → Sistema vincula automaticamente
✅ Cliente entra no dashboard → Acesso liberado!

**Zero esforço manual!** 🎉

---

**Desenvolvido com ❤️ por Claude Code**

_"Automatize ou se arrependa"_
