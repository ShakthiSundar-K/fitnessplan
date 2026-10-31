import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, LayoutGrid } from 'lucide-react'
import { useStore } from '../store'
import { useNav } from '../App'
import { DayPicker, Page, Sheet, Macro, list, item } from '../components/ui'
import { DAY_NAMES, PROFILE, todayIndex } from '../data/profile'
import { MEAL_BY_ID, SLOTS, mealsForSlot } from '../data/meals'
import { optionsFor } from '../data/plan'

function MealOption({ meal, selected, onOpen }) {
  return (
    <motion.button layout whileTap={{ scale: 0.96 }} className={selected ? 'opt on' : 'opt'} onClick={onOpen}>
      {selected && (
        <motion.span className="opt-badge" initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <Check size={12} strokeWidth={3} />
        </motion.span>
      )}
      <span className="opt-emoji">{meal.emoji}</span>
      <span className="opt-name">{meal.name}</span>
      <Macro meal={meal} />
    </motion.button>
  )
}

export default function Meals() {
  const s = useStore()
  const { openRecipe } = useNav()
  const [day, setDay] = useState(todayIndex())
  const [browse, setBrowse] = useState(null)
  const t = s.dayTotals(day)
  const [lo, hi] = PROFILE.targets.kcal

  return (
    <Page kicker="Mon → Sun · tap to see recipe & swap" title="Meal Plan">
      <DayPicker value={day} onChange={setDay} today={todayIndex()} id="meals" />

      <motion.div key={day} className="totals" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className={t.kcal >= lo - 100 && t.kcal <= hi + 100 ? 'ok' : 'warn'}>
          <strong>{t.kcal}</strong><small>kcal</small>
        </div>
        <div className={t.protein >= PROFILE.targets.protein - 10 ? 'ok' : 'warn'}>
          <strong>{Math.round(t.protein)}g</strong><small>protein</small>
        </div>
        <div className={t.fiber >= 25 ? 'ok' : 'warn'}>
          <strong>{Math.round(t.fiber)}g</strong><small>fiber</small>
        </div>
        <div>
          <strong>₹{t.cost}</strong><small>approx</small>
        </div>
      </motion.div>

      <motion.div key={`l${day}`} variants={list} initial="hidden" animate="show" className="stack">
        {SLOTS.map((sl) => {
          const chosen = s.choiceFor(day, sl.key)
          const opts = optionsFor(day, sl.key)
          if (!opts.includes(chosen)) opts.unshift(chosen)
          return (
            <motion.section variants={item} key={sl.key} className="slot">
              <div className="slot-head">
                <div>
                  <h3>{sl.emoji} {sl.label}</h3>
                  <small>{sl.time}</small>
                </div>
                <button className="link" onClick={() => setBrowse(sl.key)}>
                  <LayoutGrid size={14} /> All {mealsForSlot(sl.key).length}
                </button>
              </div>
              <div className="carousel">
                {opts.map((id) => (
                  <MealOption key={id} meal={MEAL_BY_ID[id]} selected={id === chosen} onOpen={() => openRecipe(MEAL_BY_ID[id], day, sl.key)} />
                ))}
              </div>
            </motion.section>
          )
        })}
        <p className="footnote">Macros are approximate. Totals leave out the optional bedtime item. Under 25 g fiber? Add a guava or 1 tbsp chia.</p>
      </motion.div>

      <Sheet open={!!browse} onClose={() => setBrowse(null)} title="All options">
        {browse && (
          <div>
            <h2 className="sheet-title">{SLOTS.find((x) => x.key === browse).label} options</h2>
            <p className="muted center">For {DAY_NAMES[day]} · tap any to see the recipe</p>
            <motion.div variants={list} initial="hidden" animate="show" className="grid2">
              {mealsForSlot(browse).map((meal) => (
                <motion.div variants={item} key={meal.id}>
                  <MealOption
                    meal={meal}
                    selected={meal.id === s.choiceFor(day, browse)}
                    onOpen={() => {
                      const slot = browse
                      setBrowse(null)
                      setTimeout(() => openRecipe(meal, day, slot), 250)
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </Sheet>
    </Page>
  )
}
