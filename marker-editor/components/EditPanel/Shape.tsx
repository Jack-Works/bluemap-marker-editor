import { useContext } from 'react'
import { BluemapContext } from '../../hooks/io.js'
import { DeleteIcon } from '../../icons/delete.js'
import { DownIcon } from '../../icons/down.js'
import { PinIcon } from '../../icons/pin.js'
import { UpIcon } from '../../icons/up.js'
import { swapDown, swapUp } from '../../utils/swap.js'
import { useBaseMarkEdit } from './useBaseMarkEdit.js'
import { ColorEdit } from './useColorEdit.js'
import { useActSetup } from '../../hooks/useAct.js'
import { useOpenableMarkEdit } from './useOpenableMarkEdit.js'

export interface ShapeMarkEditProps {
    value: Readonly<Marker_Line | Marker_Shape | Marker_Extrude>
    name: string
    onChange(newKey: string, marker: Marker): void
    onDelete(): void
    isNameUsed: (name: string) => boolean
}
export function ShapeMarkEdit(props: ShapeMarkEditProps) {
    const { value, name, onChange: submit, onDelete } = props
    const onMarkerChange = (marker: Marker) => submit(name, marker)
    const { useAct } = useActSetup()
    const base = useBaseMarkEdit(props, useAct)
    const link = useOpenableMarkEdit({ value, onChange: onMarkerChange })
    const [picking, startPicking, stopPicking] = useAct('pick line')

    const { pickPosition } = useContext(BluemapContext)

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const field = e.currentTarget

        const next = { ...value }

        if (field.name.startsWith('line_') && next.type === 'line') {
            if (isNaN(field.valueAsNumber)) return field.setCustomValidity('Invalid number')
            const [, axis, order] = field.name.split('_') as ['line', 'x' | 'y' | 'z', string]
            const index = parseInt(order)
            if (isNaN(index)) return
            next.line = next.line.map((point, i) => (i === index ? { ...point, [axis]: field.valueAsNumber } : point))
        } else if (field.name === 'lineWidth') {
            if (isNaN(field.valueAsNumber)) delete next.lineWidth
            else next.lineWidth = field.valueAsNumber
        } else if (field.name === 'shapeY' && next.type === 'shape') {
            if (isNaN(field.valueAsNumber)) return field.setCustomValidity('Invalid number')
            next.shapeY = field.valueAsNumber
        } else if ((field.name === 'shapeMinY' || field.name === 'shapeMaxY') && next.type === 'extrude') {
            if (isNaN(field.valueAsNumber)) return field.setCustomValidity('Invalid number')
            next[field.name] = field.valueAsNumber
        } else if (field.name === 'depthTest') {
            if (field.checked) next.depthTest = true
            else delete next.depthTest
        }
        field.setCustomValidity('')
        submit(name, next)
    }

    const onAppendLinePoints = () => {
        if (picking) return stopPicking()
        const next = { ...value }
        submit(name, next)
        startPicking((signal) => {
            async function pick(): Promise<void> {
                if (signal.aborted) return
                const [x, y, z] = await pickPosition(signal)
                if (next.type !== 'line') throw new Error('marker is not a line')
                next.line = next.line.concat({ x, y, z })
                onDelete()
                submit(name, next)
                return pick()
            }
            pick().catch(() => {})
        })
    }
    const onAppendShapePoints = () => {
        if (picking) return stopPicking()
        const next = { ...value }
        submit(name, next)
        startPicking((signal) => {
            async function pick(): Promise<void> {
                if (signal.aborted) return
                const [x, , z] = await pickPosition(signal)
                if (next.type === 'line') throw new Error('marker is a line')
                next.shape = next.shape.concat({ x, z })
                onDelete()
                submit(name, next)
                return pick()
            }
            pick().catch(() => {})
        })
    }

    const line =
        value.type === 'line' ? (
            <>
                <label>
                    line
                    <button type="button" onClick={onAppendLinePoints}>
                        {picking ? 'Stop' : 'Append point'}
                    </button>
                </label>
                {value.line.map((point, index, all) => {
                    return (
                        <label>
                            <span>
                                line-{index}
                                <DeleteIcon
                                    onClick={() => {
                                        const next = { ...value }
                                        next.line = next.line.filter((a, i) => i !== index)
                                        submit(name, next)
                                    }}
                                    className="sole-icon field-action"
                                    role="button"
                                />
                                <PinIcon
                                    onClick={() => {
                                        pickPosition(new AbortController().signal).then(([x, y, z]) => {
                                            const next = { ...value }
                                            next.line = next.line.map((a, i) => (i === index ? { x, y, z } : a))
                                            submit(name, next)
                                        })
                                    }}
                                    className="sole-icon field-action"
                                    role="button"
                                />
                                <DownIcon
                                    onClick={() => {
                                        const next = { ...value }
                                        next.line = swapDown(value.line, index) as Position3D[]
                                        submit(name, next)
                                    }}
                                    aria-disabled={index === all.length - 1}
                                    className="sole-icon field-action"
                                    role="button"
                                />
                                <UpIcon
                                    onClick={() => {
                                        const next = { ...value }
                                        next.line = swapUp(value.line, index) as Position3D[]
                                        submit(name, next)
                                    }}
                                    aria-disabled={index === 0}
                                    className="sole-icon field-action"
                                    role="button"
                                />
                            </span>
                            <span className="position">
                                <label>
                                    x
                                    <input type="number" name={'line_x_' + index} value={point.x} onChange={onChange} />
                                </label>
                                <label>
                                    y
                                    <input type="number" name={'line_y_' + index} value={point.y} onChange={onChange} />
                                </label>
                                <label>
                                    z
                                    <input type="number" name={'line_z_' + index} value={point.z} onChange={onChange} />
                                </label>
                            </span>
                        </label>
                    )
                })}
            </>
        ) : null
    const shape =
        value.type !== 'line' ? (
            <>
                <label>
                    shape
                    <button type="button" onClick={onAppendShapePoints}>
                        {picking ? 'Stop' : 'Append point'}
                    </button>
                </label>
                {value.shape.map((point, index, all) => {
                    return (
                        <label>
                            <span>
                                line-{index}
                                <DeleteIcon
                                    onClick={() => {
                                        const next = { ...value }
                                        next.shape = next.shape.filter((a, i) => i !== index)
                                        submit(name, next)
                                    }}
                                    className="sole-icon field-action"
                                    role="button"
                                />
                                <PinIcon
                                    onClick={() => {
                                        pickPosition(new AbortController().signal).then(([x, y, z]) => {
                                            const next = { ...value }
                                            next.shape = next.shape.map((a, i) => (i === index ? { x, y, z } : a))
                                            submit(name, next)
                                        })
                                    }}
                                    className="sole-icon field-action"
                                    role="button"
                                />
                                <DownIcon
                                    onClick={() => {
                                        const next = { ...value }
                                        next.shape = swapDown(value.shape, index) as Position2D_xz[]
                                        submit(name, next)
                                    }}
                                    aria-disabled={index === all.length - 1}
                                    className="sole-icon field-action"
                                    role="button"
                                />
                                <UpIcon
                                    onClick={() => {
                                        const next = { ...value }
                                        next.shape = swapUp(value.shape, index) as Position2D_xz[]
                                        submit(name, next)
                                    }}
                                    aria-disabled={index === 0}
                                    className="sole-icon field-action"
                                    role="button"
                                />
                            </span>
                            <span className="position">
                                <label>
                                    x
                                    <input type="number" name={'line_x_' + index} value={point.x} onChange={onChange} />
                                </label>
                                <label>
                                    z
                                    <input type="number" name={'line_z_' + index} value={point.z} onChange={onChange} />
                                </label>
                            </span>
                        </label>
                    )
                })}
            </>
        ) : null

    const lineWidth = (
        <label>
            lineWidth
            <input type="number" min={0} name="lineWidth" value={value.lineWidth ?? ''} onChange={onChange} />
        </label>
    )
    const shapeY =
        value.type === 'shape' ? (
            <label>
                <span>shapeY</span>
                <input name="shapeY" type="number" value={value.shapeY} onChange={onChange} />
            </label>
        ) : null
    const shapeMinXMinY =
        value.type === 'extrude' ? (
            <>
                <label>
                    <span>shapeMinY</span>
                    <input name="shapeMinY" type="number" value={value.shapeMinY} onChange={onChange} />
                </label>
                <label>
                    <span>shapeMaxY</span>
                    <input name="shapeMaxY" type="number" value={value.shapeMaxY} onChange={onChange} />
                </label>
            </>
        ) : null
    const lineColor = <ColorEdit value={value} color="lineColor" onChange={onMarkerChange} />
    const fillColor =
        value.type === 'line' ? null : <ColorEdit value={value} color="fillColor" onChange={onMarkerChange} />
    const depthTest = (
        <label>
            depthTest
            <input type="checkbox" name="depthTest" checked={value.depthTest ?? false} onChange={onChange} />
        </label>
    )
    return (
        <div className="marker-editor-secondary">
            {base.key}
            {base.label}
            {base.detail}
            {base.position}
            {link.link}
            {link.newTab}
            {line}
            {shape}
            {shapeY}
            {shapeMinXMinY}
            {lineWidth}
            {lineColor}
            {fillColor}
            {depthTest}
            {base.minDistance}
            {base.maxDistance}
            {base.sorting}
            {base.listed}
        </div>
    )
}
