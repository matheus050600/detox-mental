# 🎵 Como Adicionar Novo Conteúdo

## Processo Super Simples:

### 1️⃣ Adicione seus arquivos em `/src/assets`

Coloque a imagem e o áudio com o **mesmo nome**:

```
src/assets/
├── nova meditacao.jpg
├── nova meditacao.m4a
└── (outros arquivos...)
```

### 2️⃣ Rode o projeto

```bash
npm run dev
```

✨ **Pronto!** O sistema automaticamente:
- Detecta os novos arquivos
- Cria o mapeamento
- Integra com o site

### 3️⃣ Use na sua página

```tsx
<AudioPageLayout
  title="nova meditacao"
  subtitle="Descrição da meditação"
  duration="10 min"
  type="MEDITAÇÃO"
/>
```

O site automaticamente:
- ✅ Mostra a imagem de capa
- ✅ Carrega o player de áudio funcional
- ✅ Permite controle total (play, pause, volume, seek)

---

## 📋 Regras Simples

### Nome dos Arquivos:
- Use o **mesmo nome base** para imagem e áudio
- Exemplo: `paz interior.jpg` + `paz interior.m4a`
- O sistema ignora acentos e maiúsculas

### Formatos Aceitos:

**Imagens:**
- `.jpg`, `.jpeg`, `.png`, `.webp`

**Áudios:**
- `.mp3`, `.m4a`, `.mp4`, `.wav`

---

## 🎯 Exemplos

### Exemplo 1: Conteúdo Completo
```
src/assets/foco.jpg       ← Imagem de capa
src/assets/foco.m4a       ← Áudio
```
**Resultado:** Imagem + Player funcional

### Exemplo 2: Só Imagem
```
src/assets/gratidao.jpg   ← Só imagem
```
**Resultado:** Só a imagem (mensagem: "Áudio disponível em breve")

### Exemplo 3: Só Áudio
```
src/assets/sono.mp3       ← Só áudio
```
**Resultado:** Só o player (sem imagem de capa)

---

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento (gera mapeamento automaticamente)
npm run dev

# Build de produção (gera mapeamento automaticamente)
npm run build

# Apenas gerar/atualizar mapeamento
npm run generate:content
```

---

## ✨ Recursos do Player

- ▶️ Play / Pause
- ⏪ Voltar 10 segundos
- ⏩ Avançar 10 segundos
- 🎚️ Barra de progresso com seek
- 🔊 Controle de volume
- 🔇 Mute / Unmute
- 🕐 Tempo atual / Duração total
- 🌗 Modo claro/escuro automático
- 📱 Totalmente responsivo

---

## ⚡ Dicas Pro

1. **Organize por categoria:**
   ```
   src/assets/
   ├── meditacao-iniciantes.jpg
   ├── meditacao-iniciantes.m4a
   ├── sono-profundo.jpg
   ├── sono-profundo.m4a
   ```

2. **Use nomes descritivos:**
   - ✅ `paz interior.jpg`
   - ✅ `foco e concentracao.m4a`
   - ❌ `audio1.mp3`

3. **Mantenha qualidade:**
   - Imagens: recomendado 1920x1080px
   - Áudios: recomendado 128kbps ou superior

---

**Isso é tudo! 🎉**

O sistema cuida de todo o resto automaticamente.
