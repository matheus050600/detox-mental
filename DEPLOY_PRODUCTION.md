# =� Deploy Detox Mental em Produ��o

## < Dom�nio: https://detoxmental.site/

Este guia cont�m **todos os passos** para fazer o deploy do Detox Mental no dom�nio **detoxmental.site** usando **Vercel** (recomendado).

---

## =� Pr�-requisitos

Antes de come�ar, certifique-se de ter:

-  Conta no [Vercel](https://vercel.com/) (gratuita)
-  Dom�nio **detoxmental.site** registrado
-  Conta no Supabase configurada
-  Migrations executadas no Supabase
-  Git instalado
-  Node.js instalado

---

## <� PASSO 1: Preparar Banco de Dados (Supabase)

### 1.1 Executar Migrations

Acesse: https://app.supabase.com/ � Seu Projeto � **SQL Editor**

Execute em ordem:

#### Migration 1: Schema Principal
```sql
-- Cole TODO o conte�do de:
-- supabase/migrations/20250121_init_detox_mental.sql
```

#### Migration 2: Kiwify Webhook
```sql
-- Cole TODO o conte�do de:
-- supabase/migrations/20250122_kiwify_webhook_integration.sql
```

### 1.2 Obter Credenciais

No Dashboard do Supabase, v� em: **Project Settings** � **API**

Copie:
-  **Project URL**: `https://uetgenymwhiadqczpicc.supabase.co`
-  **anon public key**: `eyJhbGc...` (chave longa)

**� IMPORTANTE**: Guarde essas informa��es, voc� vai precisar!

### 1.3 Configurar URLs Permitidas

No Supabase: **Authentication** � **URL Configuration**

Adicione:
```
https://detoxmental.site
https://detoxmental.site/*
https://*.vercel.app
```

---

## <� PASSO 2: Preparar C�digo para Deploy

### 2.1 Criar Reposit�rio no GitHub

```bash
# 1. Criar reposit�rio no GitHub (via web)
# Nome: detox-mental
# Privado ou P�blico (sua escolha)

# 2. Inicializar Git (se ainda n�o tiver)
cd "C:\Users\mathe\Downloads\detox mental backup - Copia\breath-essence-app-main"
git init

# 3. Adicionar origin
git remote add origin https://github.com/SEU_USUARIO/detox-mental.git

# 4. Adicionar arquivos
git add .

# 5. Commit
git commit -m "Initial commit - Detox Mental com Kiwify"

# 6. Push
git branch -M main
git push -u origin main
```

### 2.2 Verificar .gitignore

Certifique-se de que `.env` est� no `.gitignore`:

```bash
# Ver se est� ignorado
cat .gitignore | grep ".env"
```

Deve ter:
```
.env
.env.local
.env.production.local
```

**� NUNCA** commite o arquivo `.env` com as chaves reais!

---

## <� PASSO 3: Deploy na Vercel

### 3.1 Conectar Projeto

1. Acesse: https://vercel.com/
2. Fa�a login (com GitHub)
3. Clique em **"Add New..."** � **"Project"**
4. Selecione o reposit�rio **detox-mental**
5. Clique em **"Import"**

### 3.2 Configurar Build

Na tela de configura��o:

**Framework Preset**: Vite
**Build Command**: `npm run build`
**Output Directory**: `dist`
**Install Command**: `npm install`

### 3.3 Configurar Vari�veis de Ambiente

**MUITO IMPORTANTE!** Clique em **"Environment Variables"** e adicione:

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | `https://uetgenymwhiadqczpicc.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Cole sua anon key do Supabase aqui |

**Environment**: Marque todos (Production, Preview, Development)

### 3.4 Deploy

Clique em **"Deploy"** e aguarde (~2 minutos).

Voc� receber� um link tempor�rio tipo:
```
https://detox-mental-abc123.vercel.app
```

 **Teste este link primeiro!** Acesse e veja se est� funcionando.

---

## <� PASSO 4: Conectar Dom�nio Personalizado

### 4.1 Na Vercel

1. Ap�s o deploy, v� na aba **"Settings"** do projeto
2. Clique em **"Domains"**
3. Adicione: `detoxmental.site`
4. Adicione tamb�m: `www.detoxmental.site` (opcional)

A Vercel vai mostrar as configura��es de DNS necess�rias.

### 4.2 No Provedor do Dom�nio

Acesse o painel onde voc� registrou **detoxmental.site** (ex: GoDaddy, Registro.br, Hostinger, etc.)

Adicione os seguintes registros DNS:

#### Op��o A: Apex Domain (Recomendado)

```
Type: A
Name: @
Value: 76.76.21.21
TTL: Auto
```

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: Auto
```

#### Op��o B: Apenas CNAME

```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
TTL: Auto
```

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: Auto
```

**� Aguarde**: A propaga��o DNS pode levar de 5 minutos a 48 horas.

### 4.3 Verificar

Ap�s a propaga��o, acesse:
```
https://detoxmental.site
```

 Deve carregar seu app!

---

## <� PASSO 5: Configurar Webhook da Kiwify

Agora que est� em produ��o, configure o webhook:

### 5.1 Criar Edge Function no Supabase

Dashboard do Supabase � **Edge Functions** � **Create Function**

Nome: `kiwify-webhook`

C�digo:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const payload = await req.json()
    console.log('=� Webhook recebido:', payload)

    const { data, error } = await supabase.rpc('process_kiwify_webhook', {
      payload: payload
    })

    if (error) {
      console.error('L Erro:', error)
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(' Processado:', data)
    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('L Erro:', err)
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

**Deploy da fun��o**: Clique em **"Deploy"**

### 5.2 Obter URL do Webhook

URL final:
```
https://uetgenymwhiadqczpicc.supabase.co/functions/v1/kiwify-webhook
```

### 5.3 Configurar na Kiwify

1. Dashboard Kiwify: https://dashboard.kiwify.com.br/
2. Seu produto � **Configura��es** � **Webhooks**
3. **URL do Webhook**: `https://uetgenymwhiadqczpicc.supabase.co/functions/v1/kiwify-webhook`
4. **Eventos**: Marque todos
   -  order_approved
   -  order_refunded
   -  subscription_created
   -  subscription_canceled
5. **Salvar**

### 5.4 Testar Webhook

Clique em **"Testar Webhook"** na Kiwify.

Verifique no Supabase:

```sql
SELECT * FROM kiwify_webhooks ORDER BY created_at DESC LIMIT 5;
```

Deve aparecer um registro! 

---

## <� PASSO 6: Configurar Link de Venda

Edite o arquivo: `src/pages/AcessoNegado.tsx`

Linha ~90:

```typescript
<Button
  onClick={() => window.open("https://seu-link-kiwify.com.br/produto", "_blank")}
  ...
>
```

Substitua pelo seu link de venda da Kiwify.

**Commit e push:**

```bash
git add src/pages/AcessoNegado.tsx
git commit -m "Adicionar link de venda Kiwify"
git push
```

A Vercel vai fazer o redeploy automaticamente! =�

---

## <� PASSO 7: Testar Fluxo Completo

### Teste 1: Acesso Negado

1. Acesse: https://detoxmental.site/cadastro
2. Crie uma conta com qualquer email
3. Fa�a login
4. Tente acessar: https://detoxmental.site/hoje
5.  Deve redirecionar para `/acesso-negado`

### Teste 2: Liberar Acesso via SQL (Simula��o)

No SQL Editor do Supabase:

```sql
-- Substituir pelo email da conta criada
SELECT process_kiwify_webhook('{
  "order_id": "test-prod-001",
  "order_status": "paid",
  "webhook_event_type": "order_approved",
  "Customer": {
    "email": "SEU_EMAIL_AQUI@example.com",
    "full_name": "Teste Produ��o"
  },
  "subscription_id": "sub-test-001",
  "Subscription": {"status": "active"}
}'::jsonb);
```

### Teste 3: Acesso Liberado

1. Fa�a logout
2. Fa�a login novamente
3. Acesse: https://detoxmental.site/hoje
4.  Deve acessar normalmente!

### Teste 4: Compra Real (Pagamento de Teste)

Se a Kiwify permitir, fa�a um pagamento de teste e veja se:
1. Webhook chega no Supabase 
2. Token � liberado 
3. Acesso � concedido automaticamente 

---

## =� Monitoramento em Produ��o

### Ver Logs da Vercel

1. Dashboard Vercel � Seu projeto � **Deployments**
2. Clique no deployment mais recente
3. Veja os logs de build e runtime

### Ver Logs do Supabase

1. Dashboard Supabase � **Functions** � `kiwify-webhook`
2. Ver logs em tempo real
3. Ou via SQL:

```sql
-- Webhooks recebidos hoje
SELECT
  order_id,
  customer_email,
  order_status,
  webhook_event_type,
  processed,
  created_at
FROM kiwify_webhooks
WHERE DATE(created_at) = CURRENT_DATE
ORDER BY created_at DESC;
```

### Ver Usu�rios Ativos

```sql
SELECT
  email,
  name,
  has_active_token,
  plan_type,
  kiwify_subscription_status,
  token_granted_at
FROM users
WHERE has_active_token = TRUE
ORDER BY token_granted_at DESC;
```

---

## =' Comandos �teis

### Atualizar Produ��o

```bash
# Ap�s fazer altera��es no c�digo:
git add .
git commit -m "Descri��o das altera��es"
git push

# Vercel vai fazer redeploy automaticamente!
```

### For�ar Rebuild

Dashboard Vercel � **Deployments** � �ltimo deploy � **"..."** � **Redeploy**

### Rollback (Voltar Vers�o)

Dashboard Vercel � **Deployments** � Deploy anterior � **"..."** � **Promote to Production**

---

## = Solu��o de Problemas

### L Erro 404 ao acessar rotas

**Causa**: Configura��o de rewrite n�o est� funcionando.

**Solu��o**: Verificar `vercel.json` tem:

```json
"rewrites": [
  { "source": "/(.*)", "destination": "/index.html" }
]
```

### L Erro de CORS no Supabase

**Solu��o**: Adicionar dom�nio em:
Supabase � **Authentication** � **URL Configuration**

Adicionar:
- `https://detoxmental.site`
- `https://detoxmental.site/*`

### L Vari�veis de ambiente n�o funcionam

**Solu��o**:
1. Vercel Dashboard � Settings � Environment Variables
2. Verificar se `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` est�o configuradas
3. Fazer **Redeploy**

### L Webhook n�o est� chegando

**Verificar**:
1. URL na Kiwify est� correta?
2. Edge Function est� deployada?
3. Testar com curl:

```bash
curl -X POST https://uetgenymwhiadqczpicc.supabase.co/functions/v1/kiwify-webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "webhook"}'
```

### L Dom�nio n�o carrega

**Aguardar**: Propaga��o DNS pode levar at� 48h.

**Verificar DNS**:
```bash
nslookup detoxmental.site
```

Deve retornar IP da Vercel: `76.76.21.21`

---

## =� Pr�ximos Passos

### 1. Analytics

Adicionar Google Analytics ou Vercel Analytics:

```bash
npm install @vercel/analytics
```

### 2. SEO

- Adicionar meta tags
- Configurar sitemap.xml
- Adicionar robots.txt

### 3. Performance

- Configurar CDN
- Otimizar imagens
- Code splitting

### 4. Seguran�a

- Configurar CSP (Content Security Policy)
- Rate limiting no webhook
- Valida��o de origem na Kiwify

---

##  Checklist Final

Antes de considerar o deploy completo:

- [ ] Dom�nio **detoxmental.site** aponta para Vercel
- [ ] Site carrega em https://detoxmental.site
- [ ] Vari�veis de ambiente configuradas
- [ ] Migrations executadas no Supabase
- [ ] Webhook configurado na Kiwify
- [ ] Edge Function deployada
- [ ] Link de venda atualizado
- [ ] Testes de acesso negado funcionando
- [ ] Teste de webhook funcionando
- [ ] SSL ativo (cadeado verde)
- [ ] Formul�rio de login/cadastro funcionando
- [ ] Redirecionamentos funcionando

---

## <� Pronto!

Seu **Detox Mental** est� agora em produ��o em:

< **https://detoxmental.site/**

**Funcionalidades ativas:**
-  Login e cadastro
-  Integra��o Supabase
-  Webhook Kiwify
-  Controle de acesso por token
-  Sistema de assinaturas
-  Dashboard protegido

---

## =� Suporte

- **Vercel**: https://vercel.com/docs
- **Supabase**: https://supabase.com/docs
- **Kiwify**: https://developers.kiwify.com.br/

---

**Desenvolvido com d por Claude Code**

>�B _"Cada respira��o � um novo come�o"_
