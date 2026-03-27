import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react'
import type { CustomTile } from '../types'
import { normalizeTile } from '../lib/tile'

type TileContextValue = {
  tile: CustomTile
  setTile: (tile: CustomTile) => void
}

const STORAGE_KEY = 'monotile.custom-tile'

const defaultTile: CustomTile = {
  layerTop: [{ x: 0, y: 0 }],
  layerBottom: [{ x: 0, y: 0 }],
}

const TileContext = createContext<TileContextValue | undefined>(undefined)

function isValidPoint(value: unknown): value is { x: number; y: number } {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as { x?: unknown; y?: unknown }

  return typeof candidate.x === 'number' && typeof candidate.y === 'number'
}

function parseStoredTile() {
  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY)

    if (!rawValue) {
      return defaultTile
    }

    const parsed = JSON.parse(rawValue) as Partial<CustomTile>
    const layerTop = Array.isArray(parsed.layerTop) ? parsed.layerTop.filter(isValidPoint) : []
    const layerBottom = Array.isArray(parsed.layerBottom)
      ? parsed.layerBottom.filter(isValidPoint)
      : []

    const nextTile = normalizeTile({ layerTop, layerBottom })
    return nextTile.layerTop.length || nextTile.layerBottom.length ? nextTile : defaultTile
  } catch {
    return defaultTile
  }
}

export function TileProvider({ children }: PropsWithChildren) {
  const [tile, setTileState] = useState<CustomTile>(() => parseStoredTile())

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tile))
  }, [tile])

  const value: TileContextValue = {
    tile,
    setTile: (nextTile) => setTileState(normalizeTile(nextTile)),
  }

  return <TileContext.Provider value={value}>{children}</TileContext.Provider>
}

export function useTile() {
  const context = useContext(TileContext)

  if (!context) {
    throw new Error('useTile must be used within a TileProvider')
  }

  return context
}
