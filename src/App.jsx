import { createContext, useCallback, useContext, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, Dumbbell, Home, User, UtensilsCrossed, Check } from 'lucide-react'
import { StoreContext, useStoreState } from './store'
import { Sheet, spring } from './components/ui'
import Recipe from './components/Recipe'
import { DAY_NAMES } from './data/profile'
import { SLOTS } from './data/meals'
import Today from './screens/Today'
import Meals from './screens/Meals'
import Train from './screens/Train'
import Recipes from './screens/Recipes'
import Me from './screens/Me'

const TABS = [
  { key: 'today', label: 'Today', icon: Home, C: Today },
  { key: 'meals', label: 'Meals', icon: UtensilsCrossed, C: Meals },
  { key: 'train', label: 'Train', icon: Dumbbell, C: Train },
  { key: 'recipes', label: 'Recipes', icon: BookOpen, C: Recipes },
  { key: 'me', label: 'Divya', icon: User, C: Me },
]

const NavContext = createContext(null)
export const useNav = () => useContext(NavContext)

export default function App() {
  const store = useStoreState()
  const [tab, setTab] = useState('today')
  const [recipe, setRecipe] = useState(null) // { meal, day?, slot? }

  const go = useCallback((t) => {
    setTab(t)
    window.scrollTo({ top: 0 })
  }, [])
  const openRecipe = useCallback((meal, day, slot) => setRecipe({ meal, day, slot }), [])
  const closeRecipe = useCallback(() => setRecipe(null), [])

  const Screen = TABS.find((t) => t.key === tab).C
  const chosen = recipe && recipe.slot != null && store.choiceFor(recipe.day, recipe.slot) === recipe.meal.id

  return (
    <StoreContext.Provider value={store}>
      <NavContext.Provider value={{ go, openRecipe }}>
        <div className="bg-blobs" aria-hidden>
          <span /><span /><span />
        </div>
        <AnimatePresence mode="wait">
          <Screen key={tab} />
        </AnimatePresence>

        <nav className="tabbar">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} className={tab === key ? 'on' : ''} onClick={() => go(key)} aria-label={label}>
              {tab === key && <motion.span layoutId="tabpill" className="tabpill" transition={spring} />}
              <motion.span animate={{ y: tab === key ? -1 : 0, scale: tab === key ? 1.08 : 1 }} transition={spring} className="tabicon">
                <Icon size={21} strokeWidth={tab === key ? 2.4 : 2} />
              </motion.span>
              <span className="tablabel">{label}</span>
            </button>
          ))}
        </nav>

        <Sheet open={!!recipe} onClose={closeRecipe} title={recipe?.meal.name}>
          {recipe && (
            <Recipe
              meal={recipe.meal}
              action={
                recipe.slot != null && (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    className={chosen ? 'cta done' : 'cta'}
                    onClick={() => {
                      store.choose(recipe.day, recipe.slot, recipe.meal.id)
                      setTimeout(closeRecipe, 350)
                    }}
                  >
                    {chosen ? (
                      <><Check size={18} /> In {DAY_NAMES[recipe.day]}’s plan</>
                    ) : (
                      <>Pick for {DAY_NAMES[recipe.day]} · {SLOTS.find((s) => s.key === recipe.slot).label}</>
                    )}
                  </motion.button>
                )
              }
            />
          )}
        </Sheet>
      </NavContext.Provider>
    </StoreContext.Provider>
  )
}
