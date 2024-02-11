import { memo, useCallback, useRef } from 'react'
import { MarkerSetEditForm, MarkerSetEditFormSubmitHandler, MarkerSetEditor } from './MarkerSetEditor.js'
import { AddIcon } from '../icons/add.js'
import { swapDown, swapUp } from '../utils/swap.js'
import { openAndClearValidity } from '../utils/form.js'
import { CodeIcon } from '../icons/code.js'
import { DownloadIcon } from '../icons/download.js'
import { SaveIcon } from '../icons/save.js'
import { CloseIcon } from '../icons/close.js'

export interface MarkerFileEditorProps {
    file: MarkerFile
    onChange(file: MarkerFile): void
}

export const MarkerFileEditor = memo(({ file, onChange }: MarkerFileEditorProps) => {
    const newDialog = useRef<HTMLDialogElement>(null)
    const codeEditorDialog = useRef<HTMLDialogElement>(null)
    const onNewMarkerSubmit: MarkerSetEditFormSubmitHandler = (event, form) => {
        const next: MarkerSet = {
            label: form.label.value,
            markers: {},
            sorting: form.sorting.valueAsNumber,
            defaultHidden: form.defaultHidden.checked,
            toggleable: form.toggleable.checked,
        }
        onChange({
            ...file,
            [form.name.value]: next,
        })
        event.currentTarget.reset()
    }
    const isNameUsed = useCallback((name: string) => name in file, [file])
    return (
        <main>
            <button className="icon-button span" onClick={() => openAndClearValidity(newDialog.current!)}>
                <AddIcon />
                New set
            </button>
            <MarkerSetEditForm
                ref={newDialog}
                title="Create new marker set"
                isNameUsed={isNameUsed}
                onSubmit={onNewMarkerSubmit}
                onClose={() => newDialog.current!.close()}
            />
            <button className="icon-button" onClick={() => codeEditorDialog.current!.showModal()}>
                <CodeIcon />
                Code editor
            </button>
            <dialog className="code-editor" ref={codeEditorDialog}>
                <CodeEditor onClose={() => codeEditorDialog.current!.close()} file={file} onChange={onChange} />
            </dialog>
            <ul className="semantic-tag">
                {Object.entries(file).map(([key, value], index) => (
                    <MarkerSetEditor
                        key={key}
                        isNameUsed={isNameUsed}
                        onChange={(newKey, newValue) => {
                            const nextFile = Object.entries(file)
                            nextFile[index] = [newKey, newValue]
                            onChange(Object.fromEntries(nextFile))
                        }}
                        onSwapUp={
                            index > 0
                                ? () => onChange(Object.fromEntries(swapUp(Object.entries(file), index)))
                                : undefined
                        }
                        onSwapDown={
                            index < Object.keys(file).length - 1
                                ? () => onChange(Object.fromEntries(swapDown(Object.entries(file), index)))
                                : undefined
                        }
                        onDelete={() => {
                            const nextFile = Object.entries(file)
                            nextFile.splice(index, 1)
                            onChange(Object.fromEntries(nextFile))
                        }}
                        defaultExpanded={index === 0}
                        name={key}
                        value={value}
                    />
                ))}
            </ul>
        </main>
    )
})
MarkerFileEditor.displayName = 'MarkerFileEditor'

function CodeEditor({
    file,
    onChange,
    onClose,
}: {
    file: MarkerFile
    onChange(file: MarkerFile): void
    onClose(): void
}) {
    const stringifiedFile = JSON.stringify(file, undefined, 4)
    const textarea = useRef<HTMLTextAreaElement>(null)
    const onDownload = () => {
        const blob = new Blob([stringifiedFile], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'marker-file.json'
        a.click()
    }
    const onSaveChange = () => {
        try {
            onChange(JSON.parse(textarea.current!.value))
            onClose()
        } catch (e) {
            alert('Invalid JSON')
        }
    }
    return (
        <div>
            <div>
                <button className="icon-button" onClick={onDownload}>
                    <DownloadIcon />
                    Download
                </button>
                <button className="icon-button" onClick={onSaveChange}>
                    <SaveIcon />
                    Save changes
                </button>
                <button className="icon-button" onClick={onClose}>
                    <CloseIcon />
                    Close
                </button>
            </div>
            <textarea
                ref={textarea}
                key={stringifiedFile}
                spellCheck={false}
                rows={99999}
                defaultValue={stringifiedFile}
            />
        </div>
    )
}
