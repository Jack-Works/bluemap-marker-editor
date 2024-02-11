import { createRoot } from 'react-dom/client'
import styles from './styles.js'
import { Root } from './root.js'
import { StrictMode, useState } from 'react'

document.adoptedStyleSheets = [styles]

let json: MarkerFile = {}
try {
    json = JSON.parse(localStorage.getItem('userscript-bluemap-marker-editor') || '{}')
    Object.assign(globalThis, { file: json })
} catch {}

createRoot(document.body.appendChild(document.createElement('div'))).render(
    <StrictMode>
        <App />
    </StrictMode>
)
function App() {
    const [file, setFile] = useState(json)
    return (
        <Root
            onChange={(nextFile) => {
                json = nextFile
                setFile(nextFile)
    Object.assign(globalThis, { file: json })
    localStorage.setItem('userscript-bluemap-marker-editor', JSON.stringify(nextFile))
            }}
            file={file}
        />
    )
}
