import { coordKey } from '../lib/tile'

type LayerEditorGridProps = {
  title: string
  size: number
  cells: Set<string>
  onToggle: (x: number, y: number) => void
}

export function LayerEditorGrid({ title, size, cells, onToggle }: LayerEditorGridProps) {
  const tiles = []

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const key = coordKey(x, y)
      const isActive = cells.has(key)

      tiles.push(
        <button
          key={key}
          className={[
            'aspect-square border transition duration-150',
            isActive
              ? 'border-sky-700 bg-sky-600 shadow-sm'
              : 'border-slate-300 bg-white hover:border-emerald-500 hover:bg-emerald-50',
          ].join(' ')}
          onClick={() => onToggle(x, y)}
          type="button"
        />,
      )
    }
  }

  return (
    <section className="panel p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-['Trebuchet_MS','Avenir_Next',sans-serif] text-lg font-semibold text-slate-900">
            {title}
          </h3>
          <p className="text-sm text-slate-600">Click cells to define this layer&apos;s footprint.</p>
        </div>
        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600">
          {cells.size} active
        </div>
      </div>

      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
      >
        {tiles}
      </div>
    </section>
  )
}
