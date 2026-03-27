import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BoardLayerGrid } from '../components/BoardLayerGrid'
import { useTile } from '../context/TileContext'
import {
  coordKey,
  flipTileAcrossLayers,
  isTileEmpty,
  pointsToSet,
  tileBounds,
  translatePoints,
} from '../lib/tile'
import type { CustomTile, GridPoint } from '../types'

const MIN_BOARD_SIZE = 10
const MAX_BOARD_SIZE = 30

function isInBounds(point: GridPoint, size: number) {
  return point.x >= 0 && point.y >= 0 && point.x < size && point.y < size
}

function getProjectedTile(tile: CustomTile, anchor: GridPoint) {
  return {
    layerTop: translatePoints(tile.layerTop, anchor),
    layerBottom: translatePoints(tile.layerBottom, anchor),
  }
}

function canPlaceTile(
  tile: CustomTile,
  anchor: GridPoint,
  size: number,
  coveredTop: Set<string>,
  coveredBottom: Set<string>,
) {
  if (isTileEmpty(tile)) {
    return false
  }

  const projected = getProjectedTile(tile, anchor)

  const topFits = projected.layerTop.every((point) => isInBounds(point, size))
  const bottomFits = projected.layerBottom.every((point) => isInBounds(point, size))

  if (!topFits || !bottomFits) {
    return false
  }

  const topClear = projected.layerTop.every((point) => !coveredTop.has(coordKey(point.x, point.y)))
  const bottomClear = projected.layerBottom.every(
    (point) => !coveredBottom.has(coordKey(point.x, point.y)),
  )

  return topClear && bottomClear
}

export function SimulatorPage() {
  const { tile } = useTile()
  const [boardSize, setBoardSize] = useState(MIN_BOARD_SIZE)
  const [coveredTop, setCoveredTop] = useState<Set<string>>(() => new Set())
  const [coveredBottom, setCoveredBottom] = useState<Set<string>>(() => new Set())
  const [hoverCell, setHoverCell] = useState<GridPoint | null>(null)
  const [isFlipped, setIsFlipped] = useState(false)

  const activeTile = isFlipped ? flipTileAcrossLayers(tile) : tile
  const bounds = tileBounds(activeTile)

  const projected = hoverCell ? getProjectedTile(activeTile, hoverCell) : null
  const topGhost = projected ? pointsToSet(projected.layerTop) : new Set<string>()
  const bottomGhost = projected ? pointsToSet(projected.layerBottom) : new Set<string>()
  const placementIsValid = hoverCell
    ? canPlaceTile(activeTile, hoverCell, boardSize, coveredTop, coveredBottom)
    : false

  function clampBoardSize(value: number) {
    return Math.min(MAX_BOARD_SIZE, Math.max(MIN_BOARD_SIZE, value))
  }

  function resetBoard(nextSize?: number) {
    setCoveredTop(new Set())
    setCoveredBottom(new Set())
    setHoverCell(null)

    if (typeof nextSize === 'number') {
      setBoardSize(nextSize)
    }
  }

  function handleBoardSizeChange(nextValue: number) {
    resetBoard(clampBoardSize(Math.floor(nextValue || MIN_BOARD_SIZE)))
  }

  function handlePlaceTile() {
    if (!hoverCell || !projected || !placementIsValid) {
      return
    }

    setCoveredTop((current) => {
      const next = new Set(current)

      for (const point of projected.layerTop) {
        next.add(coordKey(point.x, point.y))
      }

      return next
    })

    setCoveredBottom((current) => {
      const next = new Set(current)

      for (const point of projected.layerBottom) {
        next.add(coordKey(point.x, point.y))
      }

      return next
    })
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null
      const isTypingTarget =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement

      if (isTypingTarget) {
        return
      }

      if (event.key.toLowerCase() === 'f') {
        event.preventDefault()
        setIsFlipped((current) => !current)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const totalCovered = coveredTop.size + coveredBottom.size

  return (
    <div className="flex flex-col gap-5">
      <section className="panel p-5 sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-emerald-200/75">Page 2</p>
            <h2 className="section-title mt-3">The Simulator</h2>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-200/75">
              All controls now live above the boards so the dual-plane workspace can occupy as much
              of the screen as possible. Hover either grid to project the same anchor across both
              layers, and place only when both planes validate together.
            </p>
          </div>
          <div
            className={[
              'self-start rounded-full border px-4 py-2 text-sm font-semibold xl:self-auto',
              hoverCell
                ? placementIsValid
                  ? 'border-sky-200/40 bg-sky-300/10 text-sky-50'
                  : 'border-slate-300/20 bg-slate-700/40 text-slate-100'
                : 'border-white/10 bg-white/5 text-white/70',
            ].join(' ')}
          >
            {hoverCell
              ? placementIsValid
                ? `Ready at (${hoverCell.x}, ${hoverCell.y})`
                : `Blocked at (${hoverCell.x}, ${hoverCell.y})`
              : 'Move over the board to preview'}
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.95fr)]">
        <section className="panel p-5 sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/75">Board Controls</p>
                <p className="mt-2 text-sm leading-6 text-slate-200/75">
                  Vertical flip swaps the tile&apos;s top and bottom layers. Changing size resets
                  and synchronizes both boards together.
                </p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-100/80">
                Both boards: {boardSize} x {boardSize}
              </span>
            </div>

            <label className="space-y-3">
              <span className="text-sm font-semibold text-white">Board Size N</span>
              <input
                className="w-full accent-cyan-300"
                max={MAX_BOARD_SIZE}
                min={MIN_BOARD_SIZE}
                onChange={(event) => handleBoardSizeChange(event.currentTarget.valueAsNumber)}
                type="range"
                value={boardSize}
              />
              <div className="grid gap-3 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-center">
                <input
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none ring-0 transition focus:border-cyan-200/50"
                  max={MAX_BOARD_SIZE}
                  min={MIN_BOARD_SIZE}
                  onChange={(event) => handleBoardSizeChange(event.currentTarget.valueAsNumber)}
                  type="number"
                  value={boardSize}
                />
                <p className="text-sm leading-6 text-slate-200/70">
                  Range: {MIN_BOARD_SIZE}-{MAX_BOARD_SIZE}. Use the slider or type a value.
                </p>
              </div>
            </label>

            <div className="grid gap-3 sm:grid-cols-3">
              <button
                className="control-button"
                onClick={() => setIsFlipped((current) => !current)}
                type="button"
              >
                Vertical Flip ({isFlipped ? 'Flipped' : 'Original'}) · F
              </button>
              <button className="control-button" onClick={() => resetBoard()} type="button">
                Reset Board
              </button>
              <Link className="control-button text-center" to="/">
                Edit Tile
              </Link>
            </div>
          </div>
        </section>

        <section className="panel p-5 sm:p-6">
          <div className="flex flex-col gap-4">
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/75">Current Tile</p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="stat-card">
                <p className="text-sm text-slate-300/70">Top cells</p>
                <p className="mt-1 text-2xl font-semibold text-white">{activeTile.layerTop.length}</p>
              </div>
              <div className="stat-card">
                <p className="text-sm text-slate-300/70">Bottom cells</p>
                <p className="mt-1 text-2xl font-semibold text-white">
                  {activeTile.layerBottom.length}
                </p>
              </div>
              <div className="stat-card">
                <p className="text-sm text-slate-300/70">Footprint</p>
                <p className="mt-1 text-2xl font-semibold text-white">
                  {bounds.width} × {bounds.height}
                </p>
              </div>
              <div className="stat-card">
                <p className="text-sm text-slate-300/70">Covered cells</p>
                <p className="mt-1 text-2xl font-semibold text-white">{totalCovered}</p>
              </div>
            </div>

            {isTileEmpty(activeTile) ? (
              <p className="rounded-2xl border border-amber-200/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100/80">
                Your tile is empty. Return to the forge and activate at least one cell before
                placing.
              </p>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2 text-sm text-slate-100/80">
              <div className="flex items-center gap-3">
                <span className="h-4 w-4 rounded-full border border-emerald-100/20 bg-emerald-400/25" />
                Empty / uncovered
              </div>
              <div className="flex items-center gap-3">
                <span className="h-4 w-4 rounded-full border border-rose-100/30 bg-rose-400/20" />
                Already covered
              </div>
              <div className="flex items-center gap-3">
                <span className="h-4 w-4 rounded-full border border-sky-100/45 bg-sky-300/20" />
                Valid ghost
              </div>
              <div className="flex items-center gap-3">
                <span className="h-4 w-4 rounded-full border border-slate-300/20 bg-slate-800/75" />
                Invalid ghost
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="panel p-4 sm:p-5 lg:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-['Trebuchet_MS','Avenir_Next',sans-serif] text-xl font-semibold text-white">
              Dual-Plane Board
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-200/75">
              This is the main workspace, so the layout gives it the widest uninterrupted area on
              the page.
            </p>
          </div>
        </div>

        <div className="grid items-start gap-4 xl:grid-cols-2 xl:gap-5">
          <BoardLayerGrid
            covered={coveredTop}
            ghost={topGhost}
            ghostIsValid={placementIsValid}
            onHoverCell={(x, y) => setHoverCell({ x, y })}
            onLeave={() => setHoverCell(null)}
            onPlace={handlePlaceTile}
            size={boardSize}
            title="Top Layer"
          />
          <BoardLayerGrid
            covered={coveredBottom}
            ghost={bottomGhost}
            ghostIsValid={placementIsValid}
            onHoverCell={(x, y) => setHoverCell({ x, y })}
            onLeave={() => setHoverCell(null)}
            onPlace={handlePlaceTile}
            size={boardSize}
            title="Bottom Layer"
          />
        </div>
      </section>
    </div>
  )
}
