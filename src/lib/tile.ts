import type { CustomTile, GridPoint } from '../types'

export function coordKey(x: number, y: number) {
  return `${x},${y}`
}

export function pointToKey(point: GridPoint) {
  return coordKey(point.x, point.y)
}

function dedupeAndSort(points: GridPoint[]) {
  const unique = new Map<string, GridPoint>()

  for (const point of points) {
    unique.set(pointToKey(point), point)
  }

  return [...unique.values()].sort((left, right) => {
    if (left.y !== right.y) {
      return left.y - right.y
    }

    return left.x - right.x
  })
}

export function normalizeTile(tile: CustomTile): CustomTile {
  const allPoints = [...tile.layerTop, ...tile.layerBottom]

  if (allPoints.length === 0) {
    return { layerTop: [], layerBottom: [] }
  }

  const minX = Math.min(...allPoints.map((point) => point.x))
  const minY = Math.min(...allPoints.map((point) => point.y))

  const normalize = (points: GridPoint[]) =>
    dedupeAndSort(
      points.map((point) => ({
        x: point.x - minX,
        y: point.y - minY,
      })),
    )

  return {
    layerTop: normalize(tile.layerTop),
    layerBottom: normalize(tile.layerBottom),
  }
}

export function flipTileAcrossLayers(tile: CustomTile): CustomTile {
  return normalizeTile({
    layerTop: tile.layerBottom,
    layerBottom: tile.layerTop,
  })
}

export function tileBounds(tile: CustomTile) {
  const allPoints = [...tile.layerTop, ...tile.layerBottom]

  if (allPoints.length === 0) {
    return { width: 0, height: 0 }
  }

  const maxX = Math.max(...allPoints.map((point) => point.x))
  const maxY = Math.max(...allPoints.map((point) => point.y))

  return {
    width: maxX + 1,
    height: maxY + 1,
  }
}

export function translatePoints(points: GridPoint[], anchor: GridPoint) {
  return points.map((point) => ({
    x: point.x + anchor.x,
    y: point.y + anchor.y,
  }))
}

export function isTileEmpty(tile: CustomTile) {
  return tile.layerTop.length === 0 && tile.layerBottom.length === 0
}

export function setToPoints(cellSet: Set<string>) {
  return [...cellSet].map((value) => {
    const [x, y] = value.split(',').map(Number)

    return { x, y }
  })
}

export function pointsToSet(points: GridPoint[]) {
  return new Set(points.map(pointToKey))
}
