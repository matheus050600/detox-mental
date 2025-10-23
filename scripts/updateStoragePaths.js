import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// URL base do Supabase Storage
const SUPABASE_STORAGE_BASE = 'https://uetgenymwhiadqczpicc.supabase.co/storage/v1/object/public/detox-assets';

// Padrões a serem substituídos
const patterns = [
  // Importações de assets
  { from: /from\s+['"]@\/assets\/(.*?)['"]/g, to: `from "${SUPABASE_STORAGE_BASE}/$1"` },
  { from: /from\s+['"]\.\.?\/assets\/(.*?)['"]/g, to: `from "${SUPABASE_STORAGE_BASE}/$1"` },

  // Strings de caminho
  { from: /['"]@\/assets\/(.*?)['"]/g, to: `"${SUPABASE_STORAGE_BASE}/$1"` },
  { from: /['"]\.\.?\/assets\/(.*?)['"]/g, to: `"${SUPABASE_STORAGE_BASE}/$1"` },

  // URL() em CSS
  { from: /url\(['"]?\.\.?\/assets\/(.*?)['"]?\)/g, to: `url("${SUPABASE_STORAGE_BASE}/$1")` },

  // Template literals
  { from: /`@\/assets\/(.*?)`/g, to: `\`${SUPABASE_STORAGE_BASE}/$1\`` },
  { from: /`\.\.?\/assets\/(.*?)`/g, to: `\`${SUPABASE_STORAGE_BASE}/$1\`` },
];

// Diretórios a processar
const directoriesToProcess = [
  'src',
  'public',
];

// Extensões de arquivo a processar
const extensionsToProcess = ['.js', '.jsx', '.ts', '.tsx', '.css', '.html', '.json'];

function processFile(filePath) {
  const ext = path.extname(filePath);

  if (!extensionsToProcess.includes(ext)) {
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Aplica todos os padrões
  patterns.forEach(pattern => {
    const newContent = content.replace(pattern.from, pattern.to);
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Atualizado: ${filePath}`);
    return true;
  }

  return false;
}

function processDirectory(dirPath) {
  let filesModified = 0;

  function walkDir(currentPath) {
    const files = fs.readdirSync(currentPath);

    files.forEach(file => {
      const filePath = path.join(currentPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        // Ignora node_modules e dist
        if (file !== 'node_modules' && file !== 'dist' && file !== '.git') {
          walkDir(filePath);
        }
      } else {
        if (processFile(filePath)) {
          filesModified++;
        }
      }
    });
  }

  walkDir(dirPath);
  return filesModified;
}

console.log('🔍 Iniciando atualização de caminhos para Supabase Storage...\n');
console.log(`📦 URL Base: ${SUPABASE_STORAGE_BASE}\n`);

let totalModified = 0;
const projectRoot = path.join(__dirname, '..');

directoriesToProcess.forEach(dir => {
  const dirPath = path.join(projectRoot, dir);
  if (fs.existsSync(dirPath)) {
    console.log(`📂 Processando: ${dir}/`);
    const modified = processDirectory(dirPath);
    totalModified += modified;
    console.log(`   ${modified} arquivo(s) modificado(s)\n`);
  }
});

console.log('═══════════════════════════════════════════════════════');
console.log(`✅ Concluído! Total: ${totalModified} arquivo(s) atualizado(s)`);
console.log('═══════════════════════════════════════════════════════\n');

if (totalModified > 0) {
  console.log('🚀 Execute agora: npm run build');
} else {
  console.log('ℹ️  Nenhum arquivo foi modificado.');
}
