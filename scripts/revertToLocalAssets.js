import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// URL do Supabase Storage que precisa ser removida
const SUPABASE_STORAGE_BASE = 'https://uetgenymwhiadqczpicc.supabase.co/storage/v1/object/public/detox-assets';

// Padrões a serem revertidos
const patterns = [
  // Importações de assets - reverter para /assets/
  {
    from: new RegExp(`from\\s+["']${SUPABASE_STORAGE_BASE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/([^"']*?)["']`, 'g'),
    to: 'from "/assets/$1"'
  },

  // Strings de caminho - reverter para /assets/
  {
    from: new RegExp(`["']${SUPABASE_STORAGE_BASE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/([^"']*?)["']`, 'g'),
    to: '"/assets/$1"'
  },

  // URL() em CSS - reverter para /assets/
  {
    from: new RegExp(`url\\(["']?${SUPABASE_STORAGE_BASE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/([^"']*?)["']?\\)`, 'g'),
    to: 'url("/assets/$1")'
  },

  // Template literals - reverter para /assets/
  {
    from: new RegExp('`' + SUPABASE_STORAGE_BASE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '/([^`]*?)`', 'g'),
    to: '`/assets/$1`'
  },
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
    console.log(`✅ Revertido: ${filePath}`);
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

console.log('🔄 Iniciando reversão para assets locais (/assets/)...\n');
console.log(`📦 Removendo: ${SUPABASE_STORAGE_BASE}\n`);
console.log(`📂 Substituindo por: /assets/\n`);

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
console.log(`✅ Concluído! Total: ${totalModified} arquivo(s) revertido(s)`);
console.log('═══════════════════════════════════════════════════════\n');

if (totalModified > 0) {
  console.log('🚀 Agora execute: npm run build');
} else {
  console.log('ℹ️  Nenhum arquivo foi modificado.');
}
