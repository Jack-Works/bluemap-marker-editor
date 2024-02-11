import { MarkerFileEditor } from './components/MarkerFileEditor.js'
import { EditReference, InternalContext } from './hooks/context.js'
import { useState } from 'react'

export interface RootProps {
    file: MarkerFile
    onChange(newFile: MarkerFile): void
}
export function Root({ file, onChange }: RootProps) {
    const [portal, setPortal] = useState<HTMLDivElement | null>(null)
    const [globalEditingReference, setGlobalEditingReference] = useState<EditReference | null>(null)
    const context = {
        globalEditingReference,
        setGlobalEditingReference,
        portal,
    }
    return (
        <InternalContext.Provider value={context}>
            <div className="marker-editor">
                <MarkerFileEditor onChange={onChange} file={file} />
                <div ref={setPortal}></div>
            </div>
        </InternalContext.Provider>
    )
}
