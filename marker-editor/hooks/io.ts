import { createContext } from 'react'

export interface BluemapContext {
    mapViewerGotoPosition(x: number, y: number | undefined, z: number): void
    pickPosition(abortSignal: AbortSignal): Promise<[x: number, y: number, z: number]>
    getDistance(): number
}

export const BluemapContext = createContext<BluemapContext>({
    mapViewerGotoPosition(x, y, z) {
        console.log('mapViewerGotoPosition', x, y, z)
    },
    pickPosition() {
        const x = parseFloat(prompt('x', '0')!)
        if (isNaN(x)) return Promise.reject()
        const y = parseFloat(prompt('y', '0')!)
        if (isNaN(y)) return Promise.reject()
        const z = parseFloat(prompt('z', '0')!)
        if (isNaN(x)) return Promise.reject()
        return Promise.resolve([x, y, z])
    },
    getDistance() {
        return 0
    },
})
