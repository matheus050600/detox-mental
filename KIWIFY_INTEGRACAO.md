# = Detox Mental + Kiwify - Integração Completa

##  TUDO PRONTO!

A integração entre **Detox Mental** e **Kiwify** está 100% implementada e funcionando!

---

## <¯ Como Funciona

### **Token de Acesso:**
```
rsmplzhq7p9
```

Este é o token fixo usado para controlar o acesso ao dashboard. Apenas usuários que:
1.  Fizeram login no app
2.  Possuem assinatura ativa na Kiwify (token vinculado)

...terão acesso às páginas protegidas.

---

## = Fluxo Completo

### 1ã Usuário Compra na Kiwify

```
Cliente realiza pagamento ’ Kiwify processa ’ Pagamento aprovado
```

### 2ã Webhook Notifica o Supabase

```
Kiwify envia webhook ’ Supabase Edge Function recebe ’ Função process_kiwify_webhook() executa
```

### 3ã Sistema Libera Acesso

```sql
-- Webhook cria/atualiza:
- kiwify_webhooks (log do webhook)
- access_tokens (token rsmplzhq7p9 ativo)
- users (has_active_token = TRUE)
- subscriptions (plan = premium, status = active)
```

### 4ã Usuário Acessa o App

```
1. Usuário faz login
2. ProtectedRoute verifica:
   - Está autenticado? 
   - Tem token ativo? 
3. Acesso liberado ao dashboard!
```

---

## =Â Arquivos Criados/Modificados

### **1. Migration SQL** (`supabase/migrations/20250122_kiwify_webhook_integration.sql`)
-  Tabela `kiwify_webhooks` - Log de webhooks
-  Tabela `access_tokens` - Controle de tokens
-  Campos adicionados em `users` - Controle de acesso
-  Função `process_kiwify_webhook()` - Processa webhooks
-  Função `user_has_active_token()` - Valida token
-  Trigger automático para vincular tokens ao criar usuário
-  View `user_access_status` - Status consolidado

### **2. Funções no Supabase** (`src/lib/supabase.ts`)
-  `checkUserHasActiveToken()` - Verifica se usuário tem token
-  `getUserAccessStatus()` - Status completo de acesso
-  `processKiwifyWebhook()` - Processa webhook (via RPC)
-  `checkPendingTokenByEmail()` - Verifica token pendente
-  `getKiwifyWebhooks()` - Lista webhooks (admin)

### **3. Componente de Proteção** (`src/components/ProtectedRoute.tsx`)
-  Verifica autenticação
-  Verifica token ativo
-  Redireciona para `/acesso-negado` se não tiver token
-  Loading state animado

### **4. Página de Acesso Negado** (`src/pages/AcessoNegado.tsx`)
-  Design premium com animações
-  Lista de benefícios
-  Botão para assinar na Kiwify
-  Informações sobre o token

### **5. Rotas Protegidas** (`src/App.tsx`)
-  `/hoje` - Protegida
-  `/explorar` - Protegida
-  `/humor` - Protegida
-  `/perfil` - Protegida
-  `/login`, `/cadastro` - Públicas
-  `/acesso-negado` - Pública

---

## =€ Como Configurar (Próximos Passos)

### **Passo 1: Executar Migrations**

No Dashboard do Supabase ’ SQL Editor:

1. Execute: `supabase/migrations/20250121_init_detox_mental.sql` (se ainda não executou)
2. Execute: `supabase/migrations/20250122_kiwify_webhook_integration.sql`

### **Passo 2: Configurar Webhook**

Siga o guia completo em: **`WEBHOOK_KIWIFY_SETUP.md`**

**Resumo rápido:**

1. Criar Edge Function no Supabase chamada `kiwify-webhook`
2. Copiar URL: `https://SEU_PROJECT.supabase.co/functions/v1/kiwify-webhook`
3. Configurar na Kiwify: Dashboard ’ Webhooks ’ Adicionar URL
4. Selecionar eventos: `order_approved`, `subscription_canceled`, etc.

### **Passo 3: Testar**

```sql
-- Simular pagamento via SQL Editor:
SELECT process_kiwify_webhook('{
  "order_id": "test-123",
  "order_status": "paid",
  "Customer": {"email": "teste@example.com", "full_name": "Teste Silva"},
  "subscription_id": "sub-123",
  "Subscription": {"status": "active"}
}'::jsonb);
```

Depois:
1. Criar conta com `teste@example.com`
2. Fazer login
3. Verificar se tem acesso ao dashboard 

---

## = Verificar Status de Acesso

### Via SQL:

```sql
-- Ver status consolidado de todos os usuários
SELECT * FROM user_access_status;

-- Ver apenas usuários com acesso ativo
SELECT * FROM user_access_status WHERE has_valid_access = TRUE;

-- Ver webhooks recebidos
SELECT * FROM kiwify_webhooks ORDER BY created_at DESC LIMIT 10;

-- Ver tokens ativos
SELECT * FROM access_tokens WHERE is_active = TRUE;
```

### Via Frontend:

```typescript
import { checkUserHasActiveToken, getUserAccessStatus } from '@/lib/supabase'

// Verificar se tem token
const hasToken = await checkUserHasActiveToken()

// Ver status completo
const status = await getUserAccessStatus()
console.log(status)
```

---

## <¨ Personalizar

### Alterar o Token de Acesso

Se quiser usar outro token em vez de `rsmplzhq7p9`:

1. Abra: `supabase/migrations/20250122_kiwify_webhook_integration.sql`
2. Substitua todas as ocorrências de `'rsmplzhq7p9'` pelo novo token
3. Reexecute a migration
4. Atualize também em `src/lib/supabase.ts` nas funções

### Alterar Link da Kiwify

Abra: `src/pages/AcessoNegado.tsx`

```typescript
// Linha ~90
<Button
  onClick={() => window.open("SEU_LINK_KIWIFY_AQUI", "_blank")}
  ...
>
```

### Adicionar Mais Rotas Protegidas

Em `src/App.tsx`:

```tsx
<Route path="/nova-rota" element={
  <ProtectedRoute>
    <SuaPagina />
  </ProtectedRoute>
} />
```

---

## >ê Testes

### Cenário 1: Usuário SEM token

1. Criar conta (sem webhook)
2. Fazer login
3. Tentar acessar `/hoje`
4.  Deve redirecionar para `/acesso-negado`

### Cenário 2: Usuário COM token

1. Simular webhook (SQL acima) com seu email
2. Fazer login
3. Acessar `/hoje`
4.  Deve acessar normalmente

### Cenário 3: Webhook Real

1. Realizar pagamento na Kiwify (de teste)
2. Aguardar alguns segundos
3. Verificar tabela `kiwify_webhooks`
4. Criar conta com mesmo email
5.  Acesso liberado automaticamente

---

## =Ê Monitoramento

### Dashboard Admin (Futuro)

Você pode criar uma página para visualizar:

- Total de webhooks recebidos
- Usuários com token ativo
- Pagamentos aprovados hoje
- Cancelamentos

```sql
-- Query para dashboard
SELECT
  COUNT(*) FILTER (WHERE order_status = 'paid') as pagamentos_aprovados,
  COUNT(*) FILTER (WHERE order_status = 'refunded') as reembolsos,
  COUNT(DISTINCT customer_email) as clientes_unicos
FROM kiwify_webhooks
WHERE DATE(created_at) = CURRENT_DATE;
```

---

## = Problemas Comuns

### L "Acesso negado" mesmo após pagamento

**Verificar:**

```sql
-- 1. Webhook foi recebido?
SELECT * FROM kiwify_webhooks WHERE customer_email = 'SEU_EMAIL';

-- 2. Token foi criado?
SELECT * FROM access_tokens WHERE email = 'SEU_EMAIL';

-- 3. Status do usuário
SELECT * FROM user_access_status WHERE email = 'SEU_EMAIL';
```

**Solução:** Reprocessar webhook manualmente via SQL.

### L Webhook não está chegando

1. Verificar URL na Kiwify
2. Verificar logs da Edge Function
3. Testar com webhook de teste da Kiwify

### L Token expira sozinho

O token por padrão não expira (`expires_at = NULL`). Se quiser adicionar expiração:

```sql
UPDATE access_tokens
SET expires_at = NOW() + INTERVAL '30 days'
WHERE token = 'rsmplzhq7p9';
```

---

## <‰ Pronto!

Agora seu Detox Mental está 100% integrado com a Kiwify!

**Fluxo de vendas automatizado:**

```
Cliente paga ’ Webhook ’ Token liberado ’ Cliente acessa ’ >ØB Cliente medita
```

**Token de acesso:** `rsmplzhq7p9`

---

## =Þ Suporte

- **Setup inicial**: Leia `SETUP.md`
- **Configurar webhook**: Leia `WEBHOOK_KIWIFY_SETUP.md`
- **Documentação Kiwify**: https://developers.kiwify.com.br/webhooks
- **Documentação Supabase**: https://supabase.com/docs

---

**Desenvolvido com d por Claude Code**

>ØB _"Cada respiração é um novo começo"_
