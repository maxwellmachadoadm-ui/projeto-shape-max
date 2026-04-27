import { useState, useEffect, useMemo, useCallback, useRef } from 'react'

/* ============================================================
   TREINOS
   ============================================================ */
const WORKOUTS = {
  A: {
    name: 'Treino A',
    subtitle: 'Pernas · Peito/Costas · Ombro · Braços',
    blocks: [
      { title: 'Pernas', exercises: [
        { id: 'a-leg-press', name: 'Leg Press', scheme: '4x10' },
        { id: 'a-cadeira', name: 'Cadeira Extensora', scheme: '3x12' },
      ]},
      { title: 'Peito + Costas', exercises: [
        { id: 'a-supino-maq', name: 'Supino Máquina', scheme: '4x8–10' },
        { id: 'a-remada-maq', name: 'Remada Máquina', scheme: '4x10' },
      ]},
      { title: 'Costas + Ombro', exercises: [
        { id: 'a-puxada', name: 'Puxada Frente', scheme: '3x10' },
        { id: 'a-elev-lat', name: 'Elevação Lateral', scheme: '3x12–15' },
      ]},
      { title: 'Braços', exercises: [
        { id: 'a-biceps', name: 'Bíceps', scheme: '3x12' },
        { id: 'a-triceps', name: 'Tríceps', scheme: '3x12' },
      ]},
    ],
    cardio: { name: 'Zona 2', scheme: '20 min' },
  },
  B: {
    name: 'Treino B',
    subtitle: 'Pernas · Peito/Costas · Ombro · Core',
    blocks: [
      { title: 'Pernas', exercises: [
        { id: 'b-agachamento', name: 'Agachamento Guiado', scheme: '3x10' },
        { id: 'b-mesa-flex', name: 'Mesa Flexora', scheme: '3x12' },
      ]},
      { title: 'Peito + Costas', exercises: [
        { id: 'b-supino-inc', name: 'Supino Inclinado', scheme: '3x10' },
        { id: 'b-remada-baixa', name: 'Remada Baixa', scheme: '3x10' },
      ]},
      { title: 'Ombro', exercises: [
        { id: 'b-desenvolvimento', name: 'Desenvolvimento Máquina', scheme: '3x10' },
      ]},
      { title: 'Core', exercises: [
        { id: 'b-ab-curto', name: 'Abdominal Curto', scheme: '3x15' },
        { id: 'b-prancha', name: 'Prancha', scheme: '3x30s' },
      ]},
    ],
    cardio: { name: 'Intervalado leve', scheme: '20 min · 2 min leve + 1 min moderado' },
  },
  C: {
    name: 'Treino C',
    subtitle: 'Pernas · Peito/Costas · Ombro',
    blocks: [
      { title: 'Pernas', exercises: [
        { id: 'c-leg-press', name: 'Leg Press', scheme: '4x8–10' },
        { id: 'c-panturrilha', name: 'Panturrilha', scheme: '4x15' },
      ]},
      { title: 'Peito + Costas', exercises: [
        { id: 'c-supino', name: 'Supino', scheme: '4x8' },
        { id: 'c-remada', name: 'Remada', scheme: '4x8' },
      ]},
      { title: 'Costas + Ombro', exercises: [
        { id: 'c-puxada', name: 'Puxada', scheme: '3x10' },
        { id: 'c-elev-lat', name: 'Elevação Lateral', scheme: '3x15' },
      ]},
    ],
    cardio: { name: 'Zona 2', scheme: '25 a 30 min' },
  },
  D: {
    name: 'Treino D',
    subtitle: 'Circuito leve + Cardio longo',
    blocks: [
      { title: 'Circuito leve', exercises: [
        { id: 'd-agachamento', name: 'Agachamento Leve', scheme: '3x12' },
        { id: 'd-flexao', name: 'Flexão ou Supino Leve', scheme: '3x10' },
        { id: 'd-remada', name: 'Remada Leve', scheme: '3x10' },
        { id: 'd-abdominal', name: 'Abdominal', scheme: '3x15' },
      ]},
    ],
    cardio: { name: 'Caminhada, elíptico ou escada leve', scheme: '35 a 45 min' },
  },
}

/* ============================================================
   FRASES MOTIVACIONAIS
   ============================================================ */
const QUOTES = {
  start: [
    'Disciplina supera motivação. Bora.',
    'Você não precisa estar pronto. Só precisa começar.',
    '1% melhor que ontem. É isso.',
    'Treinar é o aluguel que você paga pelo corpo que quer.',
    'A versão do seu corpo daqui a 6 meses começa agora.',
    'O treino que você não quer fazer é o que mais conta.',
    'Comece. O resto vem.',
  ],
  middle: [
    'Mantém o ritmo. O meio é onde a maioria desiste.',
    'Cada rep conta. Inclusive essa.',
    'Você já tá no jogo. Não para agora.',
    'Conforto não constrói músculo.',
    'Foco no próximo set. Só nele.',
    'Hoje você compete só com a versão de ontem.',
  ],
  done: [
    'Sessão fechada. Consistência é a moeda real.',
    'Mais um tijolo no projeto Shape Max.',
    'Você apareceu. É isso que separa.',
    'Recovery agora vale tanto quanto o treino.',
    'Hoje virou ontem. Bom trabalho.',
    'Pequenos depósitos. Grandes retornos.',
  ],
}

/* ============================================================
   NÍVEIS
   ============================================================ */
const LEVELS = [
  { name: 'Iniciante',     min: 0,   next: 10  },
  { name: 'Intermediário', min: 10,  next: 50  },
  { name: 'Avançado',      min: 50,  next: 150 },
  { name: 'Atleta',        min: 150, next: null },
]

const OBJETIVOS = {
  emagrecimento: 'Emagrecimento',
  definicao: 'Definição',
  hipertrofia: 'Hipertrofia',
  manutencao: 'Manutenção',
  forca: 'Força',
}

/* ============================================================
   STORAGE KEYS
   ============================================================ */
const STORAGE_KEY = 'shapemax:data:v1'
const CURRENT_KEY = 'shapemax:current:v1'
const PROFILE_KEY = 'shapemax:profile:v1'

/* ============================================================
   HELPERS — datas e formatação
   ============================================================ */
const todayKey = () => formatDateISO(new Date())

const formatDateISO = (d) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const formatDate = (key) => {
  const [y, m, d] = key.split('-')
  return `${d}/${m}/${y}`
}

const formatDateShort = (key) => {
  const [, m, d] = key.split('-')
  return `${d}/${m}`
}

const daysAgo = (key) => {
  const [y, m, d] = key.split('-').map(Number)
  const then = new Date(y, m - 1, d)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  then.setHours(0, 0, 0, 0)
  const diff = Math.round((now - then) / 86400000)
  if (diff <= 0) return 'hoje'
  if (diff === 1) return 'ontem'
  if (diff < 7) return `${diff} dias atrás`
  if (diff < 30) return `${Math.round(diff / 7)} sem atrás`
  return `${Math.round(diff / 30)} mês${Math.round(diff / 30) > 1 ? 'es' : ''} atrás`
}

const parseFloatBR = (v) => {
  if (v === null || v === undefined) return NaN
  const n = parseFloat(String(v).replace(',', '.'))
  return n
}

const fmtKg = (n) => {
  if (n === Math.round(n)) return `${n}`
  return n.toFixed(1).replace('.', ',')
}

/* ============================================================
   ESTRUTURA DE DADOS
   ============================================================ */
const emptyDay = (workout) => ({
  workout,
  exercises: {},
  extras: [],
  cardios: [],
  peso: '',
  cintura: '',
  obs: '',
})

const defaultProfile = () => ({
  nome: '',
  pesoInicial: '',
  altura: '',
  objetivo: 'manutencao',
  metaSemanal: 4,
})

const migrateRecord = (rec, dayKey) => {
  if (!rec) return rec
  if (Array.isArray(rec.cardios)) return { ...rec, extras: rec.extras || [] }
  const newRec = { ...rec, cardios: [], extras: rec.extras || [] }
  if (rec.cardio?.done || rec.cardio?.obs) {
    const w = WORKOUTS[rec.workout]
    const sug = w?.cardio
    newRec.cardios = [
      {
        id: `cardio-legacy-${dayKey}`,
        name: sug?.name || 'Cardio',
        detail: rec.cardio?.obs || '',
        duration: sug?.scheme || '',
        done: !!rec.cardio?.done,
      },
    ]
  }
  return newRec
}

const migrateAllData = (data) => {
  const out = {}
  for (const [date, rec] of Object.entries(data || {})) {
    out[date] = migrateRecord(rec, date)
  }
  return out
}

/* ============================================================
   CÁLCULOS
   ============================================================ */
const totalItems = (record) => {
  if (!record) return 0
  const w = WORKOUTS[record.workout]
  if (!w) return 0
  const planTotal = w.blocks.reduce((s, b) => s + b.exercises.length, 0)
  const extrasTotal = (record.extras || []).length
  const cardiosTotal = Math.max(1, (record.cardios || []).length)
  return planTotal + extrasTotal + cardiosTotal
}

const doneItems = (record) => {
  if (!record) return 0
  const ex = Object.values(record.exercises || {}).filter((e) => e?.done).length
  const extras = (record.extras || []).filter((e) => e?.done).length
  const cardios = (record.cardios || []).filter((e) => e?.done).length
  return ex + extras + cardios
}

const blockProgress = (block, record) => {
  const total = block.exercises.length
  const done = block.exercises.filter((ex) => record?.exercises?.[ex.id]?.done).length
  return { done, total }
}

const progressPct = (record) => {
  if (!record) return 0
  const total = totalItems(record)
  return total === 0 ? 0 : Math.round((doneItems(record) / total) * 100)
}

const isComplete = (record) => progressPct(record) >= 70

const sessionVolume = (record) => {
  if (!record) return 0
  let total = 0
  const sum = (e) => {
    if (!e?.done) return
    const c = parseFloatBR(e.carga)
    const r = parseFloatBR(e.reps)
    if (!isNaN(c) && !isNaN(r) && c > 0 && r > 0) total += c * r
  }
  Object.values(record.exercises || {}).forEach(sum)
  ;(record.extras || []).forEach(sum)
  return Math.round(total)
}

const isPR = (exId, exData, allData, dayKey) => {
  if (!exData?.done) return false
  const c = parseFloatBR(exData.carga)
  const r = parseFloatBR(exData.reps)
  if (isNaN(c) || isNaN(r) || c <= 0 || r <= 0) return false
  const currentVol = c * r
  let maxBefore = 0
  let hadBefore = false
  for (const [date, rec] of Object.entries(allData)) {
    if (date >= dayKey) continue
    const ex = rec.exercises?.[exId]
    if (!ex?.done) continue
    const pc = parseFloatBR(ex.carga)
    const pr = parseFloatBR(ex.reps)
    if (isNaN(pc) || isNaN(pr) || pc <= 0 || pr <= 0) continue
    hadBefore = true
    const v = pc * pr
    if (v > maxBefore) maxBefore = v
  }
  return hadBefore && currentVol > maxBefore
}

const calculateStreak = (data) => {
  const trained = new Set(
    Object.entries(data)
      .filter(([, r]) => doneItems(r) > 0)
      .map(([d]) => d),
  )
  if (trained.size === 0) return 0
  let streak = 0
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)
  if (!trained.has(formatDateISO(cursor))) cursor.setDate(cursor.getDate() - 1)
  while (trained.has(formatDateISO(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
    if (streak > 365) break
  }
  return streak
}

const dayHash = (s) => {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

const motivationLine = (record, dayKey) => {
  const pct = progressPct(record)
  const bucket = pct === 0 ? 'start' : pct < 70 ? 'middle' : 'done'
  const pool = QUOTES[bucket]
  return pool[dayHash(dayKey + bucket) % pool.length]
}

const weightHistory = (data, lastN = 30) => {
  return Object.entries(data)
    .filter(([, r]) => r.peso)
    .map(([date, r]) => ({ date, peso: parseFloatBR(r.peso) }))
    .filter((p) => !isNaN(p.peso))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-lastN)
}

const last7Days = (data) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const out = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = formatDateISO(d)
    const rec = data[key]
    const status = !rec || doneItems(rec) === 0 ? 'empty' : isComplete(rec) ? 'complete' : 'partial'
    const wd = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'][d.getDay()]
    out.push({ key, label: wd, status, isToday: i === 0 })
  }
  return out
}

const treinosNaSemana = (data) => {
  return last7Days(data).filter((d) => d.status !== 'empty').length
}

/* === Sugestão de carga === */
const parseTargetReps = (scheme) => {
  if (!scheme) return null
  const m = scheme.match(/x\s*(\d+)/i)
  if (!m) return null
  const n = parseInt(m[1], 10)
  return isNaN(n) ? null : n
}

/* Procura última ocorrência (ID fixo do plano OU nome livre pra extras) */
const lastExerciseRecord = ({ id, name, isExtra }, allData, dayKey) => {
  const sorted = Object.entries(allData)
    .filter(([d]) => d < dayKey)
    .sort((a, b) => b[0].localeCompare(a[0]))
  const targetName = (name || '').toLowerCase().trim()
  for (const [date, rec] of sorted) {
    if (isExtra) {
      const found = (rec.extras || []).find(
        (e) => e?.done && (e.name || '').toLowerCase().trim() === targetName,
      )
      if (found && (found.carga || found.reps)) {
        return { carga: found.carga, reps: found.reps, date, scheme: found.scheme }
      }
    } else {
      const ex = rec.exercises?.[id]
      if (ex?.done && (ex.carga || ex.reps)) {
        return { carga: ex.carga, reps: ex.reps, date }
      }
    }
  }
  return null
}

const suggestNextLoad = (lastData, scheme) => {
  if (!lastData) return null
  const lastCarga = parseFloatBR(lastData.carga)
  const lastReps = parseFloatBR(lastData.reps)
  if (isNaN(lastCarga) || lastCarga <= 0) return null
  const target = parseTargetReps(scheme)
  if (!target || isNaN(lastReps) || lastReps >= target) {
    return { carga: lastCarga + 2.5, action: 'progress' }
  }
  return { carga: lastCarga, action: 'maintain' }
}

/* === Histórico por exercício (pra evolução) === */
const exerciseHistory = ({ id, name, isExtra }, allData) => {
  const out = []
  const targetName = (name || '').toLowerCase().trim()
  for (const [date, rec] of Object.entries(allData)) {
    if (isExtra) {
      const found = (rec.extras || []).find(
        (e) => e?.done && (e.name || '').toLowerCase().trim() === targetName,
      )
      if (found) {
        const c = parseFloatBR(found.carga)
        const r = parseFloatBR(found.reps)
        if (!isNaN(c) && c > 0) out.push({ date, carga: c, reps: isNaN(r) ? 0 : r })
      }
    } else {
      const ex = rec.exercises?.[id]
      if (ex?.done) {
        const c = parseFloatBR(ex.carga)
        const r = parseFloatBR(ex.reps)
        if (!isNaN(c) && c > 0) out.push({ date, carga: c, reps: isNaN(r) ? 0 : r })
      }
    }
  }
  return out.sort((a, b) => a.date.localeCompare(b.date))
}

/* === Nível do usuário === */
const userLevel = (completedSessions) => {
  let cur = LEVELS[0]
  for (const lvl of LEVELS) {
    if (completedSessions >= lvl.min) cur = lvl
  }
  const idx = LEVELS.indexOf(cur)
  const nextLvl = LEVELS[idx + 1] || null
  const progress = nextLvl
    ? Math.round(((completedSessions - cur.min) / (nextLvl.min - cur.min)) * 100)
    : 100
  return { ...cur, idx, nextName: nextLvl?.name || null, progress, current: completedSessions }
}

/* === Itens da sessão (pra modo foco) === */
const buildSessionItems = (record, workout) => {
  const items = []
  workout.blocks.forEach((block) => {
    block.exercises.forEach((ex) => {
      items.push({ kind: 'plan', id: ex.id, name: ex.name, scheme: ex.scheme, block: block.title })
    })
  })
  ;(record.extras || []).forEach((e) => {
    items.push({ kind: 'extra', id: e.id, name: e.name, scheme: e.scheme })
  })
  ;(record.cardios || []).forEach((c) => {
    items.push({ kind: 'cardio', id: c.id, name: c.name, scheme: c.duration, detail: c.detail })
  })
  return items
}

/* ============================================================
   APP
   ============================================================ */
export default function App() {
  const [data, setData] = useState({})
  const [profile, setProfile] = useState(defaultProfile())
  const [currentWorkout, setCurrentWorkout] = useState('A')
  const [loaded, setLoaded] = useState(false)
  const [expandedHistory, setExpandedHistory] = useState(null)
  const [addingExtra, setAddingExtra] = useState(false)
  const [addingCardio, setAddingCardio] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const [evolutionFor, setEvolutionFor] = useState(null) // { kind, id, name, isExtra }

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setData(migrateAllData(JSON.parse(raw)))
      const cur = localStorage.getItem(CURRENT_KEY)
      if (cur && WORKOUTS[cur]) setCurrentWorkout(cur)
      const prof = localStorage.getItem(PROFILE_KEY)
      if (prof) setProfile({ ...defaultProfile(), ...JSON.parse(prof) })
    } catch (e) {
      console.warn('Falha ao ler localStorage', e)
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch (e) {}
  }, [data, loaded])

  useEffect(() => {
    if (!loaded) return
    localStorage.setItem(CURRENT_KEY, currentWorkout)
  }, [currentWorkout, loaded])

  useEffect(() => {
    if (!loaded) return
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)) } catch (e) {}
  }, [profile, loaded])

  const today = todayKey()
  const todayRecord = data[today] || emptyDay(currentWorkout)

  const setTodayRecord = useCallback(
    (updater) => {
      setData((prev) => {
        const cur = prev[today] || emptyDay(currentWorkout)
        const next = typeof updater === 'function' ? updater(cur) : updater
        return { ...prev, [today]: next }
      })
    },
    [today, currentWorkout],
  )

  const switchWorkout = (key) => {
    setCurrentWorkout(key)
    setTodayRecord((cur) => ({ ...cur, workout: key }))
  }

  const toggleExercise = (id) => {
    setTodayRecord((cur) => {
      const ex = cur.exercises[id] || { done: false, carga: '', reps: '', obs: '' }
      return { ...cur, exercises: { ...cur.exercises, [id]: { ...ex, done: !ex.done } } }
    })
  }
  const updateExercise = (id, field, value) => {
    setTodayRecord((cur) => {
      const ex = cur.exercises[id] || { done: false, carga: '', reps: '', obs: '' }
      return { ...cur, exercises: { ...cur.exercises, [id]: { ...ex, [field]: value } } }
    })
  }

  /* EXTRAS */
  const addExtra = (name, scheme) => {
    if (!name.trim()) return
    const id = `extra-${Date.now()}`
    setTodayRecord((cur) => ({
      ...cur,
      extras: [...(cur.extras || []), { id, name: name.trim(), scheme: scheme.trim(), done: false, carga: '', reps: '', obs: '' }],
    }))
    setAddingExtra(false)
  }
  const toggleExtra = (id) => {
    setTodayRecord((cur) => ({ ...cur, extras: (cur.extras || []).map((e) => (e.id === id ? { ...e, done: !e.done } : e)) }))
  }
  const updateExtra = (id, field, value) => {
    setTodayRecord((cur) => ({ ...cur, extras: (cur.extras || []).map((e) => (e.id === id ? { ...e, [field]: value } : e)) }))
  }
  const removeExtra = (id) => {
    setTodayRecord((cur) => ({ ...cur, extras: (cur.extras || []).filter((e) => e.id !== id) }))
  }

  /* CARDIOS */
  const addCardio = (name, detail, duration) => {
    if (!name.trim()) return
    const id = `cardio-${Date.now()}`
    setTodayRecord((cur) => ({
      ...cur,
      cardios: [...(cur.cardios || []), { id, name: name.trim(), detail: detail.trim(), duration: duration.trim(), done: false }],
    }))
    setAddingCardio(false)
  }
  const toggleCardio = (id) => {
    setTodayRecord((cur) => ({ ...cur, cardios: (cur.cardios || []).map((c) => (c.id === id ? { ...c, done: !c.done } : c)) }))
  }
  const updateCardio = (id, field, value) => {
    setTodayRecord((cur) => ({ ...cur, cardios: (cur.cardios || []).map((c) => (c.id === id ? { ...c, [field]: value } : c)) }))
  }
  const removeCardio = (id) => {
    setTodayRecord((cur) => ({ ...cur, cardios: (cur.cardios || []).filter((c) => c.id !== id) }))
  }
  const useCardioSuggestion = () => {
    const w = WORKOUTS[workoutKey]
    if (!w?.cardio) return
    addCardio(w.cardio.name, '', w.cardio.scheme)
  }

  const updateField = (field, value) => {
    setTodayRecord((cur) => ({ ...cur, [field]: value }))
  }

  const clearToday = () => {
    if (!window.confirm('Limpar o treino de HOJE? O histórico anterior será mantido.')) return
    setData((prev) => { const next = { ...prev }; delete next[today]; return next })
  }

  const workoutKey = todayRecord.workout || currentWorkout
  const workout = WORKOUTS[workoutKey]
  const progress = progressPct(todayRecord)
  const volume = sessionVolume(todayRecord)
  const streak = useMemo(() => calculateStreak(data), [data])
  const motivation = useMemo(() => motivationLine(todayRecord, today), [todayRecord, today])
  const week = useMemo(() => last7Days(data), [data])
  const semanaCount = useMemo(() => treinosNaSemana(data), [data])
  const weights = useMemo(() => weightHistory(data, 30), [data])

  const history = useMemo(() => {
    return Object.entries(data)
      .filter(([, rec]) => doneItems(rec) > 0 || rec.peso || rec.cintura || rec.obs)
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .slice(0, 10)
  }, [data])

  const stats = useMemo(() => {
    const all = Object.values(data)
    const sessions = all.filter((r) => doneItems(r) > 0).length
    const completed = all.filter((r) => isComplete(r)).length
    const frequency = sessions === 0 ? 0 : Math.round((completed / sessions) * 100)
    return { sessions, completed, frequency }
  }, [data])

  const level = useMemo(() => userLevel(stats.completed), [stats.completed])

  /* Delta de peso desde o início */
  const weightDelta = useMemo(() => {
    const pi = parseFloatBR(profile.pesoInicial)
    const last = weights[weights.length - 1]
    if (!isNaN(pi) && pi > 0 && last?.peso) {
      return { from: pi, to: last.peso, delta: last.peso - pi }
    }
    return null
  }, [profile.pesoInicial, weights])

  return (
    <div className="app-bg min-h-screen text-slate-100">
      <div className="mx-auto max-w-md px-4 safe-top safe-bottom">
        {/* HEADER */}
        <header className="pt-6 pb-2 animate-rise">
          <div className="flex items-center justify-between">
            <Badge nome={profile.nome} />
            <div className="flex items-center gap-2">
              <DateChip date={today} />
              <button
                onClick={() => setProfileOpen(true)}
                className="h-8 w-8 rounded-full border border-slate-700/60 bg-slate-900/60 backdrop-blur flex items-center justify-center text-slate-300 hover:bg-slate-800 active:scale-95 transition"
                aria-label="Perfil"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </button>
            </div>
          </div>

          <h1 className="font-display text-[34px] font-bold mt-5 leading-[1.05] text-white">
            {profile.nome ? `Bora, ${profile.nome.split(' ')[0]}` : 'Treino de hoje'}
          </h1>
          <p className="text-slate-300 text-sm mt-1.5">
            <span className="text-emerald-300 font-semibold">{workout.name}</span>
            <span className="text-slate-500 mx-1.5">·</span>
            <span className="text-slate-300">{workout.subtitle}</span>
          </p>

          <div className="mt-4 px-1">
            <p className="text-[13px] text-slate-400 italic leading-relaxed">
              <span className="text-emerald-400 not-italic mr-1.5">“</span>
              {motivation}
              <span className="text-emerald-400 not-italic ml-1">”</span>
            </p>
          </div>

          {/* Card progresso */}
          <div className="card-base rounded-2xl p-5 mt-4">
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold">Progresso</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-3xl font-extrabold text-white tabular-nums">{progress}</span>
                <span className="text-slate-500 text-base font-semibold">%</span>
              </div>
            </div>
            <div className="mt-3.5 h-2.5 w-full rounded-full bg-slate-800/80 overflow-hidden ring-1 ring-slate-700/50">
              <div
                className="h-full rounded-full transition-[width] duration-500 ease-out"
                style={{
                  width: `${progress}%`,
                  background: progress >= 70 ? 'linear-gradient(90deg, #10b981, #34d399, #6ee7b7)' : 'linear-gradient(90deg, #38bdf8, #818cf8, #a78bfa)',
                  boxShadow: progress >= 70 ? '0 0 12px rgba(16, 185, 129, 0.6)' : '0 0 12px rgba(56, 189, 248, 0.5)',
                }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">
                <span className="text-white tabular-nums">{doneItems(todayRecord)}</span>
                <span className="text-slate-500"> de </span>
                <span className="text-slate-300 tabular-nums">{totalItems(todayRecord)}</span> itens
              </span>
              {isComplete(todayRecord) ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  Sessão completa
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              ) : (
                <span className="text-slate-500 font-medium">Meta · 70%</span>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/60 grid grid-cols-3 gap-2">
              <MiniMetric label="Volume" value={volume > 0 ? volume.toLocaleString('pt-BR') : '—'} unit={volume > 0 ? 'kg' : ''} />
              <MiniMetric label="Streak" value={streak} unit={streak === 1 ? 'dia' : 'dias'} highlight={streak >= 3} />
              <MiniMetric label="Esta semana" value={semanaCount} unit={`/ ${profile.metaSemanal || 4}`} highlight={semanaCount >= (profile.metaSemanal || 4)} />
            </div>
          </div>

          <WeekDots week={week} />

          {/* Botão Modo Treino */}
          <button
            onClick={() => setFocusMode(true)}
            className="mt-5 w-full rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 hover:brightness-110 active:scale-[0.99] transition py-4 text-emerald-950 font-bold flex items-center justify-center gap-2.5 shadow-[0_8px_30px_-8px_rgba(16,185,129,0.7)]"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span className="font-display tracking-wider uppercase text-sm">Iniciar modo treino</span>
          </button>

          {/* Card de nível */}
          <LevelCard level={level} />
        </header>

        {/* SELETOR DE TREINO */}
        <section className="mt-7 animate-rise">
          <SectionLabel>Selecione o treino</SectionLabel>
          <div className="grid grid-cols-4 gap-2.5 mt-3">
            {Object.keys(WORKOUTS).map((k) => (
              <WorkoutButton key={k} letter={k} active={workoutKey === k} onClick={() => switchWorkout(k)} />
            ))}
          </div>
        </section>

        {/* EXERCÍCIOS */}
        <section className="mt-7 space-y-6 animate-rise">
          {workout.blocks.map((block) => {
            const bp = blockProgress(block, todayRecord)
            return (
              <Block key={block.title} title={block.title} done={bp.done} total={bp.total}>
                {block.exercises.map((ex) => {
                  const state = todayRecord.exercises[ex.id]
                  const pr = isPR(ex.id, state, data, today)
                  const lastData = lastExerciseRecord({ id: ex.id, name: ex.name, isExtra: false }, data, today)
                  const suggestion = suggestNextLoad(lastData, ex.scheme)
                  const histCount = exerciseHistory({ id: ex.id, name: ex.name, isExtra: false }, data).length
                  return (
                    <ExerciseCard
                      key={ex.id}
                      exercise={ex}
                      state={state}
                      pr={pr}
                      lastData={lastData}
                      suggestion={suggestion}
                      historyCount={histCount}
                      onShowEvolution={() => setEvolutionFor({ kind: 'plan', id: ex.id, name: ex.name, scheme: ex.scheme, isExtra: false })}
                      onToggle={() => toggleExercise(ex.id)}
                      onUpdate={(f, v) => updateExercise(ex.id, f, v)}
                    />
                  )
                })}
              </Block>
            )
          })}

          <ExtrasBlock
            extras={todayRecord.extras || []}
            adding={addingExtra}
            allData={data}
            today={today}
            onShowEvolution={(item) => setEvolutionFor(item)}
            onStartAdd={() => setAddingExtra(true)}
            onCancelAdd={() => setAddingExtra(false)}
            onAdd={addExtra}
            onToggle={toggleExtra}
            onUpdate={updateExtra}
            onRemove={removeExtra}
          />

          <CardioSection
            cardios={todayRecord.cardios || []}
            suggestion={workout.cardio}
            adding={addingCardio}
            onStartAdd={() => setAddingCardio(true)}
            onCancelAdd={() => setAddingCardio(false)}
            onAdd={addCardio}
            onToggle={toggleCardio}
            onUpdate={updateCardio}
            onRemove={removeCardio}
            onUseSuggestion={useCardioSuggestion}
          />
        </section>

        {/* MÉTRICAS DO DIA */}
        <section className="mt-7 animate-rise">
          <SectionLabel>Métricas do dia</SectionLabel>
          <div className="card-base rounded-2xl p-5 mt-3 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Peso (kg)" inputMode="decimal" value={todayRecord.peso} onChange={(v) => updateField('peso', v)} placeholder="82.5" />
              <Field label="Cintura (cm)" inputMode="decimal" value={todayRecord.cintura} onChange={(v) => updateField('cintura', v)} placeholder="88" />
            </div>
            <Field label="Observações gerais" textarea value={todayRecord.obs} onChange={(v) => updateField('obs', v)} placeholder="Como foi o treino, energia, sono..." />
          </div>
        </section>

        {/* EVOLUÇÃO DE PESO */}
        {weights.length >= 2 && (
          <section className="mt-7 animate-rise">
            <SectionLabel>Evolução do peso</SectionLabel>
            <div className="card-base rounded-2xl p-4 mt-3">
              <WeightSparkline points={weights} weightDelta={weightDelta} />
            </div>
          </section>
        )}

        {/* ESTATÍSTICAS */}
        <section className="mt-7 animate-rise">
          <SectionLabel>Estatísticas gerais</SectionLabel>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <StatCard label="Sessões registradas" value={stats.sessions} />
            <StatCard label="Sessões completas" value={stats.completed} accent="emerald" />
            <StatCard label="Frequência" value={`${stats.frequency}%`} accent="sky" />
            <StatCard label="Streak atual" value={streak} unit={streak === 1 ? 'dia' : 'dias'} accent={streak >= 3 ? 'fire' : null} />
          </div>
        </section>

        {/* HISTÓRICO */}
        <section className="mt-7 animate-rise">
          <SectionLabel>Histórico (últimos 10)</SectionLabel>
          <div className="mt-3 space-y-2.5">
            {history.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 p-7 text-center text-sm text-slate-500">
                Nenhum treino registrado ainda. Bora começar?
              </div>
            ) : (
              history.map(([date, rec]) => (
                <HistoryRow key={date} date={date} record={rec} expanded={expandedHistory === date} onToggle={() => setExpandedHistory(expandedHistory === date ? null : date)} />
              ))
            )}
          </div>
        </section>

        <div className="mt-9 mb-4 animate-rise">
          <button
            onClick={clearToday}
            className="w-full rounded-2xl border border-rose-900/50 bg-rose-950/40 hover:bg-rose-950/60 active:scale-[0.99] transition py-4 text-rose-300 font-semibold text-sm"
          >
            Limpar treino de hoje
          </button>
          <p className="mt-4 text-center text-[11px] text-slate-600">
            Projeto Shape Max · dados salvos no seu celular
          </p>
        </div>
      </div>

      {/* OVERLAYS */}
      {profileOpen && (
        <ProfileSheet
          profile={profile}
          stats={stats}
          level={level}
          onSave={(p) => { setProfile(p); setProfileOpen(false) }}
          onClose={() => setProfileOpen(false)}
        />
      )}

      {focusMode && (
        <FocusMode
          record={todayRecord}
          workout={workout}
          allData={data}
          today={today}
          onClose={() => setFocusMode(false)}
          onTogglePlan={toggleExercise}
          onUpdatePlan={updateExercise}
          onToggleExtra={toggleExtra}
          onUpdateExtra={updateExtra}
          onToggleCardio={toggleCardio}
          onUpdateCardio={updateCardio}
        />
      )}

      {evolutionFor && (
        <EvolutionSheet
          item={evolutionFor}
          allData={data}
          onClose={() => setEvolutionFor(null)}
        />
      )}
    </div>
  )
}

/* ============================================================
   COMPONENTES BÁSICOS
   ============================================================ */
function Badge({ nome }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 backdrop-blur">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70 pulse-dot" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
      </span>
      <span className="font-display text-[11px] font-bold tracking-[0.2em] uppercase text-emerald-200">
        {nome ? nome.split(' ')[0].toUpperCase() : 'Shape Max'}
      </span>
    </div>
  )
}

function DateChip({ date }) {
  return (
    <div className="rounded-full border border-slate-700/60 bg-slate-900/60 backdrop-blur px-3 py-1.5 text-[11px] text-slate-300 tabular-nums font-medium">
      {formatDate(date)}
    </div>
  )
}

function SectionLabel({ children }) {
  return <h2 className="font-display text-[11px] font-bold tracking-[0.24em] uppercase text-slate-400">{children}</h2>
}

function MiniMetric({ label, value, unit, highlight }) {
  return (
    <div className="text-center">
      <div className="text-[9px] uppercase tracking-[0.18em] text-slate-500 font-bold mb-0.5">{label}</div>
      <div className="flex items-baseline justify-center gap-1">
        <span className={['font-display text-xl font-extrabold tabular-nums leading-none', highlight ? 'text-amber-300' : 'text-white'].join(' ')}>{value}</span>
        {unit && <span className="text-[10px] text-slate-500 font-semibold">{unit}</span>}
        {highlight && <span className="text-[14px] leading-none">🔥</span>}
      </div>
    </div>
  )
}

function WeekDots({ week }) {
  return (
    <div className="mt-3 flex items-center justify-between gap-1.5 px-1">
      {week.map((d) => (
        <div key={d.key} className="flex flex-col items-center gap-1.5 flex-1">
          <span className={['text-[9px] font-bold uppercase tracking-wider', d.isToday ? 'text-white' : 'text-slate-600'].join(' ')}>{d.label}</span>
          <span className={[
            'h-2.5 w-2.5 rounded-full transition',
            d.status === 'complete' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]'
              : d.status === 'partial' ? 'bg-amber-400/80'
              : d.isToday ? 'bg-slate-600 ring-2 ring-slate-500/40' : 'bg-slate-700/60',
          ].join(' ')} />
        </div>
      ))}
    </div>
  )
}

function WorkoutButton({ letter, active, onClick }) {
  return (
    <button onClick={onClick} className={[
      'relative h-[68px] rounded-2xl font-display font-extrabold text-[26px] transition-all active:scale-[0.97]',
      active ? 'bg-gradient-to-br from-white to-slate-200 text-slate-900 shadow-[0_8px_25px_-5px_rgba(255,255,255,0.35),0_0_0_1px_rgba(255,255,255,0.5)]'
        : 'card-base text-slate-200 hover:border-slate-600',
    ].join(' ')}>
      <span className="block leading-none">{letter}</span>
      <span className={['block text-[9px] font-bold tracking-[0.2em] uppercase mt-1', active ? 'text-slate-600' : 'text-slate-500'].join(' ')}>Treino</span>
    </button>
  )
}

function Block({ title, accent, children, done = 0, total = 0 }) {
  const isCardio = accent === 'cardio'
  const isExtras = accent === 'extras'
  const allDone = total > 0 && done === total
  const accentColor = isCardio ? 'sky' : isExtras ? 'amber' : 'emerald'
  const barClass = accentColor === 'sky'
    ? 'bg-gradient-to-r from-sky-400 to-blue-500 shadow-[0_0_8px_rgba(56,189,248,0.5)]'
    : accentColor === 'amber'
    ? 'bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_8px_rgba(251,191,36,0.5)]'
    : 'bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.5)]'
  const pillClass = allDone
    ? accentColor === 'sky' ? 'text-sky-200 bg-sky-500/20 border border-sky-500/40'
    : accentColor === 'amber' ? 'text-amber-200 bg-amber-500/20 border border-amber-500/40'
    : 'text-emerald-200 bg-emerald-500/20 border border-emerald-500/40'
    : 'text-slate-400 bg-slate-800/60 border border-slate-700/60'
  return (
    <div>
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2.5">
          <span className={['h-1.5 w-7 rounded-full', barClass].join(' ')} />
          <h3 className="font-display text-[13px] font-bold uppercase tracking-[0.18em] text-slate-100">{title}</h3>
        </div>
        {total > 0 && (
          <span className={['text-[11px] font-bold tabular-nums px-2 py-0.5 rounded-full', pillClass].join(' ')}>{done}/{total}</span>
        )}
      </div>
      <div className="space-y-2.5">{children}</div>
    </div>
  )
}

/* ============================================================
   EXERCISE CARD com sugestão
   ============================================================ */
function ExerciseCard({ exercise, state, pr, lastData, suggestion, historyCount, onShowEvolution, onToggle, onUpdate }) {
  const done = !!state?.done
  const carga = state?.carga || ''
  const reps = state?.reps || ''
  const obs = state?.obs || ''
  return (
    <div className={['rounded-2xl p-4 transition-all', done ? 'card-done' : 'card-base'].join(' ')}>
      <div className="flex items-start gap-3.5">
        <CheckButton done={done} onClick={onToggle} variant="emerald" />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h4 className={['font-display font-bold text-[16px] leading-tight flex items-center gap-1.5 min-w-0', done ? 'text-emerald-100' : 'text-white'].join(' ')}>
              <span className="truncate">{exercise.name}</span>
              {pr && <PRBadge />}
            </h4>
            <div className="flex items-center gap-1.5 shrink-0">
              {historyCount >= 2 && (
                <button
                  onClick={onShowEvolution}
                  aria-label="Ver evolução"
                  className="h-7 w-7 rounded-md text-slate-500 hover:text-emerald-300 hover:bg-emerald-950/40 transition flex items-center justify-center"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 17 9 11 13 15 21 7" />
                    <polyline points="14 7 21 7 21 14" />
                  </svg>
                </button>
              )}
              <span className={[
                'shrink-0 text-[11px] font-bold tabular-nums px-2 py-0.5 rounded-md',
                done ? 'text-emerald-200 bg-emerald-500/20' : 'text-slate-300 bg-slate-800/80 border border-slate-700/60',
              ].join(' ')}>{exercise.scheme}</span>
            </div>
          </div>

          {/* Hint de última carga + sugestão */}
          {(lastData || suggestion) && !done && (
            <SuggestionHint
              lastData={lastData}
              suggestion={suggestion}
              onUseSuggestion={(v) => onUpdate('carga', String(v).replace('.', ','))}
            />
          )}

          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <Mini label="Carga" value={carga} onChange={(v) => onUpdate('carga', v)} placeholder={lastData?.carga ? lastData.carga + 'kg' : 'kg'} done={done} />
            <Mini label="Reps" value={reps} onChange={(v) => onUpdate('reps', v)} placeholder={lastData?.reps || '—'} done={done} />
          </div>
          <Mini className="mt-2.5" label="Obs" value={obs} onChange={(v) => onUpdate('obs', v)} placeholder="Sensação, ajuste, dor leve..." done={done} />
        </div>
      </div>
    </div>
  )
}

function SuggestionHint({ lastData, suggestion, onUseSuggestion }) {
  if (!lastData) return null
  return (
    <div className="mt-2.5 rounded-lg bg-slate-950/50 border border-slate-800/80 px-2.5 py-2 flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1.5 text-[11px]">
        <span className="text-slate-500 font-medium uppercase tracking-wider text-[9px]">Última</span>
        <span className="text-slate-200 font-semibold tabular-nums">
          {lastData.carga ? `${lastData.carga}kg` : ''}
          {lastData.carga && lastData.reps ? ' × ' : ''}
          {lastData.reps ? `${lastData.reps}` : ''}
        </span>
        <span className="text-slate-600">·</span>
        <span className="text-slate-500">{daysAgo(lastData.date)}</span>
      </div>
      {suggestion && (
        <>
          <span className="text-slate-700 mx-0.5">→</span>
          <button
            onClick={() => onUseSuggestion(suggestion.carga)}
            className={[
              'text-[11px] font-bold tabular-nums px-2 py-1 rounded-md transition active:scale-95 flex items-center gap-1',
              suggestion.action === 'progress'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700',
            ].join(' ')}
          >
            {suggestion.action === 'progress' && <span>↑</span>}
            <span>{fmtKg(suggestion.carga)}kg</span>
            <span className="text-[9px] uppercase tracking-wider opacity-70">usar</span>
          </button>
        </>
      )}
    </div>
  )
}

function PRBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-[0.15em] px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-400 to-orange-500 text-orange-950 shadow-[0_0_8px_rgba(251,191,36,0.4)]">
      🏆 PR
    </span>
  )
}

function CheckButton({ done, onClick, variant = 'emerald', size = 'normal' }) {
  const palette = variant === 'sky'
    ? { on: 'bg-gradient-to-br from-sky-400 to-blue-500 border-sky-300 text-white shadow-[0_0_0_4px_rgba(56,189,248,0.2),0_4px_15px_-2px_rgba(56,189,248,0.6)]', off: 'bg-slate-900/80 border-slate-600 hover:border-sky-400/70' }
    : { on: 'bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-300 text-white shadow-[0_0_0_4px_rgba(16,185,129,0.2),0_4px_15px_-2px_rgba(16,185,129,0.6)]', off: 'bg-slate-900/80 border-slate-600 hover:border-emerald-400/70' }
  const sizeCls = size === 'big' ? 'h-14 w-14' : 'h-10 w-10'
  const iconCls = size === 'big' ? 'h-7 w-7' : 'h-5 w-5'
  return (
    <button onClick={onClick} aria-pressed={done} className={['mt-0.5 shrink-0 rounded-xl border-2 flex items-center justify-center transition-all active:scale-90', sizeCls, done ? palette.on : palette.off].join(' ')}>
      {done && (
        <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </button>
  )
}

function Mini({ label, value, onChange, placeholder, className = '', done = false, cardio = false, type = 'text', inputMode }) {
  const focusRing = cardio ? 'focus:border-sky-400/70' : 'focus:border-emerald-400/70'
  return (
    <label className={`block ${className}`}>
      <span className="block text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-1.5">{label}</span>
      <input
        type={type}
        inputMode={inputMode || (label === 'Carga' || label === 'Reps' || label === 'Duração' ? 'decimal' : 'text')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={['w-full rounded-xl border px-3 py-2.5 text-[15px] font-medium text-white placeholder:text-slate-500 transition focus:outline-none',
          done ? (cardio ? 'bg-slate-950/40 border-sky-700/40' : 'bg-slate-950/40 border-emerald-700/40') : 'bg-slate-950/60 border-slate-700/70', focusRing].join(' ')}
      />
    </label>
  )
}

function Field({ label, value, onChange, placeholder, textarea, inputMode }) {
  const Tag = textarea ? 'textarea' : 'input'
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-2">{label}</span>
      <Tag
        type={textarea ? undefined : 'text'}
        inputMode={inputMode}
        rows={textarea ? 3 : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-700/70 bg-slate-950/60 px-3.5 py-3 text-base text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400/70 transition resize-none"
      />
    </label>
  )
}

function StatCard({ label, value, unit, accent }) {
  const accentClass = accent === 'emerald' ? 'text-emerald-300' : accent === 'sky' ? 'text-sky-300' : accent === 'fire' ? 'text-amber-300' : 'text-white'
  return (
    <div className="card-base rounded-2xl p-4">
      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">{label}</div>
      <div className="flex items-baseline gap-1.5 mt-1">
        <div className={`font-display text-[32px] font-extrabold tabular-nums leading-none ${accentClass}`}>{value}</div>
        {unit && <span className="text-[11px] text-slate-500 font-semibold">{unit}</span>}
        {accent === 'fire' && <span className="text-base leading-none">🔥</span>}
      </div>
    </div>
  )
}

/* ============================================================
   LEVEL CARD
   ============================================================ */
function LevelCard({ level }) {
  return (
    <div className="mt-4 card-base rounded-2xl p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-bold">Seu nível</div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="font-display text-lg font-extrabold text-white leading-none">{level.name}</span>
            <span className="text-[11px] text-slate-500 tabular-nums">· {level.current} sessões</span>
          </div>
        </div>
        {level.nextName && (
          <div className="text-right shrink-0">
            <div className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-bold">Próximo</div>
            <div className="text-[12px] text-slate-300 font-bold mt-0.5">{level.nextName}</div>
          </div>
        )}
      </div>
      {level.nextName && (
        <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800/80 overflow-hidden">
          <div
            className="h-full rounded-full transition-[width] duration-500"
            style={{
              width: `${Math.max(2, level.progress)}%`,
              background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
              boxShadow: '0 0 8px rgba(251,191,36,0.4)',
            }}
          />
        </div>
      )}
    </div>
  )
}

/* ============================================================
   EXTRAS BLOCK
   ============================================================ */
function ExtrasBlock({ extras, adding, allData, today, onShowEvolution, onStartAdd, onCancelAdd, onAdd, onToggle, onUpdate, onRemove }) {
  return (
    <Block title="Extras do dia" accent="extras" done={extras.filter((e) => e.done).length} total={extras.length}>
      {extras.map((ex) => {
        const lastData = lastExerciseRecord({ id: ex.id, name: ex.name, isExtra: true }, allData, today)
        const suggestion = suggestNextLoad(lastData, ex.scheme)
        const histCount = exerciseHistory({ id: ex.id, name: ex.name, isExtra: true }, allData).length
        return (
          <ExtraCard
            key={ex.id}
            extra={ex}
            lastData={lastData}
            suggestion={suggestion}
            historyCount={histCount}
            onShowEvolution={() => onShowEvolution({ kind: 'extra', id: ex.id, name: ex.name, scheme: ex.scheme, isExtra: true })}
            onToggle={() => onToggle(ex.id)}
            onUpdate={(f, v) => onUpdate(ex.id, f, v)}
            onRemove={() => onRemove(ex.id)}
          />
        )
      })}
      {adding ? (
        <AddExtraForm onSave={onAdd} onCancel={onCancelAdd} />
      ) : (
        <button onClick={onStartAdd} className="w-full rounded-2xl border border-dashed border-amber-500/40 bg-amber-950/15 hover:bg-amber-950/25 active:scale-[0.99] transition py-3.5 text-amber-300 font-semibold text-sm flex items-center justify-center gap-2">
          <PlusIcon /> Adicionar exercício
        </button>
      )}
    </Block>
  )
}

function AddExtraForm({ onSave, onCancel }) {
  const [name, setName] = useState('')
  const [scheme, setScheme] = useState('')
  return (
    <div className="rounded-2xl card-base p-4 space-y-3">
      <div className="grid grid-cols-[1fr_auto] gap-2.5">
        <Mini label="Exercício" value={name} onChange={setName} placeholder="Ex: Stiff, Crucifixo..." />
        <Mini label="Séries" value={scheme} onChange={setScheme} placeholder="3x12" />
      </div>
      <FormButtons primary="Adicionar" disabled={!name.trim()} onSave={() => onSave(name, scheme)} onCancel={onCancel} accent="amber" />
    </div>
  )
}

function ExtraCard({ extra, lastData, suggestion, historyCount, onShowEvolution, onToggle, onUpdate, onRemove }) {
  const done = !!extra.done
  return (
    <div className={['rounded-2xl p-4 transition-all', done ? 'card-done' : 'card-base'].join(' ')}>
      <div className="flex items-start gap-3.5">
        <CheckButton done={done} onClick={onToggle} variant="emerald" />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h4 className={['font-display font-bold text-[16px] leading-tight truncate', done ? 'text-emerald-100' : 'text-white'].join(' ')}>{extra.name}</h4>
            <div className="flex items-center gap-1.5 shrink-0">
              {historyCount >= 2 && (
                <button onClick={onShowEvolution} aria-label="Ver evolução" className="h-7 w-7 rounded-md text-slate-500 hover:text-emerald-300 hover:bg-emerald-950/40 transition flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 17 9 11 13 15 21 7" />
                    <polyline points="14 7 21 7 21 14" />
                  </svg>
                </button>
              )}
              {extra.scheme && (
                <span className={['text-[11px] font-bold tabular-nums px-2 py-0.5 rounded-md', done ? 'text-emerald-200 bg-emerald-500/20' : 'text-slate-300 bg-slate-800/80 border border-slate-700/60'].join(' ')}>{extra.scheme}</span>
              )}
              <RemoveButton onClick={onRemove} />
            </div>
          </div>
          {(lastData || suggestion) && !done && (
            <SuggestionHint lastData={lastData} suggestion={suggestion} onUseSuggestion={(v) => onUpdate('carga', String(v).replace('.', ','))} />
          )}
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <Mini label="Carga" value={extra.carga || ''} onChange={(v) => onUpdate('carga', v)} placeholder="kg" done={done} />
            <Mini label="Reps" value={extra.reps || ''} onChange={(v) => onUpdate('reps', v)} placeholder="—" done={done} />
          </div>
          <Mini className="mt-2.5" label="Obs" value={extra.obs || ''} onChange={(v) => onUpdate('obs', v)} placeholder="Sensação, ajuste..." done={done} />
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   CARDIO SECTION
   ============================================================ */
function CardioSection({ cardios, suggestion, adding, onStartAdd, onCancelAdd, onAdd, onToggle, onUpdate, onRemove, onUseSuggestion }) {
  const done = cardios.filter((c) => c.done).length
  const total = cardios.length
  return (
    <Block title="Cardio" accent="cardio" done={done} total={total}>
      {suggestion && cardios.length === 0 && (
        <div className="rounded-2xl border border-sky-500/25 bg-sky-950/15 p-3.5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.18em] text-sky-400/80 font-bold mb-0.5">Sugestão do treino</div>
            <div className="text-sm text-sky-100 font-semibold leading-tight">{suggestion.name}</div>
            <div className="text-[12px] text-sky-300/70">{suggestion.scheme}</div>
          </div>
          <button onClick={onUseSuggestion} className="shrink-0 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 active:scale-95 transition px-3 py-2 text-[11px] font-bold text-sky-200 border border-sky-500/40 uppercase tracking-wider">Usar</button>
        </div>
      )}
      {cardios.map((c) => (
        <CardioItemCard key={c.id} cardio={c} onToggle={() => onToggle(c.id)} onUpdate={(f, v) => onUpdate(c.id, f, v)} onRemove={() => onRemove(c.id)} />
      ))}
      {adding ? (
        <AddCardioForm onSave={onAdd} onCancel={onCancelAdd} suggestion={suggestion} />
      ) : (
        <button onClick={onStartAdd} className="w-full rounded-2xl border border-dashed border-sky-500/40 bg-sky-950/15 hover:bg-sky-950/25 active:scale-[0.99] transition py-3.5 text-sky-300 font-semibold text-sm flex items-center justify-center gap-2">
          <PlusIcon /> Adicionar cardio
        </button>
      )}
    </Block>
  )
}

function AddCardioForm({ onSave, onCancel, suggestion }) {
  const [name, setName] = useState('')
  const [detail, setDetail] = useState('')
  const [duration, setDuration] = useState('')
  const fillSuggestion = () => {
    if (!suggestion) return
    setName(suggestion.name)
    setDuration(suggestion.scheme)
  }
  return (
    <div className="rounded-2xl card-base p-4 space-y-3">
      <div className="grid grid-cols-[1fr_110px] gap-2.5">
        <Mini label="Tipo" value={name} onChange={setName} placeholder="Esteira, elíptico, bike..." cardio />
        <Mini label="Duração" value={duration} onChange={setDuration} placeholder="20 min" cardio />
      </div>
      <label className="block">
        <span className="block text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-1.5">O que você fez</span>
        <textarea
          rows={2}
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="Ex: Trote nível 10, inclinação 3%, alternando 2 min com caminhada nível 5..."
          className="w-full rounded-xl border border-slate-700/70 bg-slate-950/60 px-3 py-2.5 text-[14px] font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400/70 transition resize-none"
        />
      </label>
      {suggestion && (
        <button onClick={fillSuggestion} type="button" className="text-[11px] text-sky-400/80 hover:text-sky-300 font-semibold underline-offset-2 hover:underline">
          Usar sugestão do treino ({suggestion.name})
        </button>
      )}
      <FormButtons primary="Adicionar" disabled={!name.trim()} onSave={() => onSave(name, detail, duration)} onCancel={onCancel} accent="sky" />
    </div>
  )
}

function CardioItemCard({ cardio, onToggle, onUpdate, onRemove }) {
  const done = !!cardio.done
  return (
    <div className={['rounded-2xl p-4 transition-all', done ? 'card-cardio' : 'card-base'].join(' ')}>
      <div className="flex items-start gap-3.5">
        <CheckButton done={done} onClick={onToggle} variant="sky" />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h4 className={['font-display font-bold text-[16px] leading-tight truncate', done ? 'text-sky-100' : 'text-white'].join(' ')}>{cardio.name}</h4>
            <div className="flex items-center gap-1.5 shrink-0">
              {cardio.duration && (
                <span className={['text-[11px] font-bold tabular-nums px-2 py-0.5 rounded-md', done ? 'text-sky-200 bg-sky-500/20' : 'text-sky-300 bg-sky-500/15 border border-sky-500/30'].join(' ')}>{cardio.duration}</span>
              )}
              <RemoveButton onClick={onRemove} />
            </div>
          </div>
          {cardio.detail && (
            <p className={['mt-1.5 text-[13px] leading-snug whitespace-pre-line', done ? 'text-sky-200/80' : 'text-slate-300'].join(' ')}>{cardio.detail}</p>
          )}
          <Mini className="mt-3" label="Detalhe / obs" value={cardio.detail || ''} onChange={(v) => onUpdate('detail', v)} placeholder="Editar descrição..." done={done} cardio />
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   UTIL UI
   ============================================================ */
function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function RemoveButton({ onClick }) {
  return (
    <button onClick={onClick} aria-label="Remover" className="h-7 w-7 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition flex items-center justify-center">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  )
}

function FormButtons({ primary, disabled, onSave, onCancel, accent }) {
  const accentBg = accent === 'sky'
    ? 'bg-gradient-to-br from-sky-400 to-blue-500 text-blue-950'
    : 'bg-gradient-to-br from-amber-400 to-orange-500 text-orange-950'
  return (
    <div className="flex gap-2">
      <button onClick={onCancel} className="flex-1 rounded-xl border border-slate-700 bg-slate-900/50 py-2.5 text-sm font-semibold text-slate-300 active:scale-[0.98] transition">Cancelar</button>
      <button onClick={onSave} disabled={disabled} className={`flex-1 rounded-xl ${accentBg} py-2.5 text-sm font-bold active:scale-[0.98] transition disabled:opacity-40 disabled:cursor-not-allowed`}>{primary}</button>
    </div>
  )
}

/* ============================================================
   SPARKLINE — peso (com pesoInicial)
   ============================================================ */
function WeightSparkline({ points, weightDelta }) {
  if (!points || points.length < 2) return null
  const W = 320, H = 80, P = 8
  const ys = points.map((p) => p.peso)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const rangeY = maxY - minY || 1
  const xStep = (W - 2 * P) / (points.length - 1)
  const coords = points.map((p, i) => ({
    x: P + i * xStep,
    y: P + (H - 2 * P) * (1 - (p.peso - minY) / rangeY),
    peso: p.peso, date: p.date,
  }))
  const path = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ')
  const areaPath = `${path} L ${coords[coords.length - 1].x.toFixed(1)} ${H - P} L ${coords[0].x.toFixed(1)} ${H - P} Z`
  const last = points[points.length - 1]
  const fromInicial = weightDelta?.delta
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2 px-1">
        <div>
          <div className="font-display text-2xl font-extrabold text-white tabular-nums leading-none">
            {last.peso.toFixed(1)}<span className="text-sm text-slate-500 font-semibold ml-1">kg</span>
          </div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-bold mt-1">Atual · {formatDateShort(last.date)}</div>
        </div>
        <div className="text-right">
          {fromInicial !== undefined && fromInicial !== null ? (
            <>
              <div className={['font-display text-base font-extrabold tabular-nums leading-none', fromInicial < 0 ? 'text-emerald-300' : fromInicial > 0 ? 'text-amber-300' : 'text-slate-400'].join(' ')}>
                {fromInicial > 0 ? '+' : ''}{fromInicial.toFixed(1)} kg
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-bold mt-1">desde início</div>
            </>
          ) : (
            <div className="text-[10px] text-slate-600">Configure peso inicial no perfil</div>
          )}
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-20" preserveAspectRatio="none">
        <defs>
          <linearGradient id="sparkArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(16 185 129)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="rgb(16 185 129)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#sparkArea)" />
        <path d={path} fill="none" stroke="rgb(52 211 153)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {coords.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r={i === coords.length - 1 ? 3.5 : 1.5} fill={i === coords.length - 1 ? 'rgb(52 211 153)' : 'rgb(100 116 139)'} />
        ))}
      </svg>
    </div>
  )
}

/* ============================================================
   HISTÓRICO expandível
   ============================================================ */
function HistoryRow({ date, record, expanded, onToggle }) {
  const total = totalItems(record)
  const done = doneItems(record)
  const pct = progressPct(record)
  const complete = isComplete(record)
  const vol = sessionVolume(record)
  const w = WORKOUTS[record.workout]
  const doneList = []
  if (w) {
    w.blocks.forEach((b) =>
      b.exercises.forEach((ex) => {
        const s = record.exercises?.[ex.id]
        if (s?.done) doneList.push({ name: ex.name, carga: s.carga, reps: s.reps })
      }),
    )
  }
  ;(record.extras || []).forEach((ex) => { if (ex.done) doneList.push({ name: ex.name, carga: ex.carga, reps: ex.reps, extra: true }) })
  const cardiosDone = (record.cardios || []).filter((c) => c.done)
  return (
    <div className={['rounded-2xl transition overflow-hidden', complete ? 'card-done' : 'card-base'].join(' ')}>
      <button onClick={onToggle} className="w-full p-3.5 flex items-center gap-3 text-left active:bg-white/5 transition">
        <div className={['h-12 w-12 shrink-0 rounded-xl flex items-center justify-center font-display font-extrabold text-lg', complete ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-[0_4px_12px_-2px_rgba(16,185,129,0.5)]' : 'bg-slate-800/80 text-slate-300 border border-slate-700'].join(' ')}>
          {record.workout || '–'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-display font-bold text-white text-sm tabular-nums">{formatDate(date)}</span>
            <span className={['text-xs font-bold tabular-nums', complete ? 'text-emerald-300' : 'text-slate-400'].join(' ')}>{pct}%</span>
          </div>
          <div className="mt-0.5 text-[11px] text-slate-400 flex flex-wrap gap-x-3 gap-y-0.5">
            <span><span className="text-slate-200 tabular-nums">{done}</span><span className="text-slate-500">/</span><span className="tabular-nums">{total}</span> itens</span>
            {vol > 0 && <span>Vol: <span className="text-slate-200 tabular-nums">{vol.toLocaleString('pt-BR')}kg</span></span>}
            {record.peso && <span>Peso: <span className="text-slate-200">{record.peso}kg</span></span>}
            {record.cintura && <span>Cintura: <span className="text-slate-200">{record.cintura}cm</span></span>}
          </div>
        </div>
        <svg viewBox="0 0 24 24" className={`h-4 w-4 text-slate-500 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {expanded && (
        <div className="px-3.5 pb-3.5 -mt-1 border-t border-slate-800/60 pt-3 space-y-2">
          {doneList.length === 0 && cardiosDone.length === 0 && !record.obs && (
            <p className="text-xs text-slate-500 italic">Nenhum exercício marcado neste dia.</p>
          )}
          {doneList.map((it, i) => (
            <div key={i} className="flex items-center gap-2 text-[12px]">
              <span className={`h-1.5 w-1.5 rounded-full ${it.extra ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              <span className="text-slate-200 flex-1 truncate">{it.name}</span>
              <span className="text-slate-400 tabular-nums shrink-0">
                {it.carga ? `${it.carga}kg` : ''}{it.carga && it.reps ? ' · ' : ''}{it.reps ? `${it.reps} reps` : ''}
              </span>
            </div>
          ))}
          {cardiosDone.map((c) => (
            <div key={c.id} className="text-[12px]">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span className="text-slate-200 flex-1 truncate">{c.name}</span>
                {c.duration && <span className="text-slate-400 tabular-nums shrink-0">{c.duration}</span>}
              </div>
              {c.detail && <p className="ml-3.5 mt-0.5 text-[11px] text-slate-500 leading-snug">{c.detail}</p>}
            </div>
          ))}
          {record.obs && (
            <p className="text-[11px] text-slate-400 italic mt-2 pt-2 border-t border-slate-800/60">“{record.obs}”</p>
          )}
        </div>
      )}
    </div>
  )
}

/* ============================================================
   PROFILE SHEET
   ============================================================ */
function ProfileSheet({ profile, stats, level, onSave, onClose }) {
  const [form, setForm] = useState(profile)
  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  return (
    <Sheet onClose={onClose} title="Perfil">
      <div className="space-y-5">
        {/* Resumo de progresso */}
        <div className="rounded-2xl card-base p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-bold">Nível atual</div>
              <div className="font-display text-2xl font-extrabold text-white mt-0.5">{level.name}</div>
            </div>
            <div className="text-right">
              <div className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-bold">Sessões completas</div>
              <div className="font-display text-2xl font-extrabold text-emerald-300 mt-0.5 tabular-nums">{stats.completed}</div>
            </div>
          </div>
          {level.nextName && (
            <div className="mt-3">
              <div className="h-1.5 w-full rounded-full bg-slate-800/80 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${Math.max(2, level.progress)}%`, background: 'linear-gradient(90deg, #fbbf24, #f59e0b)' }} />
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5 uppercase tracking-wider font-bold">
                {level.progress}% para {level.nextName}
              </p>
            </div>
          )}
        </div>

        <Field label="Nome" value={form.nome} onChange={(v) => update('nome', v)} placeholder="Como prefere ser chamado" />

        <div className="grid grid-cols-2 gap-3">
          <Field label="Peso inicial (kg)" inputMode="decimal" value={form.pesoInicial} onChange={(v) => update('pesoInicial', v)} placeholder="85.0" />
          <Field label="Altura (cm)" inputMode="decimal" value={form.altura} onChange={(v) => update('altura', v)} placeholder="175" />
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-2">Objetivo</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(OBJETIVOS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => update('objetivo', key)}
                className={[
                  'rounded-xl border py-2.5 text-sm font-semibold transition active:scale-[0.98]',
                  form.objetivo === key
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200'
                    : 'bg-slate-900/40 border-slate-700/70 text-slate-300 hover:border-slate-600',
                ].join(' ')}
              >{label}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-2">Meta semanal</label>
          <div className="grid grid-cols-5 gap-2">
            {[2, 3, 4, 5, 6].map((n) => (
              <button
                key={n}
                onClick={() => update('metaSemanal', n)}
                className={[
                  'rounded-xl border py-2.5 font-display font-extrabold text-lg transition active:scale-95',
                  form.metaSemanal === n
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200'
                    : 'bg-slate-900/40 border-slate-700/70 text-slate-300',
                ].join(' ')}
              >{n}</button>
            ))}
          </div>
          <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-wider font-bold">Treinos por semana</p>
        </div>

        <div className="flex gap-2 pt-2">
          <button onClick={onClose} className="flex-1 rounded-xl border border-slate-700 bg-slate-900/50 py-3 text-sm font-semibold text-slate-300">Cancelar</button>
          <button onClick={() => onSave(form)} className="flex-1 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 py-3 text-sm font-bold text-emerald-950 active:scale-[0.98] transition">Salvar</button>
        </div>
      </div>
    </Sheet>
  )
}

/* ============================================================
   SHEET (modal de baixo pra cima)
   ============================================================ */
function Sheet({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-rise">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md mx-auto bg-slate-950 border-t sm:border border-slate-800 sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-slate-950/95 backdrop-blur border-b border-slate-800/60 px-5 py-4 flex items-center justify-between z-10">
          <h2 className="font-display text-lg font-extrabold text-white">{title}</h2>
          <button onClick={onClose} aria-label="Fechar" className="h-9 w-9 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-slate-800 active:scale-95 transition">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="p-5 safe-bottom">{children}</div>
      </div>
    </div>
  )
}

/* ============================================================
   FOCUS MODE — modo treino (1 exercício por vez)
   ============================================================ */
function FocusMode({ record, workout, allData, today, onClose, onTogglePlan, onUpdatePlan, onToggleExtra, onUpdateExtra, onToggleCardio, onUpdateCardio }) {
  const items = useMemo(() => buildSessionItems(record, workout), [record, workout])
  const [idx, setIdx] = useState(() => {
    // começa no primeiro não-feito
    const findIdx = items.findIndex((it) => {
      if (it.kind === 'plan') return !record.exercises?.[it.id]?.done
      if (it.kind === 'extra') return !record.extras?.find((e) => e.id === it.id)?.done
      return !record.cardios?.find((c) => c.id === it.id)?.done
    })
    return findIdx >= 0 ? findIdx : 0
  })

  if (items.length === 0) {
    return (
      <FocusOverlay onClose={onClose}>
        <div className="text-center px-8">
          <h2 className="font-display text-2xl font-bold text-white mb-2">Sem exercícios</h2>
          <p className="text-slate-400 text-sm">Adicione extras ou cardios pra usar o modo treino.</p>
        </div>
      </FocusOverlay>
    )
  }

  const current = items[idx]
  const total = items.length
  const completed = items.filter((it) => {
    if (it.kind === 'plan') return record.exercises?.[it.id]?.done
    if (it.kind === 'extra') return record.extras?.find((e) => e.id === it.id)?.done
    return record.cardios?.find((c) => c.id === it.id)?.done
  }).length

  const isFinished = completed === total

  const getState = () => {
    if (current.kind === 'plan') return record.exercises?.[current.id] || { done: false, carga: '', reps: '', obs: '' }
    if (current.kind === 'extra') return record.extras?.find((e) => e.id === current.id) || { done: false, carga: '', reps: '', obs: '' }
    return record.cardios?.find((c) => c.id === current.id) || { done: false, detail: '' }
  }
  const state = getState()

  const toggleCurrent = () => {
    if (current.kind === 'plan') onTogglePlan(current.id)
    else if (current.kind === 'extra') onToggleExtra(current.id)
    else onToggleCardio(current.id)
  }

  const updateCurrent = (field, value) => {
    if (current.kind === 'plan') onUpdatePlan(current.id, field, value)
    else if (current.kind === 'extra') onUpdateExtra(current.id, field, value)
    else onUpdateCardio(current.id, field, value)
  }

  const next = () => setIdx((i) => Math.min(i + 1, total - 1))
  const prev = () => setIdx((i) => Math.max(i - 1, 0))

  const completeAndAdvance = () => {
    if (!state.done) toggleCurrent()
    setTimeout(() => next(), 200)
  }

  const isCardio = current.kind === 'cardio'
  const isExtra = current.kind === 'extra'
  const lastData = !isCardio
    ? lastExerciseRecord({ id: current.id, name: current.name, isExtra }, allData, today)
    : null
  const suggestion = !isCardio ? suggestNextLoad(lastData, current.scheme) : null

  return (
    <FocusOverlay onClose={onClose}>
      {/* Progress bar topo */}
      <div className="absolute top-0 left-0 right-0 safe-top px-4 pt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-bold">
            <span className="text-white tabular-nums">{idx + 1}</span>
            <span className="text-slate-600"> / </span>
            <span className="tabular-nums">{total}</span>
          </div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-bold">
            <span className="text-emerald-400 tabular-nums">{completed}</span>
            <span className="text-slate-600"> de </span>
            <span className="tabular-nums">{total}</span> feitos
          </div>
          <button onClick={onClose} aria-label="Fechar" className="h-9 w-9 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-slate-800 active:scale-95 transition">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-800/80 overflow-hidden">
          <div
            className="h-full rounded-full transition-[width] duration-500"
            style={{ width: `${(completed / total) * 100}%`, background: 'linear-gradient(90deg, #10b981, #34d399)' }}
          />
        </div>
      </div>

      {/* Card central */}
      <div className="w-full max-w-md px-5 mt-20 mb-32">
        {isFinished ? (
          <FinishedView record={record} onClose={onClose} />
        ) : (
          <div className={['rounded-3xl p-6 border-2 transition-all', state.done ? (isCardio ? 'card-cardio border-sky-500/60' : 'card-done border-emerald-500/60') : 'card-base border-slate-800'].join(' ')}>
            {current.block && (
              <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-bold mb-1.5">{current.block}</div>
            )}
            <h2 className="font-display text-3xl font-extrabold text-white leading-tight mb-1">{current.name}</h2>
            {current.scheme && (
              <div className="inline-flex text-[12px] font-bold tabular-nums px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-200">
                {current.scheme}
              </div>
            )}

            {!isCardio && lastData && (
              <div className="mt-4 rounded-xl bg-slate-950/60 border border-slate-800 p-3">
                <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-bold mb-1">Última vez</div>
                <div className="flex items-baseline gap-2 text-slate-200">
                  <span className="font-display text-xl font-extrabold tabular-nums">{lastData.carga ? `${lastData.carga}kg` : '—'}</span>
                  {lastData.reps && <span className="text-slate-400">× {lastData.reps} reps</span>}
                  <span className="text-[11px] text-slate-500 ml-auto">{daysAgo(lastData.date)}</span>
                </div>
                {suggestion && (
                  <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-bold">Sugestão hoje</div>
                      <div className="font-display text-lg font-extrabold text-emerald-300 tabular-nums">
                        {suggestion.action === 'progress' && '↑ '}{fmtKg(suggestion.carga)}kg
                      </div>
                    </div>
                    <button
                      onClick={() => updateCurrent('carga', String(suggestion.carga).replace('.', ','))}
                      className="rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 active:scale-95 transition px-3 py-2 text-[11px] font-bold text-emerald-200 border border-emerald-500/40 uppercase tracking-wider"
                    >Usar</button>
                  </div>
                )}
              </div>
            )}

            {!isCardio ? (
              <>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <BigInput label="Carga (kg)" value={state.carga || ''} onChange={(v) => updateCurrent('carga', v)} />
                  <BigInput label="Reps feitas" value={state.reps || ''} onChange={(v) => updateCurrent('reps', v)} />
                </div>
                <Mini className="mt-4" label="Obs" value={state.obs || ''} onChange={(v) => updateCurrent('obs', v)} placeholder="Sensação, ajuste..." done={state.done} />
              </>
            ) : (
              <div className="mt-5">
                {current.detail && (
                  <p className="text-sm text-slate-300 leading-relaxed mb-3 whitespace-pre-line">{current.detail}</p>
                )}
                <Mini label="Detalhe / obs" value={state.detail || ''} onChange={(v) => updateCurrent('detail', v)} placeholder="O que você fez..." cardio done={state.done} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer fixo */}
      {!isFinished && (
        <div className="fixed bottom-0 left-0 right-0 safe-bottom px-4 pb-4 pt-3 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent">
          <div className="max-w-md mx-auto flex items-center gap-2">
            <button onClick={prev} disabled={idx === 0} className="h-14 w-14 shrink-0 rounded-2xl border border-slate-700 bg-slate-900 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={completeAndAdvance}
              className={[
                'flex-1 h-14 rounded-2xl font-display font-extrabold uppercase tracking-wider text-sm transition active:scale-[0.98] flex items-center justify-center gap-2',
                state.done
                  ? 'bg-slate-800 text-slate-400 border border-slate-700'
                  : isCardio
                  ? 'bg-gradient-to-br from-sky-400 to-blue-500 text-blue-950 shadow-[0_8px_25px_-5px_rgba(56,189,248,0.6)]'
                  : 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-emerald-950 shadow-[0_8px_25px_-5px_rgba(16,185,129,0.6)]',
              ].join(' ')}
            >
              {state.done ? (
                <>
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Feito
                </>
              ) : (
                <>✓ Concluir</>
              )}
            </button>
            <button onClick={next} disabled={idx === total - 1} className="h-14 w-14 shrink-0 rounded-2xl border border-slate-700 bg-slate-900 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </FocusOverlay>
  )
}

function FocusOverlay({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-40 app-bg overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center relative">
        {children}
      </div>
    </div>
  )
}

function BigInput({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-1.5">{label}</span>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="—"
        className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-4 font-display text-2xl font-extrabold text-white placeholder:text-slate-700 focus:outline-none focus:border-emerald-400/70 transition tabular-nums text-center"
      />
    </label>
  )
}

function FinishedView({ record, onClose }) {
  const vol = sessionVolume(record)
  const done = doneItems(record)
  const total = totalItems(record)
  return (
    <div className="rounded-3xl p-8 card-done border-2 border-emerald-500/50 text-center">
      <div className="text-5xl mb-3">🏆</div>
      <h2 className="font-display text-3xl font-extrabold text-white mb-1">Sessão completa!</h2>
      <p className="text-emerald-200/80 text-sm mb-6">Hoje virou ontem. Bom trabalho.</p>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-xl bg-slate-950/40 p-3 border border-emerald-700/30">
          <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Itens</div>
          <div className="font-display text-xl font-extrabold text-white tabular-nums mt-0.5">{done}/{total}</div>
        </div>
        <div className="rounded-xl bg-slate-950/40 p-3 border border-emerald-700/30">
          <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Volume</div>
          <div className="font-display text-xl font-extrabold text-emerald-300 tabular-nums mt-0.5">{vol > 0 ? vol.toLocaleString('pt-BR') : '—'}</div>
        </div>
        <div className="rounded-xl bg-slate-950/40 p-3 border border-emerald-700/30">
          <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Progresso</div>
          <div className="font-display text-xl font-extrabold text-white tabular-nums mt-0.5">{progressPct(record)}%</div>
        </div>
      </div>
      <button onClick={onClose} className="w-full rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 py-3.5 font-display font-extrabold uppercase tracking-wider text-sm text-emerald-950 active:scale-[0.98] transition">
        Voltar
      </button>
    </div>
  )
}

/* ============================================================
   EVOLUTION SHEET (mini-gráfico de evolução por exercício)
   ============================================================ */
function EvolutionSheet({ item, allData, onClose }) {
  const points = useMemo(() => exerciseHistory(item, allData), [item, allData])
  if (points.length === 0) {
    return (
      <Sheet title={item.name} onClose={onClose}>
        <p className="text-slate-400 text-sm text-center py-8">Sem histórico ainda.</p>
      </Sheet>
    )
  }

  const cargas = points.map((p) => p.carga)
  const min = Math.min(...cargas)
  const max = Math.max(...cargas)
  const first = points[0]
  const last = points[points.length - 1]
  const delta = last.carga - first.carga

  const W = 320, H = 100, P = 10
  const range = max - min || 1
  const xStep = points.length > 1 ? (W - 2 * P) / (points.length - 1) : 0
  const coords = points.map((p, i) => ({
    x: P + i * xStep,
    y: P + (H - 2 * P) * (1 - (p.carga - min) / range),
    carga: p.carga, reps: p.reps, date: p.date,
  }))
  const path = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ')
  const areaPath = points.length > 1 ? `${path} L ${coords[coords.length - 1].x.toFixed(1)} ${H - P} L ${coords[0].x.toFixed(1)} ${H - P} Z` : ''

  return (
    <Sheet title={item.name} onClose={onClose}>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <StatMini label="Atual" value={`${fmtKg(last.carga)}kg`} />
          <StatMini label="Máxima" value={`${fmtKg(max)}kg`} accent="emerald" />
          <StatMini label="Evolução" value={`${delta > 0 ? '+' : ''}${fmtKg(delta)}kg`} accent={delta > 0 ? 'emerald' : delta < 0 ? 'amber' : null} />
        </div>

        <div className="card-base rounded-2xl p-4">
          <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-bold mb-2">Carga ao longo do tempo</div>
          {points.length >= 2 ? (
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-24" preserveAspectRatio="none">
              <defs>
                <linearGradient id="evoArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(16 185 129)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="rgb(16 185 129)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#evoArea)" />
              <path d={path} fill="none" stroke="rgb(52 211 153)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {coords.map((c, i) => (
                <circle key={i} cx={c.x} cy={c.y} r={i === coords.length - 1 ? 3.5 : 2} fill={i === coords.length - 1 ? 'rgb(52 211 153)' : 'rgb(100 116 139)'} />
              ))}
            </svg>
          ) : (
            <div className="text-center py-4 text-sm text-slate-500">Apenas 1 registro até agora — a evolução aparece a partir do segundo.</div>
          )}
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-bold mb-2">Últimas sessões</div>
          <div className="space-y-1.5">
            {[...points].reverse().slice(0, 8).map((p, i, arr) => {
              const prev = arr[i + 1]
              const diff = prev ? p.carga - prev.carga : 0
              return (
                <div key={p.date} className="flex items-center gap-2 text-[12px] rounded-lg bg-slate-900/40 border border-slate-800 px-3 py-2">
                  <span className="text-slate-400 tabular-nums shrink-0">{formatDate(p.date)}</span>
                  <span className="text-slate-200 font-bold tabular-nums ml-auto">{fmtKg(p.carga)}kg</span>
                  {p.reps > 0 && <span className="text-slate-500 tabular-nums">× {p.reps}</span>}
                  {prev && diff !== 0 && (
                    <span className={['text-[10px] font-bold tabular-nums shrink-0', diff > 0 ? 'text-emerald-400' : 'text-amber-400'].join(' ')}>
                      {diff > 0 ? '+' : ''}{fmtKg(diff)}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Sheet>
  )
}

function StatMini({ label, value, accent }) {
  const colorClass = accent === 'emerald' ? 'text-emerald-300' : accent === 'amber' ? 'text-amber-300' : 'text-white'
  return (
    <div className="card-base rounded-xl p-3">
      <div className="text-[9px] uppercase tracking-[0.18em] text-slate-500 font-bold">{label}</div>
      <div className={`font-display text-lg font-extrabold tabular-nums leading-none mt-0.5 ${colorClass}`}>{value}</div>
    </div>
  )
}
