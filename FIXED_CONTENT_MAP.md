# 🗺️ Sistema de Mapeamento Fixo de Conteúdo

## ✅ Implementação Completa

Foi criado um **sistema de mapeamento fixo e direto** que garante que cada seção do site carregue exatamente os arquivos corretos de imagem e áudio da pasta `/assets`.

---

## 📁 Arquivos Criados/Modificados

### 1. **Novo arquivo: `src/data/fixedContentMap.ts`**

Este arquivo contém um **objeto de mapeamento manual** que associa cada título de conteúdo aos seus respectivos arquivos de imagem e áudio.

#### Estrutura:
```typescript
export interface FixedContentItem {
  image: string;
  audio: string;
}

export const fixedContentMap: Record<string, FixedContentItem> = {
  "Primeiros passos": {
    image: "/src/assets/primeiros passos na meidtação.jpg",
    audio: "/src/assets/primeiros passos meditação.wav"
  },
  "Meditação guiada para iniciantes": {
    image: "/src/assets/meditação guiada para iniciantes 1.jpg",
    audio: "/src/assets/meidtação guiada para iniciantes.m4a"
  },
  // ... e todos os outros conteúdos
};
```

### 2. **Modificado: `src/components/AudioPageLayout.tsx`**

O componente foi atualizado para usar o mapeamento fixo como **primeira prioridade**, com fallback para o sistema automático.

#### Lógica de busca:
```typescript
useEffect(() => {
  // 1. PRIORIDADE: Tenta buscar no mapa fixo primeiro
  const fixedContent = getFixedContent(title);

  if (fixedContent) {
    setContent(fixedContent);
    setLoading(false);
    return;
  }

  // 2. FALLBACK: Busca no contentMap automático se não encontrou no fixo
  let foundContent = getContentByTitle(title);
  // ... resto do código de fallback
}, [title]);
```

---

## 🗂️ Mapeamentos Implementados

### **Seção "Hoje"**

| Título | Imagem | Áudio |
|--------|--------|-------|
| Primeiros passos | `primeiros passos na meidtação.jpg` | `primeiros passos meditação.wav` |
| Meditação guiada para iniciantes | `meditação guiada para iniciantes 1.jpg` | `meidtação guiada para iniciantes.m4a` |
| Despertar da consciência | `despertar da cosciência.jpg` | `Despertar da consciencia.m4a` |
| Como a meditação transforma sua vida | `meditação.jpg` (fallback) | `como a meditação transforma a sua vida.m4a` |
| O poder da respiração consciente | `reapiração consciente.jpg` | `respiração consciente.mp3` |
| Encontrando paz interior | `paz interior.jpg` | `encontrando a paz interior.mp3` |
| Paz interior | `paz interior.jpg` | `paz interior.mp3` |
| Mindfulness na rotina diária | `meditação.jpg` (fallback) | `Mindfulness na rotina diária.mp3` |
| Gratidão e bem-estar | `gratidão diaria.jpg` | `gratidão.m4a` |
| Gratidão diária | `gratidão diaria.jpg` | `gratidão diaria.mp3` |

### **Começar a Meditar**

| Título | Imagem | Áudio |
|--------|--------|-------|
| Começar a meditar | `comece a meditar 1.jpg` | `comece a meditar.m4a` |
| Respiração consciente | `reapiração consciente.jpg` | `respiração consciente.mp3` |
| Iniciação ao mindfulness | `iniciação ao mindfulness.jpg` | `meditation-yoga-409201.mp3` |
| Atenção plena para iniciantes | `atenção plena para iniciantes.jpg` | `meditation-yoga-409201.mp3` |

### **Programas**

| Título | Imagem | Áudio |
|--------|--------|-------|
| Ansiedade e estresse | `ansiedade e estresse.jpg` | `ansiedade e estresse.m4a` |
| Autoconhecimento profundo | `meditação 2.jpg` (fallback) | `Autoconhecimento profundo.m4a` |
| Cultivando a compaixão | `meditação 3.jpg` (fallback) | `meditation-yoga-409201.mp3` |
| Equilíbrio emocional | `meditação 4.jpg` (fallback) | `euqilibrio emocional.m4a` |

### **Populares**

| Título | Imagem | Áudio |
|--------|--------|-------|
| Sons da natureza | `sons da natureza.jpg` | `natureza.mp3` |
| Sono profundo | `sono profundo.jpg` | `sono profundo.mp3` |

### **Práticas Rápidas**

| Título | Imagem | Áudio |
|--------|--------|-------|
| Pausa mindful | `pausa mindful.jpg` | `pausa mindful.mp3` |
| Respiração 4-7-8 | `respiração 4-7-8.jpg` | `respiração 4 7 8.m4a` |
| Reset mental | `reset mental.jpg` | `reset mental.mp3` |

### **Palestras**

| Título | Imagem | Áudio |
|--------|--------|-------|
| A ciência da meditação | `meditação 5.jpg` (fallback) | `a ciência da meditação.m4a` |
| Neuroplasticidade e mindfulness | `meditation-program.jpg` (fallback) | `Neuroplasticidade e mindfulness.m4a` |
| Budismo e meditação moderna | `meditation-program.jpg` (fallback) | `Budismo e meditação moderna ‐ Feito com o Clipchamp.m4a` |
| Seus limites e seu espaço de aceitação | `meditation-program.jpg` (fallback) | `Seus limites e seu espaço de aceitação.m4a` |

### **Trabalho**

| Título | Imagem | Áudio |
|--------|--------|-------|
| Produtividade consciente | `meditação 2.jpg` (fallback) | `produtividade consciente.mp3` |
| Foco e concentração | `foco e concentraçãõ.jpg` | `foco e concentração.mp3` |
| Criatividade no trabalho | `criatividade no trabalho.jpg` | `criatividade no trabalho.mp3` |

### **Jornadas**

| Título | Imagem | Áudio |
|--------|--------|-------|
| 21 dias de gratidão | `21 dis de gratidão.jpg` | `gratidão.m4a` |
| Transformação pessoal | `teansformação pessoal.jpg` | `transformação pessoal.m4a` |

---

## 🎯 Como Funciona

### **Prioridade de Busca:**

1. **Mapa Fixo (PRIORIDADE):**
   - O sistema busca primeiro no `fixedContentMap.ts`
   - Se encontrar, usa os caminhos exatos definidos manualmente
   - Garante que títulos específicos sempre usem os arquivos corretos

2. **Variações do Mapa Fixo:**
   - Tenta variações do título:
     - Exato
     - Lowercase
     - Capitalize
     - Trim de espaços

3. **ContentMap Automático (FALLBACK):**
   - Se não encontrar no mapa fixo, usa o sistema automático
   - Normaliza o título e busca no contentMap gerado
   - Tenta variações com/sem "meditação"
   - Combina imagem e áudio de diferentes entradas

---

## ✨ Vantagens do Sistema Híbrido

✅ **Controle total** sobre mapeamentos importantes
✅ **Fallback automático** para conteúdos não mapeados
✅ **Facilidade de manutenção** - adicione novos mapeamentos facilmente
✅ **Sem quebras** - se faltar no fixo, busca automaticamente
✅ **Suporte a variações** de títulos (maiúsculas, espaços, etc.)
✅ **Imagens fallback** para conteúdos sem imagem específica

---

## 📝 Como Adicionar Novo Conteúdo

### **Opção 1: Usar Mapa Fixo (Recomendado para conteúdos principais)**

Edite `src/data/fixedContentMap.ts`:

```typescript
export const fixedContentMap: Record<string, FixedContentItem> = {
  // ... mapeamentos existentes

  "Novo Conteúdo": {
    image: "/src/assets/nova-imagem.jpg",
    audio: "/src/assets/novo-audio.m4a"
  }
};
```

### **Opção 2: Usar Sistema Automático**

Apenas adicione os arquivos com o mesmo nome base em `/src/assets/`:
- `novo-conteudo.jpg`
- `novo-conteudo.m4a`

Execute:
```bash
npm run generate:content
```

---

## 🔍 Debugging

Se um conteúdo não estiver carregando:

1. **Verifique o título exato** passado ao `AudioPageLayout`
2. **Confira se existe no `fixedContentMap.ts`** com esse título exato
3. **Verifique se os caminhos** dos arquivos estão corretos
4. **Teste variações** do título (maiúsculas/minúsculas)
5. **Confira o console** do navegador para erros de carregamento

---

## 🎉 Resultado

Agora **todas as páginas de conteúdo** exibem corretamente suas imagens e áudios:

- ✅ **Páginas da aba "Hoje"** → Mapeamentos fixos definidos
- ✅ **Páginas do Explorar** → Mapeamentos fixos + fallback automático
- ✅ **Layout consistente** → Imagem quadrada + player translúcido
- ✅ **Responsivo** → Mobile e desktop otimizados
- ✅ **Dark mode** → Funciona perfeitamente
- ✅ **Fallbacks** → Nenhuma página fica vazia

**Teste acessando:**
- `http://localhost:8081/primeiros-passos`
- `http://localhost:8081/meditacao-iniciantes`
- `http://localhost:8081/despertar-consciencia`
- E todas as outras páginas!

---

**💡 Nota:** Se precisar adicionar mais mapeamentos específicos, basta editar o arquivo `fixedContentMap.ts` e adicionar novos itens ao objeto. Não é necessário rodar nenhum script - as mudanças são aplicadas automaticamente pelo HMR!
