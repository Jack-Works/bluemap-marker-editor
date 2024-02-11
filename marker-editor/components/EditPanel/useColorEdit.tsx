export interface useColorEditProps {
    value: Readonly<Marker_Line | Marker_Shape | Marker_Extrude>
    onChange: (marker: Marker) => void
    color: 'lineColor' | 'fillColor'
}

export function ColorEdit({ value, onChange: parentChange, color: type }: useColorEditProps) {
    let color: ColorRGBA | undefined
    if (type === 'fillColor' && value.type !== 'line') color = value.fillColor
    if (type === 'lineColor') color = value.lineColor

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const field = e.currentTarget

        const next = { ...value }
        if (field.name === 'color_enabled') {
            if (field.checked) color = { r: 255, g: 255, b: 255, a: 1 }
            else color = undefined
        } else if (field.name === 'color') {
            const [r, g, b] = hexToColor(field.value)
            color = { r, g, b, a: color?.a ?? 1 }
        } else if (field.name === 'color_alpha') {
            color = {
                r: color?.r ?? 255,
                g: color?.g ?? 255,
                b: color?.b ?? 255,
                a: field.valueAsNumber,
            }
        }

        if (type === 'fillColor' && next.type !== 'line') next.fillColor = color
        if (type === 'lineColor') next.lineColor = color

        parentChange(next)
    }
    return (
        <>
            <label>
                <span>
                    {type}
                    <input
                        name="color_enabled"
                        className="sole-icon field-action"
                        type="checkbox"
                        checked={!!color}
                        onChange={onChange}
                    />
                </span>
                <input
                    type="color"
                    name="color"
                    disabled={!color}
                    value={color ? colorToHex(color) : '#ffffff'}
                    onChange={onChange}
                />
            </label>
            {color ? (
                <label>
                    {type}(alpha)
                    <input
                        type="range"
                        min={0}
                        step={0.01}
                        max={1}
                        name="color_alpha"
                        value={color?.a ?? 1}
                        onChange={onChange}
                    />
                </label>
            ) : null}
        </>
    )
}
function colorToHex(color: ColorRGBA) {
    return `#${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b
        .toString(16)
        .padStart(2, '0')}`
}
function hexToColor(color: string) {
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    return [r, g, b]
}
