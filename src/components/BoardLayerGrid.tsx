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
    return { cellSize: 17, gapSize: 1 }
  }

  if (size >= 24) {
    return { cellSize: 19, gapSize: 1 }
  }

  if (size >= 18) {
    return { cellSize: 23, gapSize: 1 }
  }

  return { cellSize: 28, gapSize: 1 }
}

function cellClass(isCovered: boolean, isGhost: boolean, ghostIsValid: boolean) {
  if (isGhost) {
    return ghostIsValid
      ? 'border-sky-500 bg-sky-200'
      : 'border-slate-400 bg-slate-200'
  }

  return isCovered
    ? 'border-rose-400 bg-rose-300'
    : 'border-slate-300 bg-white hover:border-emerald-400 hover:bg-emerald-50'
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
  const { cellSize, gapSize } = getBoardMetrics(size)

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const key = coordKey(x, y)
      const isCovered = covered.has(key)
      const isGhost = ghost.has(key)

      cells.push(
        <button
          key={key}
          className={[
            'border transition duration-100',
            cellClass(isCovered, isGhost, ghostIsValid),
          ].join(' ')}
          onClick={onPlace}
          onMouseEnter={() => onHoverCell(x, y)}
          style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
          type="button"
        />,
      )
    }
  }

  return (
    <section className="panel p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-['Trebuchet_MS','Avenir_Next',sans-serif] text-lg font-semibold text-slate-900">
            {title}
          </h3>
          <p className="text-sm text-slate-600">Hover either plane to project the tile onto both.</p>
        </div>
        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600">
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
