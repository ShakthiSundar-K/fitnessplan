export const PROFILE = {
  name: 'Divya',
  heightCm: 164,
  startKg: 66,
  goalKg: 58,
  weeks: 16,
  targets: {
    kcal: [1450, 1600],
    protein: 100, // g
    fiber: 28, // g
    waterGlasses: 13, // 250 ml each ≈ 3.25 L
    steps: 9000,
  },
}

export const bmi = (kg, cm = PROFILE.heightCm) => kg / (cm / 100) ** 2

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// JS getDay(): Sun = 0. Plan uses Mon = 0.
export const todayIndex = () => (new Date().getDay() + 6) % 7

export const RULES = [
  { emoji: '🎯', title: '1,450–1,600 kcal a day', text: 'A steady ~500 kcal deficit. That works out to about 0.5 kg a week, which gets her from 66 to 58 kg in 14–16 weeks without crashing.' },
  { emoji: '🍗', title: '100 g protein', text: 'Get protein at every meal (eggs, chicken, fish, paneer, soya, dal, curd). It keeps muscle and keeps her full.' },
  { emoji: '🌾', title: '25–30 g fiber, always', text: 'More protein needs more fiber, or constipation gets worse. Have seeds, fruit with skin, veggies, oats and dal every day.' },
  { emoji: '💧', title: '3–3.5 L water', text: 'Fiber only works with water. Without water, chia and isabgol make constipation worse. Aim for 13 glasses.' },
  { emoji: '🚶‍♀️', title: '8–10k steps', text: 'Steps burn more than the gym hour. Walk after lunch and after dinner for 10 minutes each.' },
  { emoji: '😴', title: 'Sleep 7–8 hrs', text: 'Bad sleep raises hunger hormones. Have dinner 2–3 hours before bed.' },
  { emoji: '🫒', title: '2–3 tsp oil a day total', text: 'The air fryer does the heavy lifting. Measure oil with a spoon, never pour from the bottle.' },
  { emoji: '🍫', title: 'One free meal a week', text: 'Have one sensible treat meal (Sunday lunch works well). Enjoy it, then go back to the plan at the next meal.' },
]

export const GUT_TIPS = [
  'Start every day with warm water + soaked chia (or jeera water). Warm liquid wakes up the gut.',
  'Papaya, guava, pear, kiwi, apple with skin, soaked raisins, figs and prunes are her best constipation fruits.',
  'Add 1 tbsp ground flaxseed to oats, curd or chapati dough every day.',
  'If nothing moves for 2 days: 1 tsp isabgol in a full glass of warm water at bedtime, then another glass of water.',
  'Raise fiber slowly over 7–10 days so she does not get bloated. Increase water at the same time.',
  'Walking 10 minutes after meals helps food move along.',
  'Curd/buttermilk daily gives probiotics for healthy digestion.',
  'Cut down maida, bakery items and excess tea/coffee (more than 2 cups a day). They make constipation worse.',
]

export const AVOID = ['Pineapple', 'Leafy greens (palak, methi, lettuce, cabbage, kale)', 'Plain boiled eggs']

export const GROCERY = [
  { cat: 'Protein', items: ['Chicken breast – 1.2 kg', 'Eggs – 30', 'Low-fat paneer – 400 g', 'Fish fillet (seer/basa/rohu) – 500 g', 'Soya chunks – 200 g', 'Greek yogurt / hung curd – 1 kg', 'Curd – 1.5 kg', 'Whey protein (optional) – 1 tub', 'Tofu (optional) – 200 g'] },
  { cat: 'Grains & Dal', items: ['Rolled oats – 500 g', 'Brown / sona masoori rice – 1 kg', 'Multigrain bread – 1 loaf', 'Whole wheat atta – 1 kg', 'Moong dal – 250 g', 'Rajma & chole – 250 g each', 'Besan – 250 g', 'Ragi flour – 250 g', 'Foxtail millet – 250 g', 'Roasted chana – 250 g'] },
  { cat: 'Fiber Boosters', items: ['Chia seeds – 250 g', 'Flaxseed (ground) – 250 g', 'Pumpkin & sunflower seeds – 100 g each', 'Isabgol (psyllium) – 1 pack', 'Makhana – 100 g', 'Almonds & walnuts – 200 g', 'Black raisins & dried figs – 100 g each'] },
  { cat: 'Fruits', items: ['Papaya – 1 large', 'Guava – 6', 'Apples – 6', 'Pears / kiwi – 4', 'Oranges – 4', 'Banana – 4', 'Pomegranate – 2', 'Berries (frozen ok) – 200 g'] },
  { cat: 'Vegetables', items: ['Cucumber – 1 kg', 'Carrot – 1 kg', 'Capsicum (all colours) – 500 g', 'Zucchini – 2', 'Broccoli – 1', 'Cauliflower – 1', 'Beans – 250 g', 'Mushrooms – 200 g', 'Tomato & onion – 2 kg', 'Beetroot – 2', 'Sweet corn – 2 cobs', 'Sweet potato – 2', 'Green peas – 250 g'] },
  { cat: 'Flavour', items: ['Ginger-garlic paste', 'Lemons – 10', 'Mint & coriander', 'Tandoori / chicken 65 masala', 'Oregano & chilli flakes', 'Chaat masala & black salt', 'Peanut butter (unsweetened)', 'Olive oil spray', 'Low-fat cheese slices'] },
]
