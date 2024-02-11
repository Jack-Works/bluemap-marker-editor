export function swapUp<T>(value: readonly T[], index: number) {
    if (index <= 0) return value
    if (index >= value.length) return value
    const result = [...value]
    const temp = result[index - 1]
    result[index - 1] = result[index]
    result[index] = temp
    return result
}
export function swapDown<T>(value: readonly T[], index: number) {
    if (index < 0) return value
    if (index >= value.length - 1) return value
    const result = [...value]
    const temp = result[index + 1]
    result[index + 1] = result[index]
    result[index] = temp
    return result
}
