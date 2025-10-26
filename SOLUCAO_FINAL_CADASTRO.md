# ✅ SOLUÇÃO FINAL - Erro "Database error saving new user"

## 🎯 O Problema

O Supabase **não permite** criar triggers na tabela `auth.users` por questões de segurança.

**Erro recebido:**
```
ERRO: 42501: deve ser proprietário dos usuários da relação
```

## ✅ A Solução

Em vez de usar trigger, vamos chamar uma **função SQL manualmente** após o signup.

---

## 📋 PASSO 1: Executar Script SQL no Supabase

### **1.1 Abrir Supabase**
1. Acesse: https://app.supabase.com/
2. Selecione projeto: `uetgenymwhiadqczpicc`
3. Menu → **SQL Editor** → **+ New Query**

### **1.2 Copiar e Executar**
1. Abra o arquivo: `FIX_SEM_TRIGGER_AUTH.sql`
2. Copie TUDO (Ctrl+A → Ctrl+C)
3. Cole no SQL Editor (Ctrl+V)
4. Clique em **RUN**

### **1.3 Verificar Sucesso**

Você deve ver:

```
═══════════════════════════════════════════════
✅ FUNÇÕES CRIADAS COM SUCESSO!
═══════════════════════════════════════════════

✅ create_user_on_signup() → ATIVA
✅ grant_access_after_purchase() → ATIVA

⚠️ PRÓXIMO PASSO: ATUALIZAR O CÓDIGO DO FRONTEND
═══════════════════════════════════════════════
```

✅ **PASSO 1 CONCLUÍDO!**

---

## 📋 PASSO 2: Código do Frontend JÁ FOI ATUALIZADO

O arquivo `src/lib/supabase.ts` já foi atualizado automaticamente!

### **O que mudou:**

**ANTES:**
```typescript
export async function signUpWithEmail(email: string, password: string, name?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name: name || 'Usuário' } }
  })

  if (error) throw error

  // ❌ Esperava que trigger criasse usuário automaticamente
  // (mas não temos permissão para criar trigger!)

  return data
}
```

**DEPOIS:**
```typescript
export async function signUpWithEmail(email: string, password: string, name?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name: name || 'Usuário' } }
  })

  if (error) throw error

  // ✅ Chamar função manualmente para criar usuário
  if (data.user) {
    const { data: createResult, error: createError } = await supabase.rpc('create_user_on_signup', {
      p_user_id: data.user.id,
      p_email: data.user.email,
      p_name: name || 'Usuário'
    })

    if (createError) {
      throw new Error('Database error saving new user')
    }
  }

  return data
}
```

✅ **PASSO 2 CONCLUÍDO!**

---

## 📋 PASSO 3: TESTAR O CADASTRO

### **3.1 Iniciar o Projeto**

No terminal:
```bash
cd "C:\Users\mathe\Downloads\detox mental backup - Copia\breath-essence-app-main"
npm run dev
```

### **3.2 Abrir no Navegador**

```
http://localhost:5173/cadastro
```

### **3.3 Criar Conta**

Preencha:
- **Nome:** Teste Final
- **Email:** teste.final@example.com
- **Senha:** senha123

Clique em **"Criar Conta"**

### **3.4 Resultado Esperado**

✅ **Cadastro concluído com sucesso!**
✅ **NÃO aparece erro "Database error saving new user"**

### **3.5 Verificar no Supabase**

**Em Authentication:**
1. Dashboard → **Authentication** → **Users**
2. Deve aparecer: `teste.final@example.com` ✅

**Em Table Editor:**
1. Dashboard → **Table Editor** → **users**
2. Deve aparecer: `teste.final@example.com`
3. Verifique:
   - `plan_type` = **"blocked"** ✅
   - `has_active_token` = **false** ✅

✅ **PASSO 3 CONCLUÍDO!**

---

## 📋 PASSO 4: VERIFICAR BLOQUEIO

### **4.1 Fazer Login**

1. Vá para: `http://localhost:5173/login`
2. Email: `teste.final@example.com`
3. Senha: `senha123`
4. Clique em **"Entrar"**

### **4.2 Tentar Acessar Dashboard**

Vá para: `http://localhost:5173/hoje`

### **4.3 Resultado Esperado**

❌ **Redireciona para:** `/acesso-negado`
✅ **Aparece página:** "Acesso Restrito"
✅ **Aparece botão:** "Assinar Agora - R$ 19,90/mês"

✅ **PASSO 4 CONCLUÍDO! Sistema está bloqueando corretamente!**

---

## 📋 PASSO 5: TESTAR LIBERAÇÃO DE ACESSO

### **5.1 Simular Pagamento**

No Supabase SQL Editor:

```sql
-- Simular pagamento Kiwify
SELECT public.grant_access_after_purchase(
    'teste.final@example.com',
    'Teste Final',
    'ORDER-TEST-001',
    'SUB-TEST-001'
);
```

Clique em **RUN**

### **5.2 Verificar Resultado**

Deve retornar JSON:
```json
{
  "success": true,
  "message": "Acesso liberado!",
  "email": "teste.final@example.com",
  "has_access": true,
  "plan": "premium"
}
```

### **5.3 Verificar no Table Editor**

1. **Table Editor** → **users** → `teste.final@example.com`
   - `plan_type` = **"premium"** ✅
   - `has_active_token` = **true** ✅

2. **Table Editor** → **subscriptions** → buscar por `user_id`
   - `plan` = **"premium"** ✅
   - `price` = **19.90** ✅
   - `status` = **"active"** ✅

### **5.4 Fazer Login Novamente**

1. Faça **logout**
2. Faça **login** com `teste.final@example.com`
3. Vá para: `http://localhost:5173/hoje`

### **5.5 Resultado Esperado**

✅ **ENTRA NO DASHBOARD!**
✅ **Não é mais redirecionado para "Acesso Negado"**
✅ **Pode acessar todas as funcionalidades**

✅ **PASSO 5 CONCLUÍDO! Sistema funcionando 100%!**

---

## 🎯 RESUMO DO QUE FOI FEITO

### **Problema Original:**
- Não podemos criar trigger em `auth.users` (sem permissão)
- Usuário era criado em Authentication mas não em `public.users`
- Dava erro: "Database error saving new user"

### **Solução Implementada:**
1. ✅ Criamos função SQL `create_user_on_signup()`
2. ✅ Frontend chama essa função após signup via `supabase.rpc()`
3. ✅ Função cria usuário em `public.users` como **blocked**
4. ✅ Função cria streak e verifica token pendente
5. ✅ Sistema libera acesso apenas após pagamento

---

## 🔄 FLUXO COMPLETO

### **Cadastro:**
```
1. Usuário preenche formulário
   ↓
2. supabase.auth.signUp() cria em auth.users
   ↓
3. supabase.rpc('create_user_on_signup') cria em public.users
   ↓
4. Usuário criado como BLOQUEADO
   ↓
5. Tenta acessar → redireciona para "Acesso Negado"
```

### **Pagamento:**
```
1. Usuário clica "Assinar Agora"
   ↓
2. Vai para Kiwify e paga
   ↓
3. Kiwify envia webhook
   ↓
4. grant_access_after_purchase() libera acesso
   ↓
5. Usuário vira PREMIUM
   ↓
6. Faz login → ENTRA NO DASHBOARD! 🎉
```

---

## ✅ CHECKLIST FINAL

Marque cada item:

- [ ] Script `FIX_SEM_TRIGGER_AUTH.sql` executado no Supabase
- [ ] Mensagem de sucesso apareceu (funções criadas)
- [ ] Código `src/lib/supabase.ts` atualizado
- [ ] Projeto rodando localmente (`npm run dev`)
- [ ] Cadastro funciona sem erro
- [ ] Usuário aparece em Authentication
- [ ] Usuário aparece em Table Editor (users) como "blocked"
- [ ] Login funciona
- [ ] Dashboard bloqueado (redireciona para "Acesso Negado")
- [ ] Simulação de pagamento funciona
- [ ] Usuário liberado consegue acessar dashboard

---

## 🆘 SE AINDA DER ERRO

### **Erro ao executar SQL:**
- Certifique-se de estar no projeto correto
- Verifique se copiou TODO o conteúdo do arquivo

### **Erro ao cadastrar:**
```
Database error saving new user
```
**Solução:**
- Verifique se a função `create_user_on_signup` existe:
  ```sql
  SELECT * FROM pg_proc WHERE proname = 'create_user_on_signup';
  ```
- Se não existir, execute o script novamente

### **Usuário não aparece em Table Editor:**
- Abra o Console do navegador (F12)
- Procure por mensagens de erro
- Verifique se a função RPC foi chamada

---

## 🎉 SUCESSO!

Se você chegou até aqui e todos os testes passaram:

**PARABÉNS! SISTEMA 100% FUNCIONAL!** 🎉🚀

- ✅ Cadastro funcionando
- ✅ Sistema apenas pago ativo
- ✅ Bloqueio funcionando
- ✅ Liberação de acesso funcionando
- ✅ Integração com Kiwify pronta

**Próximo passo:** Deploy para produção em https://detoxmental.site/

---

**Desenvolvido com 💪 por Claude Code**

_"Quando o trigger falha, use RPC!"_
