import * as fs from 'fs';
import * as path from 'path';
import { optimize } from 'svgo';

type ExportEntry = {
  basename: string;
  exportName: string;
  filePath: string;
}

const ICONS_DIR = path.resolve(__dirname, '..', 'icons');
const OUT_DIR = path.resolve(__dirname, '..', 'src', 'icons');

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function pascalCase(name: string): string {
  return name
    .replace(/(^[a-z])|([\-_/]+[a-z])/g, (match) => match.replace(/[^a-z]/g, '').toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '');
}

function buildVueSfc(svg: string): string {
  // Remove XMLNS and width/height; enforce viewBox and our bindings
  let optimized = svg;
  optimized = optimized.replace(/<\?xml[\s\S]*?\?>/g, '');
  optimized = optimized.replace(/<!DOCTYPE[\s\S]*?>/gi, '');

  // svgo step to clean fills/strokes and dimensions
  const svgoResult = optimize(optimized, {
    multipass: true,
    plugins: [
      {
        name: 'preset-default',
        params: { overrides: { removeViewBox: false } },
      },
      { name: 'removeDimensions' },
      { name: 'removeAttrs', params: { attrs: '(fill|stroke)' } },
      { name: 'removeXMLNS' },
    ],
  });

  if ('data' in svgoResult) {
    optimized = svgoResult.data;
  }

  // Replace opening <svg ...> tag with our bound attributes
  optimized = optimized.replace(
    /<svg\b[^>]*>/i,
    '<svg :width="props.size ?? (\n      ($attrs as any).width ?? 24\n    )" :height="props.size ?? (\n      ($attrs as any).height ?? 24\n    )" :fill="props.color ?? (($attrs as any).fill ?? \'currentColor\')" viewBox="0 0 24 24" v-bind="$attrs">'
  );

  // Inject opacity via style binding on root svg using v-bind:style
  optimized = optimized.replace(
    /<svg\b([^>]*)>/i,
    '<svg$1 :style="[{ opacity: props.opacity ?? 1 }, ($attrs as any).style]">'
  );

  const sfc = `
<template>
${optimized}
</template>

<script setup lang="ts">
import type { PapiconsProps } from '../types/PapiconsProps';
const props = defineProps<PapiconsProps>();
</script>
`;

  return sfc.trim() + '\n';
}

function generateIndex(entries: ExportEntry[]): string {
  const exportLines = entries.map((e) => `export { default as ${e.exportName} } from './${e.basename}.vue';`).join('\n');
  const enumLines = entries.map((e) => `${e.exportName} = "${e.exportName}"`).join(',\n  ');
  return `
${exportLines}

export enum IconNames {
  ${enumLines}
}
`.trim() + '\n';
}

function main() {
  ensureDir(OUT_DIR);
  const files = fs.readdirSync(ICONS_DIR).filter((f) => f.endsWith('.svg'));
  const entries: ExportEntry[] = [];

  for (const file of files) {
    const abs = path.join(ICONS_DIR, file);
    const svg = fs.readFileSync(abs, 'utf8');
    const base = path.basename(file, path.extname(file));
    const exportName = /^\d/.test(base) ? `Svg${pascalCase(base)}` : pascalCase(base);
    const outPath = path.join(OUT_DIR, `${base}.vue`);
    const sfc = buildVueSfc(svg);
    fs.writeFileSync(outPath, sfc, 'utf8');
    entries.push({ basename: base, exportName, filePath: outPath });
  }

  // Write index.ts
  const indexContent = generateIndex(entries);
  fs.writeFileSync(path.join(OUT_DIR, 'index.ts'), indexContent, 'utf8');
}

main();


