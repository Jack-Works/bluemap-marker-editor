import { useRef } from 'react'

export function useLatest<T>(val: T): { current: T } {
    const ref = useRef(val)
    ref.current = val
    return ref
}
