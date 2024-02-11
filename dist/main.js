// ==UserScript==
// @name         BlueMap marker editor
// @version      0.1
// @description  pafu pafu nya nya
// @author       Jack Works
// @icon         https://www.google.com/s2/favicons?domain=map.nyaacat.com
// @require      https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js
// @require      https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js
// @require      https://cdn.jsdelivr.net/npm/@holoflows/kit@0.9.0/umd/index.cjs
// @grant        none
// ==/UserScript==
(function (client, react, reactDom, kit) {
'use strict';

const EditIcon = (props) => (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", height: "1em", viewBox: "0 0 24 24", width: "1em", fill: "currentColor", ...props },
    React.createElement("path", { d: "M0 0h24v24H0z", fill: "none" }),
    React.createElement("path", { d: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" })));

const PinIcon = (props) => (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", enableBackground: "new 0 0 24 24", height: "1em", viewBox: "0 0 24 24", width: "1em", fill: "currentColor", ...props },
    React.createElement("g", null,
        React.createElement("rect", { fill: "none", height: "24", width: "24" })),
    React.createElement("g", null,
        React.createElement("path", { d: "M16,9V4l1,0c0.55,0,1-0.45,1-1v0c0-0.55-0.45-1-1-1H7C6.45,2,6,2.45,6,3v0 c0,0.55,0.45,1,1,1l1,0v5c0,1.66-1.34,3-3,3h0v2h5.97v7l1,1l1-1v-7H19v-2h0C17.34,12,16,10.66,16,9z", fillRule: "evenodd" }))));

const BluemapContext = react.createContext({
    mapViewerGotoPosition(x, y, z) {
        console.log('mapViewerGotoPosition', x, y, z);
    },
    pickPosition() {
        const x = parseFloat(prompt('x', '0'));
        if (isNaN(x))
            return Promise.reject();
        const y = parseFloat(prompt('y', '0'));
        if (isNaN(y))
            return Promise.reject();
        const z = parseFloat(prompt('z', '0'));
        if (isNaN(x))
            return Promise.reject();
        return Promise.resolve([x, y, z]);
    },
    getDistance() {
        return 0;
    },
});

const UpIcon = (props) => (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", height: "1em", viewBox: "0 0 24 24", width: "1em", fill: "currentColor", ...props },
    React.createElement("path", { d: "M0 0h24v24H0V0z", fill: "none" }),
    React.createElement("path", { d: "M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" })));

const DownIcon = (props) => (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", height: "1em", viewBox: "0 0 24 24", width: "1em", fill: "currentColor", ...props },
    React.createElement("path", { d: "M0 0h24v24H0V0z", fill: "none" }),
    React.createElement("path", { d: "M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z" })));

function getFormData(form) {
    return form.elements;
}
function openAndClearValidity(dialog) {
    dialog.showModal();
    dialog
        .querySelector('form')
        ?.querySelectorAll('input')
        .forEach((input) => input.setCustomValidity(''));
}

const InternalContext = react.createContext(null);
InternalContext.displayName = 'InternalContext';

const LineIcon = (props) => (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", height: "1em", viewBox: "0 -960 960 960", width: "1em", fill: "currentColor", ...props },
    React.createElement("path", { d: "M600-80v-100L320-320H120v-240h172l108-124v-196h240v240H468L360-516v126l240 120v-50h240v240H600ZM480-720h80v-80h-80v80ZM200-400h80v-80h-80v80Zm480 240h80v-80h-80v80ZM520-760ZM240-440Zm480 240Z" })));

const TwoDIcon = (props) => (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", height: "1em", viewBox: "0 -960 960 960", width: "1em", fill: "currentColor", ...props },
    React.createElement("path", { d: "M260-360h180v-60H320v-40h80q17 0 28.5-11.5T440-500v-60q0-17-11.5-28.5T400-600H260v60h120v40h-80q-17 0-28.5 11.5T260-460v100Zm260 0h160q17 0 28.5-11.5T720-400v-160q0-17-11.5-28.5T680-600H520v240Zm60-60v-120h80v120h-80ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" })));

const ThreeDIcon = (props) => (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", height: "1em", viewBox: "0 -960 960 960", width: "1em", fill: "currentColor", ...props },
    React.createElement("path", { d: "M440-183v-274L200-596v274l240 139Zm80 0 240-139v-274L520-457v274Zm-40-343 237-137-237-137-237 137 237 137ZM160-252q-19-11-29.5-29T120-321v-318q0-22 10.5-40t29.5-29l280-161q19-11 40-11t40 11l280 161q19 11 29.5 29t10.5 40v318q0 22-10.5 40T800-252L520-91q-19 11-40 11t-40-11L160-252Zm320-228Z" })));

const DeleteIcon = (props) => (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", height: "1em", viewBox: "0 -960 960 960", width: "1em", fill: "currentColor", ...props },
    React.createElement("path", { d: "m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" })));

const CodeIcon = (props) => (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", height: "1em", viewBox: "0 0 24 24", width: "1em", fill: "currentColor", ...props },
    React.createElement("path", { d: "M0 0h24v24H0V0z", fill: "none" }),
    React.createElement("path", { d: "M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" })));

function useLatest(val) {
    const ref = react.useRef(val);
    ref.current = val;
    return ref;
}

function useActSetup() {
    const [[name, kind, signal] = [], setAction] = react.useState(undefined);
    react.useDebugValue(name);
    const lastSignal = useLatest(signal);
    react.useEffect(() => () => lastSignal.current?.abort(), []);
    return {
        useAct(name) {
            const { current: thisKind } = react.useRef(Math.random());
            react.useDebugValue([name, kind === thisKind]);
            const stop = () => (kind === thisKind ? (setAction(undefined), signal?.abort()) : undefined);
            return [
                kind === thisKind,
                (callback) => {
                    return new Promise((resolve) => {
                        if (signal)
                            signal.abort();
                        const controller = new AbortController();
                        setAction([name, thisKind, controller]);
                        callback(controller.signal, () => {
                            controller.abort();
                        });
                        controller.signal.addEventListener('abort', () => (resolve(), stop()), { once: true });
                    });
                },
                stop,
            ];
        },
    };
}

const ApplyDistanceIcon = (props) => (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", height: "1em", fill: "currentColor", viewBox: "0 -960 960 960", width: "1em", ...props },
    React.createElement("path", { d: "M240-120v-120H120v-80h200v200h-80Zm400 0v-200h200v80H720v120h-80ZM120-640v-80h120v-120h80v200H120Zm520 0v-200h80v120h120v80H640Z" })));

function useBaseMarkEdit({ value, name, onChange: submit, isNameUsed }, useAct) {
    const { pickPosition, getDistance } = react.useContext(BluemapContext);
    const onChange = (e) => {
        const field = e.currentTarget;
        if (field.name === 'name') {
            if (field.value !== name && isNameUsed(field.value))
                return field.setCustomValidity('Key already exists');
            field.setCustomValidity('');
            return submit(field.value, value);
        }
        const next = { ...value };
        if (field.name === 'label')
            next.label = field.value;
        else if (field.name === 'html' && next.type === 'html')
            next.html = field.value;
        else if (field.name === 'detail' && next.type !== 'html') {
            if (field.value)
                next.detail = field.value;
            else
                delete next.detail;
        }
        else if (field.name === 'position_x' || field.name === 'position_y' || field.name === 'position_z') {
            if (isNaN(field.valueAsNumber))
                return;
            next.position = { ...next.position };
            next.position[field.name.split('_')[1]] = field.valueAsNumber;
        }
        else if (field.name === 'minDistance' || field.name === 'maxDistance' || field.name === 'sorting') {
            if (!field.value)
                delete next[field.name];
            else if (isNaN(field.valueAsNumber))
                return;
            else {
                next[field.name] = field.valueAsNumber;
            }
        }
        else if (field.name === 'listed') {
            if (field.checked)
                delete next.listed;
            else
                next.listed = false;
        }
        submit(name, next);
    };
    const [picking, startPick, stopPick] = useAct('pick position');
    const onPickLocation = () => {
        if (picking)
            return stopPick();
        startPick((signal, done) => {
            pickPosition(signal)
                .then(([x, y, z]) => {
                const next = { ...value };
                next.position = { x, y, z };
                submit(name, next);
            })
                .catch(() => { })
                .finally(done);
        });
    };
    const onSetMinDistance = () => {
        const distance = getDistance();
        const next = { ...value };
        next.minDistance = distance === 5 ? 0 : distance;
        submit(name, next);
    };
    const onSetMaxDistance = () => {
        const distance = getDistance();
        const next = { ...value };
        next.maxDistance = distance;
        submit(name, next);
    };
    return {
        stopPick: () => { },
        key: (React.createElement("label", null,
            "@@key",
            React.createElement("input", { name: "name", minLength: 1, value: name, onChange: onChange }))),
        label: (React.createElement("label", null,
            "label",
            React.createElement("input", { name: "label", minLength: 1, value: value.label, onChange: onChange }))),
        detail: value.type === 'html' ? (React.createElement("label", null,
            "html",
            React.createElement("input", { name: "html", value: value.html, onChange: onChange }))) : (React.createElement("label", null,
            "detail",
            React.createElement("input", { name: "detail", value: value.detail || '', onChange: onChange }))),
        position: (React.createElement("div", { className: "semantic-tag" },
            React.createElement("label", null,
                "position",
                React.createElement(PinIcon, { onClick: onPickLocation, className: 'sole-icon field-action' + (picking ? ' active' : ''), role: "button" })),
            React.createElement("span", { className: "position" }, picking ? ('Click on the map to pick') : (React.createElement(React.Fragment, null,
                React.createElement("label", null,
                    "x",
                    React.createElement("input", { type: "number", name: "position_x", value: value.position.x, onChange: onChange })),
                React.createElement("label", null,
                    "y",
                    React.createElement("input", { type: "number", name: "position_y", value: value.position.y, onChange: onChange })),
                React.createElement("label", null,
                    "z",
                    React.createElement("input", { type: "number", name: "position_z", value: value.position.z, onChange: onChange }))))))),
        minDistance: (React.createElement("label", null,
            React.createElement("span", null,
                "minDistance",
                React.createElement(ApplyDistanceIcon, { className: "sole-icon field-action", role: "button", onClick: onSetMinDistance })),
            React.createElement("input", { name: "minDistance", min: 0, type: "number", value: value.minDistance ?? '', onChange: onChange }))),
        maxDistance: (React.createElement("label", null,
            React.createElement("span", null,
                "maxDistance",
                React.createElement(ApplyDistanceIcon, { className: "sole-icon field-action", role: "button", onClick: onSetMaxDistance })),
            React.createElement("input", { name: "maxDistance", min: Math.max(0, value.minDistance ?? 0), type: "number", value: value.maxDistance ?? '', onChange: onChange }))),
        sorting: (React.createElement("label", null,
            "sorting",
            React.createElement("input", { name: "sorting", type: "number", value: value.sorting ?? '', onChange: onChange }))),
        listed: (React.createElement("label", null,
            "listed",
            React.createElement("input", { type: "checkbox", name: "listed", className: "field-action", checked: value.listed ?? true, onChange: onChange }))),
    };
}

function PointMarkEdit(props) {
    const base = useBaseMarkEdit(props, useActSetup().useAct);
    const { value, name, onChange: parentChange } = props;
    const onChange = (e) => {
        const field = e.currentTarget;
        const next = { ...value };
        if (field.name === 'icon' && next.type === 'poi') {
            if (field.value)
                next.icon = field.value;
            else
                delete next.icon;
        }
        else if (field.name === 'anchor_x' || field.name === 'anchor_y') {
            if (!field.value)
                delete next.anchor;
            else if (isNaN(field.valueAsNumber))
                return;
            else {
                field.setCustomValidity('');
                next.anchor = { x: next.anchor?.x ?? 0, y: next.anchor?.y ?? 0 };
                next.anchor[field.name.split('_')[1]] = field.valueAsNumber;
            }
        }
        else if (field.name === 'classes') {
            if (field.value)
                next.classes = field.value.split(' ');
            else
                next.classes = [];
        }
        parentChange(name, next);
    };
    const icon = value.type === 'poi' ? (React.createElement("label", null,
        "icon",
        React.createElement("input", { list: "icon_list", name: "icon", value: value.icon || '', onChange: onChange }),
        React.createElement("datalist", { id: "icon_list" },
            React.createElement("option", { value: "assets/poi.svg" }, "assets/poi.svg")))) : null;
    const anchor = (React.createElement("div", { className: "semantic-tag" },
        React.createElement("span", null, "anchor"),
        React.createElement("span", { className: "position" },
            React.createElement("label", null,
                "x",
                React.createElement("input", { type: "number", name: "anchor_x", value: value.anchor?.x ?? '', onChange: onChange })),
            React.createElement("label", null,
                "y",
                React.createElement("input", { type: "number", name: "anchor_y", value: value.anchor?.y ?? '', onChange: onChange })))));
    const classes = (React.createElement("label", null,
        "classes",
        React.createElement("input", { name: "classes", value: value.classes?.join(' ') ?? '', onChange: onChange, placeholder: "class1 class2" })));
    return (React.createElement("div", { className: "marker-editor-secondary" },
        base.key,
        base.label,
        icon,
        base.detail,
        base.position,
        anchor,
        base.minDistance,
        base.maxDistance,
        base.sorting,
        base.listed,
        classes));
}

function swapUp(value, index) {
    if (index <= 0)
        return value;
    if (index >= value.length)
        return value;
    const result = [...value];
    const temp = result[index - 1];
    result[index - 1] = result[index];
    result[index] = temp;
    return result;
}
function swapDown(value, index) {
    if (index < 0)
        return value;
    if (index >= value.length - 1)
        return value;
    const result = [...value];
    const temp = result[index + 1];
    result[index + 1] = result[index];
    result[index] = temp;
    return result;
}

function ColorEdit({ value, onChange: parentChange, color: type }) {
    let color;
    if (type === 'fillColor' && value.type !== 'line')
        color = value.fillColor;
    if (type === 'lineColor')
        color = value.lineColor;
    const onChange = (e) => {
        const field = e.currentTarget;
        const next = { ...value };
        if (field.name === 'color_enabled') {
            if (field.checked)
                color = { r: 255, g: 255, b: 255, a: 1 };
            else
                color = undefined;
        }
        else if (field.name === 'color') {
            const [r, g, b] = hexToColor(field.value);
            color = { r, g, b, a: color?.a ?? 1 };
        }
        else if (field.name === 'color_alpha') {
            color = {
                r: color?.r ?? 255,
                g: color?.g ?? 255,
                b: color?.b ?? 255,
                a: field.valueAsNumber,
            };
        }
        if (type === 'fillColor' && next.type !== 'line')
            next.fillColor = color;
        if (type === 'lineColor')
            next.lineColor = color;
        parentChange(next);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("label", null,
            React.createElement("span", null,
                type,
                React.createElement("input", { name: "color_enabled", className: "sole-icon field-action", type: "checkbox", checked: !!color, onChange: onChange })),
            React.createElement("input", { type: "color", name: "color", disabled: !color, value: color ? colorToHex(color) : '#ffffff', onChange: onChange })),
        color ? (React.createElement("label", null,
            type,
            "(alpha)",
            React.createElement("input", { type: "range", min: 0, step: 0.01, max: 1, name: "color_alpha", value: color?.a ?? 1, onChange: onChange }))) : null));
}
function colorToHex(color) {
    return `#${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b
        .toString(16)
        .padStart(2, '0')}`;
}
function hexToColor(color) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return [r, g, b];
}

function useOpenableMarkEdit({ value, onChange: submit }) {
    const onChange = (e) => {
        const field = e.currentTarget;
        const next = { ...value };
        if (field.name === 'link') {
            if (field.value)
                next.link = field.value;
            else
                delete next.link;
        }
        else if (field.name === 'newTab') {
            next.newTab = field.checked;
        }
        submit(next);
    };
    return {
        link: (React.createElement("label", null,
            "link",
            React.createElement("input", { name: "link", type: "url", value: value.link || '', onChange: onChange }))),
        newTab: (React.createElement("label", null,
            "newTab",
            React.createElement("input", { type: "checkbox", name: "newTab", className: "field-action", checked: value.newTab ?? true, onChange: onChange }))),
    };
}

function ShapeMarkEdit(props) {
    const { value, name, onChange: submit, onDelete } = props;
    const onMarkerChange = (marker) => submit(name, marker);
    const { useAct } = useActSetup();
    const base = useBaseMarkEdit(props, useAct);
    const link = useOpenableMarkEdit({ value, onChange: onMarkerChange });
    const [picking, startPicking, stopPicking] = useAct('pick line');
    const { pickPosition } = react.useContext(BluemapContext);
    const onChange = (e) => {
        const field = e.currentTarget;
        const next = { ...value };
        if (field.name.startsWith('line_') && next.type === 'line') {
            if (isNaN(field.valueAsNumber))
                return field.setCustomValidity('Invalid number');
            const [, axis, order] = field.name.split('_');
            const index = parseInt(order);
            if (isNaN(index))
                return;
            next.line = next.line.map((point, i) => (i === index ? { ...point, [axis]: field.valueAsNumber } : point));
        }
        else if (field.name === 'lineWidth') {
            if (isNaN(field.valueAsNumber))
                delete next.lineWidth;
            else
                next.lineWidth = field.valueAsNumber;
        }
        else if (field.name === 'shapeY' && next.type === 'shape') {
            if (isNaN(field.valueAsNumber))
                return field.setCustomValidity('Invalid number');
            next.shapeY = field.valueAsNumber;
        }
        else if ((field.name === 'shapeMinY' || field.name === 'shapeMaxY') && next.type === 'extrude') {
            if (isNaN(field.valueAsNumber))
                return field.setCustomValidity('Invalid number');
            next[field.name] = field.valueAsNumber;
        }
        else if (field.name === 'depthTest') {
            if (field.checked)
                next.depthTest = true;
            else
                delete next.depthTest;
        }
        field.setCustomValidity('');
        submit(name, next);
    };
    const onAppendLinePoints = () => {
        if (picking)
            return stopPicking();
        const next = { ...value };
        submit(name, next);
        startPicking((signal) => {
            async function pick() {
                if (signal.aborted)
                    return;
                const [x, y, z] = await pickPosition(signal);
                if (next.type !== 'line')
                    throw new Error('marker is not a line');
                next.line = next.line.concat({ x, y, z });
                onDelete();
                submit(name, next);
                return pick();
            }
            pick().catch(() => { });
        });
    };
    const onAppendShapePoints = () => {
        if (picking)
            return stopPicking();
        const next = { ...value };
        submit(name, next);
        startPicking((signal) => {
            async function pick() {
                if (signal.aborted)
                    return;
                const [x, , z] = await pickPosition(signal);
                if (next.type === 'line')
                    throw new Error('marker is a line');
                next.shape = next.shape.concat({ x, z });
                onDelete();
                submit(name, next);
                return pick();
            }
            pick().catch(() => { });
        });
    };
    const line = value.type === 'line' ? (React.createElement(React.Fragment, null,
        React.createElement("label", null,
            "line",
            React.createElement("button", { type: "button", onClick: onAppendLinePoints }, picking ? 'Stop' : 'Append point')),
        value.line.map((point, index, all) => {
            return (React.createElement("label", null,
                React.createElement("span", null,
                    "line-",
                    index,
                    React.createElement(DeleteIcon, { onClick: () => {
                            const next = { ...value };
                            next.line = next.line.filter((a, i) => i !== index);
                            submit(name, next);
                        }, className: "sole-icon field-action", role: "button" }),
                    React.createElement(PinIcon, { onClick: () => {
                            pickPosition(new AbortController().signal).then(([x, y, z]) => {
                                const next = { ...value };
                                next.line = next.line.map((a, i) => (i === index ? { x, y, z } : a));
                                submit(name, next);
                            });
                        }, className: "sole-icon field-action", role: "button" }),
                    React.createElement(DownIcon, { onClick: () => {
                            const next = { ...value };
                            next.line = swapDown(value.line, index);
                            submit(name, next);
                        }, "aria-disabled": index === all.length - 1, className: "sole-icon field-action", role: "button" }),
                    React.createElement(UpIcon, { onClick: () => {
                            const next = { ...value };
                            next.line = swapUp(value.line, index);
                            submit(name, next);
                        }, "aria-disabled": index === 0, className: "sole-icon field-action", role: "button" })),
                React.createElement("span", { className: "position" },
                    React.createElement("label", null,
                        "x",
                        React.createElement("input", { type: "number", name: 'line_x_' + index, value: point.x, onChange: onChange })),
                    React.createElement("label", null,
                        "y",
                        React.createElement("input", { type: "number", name: 'line_y_' + index, value: point.y, onChange: onChange })),
                    React.createElement("label", null,
                        "z",
                        React.createElement("input", { type: "number", name: 'line_z_' + index, value: point.z, onChange: onChange })))));
        }))) : null;
    const shape = value.type !== 'line' ? (React.createElement(React.Fragment, null,
        React.createElement("label", null,
            "shape",
            React.createElement("button", { type: "button", onClick: onAppendShapePoints }, picking ? 'Stop' : 'Append point')),
        value.shape.map((point, index, all) => {
            return (React.createElement("label", null,
                React.createElement("span", null,
                    "line-",
                    index,
                    React.createElement(DeleteIcon, { onClick: () => {
                            const next = { ...value };
                            next.shape = next.shape.filter((a, i) => i !== index);
                            submit(name, next);
                        }, className: "sole-icon field-action", role: "button" }),
                    React.createElement(PinIcon, { onClick: () => {
                            pickPosition(new AbortController().signal).then(([x, y, z]) => {
                                const next = { ...value };
                                next.shape = next.shape.map((a, i) => (i === index ? { x, y, z } : a));
                                submit(name, next);
                            });
                        }, className: "sole-icon field-action", role: "button" }),
                    React.createElement(DownIcon, { onClick: () => {
                            const next = { ...value };
                            next.shape = swapDown(value.shape, index);
                            submit(name, next);
                        }, "aria-disabled": index === all.length - 1, className: "sole-icon field-action", role: "button" }),
                    React.createElement(UpIcon, { onClick: () => {
                            const next = { ...value };
                            next.shape = swapUp(value.shape, index);
                            submit(name, next);
                        }, "aria-disabled": index === 0, className: "sole-icon field-action", role: "button" })),
                React.createElement("span", { className: "position" },
                    React.createElement("label", null,
                        "x",
                        React.createElement("input", { type: "number", name: 'line_x_' + index, value: point.x, onChange: onChange })),
                    React.createElement("label", null,
                        "z",
                        React.createElement("input", { type: "number", name: 'line_z_' + index, value: point.z, onChange: onChange })))));
        }))) : null;
    const lineWidth = (React.createElement("label", null,
        "lineWidth",
        React.createElement("input", { type: "number", min: 0, name: "lineWidth", value: value.lineWidth ?? '', onChange: onChange })));
    const shapeY = value.type === 'shape' ? (React.createElement("label", null,
        React.createElement("span", null, "shapeY"),
        React.createElement("input", { name: "shapeY", type: "number", value: value.shapeY, onChange: onChange }))) : null;
    const shapeMinXMinY = value.type === 'extrude' ? (React.createElement(React.Fragment, null,
        React.createElement("label", null,
            React.createElement("span", null, "shapeMinY"),
            React.createElement("input", { name: "shapeMinY", type: "number", value: value.shapeMinY, onChange: onChange })),
        React.createElement("label", null,
            React.createElement("span", null, "shapeMaxY"),
            React.createElement("input", { name: "shapeMaxY", type: "number", value: value.shapeMaxY, onChange: onChange })))) : null;
    const lineColor = React.createElement(ColorEdit, { value: value, color: "lineColor", onChange: onMarkerChange });
    const fillColor = value.type === 'line' ? null : React.createElement(ColorEdit, { value: value, color: "fillColor", onChange: onMarkerChange });
    const depthTest = (React.createElement("label", null,
        "depthTest",
        React.createElement("input", { type: "checkbox", name: "depthTest", checked: value.depthTest ?? false, onChange: onChange })));
    return (React.createElement("div", { className: "marker-editor-secondary" },
        base.key,
        base.label,
        base.detail,
        base.position,
        link.link,
        link.newTab,
        line,
        shape,
        shapeY,
        shapeMinXMinY,
        lineWidth,
        lineColor,
        fillColor,
        depthTest,
        base.minDistance,
        base.maxDistance,
        base.sorting,
        base.listed));
}

/// <reference path="../../marker-editor/global.d.ts" />
const iconMap = {
    poi: React.createElement(PinIcon, { className: "type-icon" }),
    html: React.createElement(CodeIcon, { className: "type-icon" }),
    line: React.createElement(LineIcon, { className: "type-icon" }),
    shape: React.createElement(TwoDIcon, { className: "type-icon" }),
    extrude: React.createElement(ThreeDIcon, { className: "type-icon" }),
};
const MarkerEditor = react.memo(function MarkerRender({ marker, name, onChange, onDelete, onSwapDown, onSwapUp, isNameUsed, }) {
    const { globalEditingReference, setGlobalEditingReference, portal } = react.useContext(InternalContext);
    const localEditReference = react.useRef({ marker, initialKey: name });
    localEditReference.current.marker = marker;
    if (localEditReference.current !== globalEditingReference &&
        localEditReference.current.marker === globalEditingReference?.marker) {
        // we just edit the @@key, the reference changed but inner value is the same. let's recover it
        localEditReference.current = globalEditingReference;
    }
    const localOnChange = (selfKey, marker) => {
        onChange(selfKey, marker);
        if (globalEditingReference === localEditReference.current) {
            globalEditingReference.marker = marker;
        }
    };
    const { mapViewerGotoPosition } = react.useContext(BluemapContext);
    const onMove = (e) => {
        e.preventDefault();
        mapViewerGotoPosition(marker.position.x, undefined, marker.position.z);
    };
    return (React.createElement("li", { className: "semantic-tag marker" },
        React.createElement(UpIcon, { className: "sole-icon", "aria-disabled": !onSwapUp, onClick: onSwapUp, role: "button" }),
        React.createElement(DownIcon, { className: "sole-icon", "aria-disabled": !onSwapDown, onClick: onSwapDown, role: "button" }),
        React.createElement(EditIcon, { className: "sole-icon", role: "button", onClick: () => {
                if (localEditReference.current === globalEditingReference)
                    setGlobalEditingReference(null);
                else
                    setGlobalEditingReference(localEditReference.current);
            } }),
        React.createElement("a", { href: "#", onClick: onMove },
            marker.label,
            React.createElement("var", null,
                "(",
                iconMap[marker.type],
                " ",
                name,
                ")")),
        React.createElement(DeleteIcon, { className: "sole-icon", role: "button", onClick: onDelete }),
        globalEditingReference === localEditReference.current ||
            globalEditingReference?.marker === localEditReference.current.marker
            ? reactDom.createPortal(marker.type === 'poi' || marker.type === 'html' ? (React.createElement(PointMarkEdit, { isNameUsed: isNameUsed, onChange: localOnChange, name: name, value: marker })) : (React.createElement(ShapeMarkEdit, { onDelete: onDelete, isNameUsed: isNameUsed, onChange: localOnChange, name: name, value: marker })), portal)
            : null));
});
const defaultValue = {
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
};
const MarkerCreateForm = react.memo(react.forwardRef((props, ref) => {
    const form = react.useRef(null);
    return (React.createElement("dialog", { ref: ref },
        React.createElement("h1", null, "Create Marker"),
        React.createElement("form", { ref: form, method: "dialog", className: "marker-info", onSubmit: (event) => {
                const formData = getFormData(form.current);
                if (props.isNameUsed(formData.name.value)) {
                    formData.name.setCustomValidity('Key already exists');
                    event.currentTarget.reportValidity();
                    event.preventDefault();
                    return;
                }
                const type = form.current.elements.namedItem('type').value;
                props.onSubmit(event, formData.name.value, defaultValue[type]);
            } },
            React.createElement("label", null,
                "type:",
                React.createElement("span", null,
                    React.createElement("label", null,
                        React.createElement("input", { type: "radio", name: "type", value: "poi" }),
                        "poi"),
                    React.createElement("label", null,
                        React.createElement("input", { type: "radio", name: "type", value: "html" }),
                        "html"),
                    React.createElement("label", null,
                        React.createElement("input", { type: "radio", name: "type", value: "line" }),
                        "line"),
                    React.createElement("label", null,
                        React.createElement("input", { type: "radio", name: "type", value: "shape", defaultChecked: true }),
                        "shape"),
                    React.createElement("label", null,
                        React.createElement("input", { type: "radio", name: "type", value: "extrude" }),
                        "extrude"))),
            React.createElement("label", null,
                "@@key:",
                React.createElement("input", { name: "name", minLength: 1, defaultValue: "default-marker", onChange: ({ currentTarget }) => {
                        const value = currentTarget.value;
                        if (props.isNameUsed(value))
                            currentTarget.setCustomValidity('Key already exists');
                        else
                            currentTarget.setCustomValidity('');
                    } })),
            React.createElement("span", null),
            React.createElement("span", { className: "action" },
                React.createElement("button", { type: "button", onClick: props.onClose }, "Close"),
                React.createElement("button", { type: "submit" }, "Save")))));
}));
MarkerCreateForm.displayName = 'MarkerCreateForm';

const AddIcon = (props) => (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", height: "1em", viewBox: "0 0 24 24", width: "1em", fill: "currentColor", ...props },
    React.createElement("path", { d: "M0 0h24v24H0z", fill: "none" }),
    React.createElement("path", { d: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" })));

const MarkerSetEditor = react.memo(({ value, name, defaultExpanded, onChange, onSwapDown, onSwapUp, onDelete, isNameUsed }) => {
    const { globalEditingReference } = react.useContext(InternalContext);
    const editSelf = react.useRef(null);
    const addNew = react.useRef(null);
    const onDialogClose = () => editSelf.current.close();
    const onEditButton = (e) => {
        e.preventDefault();
        openAndClearValidity(editSelf.current);
    };
    const onSubmitEditSelf = (event, form) => {
        onChange(form.name.value, {
            label: form.label.value,
            markers: value.markers,
            sorting: form.sorting.valueAsNumber,
            defaultHidden: form.defaultHidden.checked,
            toggleable: form.toggleable.checked,
        });
        onDialogClose();
        event.currentTarget.reset();
    };
    const onNewMarker = (event, key, newMarker) => {
        onChange(name, { ...value, markers: { ...value.markers, [key]: newMarker } });
        addNew.current.close();
        event.currentTarget.reset();
    };
    return (React.createElement("li", { className: "semantic-tag" },
        React.createElement("details", { open: defaultExpanded },
            React.createElement("summary", null,
                React.createElement(UpIcon, { className: "sole-icon", "aria-disabled": !onSwapUp, onClick: (e) => (e.preventDefault(), onSwapUp?.()), role: "button" }),
                React.createElement(DownIcon, { className: "sole-icon", "aria-disabled": !onSwapDown, onClick: (e) => (e.preventDefault(), onSwapDown?.()), role: "button" }),
                React.createElement(EditIcon, { className: "sole-icon", role: "button", onClick: onEditButton }),
                value.label,
                React.createElement("var", null,
                    "(",
                    name,
                    ")"),
                React.createElement(AddIcon, { className: "sole-icon", role: "button", onClick: (e) => (e.preventDefault(), addNew.current.showModal()) }),
                React.createElement(DeleteIcon, { className: "sole-icon", "aria-disabled": !!Object.keys(value.markers).length, role: "button", onClick: (e) => (e.preventDefault(), onDelete()) }),
                React.createElement(MarkerSetEditForm, { ref: editSelf, title: "Edit marker set", isNameUsed: isNameUsed, onSubmit: onSubmitEditSelf, onClose: onDialogClose, defaultKey: name, defaultLabel: value.label, defaultSorting: value.sorting, defaultDefaultHidden: value.defaultHidden, defaultToggleable: value.toggleable }),
                React.createElement(MarkerCreateForm, { ref: addNew, isNameUsed: (name) => name in value.markers, onClose: () => addNew.current.close(), onSubmit: onNewMarker })),
            React.createElement("ul", { className: "semantic-tag" }, Object.entries(value.markers).map(([key, marker], index, entries) => {
                function onSwapUp() {
                    return onChange(name, Object.assign({}, value, {
                        markers: Object.fromEntries(swapUp(entries, index)),
                    }));
                }
                function onSwapDown() {
                    return onChange(name, Object.assign({}, value, {
                        markers: Object.fromEntries(swapDown(entries, index)),
                    }));
                }
                const editingKey = globalEditingReference?.marker === marker &&
                    (value.markers[globalEditingReference.initialKey] === marker ||
                        !value.markers[globalEditingReference.initialKey])
                    ? globalEditingReference.initialKey
                    : key;
                return (React.createElement(MarkerEditor, { onDelete: () => {
                        const next = { ...value };
                        delete next.markers[key];
                        onChange(name, next);
                    }, onChange: (newKey, newValue) => {
                        const next = entries;
                        next[index] = [newKey, newValue];
                        onChange(name, { ...value, markers: Object.fromEntries(next) });
                    }, isNameUsed: (name) => name in value.markers, onSwapUp: index > 0 ? onSwapUp : undefined, onSwapDown: index < entries.length - 1 ? onSwapDown : undefined, key: editingKey, name: key, marker: marker }));
            })))));
});
MarkerSetEditor.displayName = 'MarkerSetEditor';
const MarkerSetEditForm = react.memo(react.forwardRef((props, ref) => {
    const form = react.useRef(null);
    return (React.createElement("dialog", { ref: ref, key: [
            props.defaultKey,
            props.defaultLabel,
            props.defaultSorting,
            props.defaultDefaultHidden,
            props.defaultToggleable,
        ].join('') },
        React.createElement("h1", null, props.title),
        React.createElement("form", { ref: form, method: "dialog", className: "set-info", onSubmit: (event) => {
                const formData = getFormData(form.current);
                if (formData.name.value !== props.defaultKey && props.isNameUsed(formData.name.value)) {
                    formData.name.setCustomValidity('Key already exists');
                    event.currentTarget.reportValidity();
                    event.preventDefault();
                    return;
                }
                props.onSubmit(event, formData);
            } },
            React.createElement("label", null,
                "@@key:",
                React.createElement("input", { name: "name", minLength: 1, defaultValue: props.defaultKey ?? 'default-set', onChange: ({ currentTarget }) => {
                        const value = currentTarget.value;
                        if (currentTarget.value !== props.defaultKey && props.isNameUsed(value))
                            currentTarget.setCustomValidity('Key already exists');
                        else
                            currentTarget.setCustomValidity('');
                    } })),
            React.createElement("label", null,
                "label:",
                React.createElement("input", { name: "label", minLength: 1, defaultValue: props.defaultLabel ?? 'Default Set' })),
            React.createElement("label", null,
                "sorting:",
                React.createElement("input", { name: "sorting", type: "number", defaultValue: props.defaultSorting ?? 0 })),
            React.createElement("label", null,
                "defaultHidden:",
                React.createElement("span", null,
                    React.createElement("input", { name: "defaultHidden", type: "checkbox", defaultChecked: props.defaultDefaultHidden ?? false }))),
            React.createElement("label", null,
                "toggleable:",
                React.createElement("span", null,
                    React.createElement("input", { name: "toggleable", type: "checkbox", defaultChecked: props.defaultToggleable ?? true }))),
            React.createElement("span", null),
            React.createElement("span", { className: "action" },
                React.createElement("button", { type: "button", onClick: props.onClose }, "Close"),
                React.createElement("button", { type: "submit" }, "Save")))));
}));
MarkerSetEditForm.displayName = 'MarkerSetEditForm';

const DownloadIcon = (props) => (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", height: "1em", viewBox: "0 0 24 24", width: "1em", fill: "currentColor", ...props },
    React.createElement("path", { d: "M0 0h24v24H0z", fill: "none" }),
    React.createElement("path", { d: "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" })));

const SaveIcon = (props) => (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", height: "1em", viewBox: "0 0 24 24", width: "1em", fill: "currentColor", ...props },
    React.createElement("path", { d: "M0 0h24v24H0z", fill: "none" }),
    React.createElement("path", { d: "M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" })));

const CloseIcon = (props) => (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", height: "1em", viewBox: "0 0 24 24", width: "1em", fill: "currentColor", ...props },
    React.createElement("path", { d: "M0 0h24v24H0z", fill: "none" }),
    React.createElement("path", { d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" })));

const MarkerFileEditor = react.memo(({ file, onChange }) => {
    const newDialog = react.useRef(null);
    const codeEditorDialog = react.useRef(null);
    const onNewMarkerSubmit = (event, form) => {
        const next = {
            label: form.label.value,
            markers: {},
            sorting: form.sorting.valueAsNumber,
            defaultHidden: form.defaultHidden.checked,
            toggleable: form.toggleable.checked,
        };
        onChange({
            ...file,
            [form.name.value]: next,
        });
        event.currentTarget.reset();
    };
    const isNameUsed = react.useCallback((name) => name in file, [file]);
    return (React.createElement("main", null,
        React.createElement("button", { className: "icon-button span", onClick: () => openAndClearValidity(newDialog.current) },
            React.createElement(AddIcon, null),
            "New set"),
        React.createElement(MarkerSetEditForm, { ref: newDialog, title: "Create new marker set", isNameUsed: isNameUsed, onSubmit: onNewMarkerSubmit, onClose: () => newDialog.current.close() }),
        React.createElement("button", { className: "icon-button", onClick: () => codeEditorDialog.current.showModal() },
            React.createElement(CodeIcon, null),
            "Code editor"),
        React.createElement("dialog", { className: "code-editor", ref: codeEditorDialog },
            React.createElement(CodeEditor, { onClose: () => codeEditorDialog.current.close(), file: file, onChange: onChange })),
        React.createElement("ul", { className: "semantic-tag" }, Object.entries(file).map(([key, value], index) => (React.createElement(MarkerSetEditor, { key: key, isNameUsed: isNameUsed, onChange: (newKey, newValue) => {
                const nextFile = Object.entries(file);
                nextFile[index] = [newKey, newValue];
                onChange(Object.fromEntries(nextFile));
            }, onSwapUp: index > 0
                ? () => onChange(Object.fromEntries(swapUp(Object.entries(file), index)))
                : undefined, onSwapDown: index < Object.keys(file).length - 1
                ? () => onChange(Object.fromEntries(swapDown(Object.entries(file), index)))
                : undefined, onDelete: () => {
                const nextFile = Object.entries(file);
                nextFile.splice(index, 1);
                onChange(Object.fromEntries(nextFile));
            }, defaultExpanded: index === 0, name: key, value: value }))))));
});
MarkerFileEditor.displayName = 'MarkerFileEditor';
function CodeEditor({ file, onChange, onClose, }) {
    const stringifiedFile = JSON.stringify(file, undefined, 4);
    const textarea = react.useRef(null);
    const onDownload = () => {
        const blob = new Blob([stringifiedFile], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'marker-file.json';
        a.click();
    };
    const onSaveChange = () => {
        try {
            onChange(JSON.parse(textarea.current.value));
            onClose();
        }
        catch (e) {
            alert('Invalid JSON');
        }
    };
    return (React.createElement("div", null,
        React.createElement("div", null,
            React.createElement("button", { className: "icon-button", onClick: onDownload },
                React.createElement(DownloadIcon, null),
                "Download"),
            React.createElement("button", { className: "icon-button", onClick: onSaveChange },
                React.createElement(SaveIcon, null),
                "Save changes"),
            React.createElement("button", { className: "icon-button", onClick: onClose },
                React.createElement(CloseIcon, null),
                "Close")),
        React.createElement("textarea", { ref: textarea, key: stringifiedFile, spellCheck: false, rows: 99999, defaultValue: stringifiedFile })));
}

function Root({ file, onChange }) {
    const [portal, setPortal] = react.useState(null);
    const [globalEditingReference, setGlobalEditingReference] = react.useState(null);
    const context = {
        globalEditingReference,
        setGlobalEditingReference,
        portal,
    };
    return (React.createElement(InternalContext.Provider, { value: context },
        React.createElement("div", { className: "marker-editor" },
            React.createElement(MarkerFileEditor, { onChange: onChange, file: file }),
            React.createElement("div", { ref: setPortal }))));
}

const css = String.raw;
const style = css `
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
`;
//#region
let sheet;
if (undefined) {
    sheet = undefined.data.sheet ??= new CSSStyleSheet();
    undefined.accept();
}
else {
    sheet = new CSSStyleSheet();
}
sheet.replaceSync(style);
const styles = sheet;
//#endregion

let latestJson;
try {
    const old = localStorage.getItem('userscript-bluemap-marker-editor');
    if (old)
        latestJson = JSON.parse(old);
}
catch {
    latestJson = {};
}
function onInstall() {
    if (typeof bluemap !== 'object' || !bluemap.markerFileManager)
        return setTimeout(onInstall, 100);
    bluemap.markerFileManager.loadMarkerFile = async () => {
        return latestJson || {};
    };
    bluemap.markerFileManager.setAutoUpdateInterval = () => {
        bluemap.markerFileManager.update();
    };
}
onInstall();
const context = {
    mapViewerGotoPosition: (x, y, z) => {
        const mgr = bluemap.mapViewer.controlsManager;
        const Vector3 = mgr.position.constructor;
        mgr.position = new Vector3(x, y ?? mgr.position.y, z);
    },
    getDistance() {
        return Math.round(bluemap.mapViewer.controlsManager.distance);
    },
    pickPosition(signal) {
        return new Promise((resolve, reject) => {
            if (location.href.endsWith(':free')) {
                try {
                    ;
                    (document.querySelector('.controls-switch')?.children[0]).click();
                }
                catch {
                    alert('Cannot use free mode to pick position.');
                }
            }
            signal.addEventListener('abort', reject, { once: true });
            signal.addEventListener('abort', recoverClick, { once: true });
            const recoverClickSet = new Set();
            const preventPointerEvent = new Map();
            function preventClick(set) {
                set.markerSets.forEach(preventClick);
                set.markers.forEach((x) => {
                    if (x.type === 'Mesh')
                        return;
                    recoverClickSet.add(x);
                    Object.defineProperty(x, 'onClick', { configurable: true, enumerable: true, value: () => false });
                    const element = x.elementObject?.element;
                    if (element && element instanceof HTMLElement) {
                        preventPointerEvent.set(element, element.style.pointerEvents);
                        element.style.pointerEvents = 'none';
                        element.querySelectorAll('*').forEach((x) => {
                            if ((x instanceof HTMLElement || x instanceof SVGElement) &&
                                x.style.pointerEvents === 'auto') {
                                preventPointerEvent.set(x, x.style.pointerEvents);
                                x.style.pointerEvents = 'none';
                            }
                        });
                    }
                });
            }
            function recoverClick() {
                recoverClickSet.forEach((x) => Reflect.deleteProperty(x, 'onClick'));
                preventPointerEvent.forEach((old, x) => (x.style.pointerEvents = old));
            }
            preventClick(bluemap.mapViewer.markers);
            bluemap.events.addEventListener('bluemapMapInteraction', (event) => {
                event.stopImmediatePropagation();
                recoverClick();
                const point = event.detail?.hit?.point;
                if (!point) {
                    alert('bug!');
                    resolve([0, 0, 0]);
                }
                else
                    resolve([Math.round(point.x), Math.round(point.y), Math.round(point.z)]);
            }, { once: true, capture: true, signal });
        });
    },
};
function App() {
    const [file, setFile] = react.useState(latestJson || {});
    return (React.createElement(BluemapContext.Provider, { value: context },
        React.createElement(Root, { onChange: (file) => {
                setFile(file);
                latestJson = file;
                localStorage.setItem('userscript-bluemap-marker-editor', JSON.stringify(file));
                bluemap.markerFileManager.update();
            }, file: file })));
}
document.adoptedStyleSheets = [styles];
const ui = getSingleInjectPoint(new kit.LiveSelector().querySelector('.control-bar').enableSingleMode()).after;
ui.dataset['userscript'] = 'bluemap-marker-editor';
ui.addEventListener('keydown', (e) => e.stopPropagation());
ui.addEventListener('keyup', (e) => e.stopPropagation());
ui.addEventListener('keypress', (e) => e.stopPropagation());
client.createRoot(ui).render(React.createElement(react.StrictMode, null,
    React.createElement(App, null)));
function getSingleInjectPoint(selector) {
    return new kit.MutationObserverWatcher(selector).startWatch({ subtree: true, childList: true }).firstDOMProxy;
}

})(ReactDOM, React, ReactDOM, HoloflowsKit);
