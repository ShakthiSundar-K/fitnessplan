// 16-week plan in 4 phases. Exercises stay the same; volume and cardio progress.
export const PHASES = [
  { n: 1, weeks: '1–4', name: 'Foundation', sets: 3, cardioMin: 15, incline: '6–8%', steps: '8,000', note: 'Learn the movements. Pick weights where the last 2 reps feel hard but form stays clean.' },
  { n: 2, weeks: '5–8', name: 'Build', sets: 3, cardioMin: 20, incline: '8–10%', steps: '9,000', note: 'Add 1–2 kg or 2 reps every week. Add the Friday finisher.' },
  { n: 3, weeks: '9–12', name: 'Burn', sets: 4, cardioMin: 25, incline: '10–12%', steps: '10,000', note: 'Go up to 4 sets on main lifts. Keep rest to 60 sec on accessories.' },
  { n: 4, weeks: '13–16', name: 'Peak', sets: 4, cardioMin: 30, incline: '10–12%', steps: '10–12k', note: 'Superset accessories (A1/A2) back-to-back. Push the steps. This is the final stretch.' },
]

export const phaseForWeek = (week) => PHASES[Math.min(3, Math.floor((week - 1) / 4))]

const ex = (name, reps, rest, cue, alt, main = false) => ({ name, reps, rest, cue, alt, main })

const WARMUP_UPPER = ['5 min treadmill walk (5 km/h)', '10 arm circles each way', '10 band pull-aparts', '10 wall push-ups', '10 cat-cow stretches']
const WARMUP_LOWER = ['5 min treadmill walk (5 km/h)', '10 bodyweight squats', '10 glute bridges', '10 leg swings each side', '10 hip circles each side']
const COOLDOWN = ['Chest/door stretch – 30 sec', 'Child’s pose – 45 sec', 'Hamstring stretch – 30 sec each', 'Figure-4 glute stretch – 30 sec each', 'Deep breathing – 1 min']

export const WEEK = [
  {
    day: 'Mon', title: 'Push', subtitle: 'Chest · Shoulders · Triceps', emoji: '💪', color: '#ff7a59', type: 'gym',
    warmup: WARMUP_UPPER,
    exercises: [
      ex('Dumbbell Chest Press (flat bench)', '10–12', '90s', 'Elbows at 45°, lower slow (3 sec), press up.', 'Smith machine press', true),
      ex('Incline Dumbbell Press', '10–12', '75s', 'Bench at 30°. Squeeze chest at top.', 'Incline machine press'),
      ex('Seated Dumbbell Shoulder Press', '10–12', '75s', 'Back flat on bench, do not arch. Stop just short of lockout.', 'Shoulder press machine', true),
      ex('Lateral Raises', '12–15', '60s', 'Lead with elbows, lift to shoulder height, pinky slightly up.', 'Cable lateral raise'),
      ex('Tricep Rope Pushdown', '12–15', '60s', 'Elbows pinned to sides. Split the rope at the bottom.', 'Overhead dumbbell extension'),
      ex('Dead Bug', '10 / side', '45s', 'Lower back glued to floor, move slow.', 'Plank 30–45s'),
    ],
    cardio: { name: 'Incline Treadmill Walk', detail: '4.5–5 km/h' },
  },
  {
    day: 'Tue', title: 'Pull', subtitle: 'Back · Biceps · Core', emoji: '🏋️‍♀️', color: '#7c5cff', type: 'gym',
    warmup: WARMUP_UPPER,
    exercises: [
      ex('Lat Pulldown (wide grip)', '10–12', '90s', 'Pull bar to upper chest, chest up, elbows drive down.', 'Assisted pull-up machine', true),
      ex('Seated Cable Row', '10–12', '75s', 'Squeeze shoulder blades, pause 1 sec, no swinging.', 'Chest-supported machine row', true),
      ex('Single-Arm Dumbbell Row', '10 / side', '60s', 'Knee on bench, pull dumbbell to hip pocket.', 'Machine row'),
      ex('Face Pulls', '15', '60s', 'Rope to forehead, elbows high, thumbs back. Good for posture.', 'Reverse pec-deck'),
      ex('Dumbbell Bicep Curl', '12', '60s', 'No swinging. Squeeze at top, lower in 3 sec.', 'Cable curl'),
      ex('Plank', '30–45s', '45s', 'Squeeze glutes, ribs down, breathe.', 'Knee plank'),
    ],
    cardio: { name: 'Elliptical / Cross Trainer', detail: 'Moderate · Level 6–8' },
  },
  {
    day: 'Wed', title: 'Active Recovery', subtitle: 'Walk · Mobility · Stretch', emoji: '🧘‍♀️', color: '#18b38b', type: 'recovery',
    warmup: ['Easy 5 min walk'],
    exercises: [
      ex('Brisk outdoor walk', '40–50 min', '—', 'Conversational pace. Split into two walks if needed.', 'Treadmill walk 5.5 km/h'),
      ex('Cat-Cow', '10 reps', '—', 'Move with breath.', '—'),
      ex('World’s Greatest Stretch', '5 / side', '—', 'Lunge, elbow to floor, rotate open.', '—'),
      ex('90/90 Hip Switches', '8 / side', '—', 'Slow, sit tall.', '—'),
      ex('Glute Bridge Hold', '3 × 30s', '—', 'Squeeze glutes at top.', '—'),
      ex('Legs Up The Wall', '3 min', '—', 'Relaxes the body and helps digestion.', '—'),
    ],
    cardio: null,
  },
  {
    day: 'Thu', title: 'Legs & Glutes', subtitle: 'Quads · Hamstrings · Glutes', emoji: '🍑', color: '#e0447c', type: 'gym',
    warmup: WARMUP_LOWER,
    exercises: [
      ex('Goblet Squat', '10–12', '90s', 'Dumbbell at chest, sit between heels, knees track over toes.', 'Leg press', true),
      ex('Dumbbell Romanian Deadlift', '10–12', '90s', 'Soft knees, push hips back, flat back, feel hamstrings.', 'Barbell RDL', true),
      ex('Walking Lunges', '10 / leg', '75s', 'Long step, back knee kisses floor, push through front heel.', 'Static split squat'),
      ex('Hip Thrust (bench)', '12', '75s', 'Chin tucked, ribs down, pause 1 sec at top.', 'Glute bridge machine', true),
      ex('Leg Extension', '12–15', '60s', 'Pause and squeeze at top.', 'Bodyweight step-ups'),
      ex('Calf Raises', '15', '45s', 'Full stretch at bottom, pause at top.', 'Seated calf raise'),
    ],
    cardio: { name: 'Incline Treadmill Walk', detail: '4.5–5 km/h' },
  },
  {
    day: 'Fri', title: 'Full Body & Core', subtitle: 'Upper · Glutes · Abs', emoji: '🔥', color: '#ffb020', type: 'gym',
    warmup: WARMUP_LOWER,
    exercises: [
      ex('Dumbbell Shoulder Press', '12', '75s', 'Core tight, press up and slightly back.', 'Machine press', true),
      ex('Lat Pulldown (close grip)', '12', '75s', 'Elbows to ribs, chest proud.', 'Cable row'),
      ex('Incline / Knee Push-ups', '8–12', '60s', 'Straight line from head to knees/heels.', 'Machine chest press'),
      ex('Cable Glute Kickback', '12 / leg', '60s', 'Squeeze glute, do not arch lower back.', 'Donkey kicks'),
      ex('Hammer Curl + Overhead Tricep Ext.', '12 each', '60s', 'Superset: do both back-to-back.', 'Cable versions'),
      ex('Russian Twists + Bicycle Crunches', '20 each', '45s', 'Slow and controlled; rotate from the ribs.', 'Dead bug'),
    ],
    cardio: { name: 'Cross Trainer', detail: 'Moderate', finisher: 'Phase 2+: 6 rounds of 30 sec fast / 60 sec easy on the bike' },
  },
  {
    day: 'Sat', title: 'LISS Cardio', subtitle: 'Long Walk · Glute Activation', emoji: '🚶‍♀️', color: '#2a9df4', type: 'cardio',
    warmup: ['5 min easy walk'],
    exercises: [
      ex('Incline Treadmill Walk', '35–45 min', '—', 'Speed 4.5–5 km/h, incline 8–12%. Do not hold the rails.', 'Swimming 30 min or outdoor walk 60 min'),
      ex('Banded Glute Bridges', '3 × 15', '30s', 'Push knees out against band.', 'Bodyweight bridges'),
      ex('Banded Side Walks', '3 × 12 / side', '30s', 'Stay low, toes forward.', 'Clamshells'),
      ex('Bird Dog', '3 × 10 / side', '30s', 'Reach long, hips square.', '—'),
      ex('Full-body stretch', '10 min', '—', 'Hips, hamstrings, chest, back.', '—'),
    ],
    cardio: null,
  },
  {
    day: 'Sun', title: 'Rest & Meal Prep', subtitle: 'Recover · Plan · Prep', emoji: '🛋️', color: '#8a8396', type: 'rest',
    warmup: [],
    exercises: [
      ex('Easy walk', '20–30 min', '—', 'Optional. A walk after the free meal is a good idea.', '—'),
      ex('Weigh-in & measurements', 'Morning', '—', 'After the washroom, before food. Log it in the Me tab.', '—'),
      ex('Prep: marinate chicken for 3 days', '20 min', '—', 'Tandoori & herb marinades in separate boxes.', '—'),
      ex('Prep: egg muffins + makhana jar', '20 min', '—', 'Breakfasts and snacks for the week.', '—'),
      ex('Prep: soak rajma/chole, chop veggies', '15 min', '—', 'Store cut veggies in airtight boxes with tissue.', '—'),
    ],
    cardio: null,
  },
]

export { COOLDOWN }
