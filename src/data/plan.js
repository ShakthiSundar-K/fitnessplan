import { mealsForSlot } from './meals'

// Hand-picked default for each day (Mon → Sun). Balanced so a chicken-heavy
// lunch is followed by a lighter dinner and fiber stays at 25g+ every day.
const FEATURED = {
  wake: ['w1', 'w2', 'w1', 'w3', 'w1', 'w5', 'w4'],
  breakfast: ['b1', 'b2', 'b9', 'b3', 'b10', 'b11', 'b8'],
  mid: ['m2', 'm1', 'm4', 'm7', 'm5', 'm1', 'm2'],
  lunch: ['l1', 'l2', 'l3', 'l4', 'l7', 'l16', 'l6'],
  evening: ['e1', 'e3', 'e4', 'e2', 'e9', 'e5', 'e12'],
  dinner: ['d1', 'd2', 'd4', 'd3', 'd5', 'd7', 'd6'],
  bed: ['z2', 'z2', 'z1', 'z2', 'z2', 'z3', 'z1'],
}

// Featured pick + up to 5 swaps, rotating through the catalog so every day
// shows a different set of alternatives.
export function optionsFor(dayIdx, slot) {
  const all = mealsForSlot(slot)
  const featured = FEATURED[slot][dayIdx]
  const start = all.findIndex((x) => x.id === featured)
  const count = Math.min(all.length, slot === 'bed' ? 3 : 6)
  const out = []
  for (let i = 0; i < all.length && out.length < count; i++) {
    const item = all[(start + i * (dayIdx + 2)) % all.length]
    if (!out.includes(item.id)) out.push(item.id)
  }
  // Step may share a factor with the catalog size; top up sequentially.
  for (let i = 1; out.length < count; i++) {
    const item = all[(start + i) % all.length]
    if (!out.includes(item.id)) out.push(item.id)
  }
  return out
}

export const featuredFor = (dayIdx, slot) => FEATURED[slot][dayIdx]
