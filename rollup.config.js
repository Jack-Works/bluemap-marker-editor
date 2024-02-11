// @ts-check
import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
// @ts-expect-error
import path from 'path'
// @ts-expect-error
import fs from 'fs'

const globals = {
    react: 'React',
    'react-dom': 'ReactDOM',
    'react-dom/client': 'ReactDOM',
    '@holoflows/kit': 'HoloflowsKit',
}
export default defineConfig({
    input: './tampermonkey-script/main.tsx',
    output: {
        file: './dist/main.js',
        format: 'iife',
        globals: globals,
        banner: `// ==UserScript==
// @name         BlueMap marker editor
// @version      0.1
// @description  pafu pafu nya nya
// @author       Jack Works
// @icon         https://www.google.com/s2/favicons?domain=map.nyaacat.com
// @require      https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js
// @require      https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js
// @require      https://cdn.jsdelivr.net/npm/@holoflows/kit@0.9.0/umd/index.cjs
// @grant        none
// ==/UserScript==`,
        indent: false,
        generatedCode: 'es2015',
    },
    external: Object.keys(globals),
    plugins: [typescript({ jsx: 'react', target: 'es2022', module: 'esnext' }), mtsResolver()],
})

function mtsResolver() {
    return {
        name: 'ts resolver',
        async resolveId(target, importer) {
            if (!target.endsWith('.js') || !importer || target[0] !== '.') {
                return null
            }
            const resolved = path.resolve(path.dirname(importer), target)

            const hasFile = await fs.promises.access(resolved, fs.constants.F_OK).then(
                () => true,
                () => false
            )
            if (hasFile) return null
            const tsx = `${resolved.slice(0, -'.js'.length)}.tsx`
            const hasTSX = await fs.promises.access(tsx, fs.constants.F_OK).then(
                () => true,
                () => false
            )
            if (hasTSX) return { id: tsx }
            return { id: tsx.slice(0, -1) }
        },
    }
}
