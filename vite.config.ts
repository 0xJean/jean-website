import { defineConfig, type Plugin } from 'vite';
import { en } from './src/i18n';

// Bake the English copy into index.html so the page is complete without JS
// (and for crawlers). The runtime swaps it when the language changes.
function prerenderCopy(): Plugin {
  return {
    name: 'prerender-copy',
    transformIndexHtml(html) {
      return html
        .replace(/%META_TITLE%/g, en['meta.title'])
        .replace(/%META_DESC%/g, en['meta.desc'])
        .replace(/(<(\w+)\b[^>]*\bdata-i18n="([^"]+)"[^>]*>)([\s\S]*?)(<\/\2>)/g, (m, open, _tag, key, _body, close) =>
          key in en ? open + en[key] + close : m,
        );
    },
  };
}

export default defineConfig({ plugins: [prerenderCopy()] });
