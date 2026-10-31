import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { useNav } from '../App'
import { Chips, Macro, Page } from '../components/ui'
import { MEALS } from '../data/meals'

const FILTERS = [
  { key: 'all', label: 'All', test: () => true },
  { key: 'breakfast', label: '🍳 Breakfast', test: (m) => m.slot === 'breakfast' },
  { key: 'lunch', label: '🍛 Lunch', test: (m) => m.slot === 'lunch' },
  { key: 'dinner', label: '🌙 Dinner', test: (m) => m.slot === 'dinner' },
  { key: 'snack', label: '🍎 Snacks', test: (m) => ['mid', 'evening'].includes(m.slot) },
  { key: 'gut', label: '💧 Gut drinks', test: (m) => ['wake', 'bed'].includes(m.slot) },
  { key: 'airfryer', label: '♨️ Air fryer', test: (m) => m.tags.includes('airfryer') },
  { key: 'fiber', label: '🌾 High fiber', test: (m) => m.fiber >= 7 },
  { key: 'protein', label: '💪 30g+ protein', test: (m) => m.protein >= 30 },
  { key: 'veg', label: '🥦 Veg', test: (m) => m.tags.includes('veg') },
  { key: 'chicken', label: '🍗 Chicken', test: (m) => m.tags.includes('chicken') },
  { key: 'egg', label: '🥚 Egg', test: (m) => m.tags.includes('egg') },
  { key: 'prep', label: '📦 Prep-ahead', test: (m) => m.tags.includes('prep') },
  { key: 'quick', label: '⚡ Quick', test: (m) => m.tags.includes('quick') },
]

export default function Recipes() {
  const { openRecipe } = useNav()
  const [q, setQ] = useState('')
  const [f, setF] = useState('all')

  const results = useMemo(() => {
    const test = FILTERS.find((x) => x.key === f).test
    const needle = q.trim().toLowerCase()
    return MEALS.filter((m) => test(m) && (!needle || (m.name + ' ' + m.ingredients.join(' ')).toLowerCase().includes(needle)))
  }, [q, f])

  return (
    <Page kicker={`${MEALS.length} recipes · all Divya-approved`} title="Recipe Book">
      <div className="search">
        <Search size={18} />
        <input type="search" inputMode="search" placeholder="Search chicken, oats, paneer…" value={q} onChange={(e) => setQ(e.target.value)} />
        {q && <button onClick={() => setQ('')} aria-label="Clear"><X size={16} /></button>}
      </div>
      <Chips options={FILTERS} value={f} onChange={setF} />
      <p className="muted count">{results.length} recipes</p>

      <motion.div layout className="grid2">
        <AnimatePresence mode="popLayout">
          {results.map((m, i) => (
            <motion.button
              layout
              key={m.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1, transition: { delay: Math.min(i, 12) * 0.025 } }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileTap={{ scale: 0.96 }}
              className="opt"
              onClick={() => openRecipe(m)}
            >
              <span className="opt-emoji">{m.emoji}</span>
              <span className="opt-name">{m.name}</span>
              <span className="opt-sub">{m.mins} min · ₹{m.cost}</span>
              <Macro meal={m} />
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>
      {results.length === 0 && <p className="empty">No recipes match. Try another word 🙂</p>}
    </Page>
  )
}
