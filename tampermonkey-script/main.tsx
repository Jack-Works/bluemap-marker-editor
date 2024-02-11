import { createRoot } from 'react-dom/client'
import { Root } from '../marker-editor/root.js'
import { BluemapContext } from '../marker-editor/hooks/io.js'
import styles from '../marker-editor/styles.js'
import { MutationObserverWatcher, LiveSelector } from '@holoflows/kit'
import { StrictMode, useState } from 'react'

let latestJson: object | undefined
try {
    const old = localStorage.getItem('userscript-bluemap-marker-editor')
    if (old) latestJson = JSON.parse(old)
} catch {
    latestJson = {}
}

function onInstall() {
    if (typeof bluemap !== 'object' || !bluemap.markerFileManager) return setTimeout(onInstall, 100)
    bluemap.markerFileManager.loadMarkerFile = async () => {
        return latestJson || {}
    }
    bluemap.markerFileManager.setAutoUpdateInterval = () => {
        bluemap.markerFileManager!.update()
    }
}
onInstall()

const context: BluemapContext = {
    mapViewerGotoPosition: (x, y, z) => {
        const mgr = bluemap.mapViewer.controlsManager
        const Vector3 = mgr.position.constructor
        mgr.position = new Vector3(x, y ?? mgr.position.y, z)
    },
    getDistance() {
        return Math.round(bluemap.mapViewer.controlsManager.distance)
    },
    pickPosition(signal) {
        return new Promise((resolve, reject) => {
            if (location.href.endsWith(':free')) {
                try {
                    ;(document.querySelector('.controls-switch')?.children[0] as HTMLElement).click()
                } catch {
                    alert('Cannot use free mode to pick position.')
                }
            }
            signal.addEventListener('abort', reject, { once: true })
            signal.addEventListener('abort', recoverClick, { once: true })

            const recoverClickSet = new Set<BlueMapMarker>()
            const preventPointerEvent = new Map<HTMLElement | SVGElement, string>()
            function preventClick(set: BlueMapMarkerSet) {
                set.markerSets.forEach(preventClick)
                set.markers.forEach((x) => {
                    if (x.type === 'Mesh') return
                    recoverClickSet.add(x)
                    Object.defineProperty(x, 'onClick', { configurable: true, enumerable: true, value: () => false })
                    const element = x.elementObject?.element
                    if (element && element instanceof HTMLElement) {
                        preventPointerEvent.set(element, element.style.pointerEvents)
                        element.style.pointerEvents = 'none'
                        element.querySelectorAll('*').forEach((x) => {
                            if (
                                (x instanceof HTMLElement || x instanceof SVGElement) &&
                                x.style.pointerEvents === 'auto'
                            ) {
                                preventPointerEvent.set(x, x.style.pointerEvents)
                                x.style.pointerEvents = 'none'
                            }
                        })
                    }
                })
            }
            function recoverClick() {
                recoverClickSet.forEach((x) => Reflect.deleteProperty(x, 'onClick'))
                preventPointerEvent.forEach((old, x) => (x.style.pointerEvents = old))
            }
            preventClick(bluemap.mapViewer.markers)
            bluemap.events.addEventListener(
                'bluemapMapInteraction',
                (event) => {
                    event.stopImmediatePropagation()
                    recoverClick()
                    const point = (event as CustomEvent).detail?.hit?.point
                    if (!point) {
                        alert('bug!')
                        resolve([0, 0, 0])
                    } else resolve([Math.round(point.x), Math.round(point.y), Math.round(point.z)])
                },
                { once: true, capture: true, signal }
            )
        })
    },
}

function App() {
    const [file, setFile] = useState<MarkerFile>((latestJson as MarkerFile) || {})
    return (
        <BluemapContext.Provider value={context}>
            <Root
                onChange={(file) => {
                    setFile(file)
                    latestJson = file
                    localStorage.setItem('userscript-bluemap-marker-editor', JSON.stringify(file))
                    bluemap.markerFileManager!.update()
                }}
                file={file}
            />
        </BluemapContext.Provider>
    )
}
document.adoptedStyleSheets = [styles]
const ui = getSingleInjectPoint(new LiveSelector().querySelector('.control-bar').enableSingleMode()).after
ui.dataset['userscript'] = 'bluemap-marker-editor'
ui.addEventListener('keydown', (e) => e.stopPropagation())
ui.addEventListener('keyup', (e) => e.stopPropagation())
ui.addEventListener('keypress', (e) => e.stopPropagation())

createRoot(ui).render(
    <StrictMode>
        <App />
    </StrictMode>
)

function getSingleInjectPoint(selector: LiveSelector<Element, true>) {
    return new MutationObserverWatcher(selector).startWatch({ subtree: true, childList: true }).firstDOMProxy
}
