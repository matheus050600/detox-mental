# =� Detox Mental - Pr�ximos Passos para Deploy

## <� Seu objetivo: **https://detoxmental.site/**

---

##  O que j� est� pronto:

-  Integra��o completa com Supabase
-  Sistema de autentica��o (login/cadastro)
-  Integra��o com Kiwify (webhook + token)
-  Controle de acesso por token (`rsmplzhq7p9`)
-  Migrations SQL prontas
-  Build funcionando
-  Arquivos de configura��o criados

---

## =� O QUE VOC� PRECISA FAZER AGORA:

### **=4 PASSO 1: Executar Migrations no Supabase (5 minutos)**

1. Acesse: https://app.supabase.com/
2. Selecione seu projeto
3. V� em **SQL Editor** � **New Query**
4. Execute em ordem:

**Migration 1:**
```sql
-- Copie TODO o conte�do de:
-- supabase/migrations/20250121_init_detox_mental.sql
-- Cole aqui e clique em RUN
```

**Migration 2:**
```sql
-- Copie TODO o conte�do de:
-- supabase/migrations/20250122_kiwify_webhook_integration.sql
-- Cole aqui e clique em RUN
```

 Verificar se deu certo:
```sql
-- Ver tabelas criadas
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Deve listar: `users`, `meditations`, `user_progress`, `user_streaks`, `subscriptions`, `user_sessions`, `kiwify_webhooks`, `access_tokens`

---

### **=4 PASSO 2: Configurar Arquivo .env (2 minutos)**

1. Copie o arquivo `.env.example`:

```bash
copy .env.example .env
```

2. Abra o `.env` e adicione suas credenciais:

V� em: Supabase Dashboard � **Project Settings** � **API**

Copie:
- **Project URL**: `https://uetgenymwhiadqczpicc.supabase.co`
- **anon public key**: `eyJhbGc...` (chave longa)

Cole no `.env`:

```env
VITE_SUPABASE_URL=https://uetgenymwhiadqczpicc.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

---

### **=4 PASSO 3: Testar Localmente (5 minutos)**

```bash
# Rodar localmente
npm run dev
```

Acesse: `http://localhost:5173/`

**Testes:**
1.  Criar uma conta em `/cadastro`
2.  Fazer login em `/login`
3.  Tentar acessar `/hoje` � Deve redirecionar para `/acesso-negado` (porque n�o tem token ainda)
4.  Ver seu perfil em `/perfil`

**Liberar token de teste via SQL:**

```sql
-- Substituir pelo seu email
SELECT process_kiwify_webhook('{
  "order_id": "test-local-001",
  "order_status": "paid",
  "Customer": {"email": "SEU_EMAIL@example.com", "full_name": "Teste Local"},
  "subscription_id": "sub-test-001",
  "Subscription": {"status": "active"}
}'::jsonb);
```

Agora fa�a logout e login novamente � Acesso liberado! 

---

### **=4 PASSO 4: Fazer Deploy na Vercel (10 minutos)**

Siga o guia completo: **`DEPLOY_PRODUCTION.md`**

**Resumo:**

1. **Criar reposit�rio no GitHub:**

```bash
git init
git add .
git commit -m "Initial commit - Detox Mental"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/detox-mental.git
git push -u origin main
```

2. **Deploy na Vercel:**
   - Acesse: https://vercel.com/
   - Conecte o reposit�rio
   - Configure vari�veis de ambiente:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Deploy!

3. **Conectar dom�nio:**
   - Vercel � Settings � Domains
   - Adicionar: `detoxmental.site`
   - Configurar DNS no seu provedor

---

### **=4 PASSO 5: Configurar Webhook Kiwify (15 minutos)**

Siga o guia: **`WEBHOOK_KIWIFY_SETUP.md`**

**Resumo:**

1. **Criar Edge Function no Supabase:**
   - Dashboard � **Edge Functions** � Create
   - Nome: `kiwify-webhook`
   - Cole o c�digo do guia
   - Deploy

2. **Configurar na Kiwify:**
   - Dashboard Kiwify � Webhooks
   - URL: `https://uetgenymwhiadqczpicc.supabase.co/functions/v1/kiwify-webhook`
   - Eventos: Todos
   - Salvar

3. **Testar:**
   - Bot�o "Testar Webhook" na Kiwify
   - Verificar no SQL Editor:
     ```sql
     SELECT * FROM kiwify_webhooks ORDER BY created_at DESC LIMIT 5;
     ```

---

### **=4 PASSO 6: Atualizar Link de Venda (2 minutos)**

Editar: `src/pages/AcessoNegado.tsx` (linha ~90)

```typescript
<Button
  onClick={() => window.open("SEU_LINK_KIWIFY_AQUI", "_blank")}
  ...
>
```

Commit e push:

```bash
git add src/pages/AcessoNegado.tsx
git commit -m "Atualizar link de venda"
git push
```

---

## <� PRONTO!

Ap�s completar esses 6 passos, voc� ter�:

 **https://detoxmental.site/** funcionando
 Login e cadastro integrados
 Webhook da Kiwify ativo
 Sistema de controle de acesso por token
 Vendas automatizadas

---

## =� Documenta��o

| Arquivo | Descri��o |
|---------|-----------|
| `SETUP.md` | Setup inicial do Supabase |
| `WEBHOOK_KIWIFY_SETUP.md` | Configura��o completa do webhook |
| `KIWIFY_INTEGRACAO.md` | Como funciona a integra��o |
| `DEPLOY_PRODUCTION.md` | Deploy completo para produ��o |
| `.env.example` | Template de vari�veis de ambiente |

---

## = Informa��es Importantes

**Token de Acesso:**
```
rsmplzhq7p9
```

**Dom�nio de Produ��o:**
```
https://detoxmental.site/
```

**URL Supabase:**
```
https://uetgenymwhiadqczpicc.supabase.co
```

**Webhook URL:**
```
https://uetgenymwhiadqczpicc.supabase.co/functions/v1/kiwify-webhook
```

---

## <� Precisa de Ajuda?

1. **Erro nas migrations?** � Ver `SETUP.md`
2. **Webhook n�o funciona?** � Ver `WEBHOOK_KIWIFY_SETUP.md`
3. **Deploy com problemas?** � Ver `DEPLOY_PRODUCTION.md`
4. **D�vidas sobre integra��o?** � Ver `KIWIFY_INTEGRACAO.md`

---

## =� Checklist Completo

### Antes do Deploy:
- [ ] Migrations executadas no Supabase
- [ ] Arquivo `.env` configurado
- [ ] Testado localmente (`npm run dev`)
- [ ] Reposit�rio Git criado

### Deploy:
- [ ] C�digo no GitHub
- [ ] Projeto criado na Vercel
- [ ] Vari�veis de ambiente configuradas
- [ ] Deploy realizado com sucesso
- [ ] Dom�nio conectado
- [ ] DNS configurado

### Webhook:
- [ ] Edge Function criada
- [ ] Edge Function deployada
- [ ] URL configurada na Kiwify
- [ ] Eventos selecionados
- [ ] Webhook testado

### Final:
- [ ] Site acess�vel em https://detoxmental.site
- [ ] Login funcionando
- [ ] Cadastro funcionando
- [ ] Prote��o de rotas ativa
- [ ] Webhook recebendo dados
- [ ] Link de venda atualizado

---

## =� Come�e Agora!

**Tempo estimado total: ~40 minutos**

Comece pelo **PASSO 1** e siga em ordem. Qualquer d�vida, consulte os guias espec�ficos!

Boa sorte! <�

---

**Desenvolvido com d por Claude Code**

>�B _"Cada respira��o � um novo come�o"_
