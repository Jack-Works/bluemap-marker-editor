interface ImportMeta {
    hot?: any
}

interface MarkerFile {
    [key: string]: MarkerSet
}
interface MarkerSet {
    label: string
    toggleable: boolean
    defaultHidden: boolean
    sorting: number
    markers: Record<string, Marker>
}
type Marker = Marker_POI | Marker_HTML | Marker_Line | Marker_Shape | Marker_Extrude

interface MarkerBase {
    position: Position3D
    label: string
    sorting?: number
    listed?: boolean
    minDistance?: number
    maxDistance?: number
}
interface OpenableMark {
    link?: string
    newTab?: boolean
}
interface OutlinedMark {
    lineWidth?: number
    lineColor?: ColorRGBA
}
interface FilledMark {
    fillColor?: ColorRGBA
}
interface Marker_POI extends MarkerBase {
    type: 'poi'
    detail?: string
    icon?: string
    anchor?: Position2D_xy
    classes: string[]
}
interface Marker_HTML extends MarkerBase {
    type: 'html'
    html: string
    anchor?: Position2D_xy
    classes: string[]
}
interface Marker_Line extends MarkerBase, OpenableMark, OutlinedMark {
    type: 'line'
    line: Position3D[]
    detail?: string
    depthTest?: boolean
}
interface Marker_Shape extends MarkerBase, OpenableMark, OutlinedMark, FilledMark {
    type: 'shape'
    shape: Position2D_xz[]
    shapeY: number
    detail?: string
    depthTest?: boolean
}
interface Marker_Extrude extends MarkerBase, OpenableMark, OutlinedMark, FilledMark {
    type: 'extrude'
    shape: Position2D_xz[]
    shapeMinY: number
    shapeMaxY: number
    detail?: string
    depthTest?: boolean
}

interface Position2D_xy {
    x: number
    y: number
}
interface Position2D_xz {
    x: number
    z: number
}
interface Position3D {
    x: number
    y: number
    z: number
}
interface ColorRGBA {
    r: number
    g: number
    b: number
    a: number
}
