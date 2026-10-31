import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight, Droplet, Minus, Plus } from 'lucide-react'
import { useStore } from '../store'
import { useNav } from '../App'
import { Page, Ring, list, item } from '../components/ui'
import { PROFILE, todayIndex } from '../data/profile'
import { MEAL_BY_ID, SLOTS } from '../data/meals'
import { WEEK, phaseForWeek } from '../data/workouts'

const HABITS = [
  { key: 'chia', label: 'Chia / jeera water', emoji: '💧' },
  { key: 'steps', label: `${PROFILE.targets.steps.toLocaleString()}+ steps`, emoji: '👟' },
  { key: 'workout', label: 'Workout done', emoji: '🏋️‍♀️' },
  { key: 'veg', label: '2 cups veggies', emoji: '🥕' },
  { key: 'sleep', label: '7+ hrs sleep', emoji: '😴' },
  { key: 'nosugar', label: 'No added sugar', emoji: '🚫' },
]

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

export default function Today() {
  const s = useStore()
  const { go, openRecipe } = useNav()
  const day = todayIndex()
  const { log } = s
  const phase = phaseForWeek(s.week)
  const workout = WEEK[day]

  const latest = s.state.weights.at(-1)?.kg ?? PROFILE.startKg
  const lost = Math.max(0, PROFILE.startKg - latest)
  const pct = Math.min(1, lost / (PROFILE.startKg - PROFILE.goalKg))

  const eaten = SLOTS.filter((sl) => log.eaten[sl.key]).reduce(
    (t, sl) => {
      const m = MEAL_BY_ID[s.choiceFor(day, sl.key)]
      return { kcal: t.kcal + m.kcal, protein: t.protein + m.protein, fiber: t.fiber + m.fiber }
    },
    { kcal: 0, protein: 0, fiber: 0 },
  )

  const water = log.water
  const W = PROFILE.targets.waterGlasses
  const habitsDone = HABITS.filter((h) => log.habits[h.key]).length

  const dateStr = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })

  return (
    <Page
      kicker={dateStr}
      title={<>{greeting()},<br /><span className="grad-text">Divya</span> ✨</>}
      right={<div className="avatar" onClick={() => go('me')}>D</div>}
    >
      <motion.div variants={list} initial="hidden" animate="show" className="stack">
        <motion.section variants={item} className="hero-card">
          <div className="hero-top">
            <span className="pill-glass">Week {s.week} of 16</span>
            <span className="pill-glass">Phase {phase.n} · {phase.name}</span>
          </div>
          <div className="hero-kg">
            <div>
              <small>Now</small>
              <strong>{latest.toFixed(1)}<em>kg</em></strong>
            </div>
            <div className="hero-arrow">→</div>
            <div>
              <small>Goal</small>
              <strong>{PROFILE.goalKg}<em>kg</em></strong>
            </div>
          </div>
          <div className="bar glass">
            <motion.span initial={{ width: 0 }} animate={{ width: `${Math.max(4, pct * 100)}%` }} transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }} />
          </div>
          <p className="hero-note">
            {lost > 0 ? `${lost.toFixed(1)} kg down, ${(latest - PROFILE.goalKg).toFixed(1)} kg to go. Keep going! 💪` : 'Every journey starts with day one. Log your weight in the Divya tab.'}
          </p>
        </motion.section>

        <motion.section variants={item} className="card">
          <div className="card-head">
            <h3>Today’s fuel</h3>
            <span className="muted">tick meals as you eat</span>
          </div>
          <div className="rings">
            <Ring value={eaten.kcal} max={PROFILE.targets.kcal[1]} color="var(--coral)" label={`/ ${PROFILE.targets.kcal[1]}`} unit="kcal" />
            <Ring value={eaten.protein} max={PROFILE.targets.protein} color="var(--violet)" label={`/ ${PROFILE.targets.protein}g`} unit="protein" />
            <Ring value={eaten.fiber} max={PROFILE.targets.fiber} color="var(--green)" label={`/ ${PROFILE.targets.fiber}g`} unit="fiber" />
          </div>
        </motion.section>

        <motion.section variants={item} className="card water">
          <div className="card-head">
            <h3><Droplet size={18} className="ic-blue" /> Water</h3>
            <span className="muted">{(water * 0.25).toFixed(2)} / {(W * 0.25).toFixed(2)} L</span>
          </div>
          <div className="glasses">
            {Array.from({ length: W }).map((_, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.8 }}
                className={i < water ? 'glass-i full' : 'glass-i'}
                onClick={() => s.patchLog((l) => (l.water = i < water ? i : i + 1))}
                aria-label={`Glass ${i + 1}`}
              >
                <motion.span className="fill" initial={false} animate={{ height: i < water ? '100%' : '0%' }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} />
              </motion.button>
            ))}
          </div>
          <div className="water-btns">
            <button className="round" onClick={() => s.patchLog((l) => (l.water = Math.max(0, l.water - 1)))} aria-label="Remove glass"><Minus size={18} /></button>
            <span>{water} glasses</span>
            <button className="round primary" onClick={() => s.patchLog((l) => (l.water = l.water + 1))} aria-label="Add glass"><Plus size={18} /></button>
          </div>
        </motion.section>

        <motion.section variants={item} className="card">
          <div className="card-head">
            <h3>Daily habits</h3>
            <span className="muted">{habitsDone}/{HABITS.length}</span>
          </div>
          <div className="habits">
            {HABITS.map((h) => {
              const on = !!log.habits[h.key]
              return (
                <motion.button key={h.key} whileTap={{ scale: 0.95 }} className={on ? 'habit on' : 'habit'} onClick={() => s.patchLog((l) => (l.habits[h.key] = !on))}>
                  <span className="habit-emoji">{h.emoji}</span>
                  <span className="habit-label">{h.label}</span>
                  <span className="check">
                    <AnimatePresence>{on && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Check size={14} strokeWidth={3} /></motion.span>}</AnimatePresence>
                  </span>
                </motion.button>
              )
            })}
          </div>
        </motion.section>

        <motion.section variants={item} className="workout-card" style={{ '--c': workout.color }} onClick={() => go('train')}>
          <span className="wc-emoji">{workout.emoji}</span>
          <div className="wc-body">
            <small>Today’s training</small>
            <strong>{workout.title}</strong>
            <span>{workout.subtitle}</span>
          </div>
          <ChevronRight />
        </motion.section>

        <motion.section variants={item} className="card">
          <div className="card-head">
            <h3>Today’s meals</h3>
            <button className="link" onClick={() => go('meals')}>Swap meals</button>
          </div>
          <div className="timeline">
            {SLOTS.map((sl) => {
              const meal = MEAL_BY_ID[s.choiceFor(day, sl.key)]
              const on = !!log.eaten[sl.key]
              return (
                <div key={sl.key} className={on ? 'tl-row on' : 'tl-row'}>
                  <motion.button whileTap={{ scale: 0.85 }} className="tl-check" onClick={() => s.patchLog((l) => (l.eaten[sl.key] = !on))} aria-label={`Mark ${sl.label} eaten`}>
                    {on && <Check size={14} strokeWidth={3} />}
                  </motion.button>
                  <button className="tl-main" onClick={() => openRecipe(meal, day, sl.key)}>
                    <small>{sl.time} · {sl.label}</small>
                    <span className="tl-name">{meal.emoji} {meal.name}</span>
                    <span className="tl-macro">{meal.kcal} kcal · {meal.protein}g P · {meal.fiber}g F</span>
                  </button>
                </div>
              )
            })}
          </div>
        </motion.section>
      </motion.div>
    </Page>
  )
}
