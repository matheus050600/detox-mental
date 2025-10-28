# 🤖 Workflows Mental IA para n8n

Este diretório contém workflows prontos para importar no n8n e fazer o chat Mental IA funcionar.

## 📦 Workflows Disponíveis

### 1. **mental-ia-simples.json** (Recomendado para testar)
- ✅ Funciona imediatamente, sem configuração
- ✅ Não precisa de API key
- ✅ Respostas empáticas pré-programadas
- ✅ Ótimo para testar se tudo está funcionando

### 2. **mental-ia-openai.json** (Para produção)
- 🤖 Usa GPT-4o-mini da OpenAI
- 💬 Respostas personalizadas e inteligentes
- 🔑 Requer API key da OpenAI
- 🎯 Configurado com prompt específico de saúde mental

---

## 🚀 Como Importar (Passo a Passo)

### **Opção 1: Workflow Simples (Comece por aqui!)**

#### 1. **Acesse seu n8n**
   - URL: https://n8n.promptart.store
   - Faça login

#### 2. **Importe o workflow**
   - Clique no menu (☰) no canto superior esquerdo
   - Clique em **"Import from File"**
   - Selecione o arquivo: `mental-ia-simples.json`
   - Clique em **"Import"**

#### 3. **Configure o webhook**
   - Abra o nó **"Webhook"** (primeiro nó)
   - Em **"Webhook URLs"**, copie a URL de **Production**
   - Deve ser algo como: `https://n8n.promptart.store/webhook/Mentalia`

#### 4. **Ative o workflow**
   - Clique no toggle no canto superior direito
   - Deve ficar **verde** (Active)

#### 5. **Teste imediatamente!**
   ```bash
   curl -X POST "https://n8n.promptart.store/webhook/Mentalia" \
     -H "Content-Type: application/json" \
     -d '{"message":"Estou me sentindo ansioso"}'
   ```

   **Resposta esperada:**
   ```json
   {
     "response": "Entendo que você disse: \"Estou me sentindo ansioso\". Como posso te ajudar mais?"
   }
   ```

✅ **Pronto!** Agora abra o site e teste o chat!

---

### **Opção 2: Workflow com OpenAI (Produção)**

#### 1. **Obtenha uma API key da OpenAI**
   - Acesse: https://platform.openai.com/api-keys
   - Crie uma nova API key
   - Copie e guarde em local seguro

#### 2. **Configure a credencial no n8n**
   - No n8n, vá em **Settings** → **Credentials**
   - Clique em **"Create New"**
   - Procure por **"OpenAI"**
   - Cole sua API key
   - Dê um nome: "OpenAI API"
   - Salve

#### 3. **Importe o workflow**
   - Menu (☰) → **"Import from File"**
   - Selecione: `mental-ia-openai.json`
   - Clique em **"Import"**

#### 4. **Conecte a credencial**
   - Abra o nó **"OpenAI"** (terceiro nó)
   - Em **"Credential to connect with"**, selecione a credencial que você criou
   - Salve

#### 5. **Ative o workflow**
   - Toggle no canto superior direito → **verde**

#### 6. **Teste com IA real!**
   ```bash
   curl -X POST "https://n8n.promptart.store/webhook/Mentalia" \
     -H "Content-Type: application/json" \
     -d '{"message":"Estou me sentindo ansioso hoje"}'
   ```

   **Resposta esperada (exemplo):**
   ```json
   {
     "response": "Entendo que você está se sentindo ansioso. É importante reconhecer esses sentimentos. O que especificamente está causando essa ansiedade? Posso te ajudar a explorar isso com calma."
   }
   ```

---

## 🎨 Personalizando o Workflow OpenAI

### Ajustar o Prompt do Sistema

Abra o nó **"OpenAI"** e edite a mensagem de sistema para mudar o comportamento da IA:

```
Você é a Mental IA, uma assistente de saúde mental acolhedora...
```

### Ajustar Criatividade (Temperature)

- **Temperature: 0.7-0.9** → Respostas mais criativas e variadas
- **Temperature: 0.3-0.5** → Respostas mais consistentes e focadas

### Ajustar Tamanho das Respostas (Max Tokens)

- **150-300 tokens** → Respostas concisas (recomendado para chat)
- **300-500 tokens** → Respostas mais elaboradas

---

## 🔄 Trocar entre Workflows

Você pode ter **ambos workflows ativos**, mas cada um deve ter um **path diferente**:

### Workflow Simples:
- Path: `/Mentalia-teste`
- URL: `https://n8n.promptart.store/webhook/Mentalia-teste`

### Workflow OpenAI:
- Path: `/Mentalia`
- URL: `https://n8n.promptart.store/webhook/Mentalia`

No código do frontend (`MentalChatIA.tsx`), basta mudar a URL.

---

## 🧪 Testando no Site

1. **Abra o site**: https://seu-site.vercel.app
2. **Faça login** (se necessário)
3. **Role até "Mental IA"** na página inicial
4. **Clique em "Conversar com Mental IA"**
5. **Envie uma mensagem**
6. **Abra F12 → Console** para ver os logs

### O que esperar no console:
```
🚀 Enviando mensagem para webhook: https://n8n.promptart.store/webhook/Mentalia
📤 Payload: {message: "oi"}
📥 Status da resposta: 200
📝 Resposta raw: {"response":"Olá! Como posso te ajudar?"}
✅ Resposta JSON parseada: {response: "Olá! Como posso te ajudar?"}
🤖 Resposta da IA: Olá! Como posso te ajudar?
```

---

## ❓ Troubleshooting

### ❌ "Webhook retornou resposta vazia"

**Causa**: O workflow não tem o nó "Respond to Webhook" ou está mal configurado.

**Solução**:
1. Abra o workflow no n8n
2. Verifique se o último nó é **"Respond to Webhook"**
3. Verifique se o Response Body é: `{{ { "response": $json.response } }}`

---

### ❌ "404 - Webhook not registered"

**Causa**: O workflow não está ativo ou o path está errado.

**Solução**:
1. Certifique-se de que o workflow está **ativo** (toggle verde)
2. Verifique o path no nó Webhook (deve ser `Mentalia`)
3. Tente salvar novamente o workflow

---

### ❌ "Error 500" ou timeout

**Causa**: Erro no processamento ou OpenAI demorou muito.

**Solução**:
1. Abra o workflow no n8n
2. Veja a aba **"Executions"** para ver o erro
3. Verifique se a API key da OpenAI está correta
4. Verifique se há créditos na conta OpenAI

---

## 📊 Estrutura dos Workflows

### Workflow Simples:
```
┌──────────┐    ┌──────────────────┐    ┌──────────────────┐
│ Webhook  │───▶│ Processar        │───▶│ Respond to       │
│ Trigger  │    │ Mensagem (Code)  │    │ Webhook          │
└──────────┘    └──────────────────┘    └──────────────────┘
```

### Workflow OpenAI:
```
┌──────────┐    ┌──────────────┐    ┌─────────┐    ┌──────────────┐    ┌──────────────┐
│ Webhook  │───▶│ Extrair      │───▶│ OpenAI  │───▶│ Formatar     │───▶│ Respond to   │
│ Trigger  │    │ Mensagem     │    │         │    │ Resposta     │    │ Webhook      │
└──────────┘    └──────────────┘    └─────────┘    └──────────────┘    └──────────────┘
```

---

## 💡 Dicas Avançadas

### 1. **Adicionar Histórico de Conversa**
   - Use o nó **"Redis"** ou **"Supabase"** para guardar mensagens anteriores
   - Envie contexto para a OpenAI

### 2. **Adicionar Análise de Sentimento**
   - Use nó **"Code"** com biblioteca de análise
   - Ajuste o tom da resposta baseado no sentimento

### 3. **Adicionar Fallback**
   - Use o nó **"Error Trigger"** para capturar erros
   - Retorne uma mensagem amigável se algo falhar

### 4. **Adicionar Rate Limiting**
   - Use nó **"Code"** para controlar frequência de mensagens
   - Previne abuso da API

---

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs no console do navegador (F12)
2. Verifique as execuções no n8n (aba Executions)
3. Consulte o arquivo `MENTAL_CHAT_DEBUG.md`

---

**Última atualização**: 2025-10-27
**Versão**: 1.0
