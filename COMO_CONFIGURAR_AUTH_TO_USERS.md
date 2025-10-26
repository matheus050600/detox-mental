# 🔐 Como Fazer Usuário do Authentication Aparecer Automaticamente em Users (Table Editor)

## 🎯 O que você quer:

Quando alguém se cadastra no site:
1. Supabase cria usuário em **Authentication** ✅
2. **AUTOMATICAMENTE** cria também em **Table Editor → users** ✅
3. Pessoa consegue entrar no dashboard ✅

---

## ⚡ Solução: TRIGGER Automático

Um **trigger** (gatilho) no banco de dados que:
- Monitora a tabela `auth.users`
- Quando alguém se cadastra
- Executa função que cria em `public.users` automaticamente

---

## 📋 Passo a Passo (3 minutos)

### **1. Acessar Supabase SQL Editor**

1. Acesse: https://app.supabase.com/
2. Selecione seu projeto: `uetgenymwhiadqczpicc`
3. No menu lateral, clique em **SQL Editor**
4. Clique em **+ New Query**

### **2. Executar o Script**

1. Abra o arquivo: `CRIAR_USER_AUTOMATICAMENTE.sql`
2. Copie **TODO** o conteúdo (Ctrl+A → Ctrl+C)
3. Cole no SQL Editor do Supabase (Ctrl+V)
4. Clique no botão **RUN** (ou aperte Ctrl+Enter)

### **3. Verificar Sucesso**

Você deve ver mensagens tipo:

```
✅ Funções e triggers antigos removidos
✅ Função handle_new_user() criada com sucesso
✅ Trigger on_auth_user_created criado com sucesso
✅ Constraint UNIQUE adicionada em user_streaks
✅ Constraint UNIQUE adicionada em subscriptions
🎉 SUCESSO TOTAL! Função e trigger estão ativos!
```

---

## 🧪 Testar se Funcionou

### **Teste 1: Criar conta no site**

1. Vá no seu site: http://localhost:5173/cadastro (ou production)
2. Preencha:
   - Nome: **João Teste**
   - Email: **joao.teste@example.com**
   - Senha: **senha123**
3. Clique em **Criar Conta**

### **Teste 2: Verificar no Supabase**

**No Authentication:**
1. Dashboard → Authentication → Users
2. Deve aparecer: `joao.teste@example.com` ✅

**No Table Editor:**
1. Dashboard → Table Editor → users
2. Deve aparecer: `joao.teste@example.com` com:
   - ✅ name: "João Teste"
   - ✅ plan_type: "free"
   - ✅ has_active_token: false

**Nas tabelas relacionadas:**
1. Table Editor → user_streaks → deve ter 1 registro
2. Table Editor → subscriptions → deve ter 1 registro (plan: free)

---

## 🔍 Como Verificar se o Trigger Está Ativo

Execute no SQL Editor:

```sql
-- Ver se função existe
SELECT
    proname as nome_funcao,
    'Ativa' as status
FROM pg_proc
WHERE proname = 'handle_new_user'
AND pronamespace = 'public'::regnamespace;

-- Ver se trigger existe
SELECT
    tgname as nome_trigger,
    CASE tgenabled
        WHEN 'O' THEN '✅ Ativo'
        WHEN 'D' THEN '❌ Desativado'
        ELSE '⚠️ Desconhecido'
    END as status
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';
```

**Resultado esperado:**
- 1 linha com `handle_new_user` → status "Ativa"
- 1 linha com `on_auth_user_created` → status "✅ Ativo"

---

## 🔄 Como Funciona (Detalhes Técnicos)

### **Fluxo Automático:**

```
1. Usuário preenche formulário de cadastro
   ↓
2. Frontend chama signUpWithEmail() do Supabase
   ↓
3. Supabase Auth cria registro em auth.users
   ↓
4. TRIGGER "on_auth_user_created" dispara automaticamente
   ↓
5. FUNÇÃO "handle_new_user()" executa:
   ├─ Insere em public.users ✅
   ├─ Insere em public.user_streaks ✅
   ├─ Insere em public.subscriptions ✅
   └─ Verifica se tem token pendente (compra antes de cadastrar) ✅
   ↓
6. Cadastro concluído! Usuário pode fazer login e acessar dashboard 🎉
```

### **O que o Trigger Faz:**

1. **Cria usuário em `public.users`**
   - Copia ID, email do `auth.users`
   - Extrai nome do `raw_user_meta_data`
   - Define plano inicial como "free"

2. **Cria streak inicial**
   - 0 dias de sequência
   - Permite rastrear progresso depois

3. **Cria assinatura inicial**
   - Plan: "free"
   - Status: "active"
   - Price: 0.00

4. **Verifica token pendente**
   - Se pessoa comprou ANTES de cadastrar
   - Sistema detecta e já libera como "premium"

---

## ⚠️ Troubleshooting (Resolver Problemas)

### **Problema 1: Usuário aparece em Authentication mas não em Table Editor**

**Causa:** Trigger não está ativo ou deu erro

**Solução:**
```sql
-- Ver logs de erro
SELECT * FROM pg_stat_statements
WHERE query LIKE '%handle_new_user%'
ORDER BY calls DESC;

-- Recriar trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
```

### **Problema 2: Erro "Database error saving new user"**

**Causa:** Função tem erro ou falta permissão

**Solução:**
1. Execute o script `CRIAR_USER_AUTOMATICAMENTE.sql` novamente
2. Se persistir, execute também `FIX_CADASTRO.sql`

### **Problema 3: Usuário criado mas sem streak/subscription**

**Causa:** Constraints UNIQUE faltando ou erro na função

**Solução:**
```sql
-- Adicionar constraints
ALTER TABLE public.user_streaks
ADD CONSTRAINT IF NOT EXISTS user_streaks_user_id_key UNIQUE (user_id);

ALTER TABLE public.subscriptions
ADD CONSTRAINT IF NOT EXISTS subscriptions_user_id_key UNIQUE (user_id);

-- Criar manualmente para usuários existentes
INSERT INTO public.user_streaks (user_id, current_streak, longest_streak)
SELECT id, 0, 0 FROM public.users
WHERE id NOT IN (SELECT user_id FROM public.user_streaks)
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.subscriptions (user_id, plan, price, status, start_date)
SELECT id, 'free', 0.00, 'active', NOW() FROM public.users
WHERE id NOT IN (SELECT user_id FROM public.subscriptions)
ON CONFLICT (user_id) DO NOTHING;
```

---

## 🎯 Checklist de Verificação

Após executar o script, confirme:

- [ ] Função `handle_new_user()` existe e está ativa
- [ ] Trigger `on_auth_user_created` existe e está ativo
- [ ] Constraint UNIQUE em `user_streaks(user_id)` existe
- [ ] Constraint UNIQUE em `subscriptions(user_id)` existe
- [ ] Cadastro no site funciona sem erro
- [ ] Usuário aparece em Authentication
- [ ] Usuário aparece em Table Editor → users
- [ ] Streak inicial criada em user_streaks
- [ ] Assinatura free criada em subscriptions
- [ ] Login funciona e entra no dashboard

---

## 📊 Ver Usuários Criados Recentemente

```sql
SELECT
    u.id,
    u.email,
    u.name,
    u.plan_type,
    u.has_active_token,
    u.created_at,
    au.email as auth_email,
    au.created_at as auth_created_at,
    s.plan as subscription_plan,
    s.status as subscription_status
FROM public.users u
LEFT JOIN auth.users au ON u.id = au.id
LEFT JOIN public.subscriptions s ON u.id = s.user_id
ORDER BY u.created_at DESC
LIMIT 10;
```

---

## 🚀 Resumo Final

**ANTES:**
- Pessoa se cadastra
- Aparece só em Authentication
- Não consegue entrar no dashboard ❌

**DEPOIS (com trigger):**
- Pessoa se cadastra
- Aparece em Authentication ✅
- Aparece em Table Editor → users ✅
- Tem streak e subscription ✅
- Consegue entrar no dashboard ✅

---

## 📝 Arquivos Importantes

- `CRIAR_USER_AUTOMATICAMENTE.sql` - Script principal (EXECUTE ESTE!)
- `FIX_CADASTRO.sql` - Backup (se o principal não funcionar)
- `20250123_fix_handle_new_user.sql` - Migration original

**DICA:** Execute `CRIAR_USER_AUTOMATICAMENTE.sql` que é o mais completo e atualizado!

---

**Desenvolvido com ❤️ por Claude Code**

_"Um bom trigger vale mais que mil cadastros manuais"_
