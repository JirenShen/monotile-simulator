import { coordKey } from '../lib/tile'

type BoardLayerGridProps = {
  title: string
  size: number
  covered: Set<string>
  ghost: Set<string>
  ghostIsValid: boolean
  onHoverCell: (x: number, y: number) => void
  onLeave: () => void
  onPlace: () => void
}

function getBoardMetrics(size: number) {
  if (size >= 28) {
    return { cellSize: 15, gapSize: 3, dotSize: 6 }
  }

  if (size >= 24) {
    return { cellSize: 17, gapSize: 4, dotSize: 7 }
  }

  if (size >= 18) {
    return { cellSize: 20, gapSize: 4, dotSize: 8 }
  }

  return { cellSize: 24, gapSize: 5, dotSize: 10 }
}

function cellClass(isCovered: boolean, isGhost: boolean, ghostIsValid: boolean) {
  if (isGhost) {
    return ghostIsValid
      ? 'border-sky-100/45 bg-sky-300/15 shadow-lg shadow-sky-950/25'
      : 'border-slate-300/20 bg-slate-800/55 shadow-lg shadow-slate-950/20'
  }

  return isCovered
    ? 'border-rose-100/30 bg-rose-400/10 shadow-md shadow-rose-950/15'
    : 'border-emerald-100/10 bg-emerald-400/5 hover:border-emerald-100/20 hover:bg-emerald-400/10'
}

function dotClass(isCovered: boolean, isGhost: boolean, ghostIsValid: boolean) {
  if (isGhost) {
    return ghostIsValid ? 'bg-sky-300/90' : 'bg-slate-500/80'
  }

  return isCovered ? 'bg-rose-400/95' : 'bg-emerald-400/75'
}

export function BoardLayerGrid({
  title,
  size,
  covered,
  ghost,
  ghostIsValid,
  onHoverCell,
  onLeave,
  onPlace,
}: BoardLayerGridProps) {
  const cells = []
  const { cellSize, gapSize, dotSize } = getBoardMetrics(size)

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const key = coordKey(x, y)
      const isCovered = covered.has(key)
      const isGhost = ghost.has(key)

      cells.push(
        <button
          key={key}
          className={[
            'flex items-center justify-center rounded-full border transition duration-100',
            cellClass(isCovered, isGhost, ghostIsValid),
          ].join(' ')}
          onClick={onPlace}
          onMouseEnter={() => onHoverCell(x, y)}
          style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
          type="button"
        >
          <span
            className={['rounded-full transition duration-100', dotClass(isCovered, isGhost, ghostIsValid)].join(
              ' ',
            )}
            style={{ width: `${dotSize}px`, height: `${dotSize}px` }}
          />
        </button>,
      )
    }
  }

  return (
    <section className="panel p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-['Trebuchet_MS','Avenir_Next',sans-serif] text-lg font-semibold text-white">
            {title}
          </h3>
          <p className="text-sm text-slate-300/70">Hover either plane to project the tile onto both.</p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-100/80">
          {covered.size} covered
        </div>
      </div>

      <div className="overflow-x-auto" onMouseLeave={onLeave}>
        <div
          className="grid w-max"
          style={{
            gap: `${gapSize}px`,
            gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
          }}
        >
          {cells}
        </div>
      </div>
    </section>
  )
}
