# 🚀 DEPLOY PARA PRODUÇÃO - detoxmental.site

## ✅ Código já está no GitHub!

Seu código foi enviado para: `https://github.com/matheus050600/detox-mental.git`

Agora vamos colocar no ar em **https://detoxmental.site/**!

---

## 📋 ETAPA 1: Deploy na Vercel (Frontend)

### **Passo 1.1: Acessar Vercel**

1. Acesse: https://vercel.com/
2. Faça login com a mesma conta do GitHub

### **Passo 1.2: Importar Projeto**

1. Clique em **"Add New..."** → **"Project"**
2. Procure o repositório: **"detox-mental"**
3. Clique em **"Import"**

### **Passo 1.3: Configurar Build**

A Vercel vai detectar automaticamente que é um projeto Vite. Confirme:

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### **Passo 1.4: Configurar Variáveis de Ambiente** ⚠️ **IMPORTANTE!**

Clique em **"Environment Variables"** e adicione:

```
VITE_SUPABASE_URL=https://uetgenymwhiadqczpicc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVldGdlbnltd2hpYWRxY3pwaWNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxOTA0NDAsImV4cCI6MjA3NDc2NjQ0MH0.ekvG9CVzOfKPof7YJC-ysZGQj66cKP3yZPa4PgCltvo
```

**IMPORTANTE:** Adicione para **todos os ambientes** (Production, Preview, Development)

### **Passo 1.5: Deploy!**

Clique em **"Deploy"**

Aguarde ~2-3 minutos. A Vercel vai:
1. Clonar o repositório
2. Instalar dependências
3. Buildar o projeto
4. Fazer deploy

### **Passo 1.6: Pegar a URL**

Quando terminar, você vai receber uma URL tipo:
```
https://detox-mental-xxx.vercel.app
```

✅ **Teste essa URL primeiro!**

---

## 📋 ETAPA 2: Configurar Domínio Personalizado

### **Passo 2.1: Adicionar Domínio na Vercel**

1. No projeto na Vercel, vá em **"Settings"** → **"Domains"**
2. Clique em **"Add"**
3. Digite: `detoxmental.site`
4. Clique em **"Add"**

### **Passo 2.2: Configurar DNS**

A Vercel vai te mostrar os registros DNS que você precisa adicionar.

**Se seu domínio está em:**

#### **Registro.br:**
1. Acesse: https://registro.br/
2. Faça login
3. Vá em **"DNS"** ou **"Gerenciar DNS"**
4. Adicione os registros que a Vercel mostrou

#### **Cloudflare:**
1. Acesse: https://dash.cloudflare.com/
2. Selecione o domínio `detoxmental.site`
3. Vá em **"DNS"** → **"Records"**
4. Adicione os registros

**Registros típicos:**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### **Passo 2.3: Aguardar Propagação**

Pode levar de **5 minutos a 48 horas** para o DNS propagar.

**Verificar se propagou:**
```bash
nslookup detoxmental.site
```

---

## 📋 ETAPA 3: Deploy Edge Functions (Supabase)

### **Passo 3.1: Verificar se Supabase CLI está instalado**

No terminal:
```bash
supabase --version
```

Se não estiver instalado:
```bash
npm install -g supabase
```

### **Passo 3.2: Fazer Login**

```bash
supabase login
```

### **Passo 3.3: Link com o Projeto**

```bash
cd "C:\Users\mathe\Downloads\detox mental backup - Copia\breath-essence-app-main"
supabase link --project-ref uetgenymwhiadqczpicc
```

### **Passo 3.4: Deploy da Edge Function**

```bash
supabase functions deploy kiwify-webhook
```

Aguarde alguns segundos. Quando terminar:

**URL da Edge Function:**
```
https://uetgenymwhiadqczpicc.supabase.co/functions/v1/kiwify-webhook
```

✅ **Copie essa URL!** Você vai precisar no próximo passo.

---

## 📋 ETAPA 4: Atualizar Webhook na Kiwify

### **Passo 4.1: Acessar Dashboard Kiwify**

1. Vá em: https://dashboard.kiwify.com.br/
2. Selecione o produto **"Detox Mental"**
3. Vá em **"Configurações"** → **"Webhooks"**

### **Passo 4.2: Atualizar URL do Webhook**

Se já tem webhook configurado:
1. Clique em **"Editar"**
2. Atualize a URL para:
   ```
   https://uetgenymwhiadqczpicc.supabase.co/functions/v1/kiwify-webhook
   ```
3. Salve

Se não tem:
1. Clique em **"Adicionar Webhook"**
2. Cole a URL acima
3. Marque os eventos:
   - ✅ `order.paid`
   - ✅ `order.refunded`
   - ✅ `subscription.started`
   - ✅ `subscription.canceled`
4. Salve

---

## 📋 ETAPA 5: Testar em Produção

### **Teste 1: Acessar o Site**

Vá em: `https://detoxmental.site/`

✅ **Deve carregar a landing page**

### **Teste 2: Criar Conta**

1. Vá em: `https://detoxmental.site/cadastro`
2. Crie uma conta de teste
3. **Resultado esperado:** Cadastro com sucesso ✅

### **Teste 3: Verificar Bloqueio**

1. Faça login com a conta criada
2. Tente acessar: `https://detoxmental.site/hoje`
3. **Resultado esperado:** Redireciona para `/acesso-negado` ✅

### **Teste 4: Verificar Link da Kiwify**

1. Na página "Acesso Negado"
2. Clique em **"Assinar Agora - R$ 19,90/mês"**
3. **Resultado esperado:** Abre `https://pay.kiwify.com.br/aj7NocQ` ✅

### **Teste 5: Simular Pagamento** (Opcional)

No Supabase SQL Editor:
```sql
SELECT public.grant_access_after_purchase(
    'seu.email@example.com',
    'Seu Nome',
    'ORDER-TEST-PROD',
    'SUB-TEST-PROD'
);
```

Depois faça login → deve entrar no dashboard ✅

---

## 📋 ETAPA 6: Configurar HTTPS (Certificado SSL)

A Vercel **já configura HTTPS automaticamente!** ✅

Você não precisa fazer nada. O site já vai estar seguro com:
- 🔒 `https://detoxmental.site/`
- 🔒 Certificado SSL válido

---

## 🔍 Verificar Deploy

### **1. Frontend (Vercel):**
```
✅ https://detoxmental.site/
✅ https://detoxmental.site/cadastro
✅ https://detoxmental.site/login
✅ https://detoxmental.site/acesso-negado
```

### **2. Backend (Supabase):**
```
✅ Database: https://uetgenymwhiadqczpicc.supabase.co
✅ Edge Function: https://uetgenymwhiadqczpicc.supabase.co/functions/v1/kiwify-webhook
```

### **3. Webhook (Kiwify):**
```
✅ URL configurada
✅ Eventos marcados
```

---

## 🆘 Troubleshooting

### **Site não carrega (404)**

1. **Verificar deploy na Vercel:**
   - Dashboard Vercel → Deployments
   - Último deploy deve estar com status "Ready"

2. **Verificar variáveis de ambiente:**
   - Settings → Environment Variables
   - `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` devem estar preenchidas

3. **Rebuild:**
   - Deployments → último deploy → "..." → "Redeploy"

### **Cadastro não funciona em produção**

1. **Verificar console do navegador (F12):**
   - Procure por erros de CORS ou API

2. **Verificar se função RPC existe:**
   ```sql
   SELECT * FROM pg_proc WHERE proname = 'create_user_on_signup';
   ```

3. **Verificar logs do Supabase:**
   - Dashboard → Logs → procure por erros

### **Webhook não funciona**

1. **Verificar Edge Function deployada:**
   ```bash
   supabase functions list
   ```
   Deve aparecer `kiwify-webhook`

2. **Ver logs da Edge Function:**
   - Dashboard Supabase → Edge Functions → kiwify-webhook → Logs

3. **Testar manualmente:**
   ```bash
   curl -X POST https://uetgenymwhiadqczpicc.supabase.co/functions/v1/kiwify-webhook \
     -H "Content-Type: application/json" \
     -d '{"order_id":"TEST","order_status":"paid","Customer":{"email":"teste@example.com"}}'
   ```

### **Domínio não funciona**

1. **Verificar DNS propagou:**
   ```bash
   nslookup detoxmental.site
   ```

2. **Aguardar mais tempo** (pode levar até 48h)

3. **Usar URL temporária da Vercel** enquanto isso:
   ```
   https://detox-mental-xxx.vercel.app
   ```

---

## ✅ Checklist de Deploy

Marque cada item quando concluir:

### **Vercel (Frontend):**
- [ ] Projeto importado do GitHub
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado com sucesso
- [ ] URL temporária funcionando
- [ ] Domínio personalizado adicionado
- [ ] DNS configurado
- [ ] HTTPS funcionando

### **Supabase (Backend):**
- [ ] Funções SQL criadas (RPC)
- [ ] Edge Function deployada
- [ ] URL da Edge Function copiada

### **Kiwify (Pagamento):**
- [ ] Webhook configurado
- [ ] URL da Edge Function adicionada
- [ ] Eventos marcados
- [ ] Link de pagamento correto

### **Testes:**
- [ ] Site carrega
- [ ] Cadastro funciona
- [ ] Login funciona
- [ ] Bloqueio funciona
- [ ] Link Kiwify funciona
- [ ] Webhook funciona (opcional)

---

## 🎉 Deploy Completo!

Depois de completar todos os passos:

```
✅ Site no ar: https://detoxmental.site/
✅ Sistema 100% funcional
✅ Cadastro funcionando
✅ Sistema apenas pago ativo
✅ Webhook automático configurado
✅ HTTPS ativo
```

**PARABÉNS! SEU SISTEMA ESTÁ EM PRODUÇÃO!** 🚀🎉

---

## 📊 Monitoramento em Produção

### **Ver usuários cadastrados:**
```sql
SELECT COUNT(*) FROM public.users;
```

### **Ver pagamentos recebidos:**
```sql
SELECT
    COUNT(*) as total_pagamentos,
    SUM(CASE WHEN order_status = 'paid' THEN 1 ELSE 0 END) as pagos
FROM public.kiwify_webhooks;
```

### **Ver assinaturas ativas:**
```sql
SELECT COUNT(*) FROM public.subscriptions WHERE status = 'active';
```

### **Receita do mês:**
```sql
SELECT
    COUNT(*) as assinaturas_ativas,
    COUNT(*) * 19.90 as receita_mensal
FROM public.subscriptions
WHERE status = 'active' AND plan = 'premium';
```

---

**Desenvolvido com 🚀 por Claude Code**

_"De localhost para o mundo!"_
