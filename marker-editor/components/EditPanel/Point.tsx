import { useActSetup } from '../../hooks/useAct.js'
import { useBaseMarkEdit } from './useBaseMarkEdit.js'

export interface PointMarkEditProps {
    value: Readonly<Marker_POI | Marker_HTML>
    name: string
    isNameUsed(name: string): boolean
    onChange(selfKey: string, marker: Marker): void
}
export function PointMarkEdit(props: PointMarkEditProps) {
    const base = useBaseMarkEdit(props, useActSetup().useAct)
    const { value, name, onChange: parentChange } = props

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const field = e.currentTarget
        const next = { ...value }
        if (field.name === 'icon' && next.type === 'poi') {
            if (field.value) next.icon = field.value
            else delete next.icon
        } else if (field.name === 'anchor_x' || field.name === 'anchor_y') {
            if (!field.value) delete next.anchor
            else if (isNaN(field.valueAsNumber)) return
            else {
                field.setCustomValidity('')
                next.anchor = { x: next.anchor?.x ?? 0, y: next.anchor?.y ?? 0 }
                next.anchor[field.name.split('_')[1] as 'x' | 'y'] = field.valueAsNumber
            }
        } else if (field.name === 'classes') {
            if (field.value) next.classes = field.value.split(' ')
            else next.classes = []
        }
        parentChange(name, next)
    }
    const icon =
        value.type === 'poi' ? (
            <label>
                icon
                <input list="icon_list" name="icon" value={value.icon || ''} onChange={onChange} />
                <datalist id="icon_list">
                    <option value="assets/poi.svg">assets/poi.svg</option>
                </datalist>
            </label>
        ) : null
    const anchor = (
        <div className="semantic-tag">
            <span>anchor</span>
            <span className="position">
                <label>
                    x<input type="number" name="anchor_x" value={value.anchor?.x ?? ''} onChange={onChange} />
                </label>
                <label>
                    y<input type="number" name="anchor_y" value={value.anchor?.y ?? ''} onChange={onChange} />
                </label>
            </span>
        </div>
    )
    const classes = (
        <label>
            classes
            <input
                name="classes"
                value={value.classes?.join(' ') ?? ''}
                onChange={onChange}
                placeholder="class1 class2"
            />
        </label>
    )
    return (
        <div className="marker-editor-secondary">
            {base.key}
            {base.label}
            {icon}
            {base.detail}
            {base.position}
            {anchor}
            {base.minDistance}
            {base.maxDistance}
            {base.sorting}
            {base.listed}
            {classes}
        </div>
    )
}
