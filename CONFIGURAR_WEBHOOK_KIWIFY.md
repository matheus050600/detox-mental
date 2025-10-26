# 🔗 Como Configurar Webhook da Kiwify (Automático)

## 🎯 Para que serve?

O webhook faz com que **quando a pessoa pagar na Kiwify, o sistema libere o acesso AUTOMATICAMENTE**, sem você precisar fazer nada manual!

---

## 📋 PASSO 1: Fazer Deploy da Edge Function

### **1.1 Instalar Supabase CLI (se ainda não tem)**

No terminal:

```bash
# Windows (via npm)
npm install -g supabase

# Ou via Chocolatey
choco install supabase
```

### **1.2 Fazer Login**

```bash
supabase login
```

Vai abrir o navegador para você fazer login.

### **1.3 Link com o Projeto**

Na pasta do projeto:

```bash
cd "C:\Users\mathe\Downloads\detox mental backup - Copia\breath-essence-app-main"

supabase link --project-ref uetgenymwhiadqczpicc
```

### **1.4 Deploy da Edge Function**

```bash
supabase functions deploy kiwify-webhook
```

Aguarde alguns segundos. Quando terminar, você vai receber uma URL tipo:

```
https://uetgenymwhiadqczpicc.supabase.co/functions/v1/kiwify-webhook
```

**COPIE ESSA URL!** Você vai precisar no próximo passo.

---

## 📋 PASSO 2: Configurar na Kiwify

### **2.1 Acessar Dashboard da Kiwify**

1. Vá em: https://dashboard.kiwify.com.br/
2. Faça login na sua conta

### **2.2 Selecionar o Produto**

1. No menu, clique em **"Produtos"**
2. Clique no produto **"Detox Mental"** (ou o nome que você deu)

### **2.3 Abrir Configurações de Webhook**

1. No produto, procure por **"Configurações"** ou **"Integrações"**
2. Clique em **"Webhooks"**
3. Clique em **"Adicionar Webhook"** ou **"Novo Webhook"**

### **2.4 Configurar o Webhook**

**URL do Webhook:**
```
https://uetgenymwhiadqczpicc.supabase.co/functions/v1/kiwify-webhook
```
(Cole a URL que você recebeu no PASSO 1.4)

**Eventos para monitorar:**
Marque estas opções:
- ✅ `order.paid` (Pedido pago)
- ✅ `order.refunded` (Pedido reembolsado)
- ✅ `subscription.started` (Assinatura iniciada)
- ✅ `subscription.canceled` (Assinatura cancelada)

**Método:** POST

**Headers:** (deixe padrão, não precisa adicionar nada)

### **2.5 Salvar**

Clique em **"Salvar"** ou **"Criar Webhook"**

---

## 📋 PASSO 3: Testar o Webhook

### **3.1 Fazer um Pagamento de Teste**

A Kiwify tem um modo de teste. Pergunte no suporte deles como ativar.

Ou faça um pagamento real de R$ 19,90 e depois reembolse (para testar).

### **3.2 Verificar se o Webhook Chegou**

No Supabase:

**SQL Editor:**
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
    created_at
FROM public.kiwify_webhooks
ORDER BY created_at DESC
LIMIT 10;
```

**Deve aparecer o webhook!** ✅

### **3.3 Verificar se Liberou Acesso**

```sql
-- Ver se o usuário foi liberado
SELECT
    email,
    plan_type,
    has_active_token
FROM public.users
WHERE email = 'EMAIL_QUE_PAGOU@example.com';
```

**Deve estar:**
- `plan_type` = **"premium"** ✅
- `has_active_token` = **true** ✅

---

## 📋 OPÇÃO 2: Liberar Acesso Manualmente (Temporário)

Se você ainda não quer configurar o webhook, pode liberar acesso **manualmente** quando alguém pagar.

### **No Supabase SQL Editor:**

```sql
-- Quando alguém pagar, execute:
SELECT public.grant_access_after_purchase(
    'email.do.cliente@example.com',  -- Email do cliente
    'Nome do Cliente',                -- Nome do cliente
    'ORDER-123',                      -- ID do pedido (opcional)
    'SUB-123'                         -- ID da assinatura (opcional)
);
```

Isso vai liberar o acesso instantaneamente! ✅

---

## 🔄 Como Funciona o Fluxo Automático

```
1. Cliente paga na Kiwify (R$ 19,90)
   ↓
2. Kiwify envia webhook para:
   https://uetgenymwhiadqczpicc.supabase.co/functions/v1/kiwify-webhook
   ↓
3. Edge Function recebe o webhook
   ↓
4. Salva no log (tabela kiwify_webhooks)
   ↓
5. Chama grant_access_after_purchase(email)
   ↓
6. Libera acesso:
   - Cria token ativo
   - Atualiza usuário para premium
   - Cria assinatura R$ 19,90/mês
   ↓
7. Cliente faz login → ENTRA NO DASHBOARD! 🎉
```

---

## 🆘 Troubleshooting

### **Webhook não está chegando**

1. **Verificar URL está correta:**
   - Deve terminar com `/functions/v1/kiwify-webhook`
   - Não pode ter espaços ou caracteres estranhos

2. **Verificar Edge Function foi deployada:**
   ```bash
   supabase functions list
   ```
   Deve aparecer `kiwify-webhook` na lista

3. **Ver logs da Edge Function:**
   - Dashboard Supabase → Edge Functions → kiwify-webhook → Logs
   - Procure por erros

4. **Testar manualmente a Edge Function:**
   ```bash
   curl -X POST https://uetgenymwhiadqczpicc.supabase.co/functions/v1/kiwify-webhook \
     -H "Content-Type: application/json" \
     -d '{
       "order_id": "TEST123",
       "order_status": "paid",
       "Customer": {
         "email": "teste@example.com",
         "full_name": "Teste"
       }
     }'
   ```

### **Webhook chega mas não libera acesso**

1. **Ver logs da função:**
   - Supabase → Edge Functions → kiwify-webhook → Logs
   - Procure por mensagens de erro

2. **Verificar se função SQL existe:**
   ```sql
   SELECT * FROM pg_proc WHERE proname = 'grant_access_after_purchase';
   ```

3. **Testar função diretamente:**
   ```sql
   SELECT public.grant_access_after_purchase(
       'teste@example.com',
       'Teste',
       'ORDER-TEST',
       'SUB-TEST'
   );
   ```

---

## ✅ Checklist de Configuração

- [ ] Edge Function criada (`kiwify-webhook/index.ts`)
- [ ] Supabase CLI instalado
- [ ] Login no Supabase CLI feito
- [ ] Projeto linkado (`supabase link`)
- [ ] Edge Function deployed (`supabase functions deploy`)
- [ ] URL da Edge Function copiada
- [ ] Webhook configurado na Kiwify
- [ ] Eventos marcados (paid, refunded, started, canceled)
- [ ] Webhook testado
- [ ] Acesso liberado automaticamente

---

## 🎉 Tudo Pronto!

Depois de configurar o webhook:

✅ **Sistema 100% AUTOMÁTICO!**

- Pessoa paga → Sistema libera sozinho
- Pessoa cancela → Sistema bloqueia sozinho
- Pessoa reembolsa → Sistema remove acesso
- ZERO trabalho manual! 🚀

---

## 📊 Monitorar Webhooks

Para ver todos os webhooks recebidos:

```sql
SELECT
    id,
    order_id,
    customer_email,
    customer_name,
    order_status,
    subscription_status,
    processed,
    created_at
FROM public.kiwify_webhooks
ORDER BY created_at DESC
LIMIT 50;
```

Para ver webhooks não processados:

```sql
SELECT * FROM public.kiwify_webhooks
WHERE processed = FALSE
ORDER BY created_at DESC;
```

---

**Desenvolvido com 🔗 por Claude Code**

_"Automatize ou vire escravo do manual!"_
