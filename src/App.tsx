import { NavLink, Route, Routes } from 'react-router-dom'
import { ForgePage } from './pages/ForgePage'
import { SimulatorPage } from './pages/SimulatorPage'

const navClass = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-full border px-4 py-2 text-sm font-semibold transition',
    isActive
      ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
      : 'border-slate-300 bg-white text-slate-700 hover:border-slate-500 hover:bg-slate-50',
  ].join(' ')

export default function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-[1680px] flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-5 rounded-[2rem] border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.28em] text-sky-700">
                Translational Constraint Sandbox
              </p>
              <h1 className="font-['Trebuchet_MS','Avenir_Next',sans-serif] text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                2-Layer Tiling Simulator
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                Design a paired tile across two stacked planes, then test whether translation
                plus an A ↔ B swap can cover both boards without overlap.
              </p>
            </div>
            <nav className="flex flex-wrap gap-3">
              <NavLink className={navClass} to="/">
                The Forge
              </NavLink>
              <NavLink className={navClass} to="/simulate">
                The Simulator
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<ForgePage />} />
            <Route path="/simulate" element={<SimulatorPage />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
