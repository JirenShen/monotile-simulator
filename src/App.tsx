import { NavLink, Route, Routes } from 'react-router-dom'
import { ForgePage } from './pages/ForgePage'
import { SimulatorPage } from './pages/SimulatorPage'

const navClass = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-full border px-4 py-2 text-sm font-semibold transition',
    isActive
      ? 'border-white/60 bg-white/20 text-white shadow-lg'
      : 'border-white/20 bg-white/5 text-white/75 hover:border-white/40 hover:bg-white/10 hover:text-white',
  ].join(' ')

export default function App() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.16),_transparent_32%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.18),_transparent_24%),linear-gradient(160deg,_#08111c_0%,_#10233a_50%,_#0b1724_100%)] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[1680px] flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-5 rounded-[2rem] border border-white/10 bg-white/5 px-6 py-5 shadow-2xl shadow-slate-950/25 backdrop-blur">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">
                Translational Constraint Sandbox
              </p>
              <h1 className="font-['Trebuchet_MS','Avenir_Next',sans-serif] text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                2-Layer Tiling Simulator
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-slate-200/80 sm:text-base">
                Design one tile that exists across two stacked planes, then test whether
                translation plus a vertical-axis flip can cover a paired board without overlap.
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
