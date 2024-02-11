export function getFormData<const T extends string>(form: HTMLFormElement): Record<T, HTMLInputElement> {
    return form.elements as any
}
export function openAndClearValidity(dialog: HTMLDialogElement) {
    dialog.showModal()
    dialog
        .querySelector('form')
        ?.querySelectorAll('input')
        .forEach((input) => input.setCustomValidity(''))
}
