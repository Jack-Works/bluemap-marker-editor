import { forwardRef, memo, useContext, useRef } from 'react'
import { MarkerCreateForm, MarkerCreateFormSubmitHandler, MarkerEditor } from './MarkerEditor.js'
import { EditIcon } from '../icons/edit.js'
import { AddIcon } from '../icons/add.js'
import { UpIcon } from '../icons/up.js'
import { DownIcon } from '../icons/down.js'
import { swapDown, swapUp } from '../utils/swap.js'
import { DeleteIcon } from '../icons/delete.js'
import { getFormData, openAndClearValidity } from '../utils/form.js'
import { InternalContext } from '../hooks/context.js'

export interface MarkerSetEditorProps {
    value: MarkerSet
    name: string
    defaultExpanded: boolean
    onChange(selfKey: string, value: MarkerSet): void
    onSwapUp?(): void
    onSwapDown?(): void
    onDelete(): void
    isNameUsed(name: string): boolean
}

export const MarkerSetEditor = memo(
    ({ value, name, defaultExpanded, onChange, onSwapDown, onSwapUp, onDelete, isNameUsed }: MarkerSetEditorProps) => {
        const { globalEditingReference } = useContext(InternalContext)
        const editSelf = useRef<HTMLDialogElement>(null)
        const addNew = useRef<HTMLDialogElement>(null)

        const onDialogClose = () => editSelf.current!.close()
        const onEditButton: React.MouseEventHandler<SVGSVGElement> = (e) => {
            e.preventDefault()
            openAndClearValidity(editSelf.current!)
        }
        const onSubmitEditSelf: MarkerSetEditFormSubmitHandler = (event, form) => {
            onChange(form.name.value, {
                label: form.label.value,
                markers: value.markers,
                sorting: form.sorting.valueAsNumber,
                defaultHidden: form.defaultHidden.checked,
                toggleable: form.toggleable.checked,
            })
            onDialogClose()
            event.currentTarget.reset()
        }
        const onNewMarker: MarkerCreateFormSubmitHandler = (event, key, newMarker) => {
            onChange(name, { ...value, markers: { ...value.markers, [key]: newMarker } })
            addNew.current!.close()
            event.currentTarget.reset()
        }
        return (
            <li className="semantic-tag">
                <details open={defaultExpanded}>
                    <summary>
                        <UpIcon
                            className="sole-icon"
                            aria-disabled={!onSwapUp}
                            onClick={(e) => (e.preventDefault(), onSwapUp?.())}
                            role="button"
                        />
                        <DownIcon
                            className="sole-icon"
                            aria-disabled={!onSwapDown}
                            onClick={(e) => (e.preventDefault(), onSwapDown?.())}
                            role="button"
                        />
                        <EditIcon className="sole-icon" role="button" onClick={onEditButton} />
                        {value.label}
                        <var>({name})</var>
                        <AddIcon
                            className="sole-icon"
                            role="button"
                            onClick={(e) => (e.preventDefault(), addNew.current!.showModal())}
                        />
                        <DeleteIcon
                            className="sole-icon"
                            aria-disabled={!!Object.keys(value.markers).length}
                            role="button"
                            onClick={(e) => (e.preventDefault(), onDelete())}
                        />
                        <MarkerSetEditForm
                            ref={editSelf}
                            title="Edit marker set"
                            isNameUsed={isNameUsed}
                            onSubmit={onSubmitEditSelf}
                            onClose={onDialogClose}
                            defaultKey={name}
                            defaultLabel={value.label}
                            defaultSorting={value.sorting}
                            defaultDefaultHidden={value.defaultHidden}
                            defaultToggleable={value.toggleable}
                        />
                        <MarkerCreateForm
                            ref={addNew}
                            isNameUsed={(name) => name in value.markers}
                            onClose={() => addNew.current!.close()}
                            onSubmit={onNewMarker}
                        />
                    </summary>
                    <ul className="semantic-tag">
                        {Object.entries(value.markers).map(([key, marker], index, entries) => {
                            function onSwapUp() {
                                return onChange(
                                    name,
                                    Object.assign({}, value, {
                                        markers: Object.fromEntries(swapUp(entries, index)),
                                    })
                                )
                            }
                            function onSwapDown() {
                                return onChange(
                                    name,
                                    Object.assign({}, value, {
                                        markers: Object.fromEntries(swapDown(entries, index)),
                                    })
                                )
                            }
                            const editingKey =
                                globalEditingReference?.marker === marker &&
                                (value.markers[globalEditingReference.initialKey] === marker ||
                                    !value.markers[globalEditingReference.initialKey])
                                    ? globalEditingReference.initialKey
                                    : key
                            return (
                                <MarkerEditor
                                    onDelete={() => {
                                        const next = { ...value }
                                        delete next.markers[key]
                                        onChange(name, next)
                                    }}
                                    onChange={(newKey, newValue) => {
                                        const next = entries
                                        next[index] = [newKey, newValue]
                                        onChange(name, { ...value, markers: Object.fromEntries(next) })
                                    }}
                                    isNameUsed={(name) => name in value.markers}
                                    onSwapUp={index > 0 ? onSwapUp : undefined}
                                    onSwapDown={index < entries.length - 1 ? onSwapDown : undefined}
                                    key={editingKey}
                                    name={key}
                                    marker={marker}
                                />
                            )
                        })}
                    </ul>
                </details>
            </li>
        )
    }
)
MarkerSetEditor.displayName = 'MarkerSetEditor'

export type MarkerSetEditFormSubmitHandler = (
    event: React.FormEvent<HTMLFormElement>,
    fields: Record<'name' | 'label' | 'sorting' | 'defaultHidden' | 'toggleable', HTMLInputElement>
) => void
export const MarkerSetEditForm = memo(
    forwardRef<
        HTMLDialogElement,
        {
            onClose: React.MouseEventHandler<HTMLButtonElement>
            onSubmit: MarkerSetEditFormSubmitHandler
            isNameUsed(name: string): boolean
            defaultKey?: string
            defaultLabel?: string
            defaultSorting?: number
            defaultDefaultHidden?: boolean
            defaultToggleable?: boolean
            title: string
        }
    >((props, ref) => {
        const form = useRef<HTMLFormElement>(null)
        return (
            <dialog
                ref={ref}
                key={[
                    props.defaultKey,
                    props.defaultLabel,
                    props.defaultSorting,
                    props.defaultDefaultHidden,
                    props.defaultToggleable,
                ].join('')}
            >
                <h1>{props.title}</h1>
                <form
                    ref={form}
                    method="dialog"
                    className="set-info"
                    onSubmit={(event) => {
                        const formData = getFormData(form.current!)
                        if (formData.name.value !== props.defaultKey && props.isNameUsed(formData.name.value)) {
                            formData.name.setCustomValidity('Key already exists')
                            event.currentTarget.reportValidity()
                            event.preventDefault()
                            return
                        }
                        props.onSubmit(event, formData)
                    }}
                >
                    <label>
                        @@key:
                        <input
                            name="name"
                            minLength={1}
                            defaultValue={props.defaultKey ?? 'default-set'}
                            onChange={({ currentTarget }) => {
                                const value = currentTarget.value
                                if (currentTarget.value !== props.defaultKey && props.isNameUsed(value))
                                    currentTarget.setCustomValidity('Key already exists')
                                else currentTarget.setCustomValidity('')
                            }}
                        />
                    </label>
                    <label>
                        label:
                        <input name="label" minLength={1} defaultValue={props.defaultLabel ?? 'Default Set'} />
                    </label>
                    <label>
                        sorting:
                        <input name="sorting" type="number" defaultValue={props.defaultSorting ?? 0} />
                    </label>
                    <label>
                        defaultHidden:
                        <span>
                            <input
                                name="defaultHidden"
                                type="checkbox"
                                defaultChecked={props.defaultDefaultHidden ?? false}
                            />
                        </span>
                    </label>
                    <label>
                        toggleable:
                        <span>
                            <input name="toggleable" type="checkbox" defaultChecked={props.defaultToggleable ?? true} />
                        </span>
                    </label>
                    <span></span>
                    <span className="action">
                        <button type="button" onClick={props.onClose}>
                            Close
                        </button>
                        <button type="submit">Save</button>
                    </span>
                </form>
            </dialog>
        )
    })
)
MarkerSetEditForm.displayName = 'MarkerSetEditForm'
