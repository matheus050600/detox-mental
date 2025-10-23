# 🚀 Guia de Integração Supabase - Detox Mental

Este guia explica como conectar o Detox Mental ao Supabase e fazer tudo funcionar.

## 📋 Pré-requisitos

1. Conta no Supabase (gratuita): https://supabase.com
2. Projeto criado no Supabase
3. SQL executado (arquivo `supabase-setup.sql`)

---

## 🔧 Passo 1: Configurar o Banco de Dados

1. Acesse seu projeto no Supabase Dashboard
2. Vá em **SQL Editor** (menu lateral)
3. Copie todo o conteúdo do arquivo `supabase-setup.sql`
4. Cole no editor e clique em **Run**
5. Aguarde a confirmação de sucesso ✅

---

## 🔑 Passo 2: Obter as Credenciais

1. No Supabase Dashboard, vá em **Settings** → **API**
2. Copie as seguintes informações:
   - **Project URL** (exemplo: `https://xxxxxxxxxxx.supabase.co`)
   - **anon public** key (uma string JWT longa)

---

## ⚙️ Passo 3: Configurar as Variáveis de Ambiente

1. Na raiz do projeto, copie o arquivo `.env.example`:
   ```bash
   cp .env.example .env
   ```

2. Abra o arquivo `.env` e cole suas credenciais:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
   ```

3. **IMPORTANTE**: Nunca commit o arquivo `.env` no Git!

---

## 📦 Passo 4: Instalar Dependências

Se ainda não instalou o cliente do Supabase:

```bash
npm install @supabase/supabase-js
```

---

## 🎯 Como Usar os Serviços

### Autenticação

```typescript
import { signUpWithEmail, signInWithEmail, signOut } from '@/services/supabaseService'

// Cadastro
await signUpWithEmail('João Silva', 'joao@email.com', 'senha123')

// Login
await signInWithEmail('joao@email.com', 'senha123')

// Logout
await signOut()
```

### Meditações

```typescript
import { getAllMeditations, getMeditationById } from '@/services/supabaseService'

// Buscar todas
const meditations = await getAllMeditations()

// Buscar por ID
const meditation = await getMeditationById('uuid-aqui')
```

### Progresso

```typescript
import { updateUserProgress, getCompletedMeditationsCount } from '@/services/supabaseService'

// Atualizar progresso (ex: 50% concluído)
await updateUserProgress('meditation-id', 50, false)

// Marcar como concluído
await updateUserProgress('meditation-id', 100, true)

// Contar meditações concluídas
const count = await getCompletedMeditationsCount()
```

### Streaks

```typescript
import { getUserStreak, updateUserStreak } from '@/services/supabaseService'

// Buscar streak atual
const streak = await getUserStreak()
console.log(`Sequência atual: ${streak?.current_streak} dias`)

// Atualizar após completar meditação
const result = await updateUserStreak()
console.log(result.message) // "Continue assim!" ou "Novo recorde!"
```

### Assinaturas

```typescript
import { getActiveSubscription, hasActiveSubscription } from '@/services/supabaseService'

// Verificar se tem assinatura ativa
const hasSubscription = await hasActiveSubscription()

// Buscar detalhes da assinatura
const subscription = await getActiveSubscription()
console.log(`Plano: R$${subscription?.price}/mês`)
```

---

## 🔐 Segurança (RLS - Row Level Security)

O SQL já configurou as políticas de segurança:

✅ Usuários só acessam seus próprios dados  
✅ Meditações são públicas (catálogo)  
✅ Progresso e streaks são privados  
✅ Assinaturas são privadas  

---

## 📊 Testando a Integração

### 1. Teste o Cadastro
```typescript
// Cria usuário + plano mensal + assinatura + streak inicial
await signUpWithEmail('Teste', 'teste@email.com', '123456')
```

### 2. Verifique no Supabase Dashboard
- Vá em **Table Editor**
- Confira se os dados apareceram em:
  - `users`
  - `subscriptions`
  - `user_streaks`

### 3. Teste uma Meditação
```typescript
// Simula progresso
await updateUserProgress('meditation-id', 50, false) // 50%
await updateUserProgress('meditation-id', 100, true) // Concluído
await updateUserStreak() // Atualiza streak
```

---

## 🎨 Exemplo Completo: Página de Meditação

```typescript
import { useEffect, useState } from 'react'
import { getMeditationById, updateUserProgress, updateUserStreak } from '@/services/supabaseService'

function MeditationPage({ meditationId }) {
  const [meditation, setMeditation] = useState(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Carrega dados da meditação
    const load = async () => {
      const data = await getMeditationById(meditationId)
      setMeditation(data)
    }
    load()
  }, [meditationId])

  const handleProgressChange = async (percent: number) => {
    setProgress(percent)
    // Salva no banco
    await updateUserProgress(meditationId, percent, percent === 100)
    
    // Se completou, atualiza streak
    if (percent === 100) {
      const result = await updateUserStreak()
      alert(result.message)
    }
  }

  return (
    <div>
      <h1>{meditation?.title}</h1>
      <audio 
        src={meditation?.audio_url} 
        onTimeUpdate={(e) => {
          const audio = e.currentTarget
          const percent = (audio.currentTime / audio.duration) * 100
          handleProgressChange(Math.round(percent))
        }}
      />
      <progress value={progress} max={100} />
    </div>
  )
}
```

---

## 🐛 Troubleshooting

### Erro: "Invalid API key"
- Verifique se copiou a **anon public** key correta
- Confira se o arquivo `.env` está na raiz do projeto
- Reinicie o servidor de desenvolvimento (`npm run dev`)

### Erro: "relation does not exist"
- Execute o SQL novamente no Supabase
- Verifique se todas as tabelas foram criadas em **Table Editor**

### Erro: "Row level security"
- Certifique-se de estar autenticado antes de acessar dados privados
- Verifique se as policies foram criadas corretamente

---

## 📚 Recursos Adicionais

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## ✅ Checklist Final

- [ ] SQL executado no Supabase
- [ ] Variáveis de ambiente configuradas
- [ ] Dependência `@supabase/supabase-js` instalada
- [ ] Cadastro funciona e cria registros em 4 tabelas
- [ ] Login funciona e retorna dados do usuário
- [ ] Meditações carregam do banco
- [ ] Progresso é salvo e atualizado
- [ ] Streaks funcionam corretamente
- [ ] Assinatura aparece no perfil

---

🎉 **Pronto! Seu Detox Mental está 100% integrado com o Supabase!**
