# 📦 Sistema de Mapeamento Automático de Conteúdo

Este documento explica como funciona o sistema automático de mapeamento de imagens e áudios do projeto.

## 🎯 Objetivo

Automatizar completamente a integração entre os arquivos de mídia (imagens e áudios) na pasta `/src/assets` e as páginas de conteúdo do site, sem necessidade de configuração manual.

## 🏗️ Arquitetura

### 1. Script de Geração (`scripts/generateContentMap.js`)

**O que faz:**
- Varre automaticamente a pasta `src/assets`
- Identifica todos os arquivos de imagem (.jpg, .png, .webp) e áudio (.mp3, .m4a, .mp4, .wav)
- Agrupa arquivos pelo nome base (ex: "foco e concentração.jpg" + "foco e concentração.m4a")
- Normaliza nomes (remove acentos, corrige erros de digitação)
- Gera o arquivo `src/data/contentMap.ts` com mapeamento completo

**Quando roda:**
- Automaticamente antes de `npm run dev`
- Automaticamente antes de `npm run build`
- Manualmente com `npm run generate:content`

**Exemplo de saída:**
```typescript
export const contentMap = {
  "foco e concentracao": {
    title: "foco e concentração",
    normalizedName: "foco e concentracao",
    image: "/src/assets/foco e concentração.jpg",
    audio: "/src/assets/foco e concentração.m4a"
  },
  // ... outros conteúdos
}
```

### 2. ContentMap (`src/data/contentMap.ts`)

**Gerado automaticamente** pelo script acima.

**Estrutura:**
```typescript
interface ContentItem {
  title: string;              // Nome original do arquivo
  normalizedName: string;     // Nome normalizado (sem acentos)
  image: string | null;       // Caminho da imagem ou null
  audio: string | null;       // Caminho do áudio ou null
}

type ContentMap = Record<string, ContentItem>;
```

**Funções auxiliares:**
- `getContentByTitle(title: string)` - Busca conteúdo por título (com normalização automática)
- `availableContent` - Array com todas as chaves disponíveis

### 3. Componente AudioPlayer (`src/components/AudioPlayer.tsx`)

Player de áudio completo e funcional com:
- ✅ Play/Pause
- ✅ Barra de progresso com seek
- ✅ Controle de volume
- ✅ Mute/Unmute
- ✅ Skip +10s / -10s
- ✅ Exibição de tempo (atual / total)
- ✅ Design responsivo e modo escuro

### 4. AudioPageLayout (`src/components/AudioPageLayout.tsx`)

**Atualizado para integração automática:**

```typescript
// Busca automática do conteúdo baseado no título
const content = getContentByTitle(title);

// Exibe imagem de capa (se disponível)
{content?.image && <img src={content.image} />}

// Exibe player de áudio (se disponível)
{content?.audio ? (
  <AudioPlayer audioSrc={content.audio} title={title} />
) : (
  // Placeholder: "Áudio disponível em breve"
)}
```

## 📂 Estrutura de Arquivos

```
projeto/
├── scripts/
│   └── generateContentMap.js    # Script de mapeamento automático
├── src/
│   ├── assets/                  # Todos os arquivos de mídia
│   │   ├── foco e concentração.jpg
│   │   ├── foco e concentração.m4a
│   │   ├── paz interior.jpg
│   │   ├── paz interior.mp3
│   │   └── ... (70+ arquivos)
│   ├── components/
│   │   ├── AudioPageLayout.tsx  # Layout com integração automática
│   │   └── AudioPlayer.tsx      # Player de áudio funcional
│   └── data/
│       └── contentMap.ts        # Gerado automaticamente
└── package.json                 # Scripts configurados
```

## 🚀 Como Usar

### Para desenvolvedores:

1. **Adicionar novo conteúdo:**
   - Coloque a imagem e/ou áudio em `src/assets/`
   - Use o **mesmo nome** para ambos (ex: "novo conteudo.jpg" + "novo conteudo.m4a")
   - Rode `npm run dev` (o mapeamento é automático)

2. **Usar em uma página:**
   ```tsx
   import AudioPageLayout from "@/components/AudioPageLayout";

   const MinhaPage = () => {
     return (
       <AudioPageLayout
         title="foco e concentração"  // Busca automática!
         subtitle="Melhore seu foco"
         duration="10 min"
         type="MEDITAÇÃO"
       />
     );
   };
   ```

3. **O sistema faz automaticamente:**
   - ✅ Normaliza o nome (ignora acentos, maiúsculas)
   - ✅ Encontra a imagem correspondente
   - ✅ Encontra o áudio correspondente
   - ✅ Exibe player funcional ou placeholder

### Para usuários finais:

O sistema é **completamente transparente**:
- Ao abrir uma seção, vê automaticamente a imagem de capa
- Se houver áudio, pode reproduzir com player completo
- Se não houver áudio, vê mensagem amigável: "Áudio disponível em breve"

## 🔧 Configuração no package.json

```json
{
  "scripts": {
    "dev": "npm run generate:content && vite",
    "build": "npm run generate:content && vite build",
    "generate:content": "node scripts/generateContentMap.js"
  }
}
```

## 📊 Estatísticas Atuais

Executando `npm run generate:content`:

```
✅ Encontrados 70 conteúdos mapeados

📊 Estatísticas:
   • Com imagem: 39
   • Com áudio: 39
   • Completos (imagem + áudio): 8
```

## 🎨 Funcionalidades do Player

### Controles:
- **Play/Pause** - Botão central com gradiente
- **Skip -10s / +10s** - Botões laterais
- **Seek bar** - Clique para ir a qualquer posição
- **Volume** - Slider de 0 a 100%
- **Mute** - Botão rápido

### Visual:
- Design minimalista e clean
- Suporte a modo claro/escuro automático
- Responsivo (mobile/tablet/desktop)
- Animações suaves

### UX:
- Exibe tempo atual / duração total
- Formatação inteligente (ex: 1:23)
- Feedback visual nos controles
- Estado do áudio (playing/paused/loading)

## 🔄 Fluxo Completo

```
1. Desenvolvedor adiciona "meditacao.jpg" e "meditacao.m4a" em /assets
                    ↓
2. Roda "npm run dev"
                    ↓
3. Script executa automaticamente:
   - Varre pasta /assets
   - Encontra ambos os arquivos
   - Gera entrada no contentMap.ts
                    ↓
4. Página usa <AudioPageLayout title="meditacao" />
                    ↓
5. Sistema busca automaticamente:
   - getContentByTitle("meditacao")
   - Retorna { image: "...", audio: "..." }
                    ↓
6. Renderiza:
   - Imagem de capa
   - Player de áudio funcional
                    ↓
7. Usuário interage:
   - Vê a imagem
   - Reproduz o áudio
   - ✨ Tudo funciona!
```

## ⚠️ Importante

### Convenções de nomes:
- Use o **mesmo nome base** para imagem e áudio
- Exemplo correto: `paz interior.jpg` + `paz interior.m4a`
- O sistema ignora acentos e maiúsculas automaticamente

### Formatos suportados:
- **Imagens:** .jpg, .jpeg, .png, .webp
- **Áudios:** .mp3, .m4a, .mp4, .wav

### Fallback:
- Se não houver imagem: não exibe nada (apenas player)
- Se não houver áudio: exibe placeholder amigável
- Se houver erro ao carregar: usa imagem padrão

## 🎉 Benefícios

✅ **Zero configuração manual**
✅ **Adicione arquivos e funciona**
✅ **Normalização automática de nomes**
✅ **Player completo e funcional**
✅ **Suporte a modo escuro**
✅ **Totalmente responsivo**
✅ **Mensagens amigáveis**
✅ **Performance otimizada**

---

**Desenvolvido com automação inteligente para o Detox Mental** 🧘‍♀️✨
