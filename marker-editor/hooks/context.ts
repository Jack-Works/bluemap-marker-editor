import { createContext } from 'react'

export interface EditReference {
    marker: Marker
    initialKey: string
}

export interface InternalContext {
    setGlobalEditingReference(marker: EditReference | null): void
    globalEditingReference: null | EditReference
    portal: HTMLDivElement | null
}

export const InternalContext = createContext<InternalContext>(null!)
InternalContext.displayName = 'InternalContext'
