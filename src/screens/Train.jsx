import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Flame, Repeat, Timer, X, Footprints } from 'lucide-react'
import { useStore } from '../store'
import { DayPicker, Page, list, item } from '../components/ui'
import { todayIndex } from '../data/profile'
import { COOLDOWN, PHASES, WEEK, phaseForWeek } from '../data/workouts'

function RestTimer() {
  const [end, setEnd] = useState(null)
  const [, tick] = useState(0)
  useEffect(() => {
    if (!end) return
    const id = setInterval(() => {
      if (Date.now() >= end) {
        setEnd(null)
        navigator.vibrate?.([200, 100, 200])
      }
      tick((n) => n + 1)
    }, 250)
    return () => clearInterval(id)
  }, [end])
  const left = end ? Math.max(0, Math.ceil((end - Date.now()) / 1000)) : 0

  return createPortal(
    <div className="timer">
      <AnimatePresence mode="wait">
        {end ? (
          <motion.button key="run" className="timer-run" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} onClick={() => setEnd(null)}>
            <Timer size={18} /> <strong>{Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}</strong> <X size={16} />
          </motion.button>
        ) : (
          <motion.div key="idle" className="timer-idle" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
            <Timer size={16} />
            {[45, 60, 90].map((sec) => (
              <button key={sec} onClick={() => setEnd(Date.now() + sec * 1000)}>{sec}s</button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body,
  )
}

function Exercise({ ex, sets, idx, dayKey }) {
  const s = useStore()
  const [open, setOpen] = useState(false)
  const done = s.log.done ?? {}
  const n = ex.rest === '—' ? 1 : ex.main ? sets : 3
  const allDone = Array.from({ length: n }).every((_, k) => done[`${dayKey}-${idx}-${k}`])

  return (
    <motion.div variants={item} layout className={allDone ? 'ex done' : 'ex'}>
      <button className="ex-head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="ex-num">{idx + 1}</span>
        <div className="ex-title">
          <strong>{ex.name}</strong>
          <small>
            {ex.rest === '—' ? ex.reps : `${n} × ${ex.reps}`}
            {ex.rest !== '—' && ` · rest ${ex.rest}`}
          </small>
        </div>
        <motion.span animate={{ rotate: open ? 180 : 0 }}><ChevronDown size={18} /></motion.span>
      </button>
      <div className="sets">
        {Array.from({ length: n }).map((_, k) => {
          const key = `${dayKey}-${idx}-${k}`
          const on = !!done[key]
          return (
            <motion.button key={k} whileTap={{ scale: 0.85 }} className={on ? 'set on' : 'set'} onClick={() => s.patchLog((l) => { l.done = l.done ?? {}; l.done[key] = !on })}>
              {on ? '✓' : n === 1 ? 'Done?' : `Set ${k + 1}`}
            </motion.button>
          )
        })}
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div className="ex-more" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            <p>🎯 {ex.cue}</p>
            {ex.alt !== '—' && <p><Repeat size={13} /> Swap: {ex.alt}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Train() {
  const s = useStore()
  const [day, setDay] = useState(todayIndex())
  const [phaseN, setPhaseN] = useState(phaseForWeek(s.week).n)
  const [warmOpen, setWarmOpen] = useState(false)
  const phase = PHASES[phaseN - 1]
  const w = WEEK[day]

  return (
    <Page kicker={`Week ${s.week} · 4 gym days + cardio`} title="Training">
      <DayPicker value={day} onChange={setDay} today={todayIndex()} id="train" />

      <div className="phases">
        {PHASES.map((p) => (
          <button key={p.n} className={p.n === phaseN ? 'on' : ''} onClick={() => setPhaseN(p.n)}>
            <strong>{p.name}</strong>
            <small>Wk {p.weeks}</small>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={`${day}-${phaseN}`} variants={list} initial="hidden" animate="show" exit={{ opacity: 0 }} className="stack">
          <motion.section variants={item} className="train-hero" style={{ '--c': w.color }}>
            <motion.span className="th-emoji" initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 12 }}>
              {w.emoji}
            </motion.span>
            <h2>{w.title}</h2>
            <p>{w.subtitle}</p>
            <div className="th-meta">
              <span><Footprints size={14} /> {phase.steps} steps</span>
              {w.type === 'gym' && <span>💪 {phase.sets} sets on main lifts</span>}
            </div>
            {w.type === 'gym' && <p className="th-note">{phase.note}</p>}
          </motion.section>

          {w.warmup.length > 0 && (
            <motion.section variants={item} className="card">
              <button className="card-head as-btn" onClick={() => setWarmOpen((o) => !o)}>
                <h3>🔥 Warm-up · 8 min</h3>
                <motion.span animate={{ rotate: warmOpen ? 180 : 0 }}><ChevronDown size={18} /></motion.span>
              </button>
              <AnimatePresence initial={false}>
                {warmOpen && (
                  <motion.ul className="bullets" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                    {w.warmup.map((x) => <li key={x}>{x}</li>)}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.section>
          )}

          {w.exercises.map((ex, i) => (
            <Exercise key={ex.name} ex={ex} idx={i} sets={phase.sets} dayKey={day} />
          ))}

          {w.cardio && (
            <motion.section variants={item} className="cardio">
              <Flame size={22} />
              <div>
                <strong>{w.cardio.name} · {phase.cardioMin} min</strong>
                <small>{w.cardio.detail}{w.cardio.name.includes('Incline') ? ` · incline ${phase.incline}` : ''}</small>
                {w.cardio.finisher && phaseN > 1 && <small className="finisher">⚡ {w.cardio.finisher}</small>}
              </div>
            </motion.section>
          )}

          {w.type === 'gym' && (
            <motion.section variants={item} className="card">
              <h3>🧊 Cool-down</h3>
              <ul className="bullets">{COOLDOWN.map((x) => <li key={x}>{x}</li>)}</ul>
            </motion.section>
          )}

          <motion.p variants={item} className="footnote">
            Do strength training before cardio. If a weight feels easy for every rep, go up next session. Sore for more than 3 days? Take an extra rest day.
          </motion.p>
        </motion.div>
      </AnimatePresence>

      {w.type === 'gym' && <RestTimer />}
    </Page>
  )
}
