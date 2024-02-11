import { useContext } from 'react'
import { BluemapContext } from '../../hooks/io.js'
import { ApplyDistanceIcon } from '../../icons/apply-distance.js'
import { PinIcon } from '../../icons/pin.js'
import { useAct } from '../../hooks/useAct.js'

export interface BaseMarkEditProps {
    value: Readonly<Marker>
    name: string
    onChange(selfKey: string, marker: Marker): void
    isNameUsed(name: string): boolean
}
export function useBaseMarkEdit({ value, name, onChange: submit, isNameUsed }: BaseMarkEditProps, useAct: useAct) {
    const { pickPosition, getDistance } = useContext(BluemapContext)
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const field = e.currentTarget

        if (field.name === 'name') {
            if (field.value !== name && isNameUsed(field.value)) return field.setCustomValidity('Key already exists')
            field.setCustomValidity('')
            return submit(field.value, value)
        }

        const next = { ...value }

        if (field.name === 'label') next.label = field.value
        else if (field.name === 'html' && next.type === 'html') next.html = field.value
        else if (field.name === 'detail' && next.type !== 'html') {
            if (field.value) next.detail = field.value
            else delete next.detail
        } else if (field.name === 'position_x' || field.name === 'position_y' || field.name === 'position_z') {
            if (isNaN(field.valueAsNumber)) return
            next.position = { ...next.position }
            next.position[field.name.split('_')[1] as 'x' | 'y' | 'z'] = field.valueAsNumber
        } else if (field.name === 'minDistance' || field.name === 'maxDistance' || field.name === 'sorting') {
            if (!field.value) delete next[field.name]
            else if (isNaN(field.valueAsNumber)) return
            else {
                next[field.name] = field.valueAsNumber
            }
        } else if (field.name === 'listed') {
            if (field.checked) delete next.listed
            else next.listed = false
        }
        submit(name, next)
    }
    const [picking, startPick, stopPick] = useAct('pick position')
    const onPickLocation = () => {
        if (picking) return stopPick()
        startPick((signal, done) => {
            pickPosition(signal)
                .then(([x, y, z]) => {
                    const next = { ...value }
                    next.position = { x, y, z }
                    submit(name, next)
                })
                .catch(() => {})
                .finally(done)
        })
    }
    const onSetMinDistance = () => {
        const distance = getDistance()
        const next = { ...value }
        next.minDistance = distance === 5 ? 0 : distance
        submit(name, next)
    }
    const onSetMaxDistance = () => {
        const distance = getDistance()
        const next = { ...value }
        next.maxDistance = distance
        submit(name, next)
    }
    return {
        stopPick: () => {},
        key: (
            <label>
                @@key
                <input name="name" minLength={1} value={name} onChange={onChange} />
            </label>
        ),
        label: (
            <label>
                label
                <input name="label" minLength={1} value={value.label} onChange={onChange} />
            </label>
        ),
        detail:
            value.type === 'html' ? (
                <label>
                    html
                    <input name="html" value={value.html} onChange={onChange} />
                </label>
            ) : (
                <label>
                    detail
                    <input name="detail" value={value.detail || ''} onChange={onChange} />
                </label>
            ),
        position: (
            <div className="semantic-tag">
                <label>
                    position
                    <PinIcon
                        onClick={onPickLocation}
                        className={'sole-icon field-action' + (picking ? ' active' : '')}
                        role="button"
                    />
                </label>
                <span className="position">
                    {picking ? (
                        'Click on the map to pick'
                    ) : (
                        <>
                            <label>
                                x
                                <input type="number" name="position_x" value={value.position.x} onChange={onChange} />
                            </label>
                            <label>
                                y
                                <input type="number" name="position_y" value={value.position.y} onChange={onChange} />
                            </label>
                            <label>
                                z
                                <input type="number" name="position_z" value={value.position.z} onChange={onChange} />
                            </label>
                        </>
                    )}
                </span>
            </div>
        ),
        minDistance: (
            <label>
                <span>
                    minDistance
                    <ApplyDistanceIcon className="sole-icon field-action" role="button" onClick={onSetMinDistance} />
                </span>
                <input name="minDistance" min={0} type="number" value={value.minDistance ?? ''} onChange={onChange} />
            </label>
        ),
        maxDistance: (
            <label>
                <span>
                    maxDistance
                    <ApplyDistanceIcon className="sole-icon field-action" role="button" onClick={onSetMaxDistance} />
                </span>
                <input
                    name="maxDistance"
                    min={Math.max(0, value.minDistance ?? 0)}
                    type="number"
                    value={value.maxDistance ?? ''}
                    onChange={onChange}
                />
            </label>
        ),
        sorting: (
            <label>
                sorting
                <input name="sorting" type="number" value={value.sorting ?? ''} onChange={onChange} />
            </label>
        ),
        listed: (
            <label>
                listed
                <input
                    type="checkbox"
                    name="listed"
                    className="field-action"
                    checked={value.listed ?? true}
                    onChange={onChange}
                />
            </label>
        ),
    }
}
