/// <reference path="../../marker-editor/global.d.ts" />
import { forwardRef, memo, useContext, useRef } from 'react'
import { EditIcon } from '../icons/edit.js'
import { PinIcon } from '../icons/pin.js'
import { BluemapContext } from '../hooks/io.js'
import { UpIcon } from '../icons/up.js'
import { DownIcon } from '../icons/down.js'
import { getFormData } from '../utils/form.js'
import { EditReference, InternalContext } from '../hooks/context.js'
import { LineIcon } from '../icons/line.js'
import { TwoDIcon } from '../icons/2d.js'
import { ThreeDIcon } from '../icons/3d.js'
import { DeleteIcon } from '../icons/delete.js'
import { CodeIcon } from '../icons/code.js'
import { createPortal } from 'react-dom'
import { PointMarkEdit } from './EditPanel/Point.js'
import { ShapeMarkEdit } from './EditPanel/Shape.js'

export interface MarkerEditorProps {
    marker: Marker
    name: string
    onChange(selfKey: string, marker: Marker): void
    onDelete(): void
    onSwapUp?(): void
    onSwapDown?(): void
    isNameUsed(name: string): boolean
}

const iconMap: Record<Marker['type'], JSX.Element> = {
    poi: <PinIcon className="type-icon" />,
    html: <CodeIcon className="type-icon" />,
    line: <LineIcon className="type-icon" />,
    shape: <TwoDIcon className="type-icon" />,
    extrude: <ThreeDIcon className="type-icon" />,
}
export const MarkerEditor = memo(function MarkerRender({
    marker,
    name,
    onChange,
    onDelete,
    onSwapDown,
    onSwapUp,
    isNameUsed,
}: MarkerEditorProps) {
    const { globalEditingReference, setGlobalEditingReference, portal } = useContext(InternalContext)
    const localEditReference = useRef<EditReference>({ marker, initialKey: name })
    localEditReference.current.marker = marker

    if (
        localEditReference.current !== globalEditingReference &&
        localEditReference.current.marker === globalEditingReference?.marker
    ) {
        // we just edit the @@key, the reference changed but inner value is the same. let's recover it
        localEditReference.current = globalEditingReference
    }
    const localOnChange = (selfKey: string, marker: Marker) => {
        onChange(selfKey, marker)
        if (globalEditingReference === localEditReference.current) {
            globalEditingReference.marker = marker
        }
    }

    const { mapViewerGotoPosition } = useContext(BluemapContext)

    const onMove: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
        e.preventDefault()
        mapViewerGotoPosition(marker.position.x, undefined, marker.position.z)
    }
    return (
        <li className="semantic-tag marker">
            <UpIcon className="sole-icon" aria-disabled={!onSwapUp} onClick={onSwapUp} role="button" />
            <DownIcon className="sole-icon" aria-disabled={!onSwapDown} onClick={onSwapDown} role="button" />
            <EditIcon
                className="sole-icon"
                role="button"
                onClick={() => {
                    if (localEditReference.current === globalEditingReference) setGlobalEditingReference(null)
                    else setGlobalEditingReference(localEditReference.current)
                }}
            />
            <a href="#" onClick={onMove}>
                {marker.label}
                <var>
                    ({iconMap[marker.type]} {name})
                </var>
            </a>
            <DeleteIcon className="sole-icon" role="button" onClick={onDelete} />
            {globalEditingReference === localEditReference.current ||
            globalEditingReference?.marker === localEditReference.current.marker
                ? createPortal(
                      marker.type === 'poi' || marker.type === 'html' ? (
                          <PointMarkEdit isNameUsed={isNameUsed} onChange={localOnChange} name={name} value={marker} />
                      ) : (
                          <ShapeMarkEdit
                              onDelete={onDelete}
                              isNameUsed={isNameUsed}
                              onChange={localOnChange}
                              name={name}
                              value={marker}
                          />
                      ),
                      portal!
                  )
                : null}
        </li>
    )
})

const defaultValue: Record<Marker['type'], Marker> = {
    poi: { type: 'poi', label: 'Point', position: { x: 0, y: 0, z: 0 }, classes: [], anchor: { x: 25, y: 45 } },
    html: { type: 'html', label: 'HTML marker', position: { x: 0, y: 0, z: 0 }, html: '', classes: [] },
    line: {
        type: 'line',
        label: 'Line',
        line: [],
        position: { x: 0, y: 0, z: 0 },
        lineWidth: 2,
        lineColor: { r: 255, g: 255, b: 255, a: 1 },
    },
    shape: {
        type: 'shape',
        label: 'Shape',
        shape: [],
        position: { x: 0, y: 0, z: 0 },
        shapeY: 63,
        lineWidth: 2,
        lineColor: { r: 255, g: 255, b: 255, a: 1 },
    },
    extrude: {
        type: 'extrude',
        label: 'Extrude',
        shape: [],
        position: { x: 0, y: 0, z: 0 },
        shapeMinY: 63,
        shapeMaxY: 63,
        lineWidth: 2,
        lineColor: { r: 255, g: 255, b: 255, a: 1 },
    },
}
export type MarkerCreateFormSubmitHandler = (
    event: React.FormEvent<HTMLFormElement>,
    key: string,
    newMarker: Marker
) => void
export const MarkerCreateForm = memo(
    forwardRef<
        HTMLDialogElement,
        {
            onClose: React.MouseEventHandler<HTMLButtonElement>
            onSubmit: MarkerCreateFormSubmitHandler
            isNameUsed(name: string): boolean
        }
    >((props, ref) => {
        const form = useRef<HTMLFormElement>(null)
        return (
            <dialog ref={ref}>
                <h1>Create Marker</h1>
                <form
                    ref={form}
                    method="dialog"
                    className="marker-info"
                    onSubmit={(event) => {
                        const formData = getFormData(form.current!)
                        if (props.isNameUsed(formData.name.value)) {
                            formData.name.setCustomValidity('Key already exists')
                            event.currentTarget.reportValidity()
                            event.preventDefault()
                            return
                        }
                        const type = (form.current!.elements.namedItem('type') as RadioNodeList).value as Marker['type']
                        props.onSubmit(event, formData.name.value, defaultValue[type])
                    }}
                >
                    <label>
                        type:
                        <span>
                            <label>
                                <input type="radio" name="type" value="poi" />
                                poi
                            </label>
                            <label>
                                <input type="radio" name="type" value="html" />
                                html
                            </label>
                            <label>
                                <input type="radio" name="type" value="line" />
                                line
                            </label>
                            <label>
                                <input type="radio" name="type" value="shape" defaultChecked />
                                shape
                            </label>
                            <label>
                                <input type="radio" name="type" value="extrude" />
                                extrude
                            </label>
                        </span>
                    </label>
                    <label>
                        @@key:
                        <input
                            name="name"
                            minLength={1}
                            defaultValue="default-marker"
                            onChange={({ currentTarget }) => {
                                const value = currentTarget.value
                                if (props.isNameUsed(value)) currentTarget.setCustomValidity('Key already exists')
                                else currentTarget.setCustomValidity('')
                            }}
                        />
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
MarkerCreateForm.displayName = 'MarkerCreateForm'
