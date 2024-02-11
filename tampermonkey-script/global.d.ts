declare const React: typeof import('react')
declare const bluemap: {
    markerFileManager: null | {
        fileUrl: string
        update(): Promise<void>
        loadMarkerFile(): Promise<object>
        setAutoUpdateInterval(ms: number): void
    }
    events: HTMLDivElement
    mapViewer: {
        controlsManager: {
            position: __Vector3__
            distance: number
        }
        markers: BlueMapMarkerSet
    }
    popupMarkerSet: BlueMapMarkerSet
}
interface BlueMapMarkerSet {
    children: (BlueMapMarkerSet | BlueMapMarker)[]
    markerSets: Map<string, BlueMapMarkerSet>
    markers: Map<string, BlueMapMarker>
    visible: boolean
    type: string
}
interface BlueMapMarker {
    onClick?(): void
    visible: boolean
    type: string
    elementObject?: {
        element?: unknown
    }
}
declare class __Vector3__ {
    constructor(public x: number, public y: number, public z: number)
    ['constructor']: typeof __Vector3__
}
