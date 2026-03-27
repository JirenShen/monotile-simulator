export type GridPoint = {
  x: number
  y: number
}

export type CustomTile = {
  layerTop: GridPoint[]
  layerBottom: GridPoint[]
}

export type LayerName = 'top' | 'bottom'
