import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useDragControls } from 'framer-motion'
import { X } from 'lucide-react'
import { DAYS } from '../data/profile'

export const spring = { type: 'spring', stiffness: 420, damping: 34 }

export const list = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } }
export const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 26 } },
}

export function Page({ title, kicker, right, children }) {
  return (
    <motion.main
      className="page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <header className="page-head">
        <div>
          {kicker && <p className="kicker">{kicker}</p>}
          <h1>{title}</h1>
        </div>
        {right}
      </header>
      {children}
    </motion.main>
  )
}

export function DayPicker({ value, onChange, today, id }) {
  return (
    <div className="daypicker" role="tablist">
      {DAYS.map((d, i) => (
        <button key={d} role="tab" aria-selected={value === i} className={value === i ? 'on' : ''} onClick={() => onChange(i)}>
          {value === i && <motion.span layoutId={`day-${id}`} className="daypill" transition={spring} />}
          <span className="dname">{d}</span>
          {i === today && <span className="dot" />}
        </button>
      ))}
    </div>
  )
}

export function Ring({ value, max, size = 76, stroke = 8, color, label, unit }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.min(1, value / max)
  return (
    <div className="ring" style={{ width: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--track)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - pct) }}
          transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="ring-in">
        <strong>{Math.round(value)}</strong>
        <small>{unit}</small>
      </div>
      <span className="ring-label">{label}</span>
    </div>
  )
}

export function Sheet({ open, onClose, children, title }) {
  const controls = useDragControls()

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            className="sheet"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            drag="y"
            dragListener={false}
            dragControls={controls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, i) => (i.offset.y > 110 || i.velocity.y > 600) && onClose()}
          >
            <div className="sheet-grab" onPointerDown={(e) => controls.start(e)}>
              <span />
              <button className="icon-btn" onClick={onClose} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="sheet-body">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}

export function Chips({ options, value, onChange }) {
  return (
    <div className="chips">
      {options.map((o) => (
        <motion.button whileTap={{ scale: 0.94 }} key={o.key} className={value === o.key ? 'chip on' : 'chip'} onClick={() => onChange(o.key)}>
          {o.label}
        </motion.button>
      ))}
    </div>
  )
}

export const Macro = ({ meal }) => (
  <div className="macros">
    <span className="mk">{meal.kcal} kcal</span>
    <span className="mp">{meal.protein}g P</span>
    <span className="mf">{meal.fiber}g F</span>
  </div>
)
