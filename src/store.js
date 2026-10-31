import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { featuredFor } from './data/plan'
import { MEAL_BY_ID, SLOTS } from './data/meals'

const KEY = 'divya-fitplan-v1'

const isoDate = (d = new Date()) => {
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
  return z.toISOString().slice(0, 10)
}

const initial = () => ({
  startDate: isoDate(),
  choices: {}, // { [dayIdx]: { [slot]: mealId } }
  logs: {}, // { [isoDate]: { water, habits: {}, done: {}, eaten: {} } }
  weights: [], // [{ date, kg }]
  grocery: {},
})

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...initial(), ...JSON.parse(raw) } : initial()
  } catch {
    return initial()
  }
}

export const StoreContext = createContext(null)

export function useStoreState() {
  const [state, setState] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* private mode – keep in memory */
    }
  }, [state])

  const update = useCallback((fn) => setState((s) => fn(structuredClone(s)) ?? s), [])

  const today = isoDate()
  const log = state.logs[today] ?? { water: 0, habits: {}, done: {}, eaten: {} }

  const api = {
    state,
    today,
    log,
    choiceFor: (day, slot) => state.choices[day]?.[slot] ?? featuredFor(day, slot),
    choose: (day, slot, id) =>
      update((s) => {
        s.choices[day] = { ...s.choices[day], [slot]: id }
        return s
      }),
    patchLog: (fn) =>
      update((s) => {
        const l = s.logs[today] ?? { water: 0, habits: {}, done: {}, eaten: {} }
        fn(l)
        s.logs[today] = l
        return s
      }),
    addWeight: (kg) =>
      update((s) => {
        s.weights = s.weights.filter((w) => w.date !== today)
        s.weights.push({ date: today, kg })
        s.weights.sort((a, b) => a.date.localeCompare(b.date))
        return s
      }),
    removeWeight: (date) =>
      update((s) => {
        s.weights = s.weights.filter((w) => w.date !== date)
        return s
      }),
    toggleGrocery: (item) =>
      update((s) => {
        s.grocery[item] = !s.grocery[item]
        return s
      }),
    clearGrocery: () =>
      update((s) => {
        s.grocery = {}
        return s
      }),
    setStartDate: (d) =>
      update((s) => {
        s.startDate = d
        return s
      }),
    resetAll: () => setState(initial()),
  }

  api.dayTotals = (day) =>
    SLOTS.filter((s) => s.key !== 'bed').reduce(
      (t, s) => {
        const meal = MEAL_BY_ID[api.choiceFor(day, s.key)]
        t.kcal += meal.kcal
        t.protein += meal.protein
        t.fiber += meal.fiber
        t.cost += meal.cost
        return t
      },
      { kcal: 0, protein: 0, fiber: 0, cost: 0 },
    )

  const startMs = new Date(state.startDate + 'T00:00:00').getTime()
  api.week = Math.max(1, Math.min(16, Math.floor((Date.now() - startMs) / (7 * 864e5)) + 1))

  return api
}

export const useStore = () => useContext(StoreContext)
