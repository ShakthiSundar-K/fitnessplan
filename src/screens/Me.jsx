import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, Plus, Trash2 } from 'lucide-react'
import { useStore } from '../store'
import { Page, list, item } from '../components/ui'
import { AVOID, GROCERY, GUT_TIPS, PROFILE, RULES, bmi } from '../data/profile'

function Chart({ weights, startDate }) {
  const W = 320, H = 170, P = { l: 30, r: 10, t: 12, b: 24 }
  const start = new Date(startDate + 'T00:00:00').getTime()
  const maxDay = 16 * 7
  const lo = PROFILE.goalKg - 1, hi = Math.max(PROFILE.startKg + 1, ...weights.map((w) => w.kg + 0.5))
  const x = (d) => P.l + (d / maxDay) * (W - P.l - P.r)
  const y = (kg) => P.t + ((hi - kg) / (hi - lo)) * (H - P.t - P.b)
  const pts = weights.map((w) => [x(Math.max(0, (new Date(w.date + 'T00:00:00').getTime() - start) / 864e5)), y(w.kg)])
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="Weight progress chart">
      {[PROFILE.startKg, 62, PROFILE.goalKg].map((kg) => (
        <g key={kg}>
          <line x1={P.l} x2={W - P.r} y1={y(kg)} y2={y(kg)} className="grid" />
          <text x={P.l - 6} y={y(kg) + 4} textAnchor="end" className="axis">{kg}</text>
        </g>
      ))}
      {[0, 4, 8, 12, 16].map((wk) => (
        <text key={wk} x={x(wk * 7)} y={H - 6} textAnchor="middle" className="axis">W{wk}</text>
      ))}
      <line x1={x(0)} y1={y(PROFILE.startKg)} x2={x(maxDay)} y2={y(PROFILE.goalKg)} className="ideal" />
      {pts.length > 1 && <motion.path d={path} className="actual" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} />}
      {pts.map((p, i) => (
        <motion.circle key={i} cx={p[0]} cy={p[1]} r={4} className="pt" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 * i }} />
      ))}
    </svg>
  )
}

function Fold({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <motion.section variants={item} className="card">
      <button className="card-head as-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <h3>{title}</h3>
        <motion.span animate={{ rotate: open ? 180 : 0 }}><ChevronDown size={18} /></motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div className="fold" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}

export default function Me() {
  const s = useStore()
  const [kg, setKg] = useState('')
  const weights = s.state.weights
  const latest = weights.at(-1)?.kg ?? PROFILE.startKg
  const groceryDone = Object.values(s.state.grocery).filter(Boolean).length
  const groceryTotal = GROCERY.reduce((n, g) => n + g.items.length, 0)

  const save = () => {
    const v = parseFloat(kg)
    if (v > 30 && v < 200) {
      s.addWeight(Math.round(v * 10) / 10)
      setKg('')
    }
  }

  return (
    <Page kicker="Profile" title="Divya">
      <motion.div variants={list} initial="hidden" animate="show" className="stack">
        <motion.section variants={item} className="profile">
          <motion.div className="big-avatar" initial={{ scale: 0.5, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }}>D</motion.div>
          <h2>Divya</h2>
          <p className="muted">16-week fat-loss journey</p>
          <div className="pstats">
            <div><strong>{PROFILE.heightCm}</strong><small>cm</small></div>
            <div><strong>{PROFILE.startKg}</strong><small>start kg</small></div>
            <div><strong>{latest}</strong><small>now kg</small></div>
            <div><strong>{PROFILE.goalKg}</strong><small>goal kg</small></div>
          </div>
          <div className="bmi">
            <span>BMI <b>{bmi(latest).toFixed(1)}</b></span>
            <span className="muted">→</span>
            <span>Goal BMI <b>{bmi(PROFILE.goalKg).toFixed(1)}</b></span>
          </div>
        </motion.section>

        <motion.section variants={item} className="card">
          <div className="card-head">
            <h3>⚖️ Weekly weigh-in</h3>
            <span className="muted">every Sunday</span>
          </div>
          <Chart weights={weights} startDate={s.state.startDate} />
          <div className="legend">
            <span><i className="lg-ideal" /> target pace</span>
            <span><i className="lg-actual" /> Divya</span>
          </div>
          <div className="weigh">
            <input type="number" inputMode="decimal" step="0.1" placeholder="Today’s weight (kg)" value={kg} onChange={(e) => setKg(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && save()} />
            <motion.button whileTap={{ scale: 0.9 }} className="round primary" onClick={save} aria-label="Save weight"><Plus size={20} /></motion.button>
          </div>
          {weights.length > 0 && (
            <ul className="wlog">
              <AnimatePresence initial={false}>
                {[...weights].reverse().slice(0, 6).map((w) => (
                  <motion.li key={w.date} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                    <span>{new Date(w.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    <strong>{w.kg} kg</strong>
                    <button onClick={() => s.removeWeight(w.date)} aria-label="Delete entry"><Trash2 size={15} /></button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </motion.section>

        <Fold title="🏆 The 8 rules" defaultOpen>
          <div className="rules">
            {RULES.map((r) => (
              <div key={r.title} className="rule">
                <span>{r.emoji}</span>
                <div><strong>{r.title}</strong><p>{r.text}</p></div>
              </div>
            ))}
          </div>
        </Fold>

        <Fold title="🌿 Gut health & constipation">
          <ul className="bullets">{GUT_TIPS.map((t) => <li key={t}>{t}</li>)}</ul>
        </Fold>

        <Fold title="🚫 Not in Divya’s plan">
          <div className="avoid">{AVOID.map((a) => <span key={a}>{a}</span>)}</div>
          <p className="muted small">Boiled eggs only appear air-fried with a crispy spiced skin in egg curry, and they never taste plain boiled.</p>
        </Fold>

        <Fold title={`🛒 Weekly grocery list · ${groceryDone}/${groceryTotal}`}>
          {GROCERY.map((g) => (
            <div key={g.cat} className="gcat">
              <h4>{g.cat}</h4>
              {g.items.map((it) => {
                const on = !!s.state.grocery[it]
                return (
                  <button key={it} className={on ? 'tick on' : 'tick'} onClick={() => s.toggleGrocery(it)}>
                    <span className="box">{on && <Check size={13} strokeWidth={3} />}</span>
                    <span>{it}</span>
                  </button>
                )
              })}
            </div>
          ))}
          <button className="link danger" onClick={s.clearGrocery}>Clear ticks</button>
        </Fold>

        <Fold title="⚙️ Settings">
          <label className="field">
            <span>Plan start date</span>
            <input type="date" value={s.state.startDate} onChange={(e) => e.target.value && s.setStartDate(e.target.value)} />
          </label>
          <p className="muted small">Currently week {s.week} of 16. All data stays on this phone.</p>
          <button className="link danger" onClick={() => window.confirm('Reset all progress, choices and weights?') && s.resetAll()}>Reset everything</button>
        </Fold>

        <motion.p variants={item} className="footnote">
          Made with ❤️ for Divya. This plan is general guidance. Check with a doctor before starting if she has any medical condition.
        </motion.p>
      </motion.div>
    </Page>
  )
}
