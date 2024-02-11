import { useDebugValue, useEffect, useRef, useState } from 'react'
import { useLatest } from './useLatest.js'

export type Act = (callback: (signal: AbortSignal, done: () => void) => void) => Promise<void>
export type useAct = (name?: string) => [running: boolean, act: Act, stop: () => void]
export type useActSetup = { useAct: useAct }
export function useActSetup(): useActSetup {
    const [[name, kind, signal] = [], setAction] = useState<
        [name: undefined | string, kind: number, signal: AbortController] | undefined
    >(undefined)
    useDebugValue(name)

    const lastSignal = useLatest(signal)
    useEffect(() => () => lastSignal.current?.abort(), [])

    return {
        useAct(name?: string) {
            const { current: thisKind } = useRef(Math.random())
            useDebugValue([name, kind === thisKind])
            const stop = () => (kind === thisKind ? (setAction(undefined), signal?.abort()) : undefined)
            return [
                kind === thisKind,
                (callback: (signal: AbortSignal, done: () => void) => void) => {
                    return new Promise<void>((resolve) => {
                        if (signal) signal.abort()
                        const controller = new AbortController()
                        setAction([name, thisKind, controller])
                        callback(controller.signal, () => {
                            controller.abort()
                        })

                        controller.signal.addEventListener('abort', () => (resolve(), stop()), { once: true })
                    })
                },
                stop,
            ]
        },
    }
}
