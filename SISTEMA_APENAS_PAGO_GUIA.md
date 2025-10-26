# 💰 Sistema APENAS PAGO - Sem Assinatura Free

## 🎯 Nova Regra:

**NÃO EXISTE PLANO FREE!**

- ✅ Qualquer pessoa pode se **cadastrar**
- ❌ Mas **NÃO consegue acessar** o dashboard sem pagar
- 💳 Só após **PAGAR R$ 19,90/mês** na Kiwify que libera acesso

---

## 🔄 Novo Fluxo

### **Cenário 1: Cadastro → Depois Paga**

```
1. Pessoa acessa detoxmental.site
   ↓
2. Clica em "Criar Conta" e preenche dados
   ↓
3. Conta criada! ✅ (mas sem acesso)
   ↓
4. Pessoa tenta entrar no dashboard
   ↓
5. Sistema redireciona para página "Acesso Negado" 🚫
   ↓
6. Pessoa clica em "Assinar Agora - R$ 19,90/mês"
   ↓
7. Vai para Kiwify → Paga
   ↓
8. Kiwify envia webhook → Sistema libera acesso
   ↓
9. Pessoa faz login → ENTRA NO DASHBOARD! 🎉
```

### **Cenário 2: Paga → Depois Cadastra**

```
1. Pessoa clica no link da Kiwify (sem cadastro)
   ↓
2. Paga R$ 19,90/mês
   ↓
3. Kiwify envia webhook → Sistema cria "token pendente"
   ↓
4. Pessoa acessa detoxmental.site e cria conta
   ↓
5. Sistema detecta token pendente automaticamente
   ↓
6. Libera acesso premium imediatamente
   ↓
7. Pessoa entra direto no dashboard! 🎉
```

---

## 📋 Como Configurar (5 minutos)

### **Passo 1: Executar Migration**

1. Acesse: https://app.supabase.com/
2. Selecione seu projeto: `uetgenymwhiadqczpicc`
3. Vá em **SQL Editor** → **New Query**
4. Copie **TODO** o conteúdo do arquivo:
   ```
   supabase/migrations/20250125_apenas_pago_sem_free.sql
   ```
5. Cole no SQL Editor
6. Clique em **RUN** (Ctrl+Enter)

### **Passo 2: Verificar Sucesso**

Você deve ver:

```
✅ Valor "blocked" adicionado ao ENUM plan_type
✅ Todos os usuários free foram atualizados para blocked
✅ Todas as assinaturas free foram removidas
✅ Triggers e funções antigas removidas
✅ Função handle_new_user() criada (APENAS PAGO)
✅ Trigger on_auth_user_created criado
✅ Função grant_access_after_purchase() atualizada
🎉 SISTEMA APENAS PAGO ATIVADO!
```

---

## 🔍 O que Mudou

### **ANTES (com free):**

| Ação | Resultado |
|------|-----------|
| Pessoa se cadastra | ✅ Cria conta FREE |
| Tenta entrar | ✅ Entra no dashboard |
| Vê meditações | ✅ Acesso completo |

### **DEPOIS (apenas pago):**

| Ação | Resultado |
|------|-----------|
| Pessoa se cadastra | ✅ Cria conta BLOQUEADA |
| Tenta entrar | ❌ Redireciona para "Acesso Negado" |
| Vê página | 💳 "Assinar Agora - R$ 19,90/mês" |
| Paga na Kiwify | ✅ Sistema libera automaticamente |
| Faz login de novo | ✅ ENTRA NO DASHBOARD! |

---

## 🗃️ Mudanças no Banco de Dados

### **Tabela `users`**

**Coluna `plan_type` agora aceita:**
- ~~`free`~~ ❌ **REMOVIDO**
- `blocked` 🆕 **NOVO** (padrão ao cadastrar)
- `premium` ✅ (após pagar)

**Usuários criados agora:**
```sql
INSERT INTO public.users (
    plan_type = 'blocked',      -- ⚠️ SEM ACESSO
    has_active_token = FALSE     -- ⚠️ SEM TOKEN
)
```

### **Tabela `subscriptions`**

**NÃO cria mais assinatura ao cadastrar!**

Assinatura é criada **APENAS** quando:
- Webhook da Kiwify confirma pagamento ✅

**Valores:**
```sql
INSERT INTO public.subscriptions (
    plan = 'premium',            -- Sempre premium
    price = 19.90,               -- R$ 19,90/mês
    status = 'active',
    expiration_date = NOW() + INTERVAL '1 month'
)
```

---

## 🧪 Como Testar

### **Teste 1: Cadastro sem pagamento**

1. Vá em: http://localhost:5173/cadastro
2. Crie conta com: `teste.bloqueado@example.com`
3. Faça login
4. Tente acessar `/hoje` ou `/explorar`
5. **Resultado esperado:** Redireciona para `/acesso-negado` ✅

### **Teste 2: Verificar usuário bloqueado no Supabase**

```sql
SELECT
    email,
    name,
    plan_type,
    has_active_token
FROM public.users
WHERE email = 'teste.bloqueado@example.com';
```

**Resultado esperado:**
```
plan_type: "blocked"
has_active_token: false
```

### **Teste 3: Simular pagamento**

```sql
-- Simular webhook da Kiwify
SELECT public.grant_access_after_purchase(
    'teste.bloqueado@example.com',
    'João Teste',
    'ORDER-TEST-123',
    'SUB-TEST-123'
);

-- Verificar se foi liberado
SELECT
    email,
    plan_type,
    has_active_token
FROM public.users
WHERE email = 'teste.bloqueado@example.com';
```

**Resultado esperado:**
```
plan_type: "premium"
has_active_token: true
```

Agora faça login com `teste.bloqueado@example.com` → Deve entrar no dashboard! ✅

### **Teste 4: Verificar assinatura criada**

```sql
SELECT
    u.email,
    s.plan,
    s.price,
    s.status,
    s.expiration_date
FROM public.users u
LEFT JOIN public.subscriptions s ON u.id = s.user_id
WHERE u.email = 'teste.bloqueado@example.com';
```

**Resultado esperado:**
```
plan: "premium"
price: 19.90
status: "active"
expiration_date: (1 mês a partir de hoje)
```

---

## 🔐 Componente ProtectedRoute

O componente `ProtectedRoute` já verifica automaticamente:

```typescript
const hasActiveToken = await checkUserHasActiveToken();

if (!hasActiveToken) {
  navigate("/acesso-negado"); // ❌ Bloqueia acesso
}
```

**Funciona para:**
- `/hoje` - Dashboard
- `/explorar` - Meditações
- `/perfil` - Perfil
- Qualquer outra rota protegida

---

## 📊 Ver Usuários Bloqueados vs Pagos

```sql
-- Ver usuários bloqueados (sem acesso)
SELECT
    id,
    email,
    name,
    plan_type,
    has_active_token,
    created_at
FROM public.users
WHERE plan_type = 'blocked'
ORDER BY created_at DESC;

-- Ver usuários premium (com acesso)
SELECT
    u.id,
    u.email,
    u.name,
    u.plan_type,
    u.has_active_token,
    s.plan as subscription_plan,
    s.price,
    s.status,
    s.expiration_date
FROM public.users u
LEFT JOIN public.subscriptions s ON u.id = s.user_id
WHERE u.plan_type = 'premium'
ORDER BY u.created_at DESC;
```

---

## ⚠️ Migrar Usuários Existentes

Se você já tem usuários com plano `free`, eles foram automaticamente convertidos para `blocked` pela migration.

**Verificar:**
```sql
SELECT
    COUNT(*) FILTER (WHERE plan_type = 'blocked') as bloqueados,
    COUNT(*) FILTER (WHERE plan_type = 'premium') as premium,
    COUNT(*) as total
FROM public.users;
```

**Se quiser liberar manualmente algum usuário:**
```sql
-- Liberar acesso para um email específico
SELECT public.grant_access_after_purchase(
    'email@exemplo.com',
    'Nome do Cliente',
    'ORDER-MANUAL-001',
    NULL
);
```

---

## 🛠️ Troubleshooting

### **Problema: Usuário pagou mas não consegue entrar**

**Verificar:**
```sql
-- 1. Ver se webhook foi recebido
SELECT * FROM public.kiwify_webhooks
WHERE customer_email = 'EMAIL_DO_CLIENTE'
ORDER BY created_at DESC;

-- 2. Ver se token foi criado
SELECT * FROM public.access_tokens
WHERE email = 'EMAIL_DO_CLIENTE';

-- 3. Ver status do usuário
SELECT * FROM public.users
WHERE email = 'EMAIL_DO_CLIENTE';
```

**Solução manual:**
```sql
-- Liberar acesso manualmente
UPDATE public.users
SET
    plan_type = 'premium',
    has_active_token = TRUE,
    token_granted_at = NOW()
WHERE email = 'EMAIL_DO_CLIENTE';

-- Criar assinatura
INSERT INTO public.subscriptions (
    user_id,
    plan,
    price,
    status,
    start_date,
    expiration_date
) VALUES (
    (SELECT id FROM public.users WHERE email = 'EMAIL_DO_CLIENTE'),
    'premium',
    19.90,
    'active',
    NOW(),
    NOW() + INTERVAL '1 month'
)
ON CONFLICT (user_id) DO UPDATE
SET
    plan = 'premium',
    status = 'active',
    expiration_date = NOW() + INTERVAL '1 month';
```

---

## 📝 Checklist Final

Após executar a migration, verifique:

- [ ] Migration executada com sucesso (sem erros)
- [ ] Função `handle_new_user()` existe e está ativa
- [ ] Trigger `on_auth_user_created` existe e está ativo
- [ ] Coluna `plan_type` aceita valor "blocked"
- [ ] Todos usuários free foram convertidos para blocked
- [ ] Assinaturas free foram removidas
- [ ] Cadastro funciona (cria usuário bloqueado)
- [ ] Usuário bloqueado não consegue acessar dashboard
- [ ] Página "Acesso Negado" aparece corretamente
- [ ] Link da Kiwify está correto: `https://pay.kiwify.com.br/aj7NocQ`
- [ ] Webhook da Kiwify está configurado
- [ ] Teste de pagamento libera acesso

---

## 🎯 Resumo

**Sistema Anterior:**
- Cadastro → Free → Acessa tudo

**Sistema Novo:**
- Cadastro → Blocked → Não acessa nada
- Paga → Premium → Acessa tudo! 💰

**Vantagem:**
- ✅ Zero freeloaders
- ✅ Todo mundo paga
- ✅ Receita garantida
- ✅ R$ 19,90/mês por usuário

---

**Desenvolvido com 💰 por Claude Code**

_"Sem free, só premium!"_
