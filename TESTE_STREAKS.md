# 🔥 Sistema de Streaks - Guia de Teste

## ✅ Sistema Implementado com localStorage

O sistema de streaks está **100% funcional** usando **localStorage** para armazenamento local, sem necessidade de conexão com Supabase.

---

## 📍 Como Testar

### 1️⃣ **Visualizar Streak no Perfil**
1. Acesse: `http://localhost:5173/perfil`
2. Role a página e veja o card **"🌿 Seu progresso"**
3. Você verá:
   - **Dias consecutivos**: Seu streak atual
   - **Maior sequência**: Seu recorde pessoal
   - **Última meditação**: Quando você meditou pela última vez

### 2️⃣ **Completar uma Meditação**
1. Acesse qualquer página de meditação, por exemplo:
   - `http://localhost:5173/explorar/comecar-meditar/primeiros-passos`
   - `http://localhost:5173/explorar/populares/paz-interior`
2. **Clique no player de áudio** e deixe tocar até o final
3. Quando o áudio terminar, você verá o **modal de conclusão**:
   ```
   🎉 Parabéns! Você concluiu sua meditação!

   🔥 Você está no seu dia X de meditação consecutiva!
   ```
4. O número X será atualizado automaticamente

### 3️⃣ **Testar Lógica de Streak**

#### ✅ **Mesmo dia (não incrementa)**
- Complete uma meditação
- Complete outra meditação no mesmo dia
- Resultado: O streak permanece o mesmo

#### ✅ **Dia consecutivo (incrementa)**
- Complete uma meditação hoje
- Altere a data do sistema para amanhã (ou use DevTools)
- Complete outra meditação
- Resultado: Streak incrementa de 1 para 2

#### ✅ **Quebra de streak (reseta para 1)**
- Complete uma meditação hoje
- Altere a data do sistema para daqui a 3 dias
- Complete outra meditação
- Resultado: Streak volta para 1

---

## 🛠️ Ferramentas de Teste

### Console do Navegador

Abra o **Console do DevTools** (F12) e use os seguintes comandos:

```javascript
// Ver dados atuais do streak
JSON.parse(localStorage.getItem('detox_mental_streak_data'))

// Resetar o streak (volta para 0)
localStorage.removeItem('detox_mental_streak_data')
// Depois recarregue a página

// Simular meditação ontem (para testar incremento)
const data = JSON.parse(localStorage.getItem('detox_mental_streak_data'))
const yesterday = new Date()
yesterday.setDate(yesterday.getDate() - 1)
data.lastMeditationDate = yesterday.toISOString().split('T')[0]
localStorage.setItem('detox_mental_streak_data', JSON.stringify(data))
// Depois complete uma meditação

// Simular meditação há 3 dias (para testar quebra)
const data = JSON.parse(localStorage.getItem('detox_mental_streak_data'))
const threeDaysAgo = new Date()
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
data.lastMeditationDate = threeDaysAgo.toISOString().split('T')[0]
localStorage.setItem('detox_mental_streak_data', JSON.stringify(data))
// Depois complete uma meditação
```

### Importar Função de Reset

No console, você também pode usar:

```javascript
import { resetStreak } from '/src/services/localStreaksService.ts'
resetStreak()
```

---

## 🎯 Comportamento Esperado

### Modal de Conclusão
Quando o áudio termina, aparece:
- ✅ Título: **"🎉 Parabéns! Você concluiu sua meditação!"**
- ✅ Streak atual com ícone de chama pulsando
- ✅ Se for novo recorde: **"🎉 Novo recorde pessoal!"**
- ✅ Mensagem motivacional baseada no streak:
  - 1-2 dias: "🌱 Ótimo começo! Continue praticando!"
  - 3-6 dias: "💪 Continue assim! Você está no caminho certo!"
  - 7+ dias: "🎉 Incrível! Você está construindo um hábito forte!"

### Card de Progresso (Perfil)
- ✅ **Dias consecutivos**: Número grande com chama animada
- ✅ **Maior sequência**: Seu recorde com troféu
- ✅ **Última meditação**: Data formatada (Hoje/Ontem/X dias atrás)
- ✅ **Mensagem motivacional**: Muda conforme o streak
- ✅ Atualiza automaticamente a cada 5 segundos

---

## 📊 Estrutura dos Dados (localStorage)

```typescript
interface LocalStreakData {
  currentStreak: number;       // Dias consecutivos atuais
  longestStreak: number;       // Recorde pessoal
  lastMeditationDate: string;  // Formato: "YYYY-MM-DD"
  totalSessions: number;       // Total de meditações
}
```

**Chave do localStorage**: `detox_mental_streak_data`

---

## 🎨 Design Implementado

### Modal de Conclusão
- ✅ Animação de entrada (fade + scale)
- ✅ Ícone de chama com animação pulsante
- ✅ Gradientes suaves (laranja para streak, amarelo para recorde)
- ✅ Botões: "Fechar" e "Ver Perfil"

### Card de Progresso
- ✅ Glassmorphism design
- ✅ Grid responsivo (3 colunas no desktop, 1 no mobile)
- ✅ Animações staggered (entrada em sequência)
- ✅ Cores: Roxo (streak), Azul (recorde), Verde (última data)

---

## 🚀 Próximos Passos (Integração Supabase)

Quando estiver pronto para conectar ao Supabase:

1. Substitua `localStreaksService.ts` por `streaksService.ts` nas importações
2. Execute as migrations SQL do Supabase
3. O sistema já está preparado para migração suave

**Arquivos a atualizar**:
- `src/components/AudioPageLayout.tsx` (linha 18)
- `src/components/StreakCard.tsx` (linha 6)

---

## ✅ Checklist de Funcionalidades

- [x] Sistema de localStorage funcionando
- [x] Detecção de conclusão de áudio
- [x] Modal de parabéns com streak
- [x] Card de progresso no perfil
- [x] Lógica de incremento/reset de streak
- [x] Detecção de novo recorde
- [x] Mensagens motivacionais dinâmicas
- [x] Formatação de datas (Hoje/Ontem/X dias atrás)
- [x] Animações e design glassmorphism
- [x] Persistência entre recarregamentos
- [x] Atualização automática do card (5s)

---

## 📝 Logs do Console

Durante o teste, você verá logs úteis:

```
🎵 Áudio concluído! Atualizando streak...
📊 Resultado do streak: { success: true, newStreak: 3, isNewRecord: false, ... }
```

Caso precise resetar para testar:
```
✅ Streak resetado!
```

---

## 🎉 Pronto para Testar!

1. Abra o navegador em `http://localhost:5173`
2. Vá para `/perfil` e veja o card de progresso
3. Vá para qualquer meditação e complete o áudio
4. Veja o modal de conclusão aparecer
5. Volte ao perfil e veja o streak atualizado

**Divirta-se testando! 🚀**
