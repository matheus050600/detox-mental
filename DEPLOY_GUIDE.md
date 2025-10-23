# 🚀 Guia de Deploy - Detox Mental

## ✅ Build Concluído com Sucesso!

Seu aplicativo foi compilado e está pronto para deploy na pasta **`dist/`**.

---

## 📦 O Que Foi Gerado:

```
dist/
├── index.html                        # Página principal
├── .htaccess                         # Configuração Apache (criado)
├── assets/
│   ├── index-CuAsKhhS.css           # CSS minificado (84.84 KB)
│   ├── index-D11rmMP4.js            # JavaScript bundle (617.91 KB)
│   ├── logo-jDw3aMmy.png            # Logo (2.2 MB)
│   ├── meditation-program-*.jpg      # Imagens
│   └── frase-motivacional-*.jpg     # Imagens motivacionais
```

**Tamanho total do build:** ~6.5 MB (com imagens)

---

## 🌐 Opções de Deploy

### **Opção 1: Apache (Servidor próprio)**

#### **Passo 1: Upload dos Arquivos**

Faça upload de **TODA a pasta `dist/`** para seu servidor via FTP/SFTP:

```
/var/www/html/              # Linux
ou
C:\xampp\htdocs\            # Windows (XAMPP)
```

#### **Passo 2: Configurar Apache**

O arquivo `.htaccess` já está incluído na pasta `dist/` com:
- ✅ Rewrite rules para React Router
- ✅ Compressão GZIP
- ✅ Cache otimizado
- ✅ Cabeçalhos de segurança

**Certifique-se de que o Apache tem `mod_rewrite` habilitado:**

```bash
# Linux
sudo a2enmod rewrite
sudo systemctl restart apache2

# Verifique se está habilitado
apache2ctl -M | grep rewrite
```

#### **Passo 3: Configurar Virtual Host (Opcional)**

Crie um arquivo de configuração:

```apache
<VirtualHost *:80>
    ServerName detoxmental.com.br
    DocumentRoot /var/www/html/dist

    <Directory /var/www/html/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

#### **Passo 4: Configurar SSL (Recomendado)**

```bash
# Usando Certbot (Let's Encrypt)
sudo apt install certbot python3-certbot-apache
sudo certbot --apache -d detoxmental.com.br -d www.detoxmental.com.br
```

---

### **Opção 2: Netlify (Recomendado para Deploy Rápido)**

#### **Via Interface Web:**

1. Acesse https://app.netlify.com
2. Clique em "Add new site" > "Deploy manually"
3. Arraste a pasta **`dist/`** para o upload
4. Pronto! Seu site estará no ar em segundos

#### **Configuração Netlify:**

Crie um arquivo `netlify.toml` na raiz do projeto:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### **Via CLI:**

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

---

### **Opção 3: Vercel**

#### **Via Interface Web:**

1. Acesse https://vercel.com
2. Conecte seu repositório GitHub
3. Vercel detecta automaticamente Vite
4. Clique em "Deploy"

#### **Via CLI:**

```bash
npm install -g vercel
vercel login
vercel --prod
```

**Configuração (`vercel.json`):**

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

### **Opção 4: GitHub Pages**

#### **Passo 1: Instalar `gh-pages`**

```bash
npm install --save-dev gh-pages
```

#### **Passo 2: Adicionar scripts no `package.json`**

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://seu-usuario.github.io/detox-mental"
}
```

#### **Passo 3: Deploy**

```bash
npm run deploy
```

---

### **Opção 5: Firebase Hosting**

#### **Passo 1: Instalar Firebase CLI**

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
```

#### **Passo 2: Configurar `firebase.json`**

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

#### **Passo 3: Deploy**

```bash
firebase deploy
```

---

## ⚙️ Variáveis de Ambiente (.env)

**IMPORTANTE:** O arquivo `.env` **NÃO** é incluído no build por segurança.

### **Para Produção:**

1. **Netlify/Vercel:**
   - Vá em Settings > Environment Variables
   - Adicione:
     ```
     VITE_SUPABASE_URL=https://seu-projeto.supabase.co
     VITE_SUPABASE_ANON_KEY=sua-chave-anon
     ```

2. **Apache/Servidor Próprio:**
   - Crie um arquivo `.env` na raiz do servidor
   - Ou configure via painel de controle

3. **GitHub Pages:**
   - Use GitHub Secrets
   - Configure no workflow do GitHub Actions

---

## 🔧 Pós-Deploy

### **1. Teste o Site**

Verifique se todas as rotas funcionam:
- ✅ `https://seusite.com/` (Home)
- ✅ `https://seusite.com/hoje` (Hoje)
- ✅ `https://seusite.com/explorar` (Explorar)
- ✅ `https://seusite.com/perfil` (Perfil)
- ✅ `https://seusite.com/login` (Login)

### **2. Configure DNS (se domínio próprio)**

Aponte seu domínio para o servidor:

```
Tipo A:
Nome: @
Valor: IP_DO_SERVIDOR

Tipo CNAME:
Nome: www
Valor: detoxmental.com.br
```

### **3. Configure CORS no Supabase**

1. Acesse Supabase Dashboard
2. Vá em Settings > API
3. Adicione seu domínio em "Allowed Origins":
   ```
   https://detoxmental.com.br
   https://www.detoxmental.com.br
   ```

### **4. Google OAuth Redirect URI**

Adicione no Google Cloud Console:

```
https://seu-projeto.supabase.co/auth/v1/callback
https://detoxmental.com.br
```

---

## 📊 Otimizações Aplicadas

### **1. Compressão GZIP**
- ✅ JavaScript: 617 KB → ~177 KB (71% menor)
- ✅ CSS: 84 KB → ~14 KB (83% menor)

### **2. Cache Headers**
- ✅ Assets estáticos: 1 ano
- ✅ HTML: Sem cache (sempre atualizado)
- ✅ Fontes e imagens: 1 ano

### **3. Segurança**
- ✅ X-Frame-Options (anti-clickjacking)
- ✅ X-Content-Type-Options (anti-MIME sniffing)
- ✅ X-XSS-Protection (proteção XSS)
- ✅ Listagem de diretórios desabilitada

---

## 🐛 Troubleshooting

### **Erro 404 ao recarregar páginas**

**Causa:** Apache não está redirecionando para `index.html`

**Solução:**
1. Verifique se `.htaccess` está na pasta raiz
2. Verifique se `mod_rewrite` está habilitado
3. Verifique se `AllowOverride All` está configurado

### **Páginas em branco**

**Causa:** Variáveis de ambiente não configuradas

**Solução:**
1. Configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
2. Faça rebuild: `npm run build`
3. Faça novo upload

### **Imagens não carregam**

**Causa:** Caminho relativo incorreto

**Solução:**
1. Verifique o `base` no `vite.config.ts`
2. Use caminhos absolutos ou relativos corretos

---

## 📦 Estrutura Final no Servidor

```
/var/www/html/          (ou seu diretório raiz)
├── index.html
├── .htaccess
├── assets/
│   ├── index-*.css
│   ├── index-*.js
│   └── *.jpg, *.png
└── .env              (NÃO incluir no Git!)
```

---

## ✅ Checklist Final

Antes de considerar o deploy concluído:

- [ ] Site carrega corretamente
- [ ] Todas as rotas funcionam (/, /hoje, /explorar, etc.)
- [ ] Login funciona
- [ ] Imagens carregam
- [ ] Áudios tocam
- [ ] Dark mode funciona
- [ ] Responsivo (mobile, tablet, desktop)
- [ ] SSL/HTTPS configurado
- [ ] CORS configurado no Supabase
- [ ] Google Analytics (opcional)
- [ ] SEO meta tags (opcional)

---

## 🎉 Deploy Concluído!

Seu aplicativo **Detox Mental** está pronto para produção!

**Arquivos gerados:**
- ✅ `dist/` - Build de produção
- ✅ `dist/.htaccess` - Configuração Apache
- ✅ `DEPLOY_GUIDE.md` - Este guia

**Próximos passos:**
1. Escolha uma plataforma de deploy
2. Faça upload da pasta `dist/`
3. Configure variáveis de ambiente
4. Teste todas as funcionalidades
5. Monitore logs de erro

**Suporte:**
- Documentação Vite: https://vitejs.dev/guide/static-deploy.html
- Documentação Apache: https://httpd.apache.org/docs/
- Documentação Supabase: https://supabase.com/docs
