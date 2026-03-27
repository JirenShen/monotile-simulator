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
            'aspect-square rounded-[1rem] border transition duration-150',
            isActive
              ? 'border-cyan-100/70 bg-cyan-300/80 shadow-lg shadow-cyan-950/40'
              : 'border-emerald-200/20 bg-emerald-400/20 hover:border-emerald-100/40 hover:bg-emerald-300/30',
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
          <h3 className="font-['Trebuchet_MS','Avenir_Next',sans-serif] text-lg font-semibold text-white">
            {title}
          </h3>
          <p className="text-sm text-slate-300/70">Click cells to define this layer&apos;s footprint.</p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-100/80">
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
