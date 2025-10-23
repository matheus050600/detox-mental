# = Detox Mental - Guia de Configuração do Webhook Kiwify

Este guia ensina como configurar o webhook da **Kiwify** para liberar automaticamente o acesso dos usuários que comprarem a assinatura.

---

## =Ë O que o webhook faz?

Quando um usuário **compra ou renova** a assinatura na Kiwify, o webhook:

1.  Recebe a notificação de pagamento
2.  Cria/atualiza o registro no banco de dados
3.  Libera o token de acesso `rsmplzhq7p9` para o usuário
4.  Atualiza o plano para **Premium**
5.  Permite acesso ao dashboard

Quando uma assinatura é **cancelada ou reembolsada**:

1. L Desativa o token de acesso
2. L Bloqueia o acesso ao dashboard
3. L Mantém o perfil do usuário (histórico preservado)

---

## <× Arquitetura

```
Kiwify (pagamento)
    “
Webhook URL (Supabase Edge Function)
    “
Função: process_kiwify_webhook()
    “
Tabelas: kiwify_webhooks + access_tokens + users + subscriptions
    “
Frontend: ProtectedRoute verifica token
```

---

## =€ Opção 1: Webhook via Supabase Edge Function (Recomendado)

### Passo 1: Criar Edge Function no Supabase

1. Acesse o Dashboard do Supabase
2. Vá em **Edge Functions**
3. Clique em **Create Function**
4. Nome: `kiwify-webhook`
5. Cole o código abaixo:

```typescript
// supabase/functions/kiwify-webhook/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Parse o payload do webhook
    const payload = await req.json()

    console.log('=å Webhook recebido:', payload)

    // Chamar função que processa o webhook
    const { data, error } = await supabase.rpc('process_kiwify_webhook', {
      payload: payload
    })

    if (error) {
      console.error('L Erro ao processar webhook:', error)
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(' Webhook processado com sucesso:', data)

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (err) {
    console.error('L Erro no webhook:', err)
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
```

### Passo 2: Deploy da Edge Function

```bash
# Instalar Supabase CLI (se ainda não tiver)
npm install -g supabase

# Login
supabase login

# Link com seu projeto
supabase link --project-ref SEU_PROJECT_ID

# Deploy da função
supabase functions deploy kiwify-webhook
```

### Passo 3: Obter URL do Webhook

Após o deploy, a URL será:
```
https://SEU_PROJECT_ID.supabase.co/functions/v1/kiwify-webhook
```

---

## =' Opção 2: Webhook via API Externa (Vercel, Netlify, etc.)

Se você preferir hospedar o webhook em outro lugar, use este código:

### Código para API Route (Next.js / Vercel)

```typescript
// pages/api/webhook/kiwify.ts ou app/api/webhook/kiwify/route.ts

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use a Service Role Key (não a anon key)
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const payload = req.body

    console.log('=å Webhook Kiwify recebido:', payload)

    // Processar webhook
    const { data, error } = await supabase.rpc('process_kiwify_webhook', {
      payload: payload
    })

    if (error) {
      console.error('L Erro:', error)
      return res.status(500).json({ success: false, error: error.message })
    }

    console.log(' Processado:', data)
    return res.status(200).json({ success: true, data })

  } catch (err) {
    console.error('L Erro:', err)
    return res.status(500).json({ success: false, error: err.message })
  }
}
```

---

## = Configurar Webhook na Kiwify

### Passo 1: Acessar Dashboard da Kiwify

1. Faça login em: https://dashboard.kiwify.com.br/
2. Selecione seu produto
3. Vá em **Configurações** ’ **Webhooks**

### Passo 2: Adicionar URL do Webhook

- **URL do Webhook**: Cole a URL da sua Edge Function ou API
  - Exemplo Supabase: `https://seu-projeto.supabase.co/functions/v1/kiwify-webhook`
  - Exemplo Vercel: `https://seu-site.vercel.app/api/webhook/kiwify`

- **Eventos para notificar**: Selecione todos relacionados a pagamento
  -  `order_approved` (Pedido aprovado)
  -  `order_refunded` (Pedido reembolsado)
  -  `subscription_created` (Assinatura criada)
  -  `subscription_updated` (Assinatura atualizada)
  -  `subscription_canceled` (Assinatura cancelada)

- Clique em **Salvar**

### Passo 3: Testar o Webhook

A Kiwify possui um botão **"Testar Webhook"** que envia um payload de exemplo.

---

## >ê Testar Manualmente

Você pode testar o webhook manualmente usando o SQL Editor do Supabase:

```sql
-- Simular pagamento aprovado
SELECT process_kiwify_webhook('{
  "order_id": "test-123",
  "order_status": "paid",
  "webhook_event_type": "order_approved",
  "Customer": {
    "email": "teste@example.com",
    "full_name": "João da Silva"
  },
  "subscription_id": "sub-123",
  "Subscription": {
    "status": "active"
  }
}'::jsonb);
```

Isso deve:
1. Criar um registro na tabela `kiwify_webhooks`
2. Criar um token ativo na tabela `access_tokens`
3. Liberar acesso para `teste@example.com`

---

##  Verificar se Funcionou

### 1. Verificar tabelas no Supabase

```sql
-- Ver webhooks recebidos
SELECT * FROM kiwify_webhooks ORDER BY created_at DESC LIMIT 10;

-- Ver tokens criados
SELECT * FROM access_tokens ORDER BY created_at DESC LIMIT 10;

-- Ver status de acesso dos usuários
SELECT * FROM user_access_status;
```

### 2. Testar no Frontend

1. Crie uma conta com o email usado no pagamento
2. Faça login
3. Tente acessar `/hoje` ou `/perfil`
4. Você deve ser redirecionado para `/acesso-negado` se o token não estiver ativo
5. Após o webhook processar, o acesso deve ser liberado

---

## = Segurança

### IMPORTANTE: Use Service Role Key

Para o webhook funcionar corretamente, você precisa usar a **Service Role Key** do Supabase (não a anon key).

**Onde encontrar:**
1. Dashboard do Supabase ’ **Project Settings** ’ **API**
2. Copie a **service_role** key (começa com `eyJhbG...`)

**Variáveis de ambiente:**

Para Edge Functions:
```bash
# Já está configurado automaticamente
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
```

Para API externa:
```env
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
```

### Validar Origem do Webhook (Opcional)

Para maior segurança, você pode validar se o webhook realmente veio da Kiwify:

```typescript
// Verificar IP ou assinatura da Kiwify
const kiwifyIPs = ['IP_DA_KIWIFY'] // Consulte a documentação
if (!kiwifyIPs.includes(req.headers.get('x-forwarded-for'))) {
  return new Response('Unauthorized', { status: 401 })
}
```

---

## =Ê Monitorar Webhooks

### Ver logs no Supabase

```sql
-- Ver todos os webhooks recebidos hoje
SELECT
    order_id,
    customer_email,
    order_status,
    subscription_status,
    processed,
    created_at
FROM kiwify_webhooks
WHERE DATE(created_at) = CURRENT_DATE
ORDER BY created_at DESC;

-- Ver webhooks não processados
SELECT * FROM kiwify_webhooks WHERE processed = FALSE;
```

### Dashboard de Webhooks (Futuro)

Você pode criar uma página admin para visualizar todos os webhooks:

```typescript
// src/pages/admin/Webhooks.tsx
import { useEffect, useState } from 'react'
import { getKiwifyWebhooks } from '@/lib/supabase'

export default function WebhooksAdmin() {
  const [webhooks, setWebhooks] = useState([])

  useEffect(() => {
    async function load() {
      const data = await getKiwifyWebhooks(100)
      setWebhooks(data)
    }
    load()
  }, [])

  return (
    <div>
      <h1>Webhooks Recebidos</h1>
      {/* Renderizar tabela com webhooks */}
    </div>
  )
}
```

---

## = Solução de Problemas

### L Erro: "relation 'access_tokens' does not exist"

**Causa**: Migration não foi executada.

**Solução**: Execute a migration `20250122_kiwify_webhook_integration.sql` no SQL Editor.

### L Webhook não está sendo recebido

**Verificar**:
1. URL está correta na Kiwify?
2. Edge Function está deployed?
3. Verificar logs da Edge Function no Supabase

### L Token não está sendo criado

**Verificar**:
1. O `order_status` está como `paid`?
2. A função `process_kiwify_webhook` retornou erro?
3. Verificar logs no SQL Editor:
   ```sql
   SELECT * FROM kiwify_webhooks WHERE processed = FALSE;
   ```

### L Usuário ainda não tem acesso após pagamento

**Verificar**:
1. Email do usuário é o mesmo do pagamento?
2. Token está ativo?
   ```sql
   SELECT * FROM access_tokens WHERE email = 'email@usuario.com';
   ```
3. Limpar cache do navegador e fazer login novamente

---

## <‰ Conclusão

Agora seu sistema de webhook Kiwify está configurado!

**Fluxo completo:**

1. Usuário paga na Kiwify ’
2. Kiwify envia webhook ’
3. Supabase processa e libera token ’
4. Usuário faz login ’
5. Acesso liberado automaticamente 

**Token de acesso:**
```
rsmplzhq7p9
```

Este token é fixo e único para todos os usuários. Apenas usuários com assinatura ativa terão este token vinculado à sua conta.

---

**Dúvidas?** Consulte a documentação da Kiwify: https://developers.kiwify.com.br/webhooks
