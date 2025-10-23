# =' Como Corrigir Erro no Cadastro

## L Erro: "Database error saving new user"

Este erro ocorre quando a função `handle_new_user()` falha ao inserir dados na tabela `public.users` após o signup.

---

## ¡ CORREÇÃO RÁPIDA (3 minutos)

### **Opção 1: Executar Script de Correção (Recomendado)**

1. Acesse: https://app.supabase.com/
2. Selecione seu projeto
3. Vá em **SQL Editor** ’ **New Query**
4. Abra o arquivo `FIX_CADASTRO.sql` deste projeto
5. Copie **TODO** o conteúdo
6. Cole no SQL Editor
7. Clique em **RUN** (ou Ctrl+Enter)
8. Aguarde ~5 segundos

Você verá mensagens tipo:
```
 Triggers e funções antigas removidas
 Função handle_new_user() recriada
 Trigger on_auth_user_created recriado
 Constraints UNIQUE adicionadas
<‰ SUCESSO! Função e trigger estão ativos!
```

### **Opção 2: Executar via Supabase CLI**

```bash
# Na pasta do projeto
supabase db push --file supabase/migrations/20250123_fix_handle_new_user.sql
```

---

## >ê Testar se Funcionou

### Teste 1: Ver se função existe

No SQL Editor:

```sql
SELECT proname, prosrc
FROM pg_proc
WHERE proname = 'handle_new_user'
AND pronamespace = 'public'::regnamespace;
```

Deve retornar 1 linha com o código da função.

### Teste 2: Ver se trigger existe

```sql
SELECT tgname, tgenabled
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';
```

Deve retornar:
```
tgname: on_auth_user_created
tgenabled: O (significa "ativo")
```

### Teste 3: Cadastrar usuário

1. No app, vá em `/cadastro`
2. Preencha:
   - Nome: Teste Silva
   - Email: teste@example.com
   - Senha: senha123
3. Clique em **Criar conta**

 **Deve funcionar sem erro!**

### Teste 4: Verificar se usuário foi criado

No SQL Editor:

```sql
-- Ver usuários criados recentemente
SELECT
    u.id,
    u.email,
    u.name,
    u.has_active_token,
    u.created_at,
    au.email as auth_email,
    au.created_at as auth_created_at
FROM public.users u
LEFT JOIN auth.users au ON u.id = au.id
ORDER BY u.created_at DESC
LIMIT 5;
```

Deve listar seu usuário! 

---

## = Diagnóstico: Por que deu erro?

### Causa 1: Função não existia

Se a migration inicial não foi executada corretamente, a função `handle_new_user()` não foi criada.

**Verificar:**
```sql
SELECT COUNT(*) FROM pg_proc WHERE proname = 'handle_new_user';
```

Se retornar `0`, a função não existe.

### Causa 2: Trigger desativado ou não existe

O trigger pode estar desativado ou não ter sido criado.

**Verificar:**
```sql
SELECT tgname, tgenabled FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

Se não retornar nada, o trigger não existe.

Se retornar `tgenabled = D`, o trigger está desativado.

### Causa 3: Constraint UNIQUE faltando

Se as constraints `UNIQUE` não existem nas tabelas `user_streaks` ou `subscriptions`, pode dar erro ao tentar inserir duplicado.

**Verificar:**
```sql
SELECT conname, contype FROM pg_constraint
WHERE conname IN ('user_streaks_user_id_key', 'subscriptions_user_id_key');
```

Deve retornar 2 linhas.

### Causa 4: Permissões RLS

Row Level Security pode estar bloqueando inserções.

**Verificar:**
```sql
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('users', 'user_streaks', 'subscriptions');
```

Se `rowsecurity = true`, verifique as políticas:

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename IN ('users', 'user_streaks', 'subscriptions');
```

---

## =à Correções Adicionais

### Se ainda der erro após executar FIX_CADASTRO.sql

#### 1. Verificar logs do Supabase

Dashboard ’ **Logs** ’ **Postgres Logs**

Procure por:
- `ERROR:` ou `WARNING:`
- Mensagens relacionadas a `handle_new_user`

#### 2. Desabilitar RLS temporariamente (apenas para teste)

```sql
-- CUIDADO: Isso remove a segurança temporariamente
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions DISABLE ROW LEVEL SECURITY;

-- Tente cadastrar novamente

-- Depois, reabilite:
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
```

#### 3. Limpar tabelas e recriar (apenas se necessário)

  **ATENÇÃO: Isso vai apagar TODOS os dados!**

```sql
-- Backup primeiro!
-- CREATE TABLE users_backup AS SELECT * FROM public.users;

-- Limpar
TRUNCATE public.users, public.user_streaks, public.subscriptions CASCADE;

-- Recriar função e trigger
-- Execute FIX_CADASTRO.sql novamente
```

#### 4. Recriar tabela users (último recurso)

```sql
-- Backup
CREATE TABLE users_backup AS SELECT * FROM public.users;

-- Dropar e recriar
DROP TABLE public.users CASCADE;

-- Execute a migration inicial novamente:
-- supabase/migrations/20250121_init_detox_mental.sql
```

---

## =Ê Checklist de Verificação

Após executar a correção, verifique:

- [ ] Função `handle_new_user()` existe
- [ ] Trigger `on_auth_user_created` está ativo
- [ ] Constraints UNIQUE existem em `user_streaks` e `subscriptions`
- [ ] RLS está habilitado mas não bloqueando
- [ ] Políticas de RLS permitem INSERT via trigger
- [ ] Cadastro funciona sem erro
- [ ] Usuário aparece em `public.users` após cadastro
- [ ] Streak inicial é criada automaticamente
- [ ] Assinatura free é criada automaticamente

---

## <¯ Fluxo Esperado (Como DEVE Funcionar)

```
1. Usuário preenche formulário de cadastro
   “
2. Frontend chama signUpWithEmail()
   “
3. Supabase Auth cria registro em auth.users
   “
4. Trigger on_auth_user_created dispara
   “
5. Função handle_new_user() executa:
   - Insere em public.users 
   - Insere em public.user_streaks 
   - Insere em public.subscriptions 
   - Verifica token pendente 
   “
6. Cadastro concluído com sucesso! <‰
```

---

## <˜ Ainda não funcionou?

Se após executar `FIX_CADASTRO.sql` o erro persistir:

### 1. Copiar mensagem de erro exata

No console do navegador (F12 ’ Console), copie a mensagem completa.

### 2. Ver logs do Supabase

Dashboard ’ **Logs** ’ **Postgres Logs**

Procure o timestamp do erro e veja a mensagem completa.

### 3. Testar manualmente

Execute este SQL para simular o que o trigger faz:

```sql
DO $$
DECLARE
    test_id UUID := gen_random_uuid();
BEGIN
    -- Inserir em auth.users (simulado)
    -- Inserir em public.users (manual)
    INSERT INTO public.users (id, email, name, created_at, last_login)
    VALUES (test_id, 'teste_manual@example.com', 'Teste Manual', NOW(), NOW());

    RAISE NOTICE 'Usuário criado: %', test_id;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'ERRO: %', SQLERRM;
END $$;
```

Se esse comando der erro, o problema está nas permissões ou estrutura da tabela.

---

##  Após Corrigir

Execute o teste completo:

```bash
# Local
npm run dev

# Acesse
http://localhost:5173/cadastro

# Cadastre:
Nome: João Silva
Email: joao@example.com
Senha: senha123

# Deve funcionar! 
```

Depois verifique no Supabase:

```sql
SELECT * FROM public.users WHERE email = 'joao@example.com';
SELECT * FROM public.user_streaks WHERE user_id = (SELECT id FROM public.users WHERE email = 'joao@example.com');
SELECT * FROM public.subscriptions WHERE user_id = (SELECT id FROM public.users WHERE email = 'joao@example.com');
```

Deve retornar 1 linha em cada tabela! 

---

## =Þ Suporte

Se o erro persistir, envie:

1. Mensagem de erro exata
2. Logs do Supabase (Postgres Logs)
3. Resultado de:
   ```sql
   SELECT * FROM pg_proc WHERE proname = 'handle_new_user';
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```

---

**Desenvolvido com d por Claude Code**

=' _"Bugs existem para serem corrigidos"_
