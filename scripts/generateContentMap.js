import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Função para normalizar nomes de arquivo (remover acentos, corrigir erros de digitação)
function normalizeFileName(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/õ/g, 'o')
    .replace(/ã/g, 'a')
    .replace(/ç/g, 'c')
    .replace(/[‐]/g, '-') // Substitui hífen especial por hífen normal
    .trim();
}

// Função para criar chave única baseada no nome
function createKey(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/õ/g, 'o')
    .replace(/ã/g, 'a')
    .replace(/ç/g, 'c')
    .trim();
}

console.log('🔍 Iniciando mapeamento de conteúdos...\n');

const assetsDir = path.join(__dirname, '../src/assets');
const outputFile = path.join(__dirname, '../src/data/contentMap.ts');

// Verifica se a pasta existe
if (!fs.existsSync(assetsDir)) {
  console.error('❌ Pasta src/assets não encontrada!');
  process.exit(1);
}

// Lê todos os arquivos da pasta assets
const files = fs.readdirSync(assetsDir);

// Agrupa arquivos por nome base
const contentMap = {};
const audioExtensions = ['.mp3', '.m4a', '.mp4', '.wav'];
const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

files.forEach(file => {
  const ext = path.extname(file).toLowerCase();
  const baseName = path.basename(file, ext);
  const normalizedBase = normalizeFileName(baseName);
  const key = createKey(baseName);

  // Ignora arquivos que não são mídia
  if (!audioExtensions.includes(ext) && !imageExtensions.includes(ext)) {
    return;
  }

  // Inicializa o objeto se não existir
  if (!contentMap[key]) {
    contentMap[key] = {
      title: baseName, // Mantém o nome original com maiúsculas
      normalizedName: normalizedBase,
      image: null,
      audio: null
    };
  }

  // Adiciona a imagem ou áudio (apenas o nome do arquivo, sem caminho)
  if (imageExtensions.includes(ext)) {
    contentMap[key].image = file;
  } else if (audioExtensions.includes(ext)) {
    // Se já tem um áudio, mantém o primeiro encontrado
    if (!contentMap[key].audio) {
      contentMap[key].audio = file;
    }
  }
});

// Remove entradas sem imagem E sem áudio
Object.keys(contentMap).forEach(key => {
  if (!contentMap[key].image && !contentMap[key].audio) {
    delete contentMap[key];
  }
});

// Gera o arquivo TypeScript
const totalContent = Object.keys(contentMap).length;
console.log(`✅ Encontrados ${totalContent} conteúdos mapeados\n`);

// Exibe resumo
let withImage = 0;
let withAudio = 0;
let complete = 0;

Object.values(contentMap).forEach(item => {
  if (item.image) withImage++;
  if (item.audio) withAudio++;
  if (item.image && item.audio) complete++;
});

console.log('📊 Estatísticas:');
console.log(`   • Com imagem: ${withImage}`);
console.log(`   • Com áudio: ${withAudio}`);
console.log(`   • Completos (imagem + áudio): ${complete}\n`);

// Cria a pasta data se não existir
const dataDir = path.dirname(outputFile);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Gera o conteúdo do arquivo
const fileContent = `// Auto-gerado por scripts/generateContentMap.js
// Não edite manualmente - rode 'npm run generate:content' para atualizar

export interface ContentItem {
  title: string;
  normalizedName: string;
  image: string | null;
  audio: string | null;
}

export type ContentMap = Record<string, ContentItem>;

export const contentMap: ContentMap = ${JSON.stringify(contentMap, null, 2)};

// Função auxiliar para buscar conteúdo por título (com normalização)
export function getContentByTitle(title: string): ContentItem | null {
  const normalizedTitle = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .replace(/õ/g, 'o')
    .replace(/ã/g, 'a')
    .replace(/ç/g, 'c')
    .trim();

  return contentMap[normalizedTitle] || null;
}

// Lista todas as chaves disponíveis
export const availableContent = Object.keys(contentMap);

console.log('📦 Conteúdos disponíveis:', availableContent.length);
`;

// Escreve o arquivo
fs.writeFileSync(outputFile, fileContent, 'utf-8');

console.log(`✅ Arquivo gerado: ${outputFile}\n`);
console.log('🎉 Mapeamento concluído com sucesso!\n');

// Lista alguns exemplos
console.log('📝 Exemplos de conteúdos mapeados:');
Object.entries(contentMap).slice(0, 5).forEach(([key, value]) => {
  console.log(`   • "${value.title}"`);
  console.log(`     - Imagem: ${value.image ? '✓' : '✗'}`);
  console.log(`     - Áudio: ${value.audio ? '✓' : '✗'}`);
});

if (Object.keys(contentMap).length > 5) {
  console.log(`   ... e mais ${Object.keys(contentMap).length - 5} conteúdos\n`);
}
