import { useState, type Dispatch, type SetStateAction } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayerEditorGrid } from '../components/LayerEditorGrid'
import { useTile } from '../context/TileContext'
import { coordKey, normalizeTile, setToPoints, tileBounds } from '../lib/tile'

const editorSize = 5

function makeLayerSet(points: { x: number; y: number }[]) {
  return new Set(points.map((point) => coordKey(point.x, point.y)))
}

export function ForgePage() {
  const navigate = useNavigate()
  const { tile, setTile } = useTile()
  const [topCells, setTopCells] = useState<Set<string>>(() => makeLayerSet(tile.layerTop))
  const [bottomCells, setBottomCells] = useState<Set<string>>(() => makeLayerSet(tile.layerBottom))

  const totalCells = topCells.size + bottomCells.size
  const normalizedPreview = normalizeTile({
    layerTop: setToPoints(topCells),
    layerBottom: setToPoints(bottomCells),
  })
  const bounds = tileBounds(normalizedPreview)

  function toggleCell(
    updater: Dispatch<SetStateAction<Set<string>>>,
    x: number,
    y: number,
  ) {
    const key = coordKey(x, y)

    updater((current) => {
      const next = new Set(current)

      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }

      return next
    })
  }

  function handleSaveAndPlay() {
    const nextTile = normalizeTile({
      layerTop: setToPoints(topCells),
      layerBottom: setToPoints(bottomCells),
    })

    setTile(nextTile)
    navigate('/simulate')
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.8fr)]">
      <section className="panel p-6 sm:p-7">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs uppercase tracking-[0.28em] text-emerald-700">Page 1</p>
            <h2 className="section-title">The Forge</h2>
            <p className="section-copy">
              Build one tile that exists across two layers. Each active cell becomes a relative
              coordinate, and the combined footprint is normalized before it enters the simulator.
            </p>
          </div>
          <button
            className="control-button-primary disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
            disabled={totalCells === 0}
            onClick={handleSaveAndPlay}
            type="button"
          >
            Save &amp; Play
          </button>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <LayerEditorGrid
            cells={topCells}
            onToggle={(x, y) => toggleCell(setTopCells, x, y)}
            size={editorSize}
            title="Top Layer"
          />
          <LayerEditorGrid
            cells={bottomCells}
            onToggle={(x, y) => toggleCell(setBottomCells, x, y)}
            size={editorSize}
            title="Bottom Layer"
          />
        </div>
      </section>

      <aside className="flex flex-col gap-5">
        <section className="panel p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-sky-700">Tile Summary</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="stat-card">
              <p className="text-sm text-slate-600">Top cells (A)</p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">{topCells.size}</p>
            </div>
            <div className="stat-card">
              <p className="text-sm text-slate-600">Bottom cells (B)</p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">{bottomCells.size}</p>
            </div>
            <div className="stat-card">
              <p className="text-sm text-slate-600">Bounding width</p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">{bounds.width}</p>
            </div>
            <div className="stat-card">
              <p className="text-sm text-slate-600">Bounding height</p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">{bounds.height}</p>
            </div>
          </div>
        </section>

        <section className="panel p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-sky-700">Rules</p>
          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <p>Only translation and an A ↔ B swap between planes are allowed in the simulator.</p>
            <p>The ghost will always project onto both boards at the same anchor coordinate.</p>
            <p>
              Empty designs are blocked, but a tile may still occupy only one layer if that is the
              structure you want to test.
            </p>
          </div>
        </section>
      </aside>
    </div>
  )
}
