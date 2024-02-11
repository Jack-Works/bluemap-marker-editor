const css = String.raw

const style = css`
    .marker-editor {
        position: fixed;
        line-height: 1.4em;
        color: var(--theme-fg);
        font-family: system-ui;
        top: calc(2em + 0.5em);
        right: 0;
        display: flex;
        flex-direction: column;
        max-width: 506px;
        align-items: end;
        margin: 0.5em;
        gap: 0.5em;
        max-height: calc(100vh - 56px);
        overflow: auto;
        & > * {
            width: 100%;
        }
        & * {
            box-sizing: border-box;
        }
    }
    .marker-editor > main,
    .marker-editor-secondary {
        pointer-events: auto;
        background: var(--theme-bg);
        padding: 0.75em;
        filter: drop-shadow(1px 1px 3px rgba(0, 0, 0, 0.53));
        .semantic-tag {
            display: contents;
        }
        .sole-icon {
            margin: -0.125em 0.25em;
            &[role='button'] {
                cursor: pointer;
            }
            &[aria-disabled^='true'] {
                opacity: 0.2;
            }
        }
        h1 {
            font-weight: 100;
            font-size: x-large;
        }
        var {
            opacity: 0.6;
            margin-left: 0.25em;
        }
        input {
            color: black;
            background-color: white;
            border: 1px solid gray;
            &:focus {
                outline: 1px blue solid;
            }
            &:invalid {
                outline: 1px red solid;
            }
        }
        .span {
            margin-right: 0.5em;
        }
    }
    .marker-editor > main {
        dialog {
            border: 1px solid gray;
            filter: drop-shadow(1px 1px 3px rgba(0, 0, 0, 0.53));
            & > h1 {
                margin-top: 0;
            }
        }
        details {
            margin-left: 1em;
            ::marker {
                translate: -2px 0;
            }
            & > summary {
                margin-left: -1em;
            }
        }
        .icon-button svg {
            translate: 0 2px;
            margin-right: 0.25em;
        }

        dialog.code-editor {
            width: 75vw;
            & > div {
                max-height: 80vh;
                gap: 0.5em;
                flex-direction: column;
                display: flex;
            }
            div > * {
                margin-right: 0.5em;
            }
            textarea {
                max-height: 100%;
                flex: 1;
                overflow: auto;
            }
        }
        .set-info,
        .marker-info {
            display: grid;
            grid-template-columns: auto auto;
            grid-gap: 0.5em;
            label {
                display: contents;
            }
            input {
                align-self: flex-end;
            }
            button {
                min-width: 6em;
                margin-right: 0.5em;
            }
            .action {
                text-align: right;
            }
        }
        .marker {
            display: block;
            margin-left: 1em;
        }
        svg.type-icon {
            margin-bottom: -0.18em;
        }
    }
    .marker-editor-secondary {
        bottom: 0.5em;
        left: 0;
        display: grid;
        grid-template-columns: auto auto;
        gap: 0.5em;
        & > label {
            display: contents;
        }
        .field-action {
            float: right;
        }
        .field-action.sole-icon {
            translate: 0 4px;
        }
        .field-action.sole-icon.active {
            color: red;
        }
        .position {
            display: flex;
            gap: 0.5em;
            min-width: 245px;
            & > label > input[type='number'] {
                max-width: 3.5em;
                margin-left: 0.5em;
            }
        }
    }
`

//#region
let sheet: CSSStyleSheet
if (import.meta.hot) {
    sheet = import.meta.hot.data.sheet ??= new CSSStyleSheet()
    import.meta.hot.accept()
} else {
    sheet = new CSSStyleSheet()
}
sheet.replaceSync(style)
export default sheet
//#endregion
