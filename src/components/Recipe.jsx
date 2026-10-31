import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Clock, IndianRupee, Lightbulb } from 'lucide-react'
import { list, item } from './ui'

export const TAG_LABEL = {
  veg: '🥦 Veg', egg: '🥚 Egg', chicken: '🍗 Chicken', fish: '🐟 Fish', airfryer: '♨️ Air fryer',
  prep: '📦 Prep-ahead', fiber: '🌾 High fiber', quick: '⚡ Quick', south: '🌴 South Indian',
}

export default function Recipe({ meal, action }) {
  const [got, setGot] = useState({})
  return (
    <motion.div variants={list} initial="hidden" animate="show" className="recipe">
      <motion.div variants={item} className="recipe-hero">
        <motion.span className="recipe-emoji" initial={{ scale: 0.4, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }}>
          {meal.emoji}
        </motion.span>
        <h2>{meal.name}</h2>
        <div className="tags">
          {meal.tags.map((t) => (
            <span key={t} className="tag">{TAG_LABEL[t]}</span>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item} className="stat-row">
        <div><strong>{meal.kcal}</strong><small>kcal</small></div>
        <div className="p"><strong>{meal.protein}g</strong><small>protein</small></div>
        <div className="f"><strong>{meal.fiber}g</strong><small>fiber</small></div>
        <div><strong><Clock size={13} /> {meal.mins}m</strong><small>time</small></div>
        <div><strong><IndianRupee size={13} />{meal.cost}</strong><small>approx</small></div>
      </motion.div>

      <motion.section variants={item}>
        <h3>Ingredients</h3>
        <ul className="ingredients">
          {meal.ingredients.map((ing) => (
            <li key={ing}>
              <button className={got[ing] ? 'tick on' : 'tick'} onClick={() => setGot((g) => ({ ...g, [ing]: !g[ing] }))} aria-pressed={!!got[ing]}>
                <span className="box">{got[ing] && <Check size={13} strokeWidth={3} />}</span>
                <span>{ing}</span>
              </button>
            </li>
          ))}
        </ul>
      </motion.section>

      <motion.section variants={item}>
        <h3>Method</h3>
        <ol className="steps">
          {meal.steps.map((s, i) => (
            <li key={i}>
              <span className="num">{i + 1}</span>
              <p>{s}</p>
            </li>
          ))}
        </ol>
      </motion.section>

      {meal.tip && (
        <motion.div variants={item} className="tip">
          <Lightbulb size={18} />
          <p>{meal.tip}</p>
        </motion.div>
      )}

      {action}
    </motion.div>
  )
}
