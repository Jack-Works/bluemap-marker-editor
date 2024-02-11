export interface useOpenableMarkEditProps {
    value: Readonly<Marker_Line | Marker_Shape | Marker_Extrude>
    onChange(marker: Marker): void
}
export function useOpenableMarkEdit({ value, onChange: submit }: useOpenableMarkEditProps) {
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const field = e.currentTarget

        const next = { ...value }
        if (field.name === 'link') {
            if (field.value) next.link = field.value
            else delete next.link
        } else if (field.name === 'newTab') {
            next.newTab = field.checked
        }
        submit(next)
    }

    return {
        link: (
            <label>
                link
                <input name="link" type="url" value={value.link || ''} onChange={onChange} />
            </label>
        ),
        newTab: (
            <label>
                newTab
                <input
                    type="checkbox"
                    name="newTab"
                    className="field-action"
                    checked={value.newTab ?? true}
                    onChange={onChange}
                />
            </label>
        ),
    }
}
