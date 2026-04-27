import { useState, useEffect, useMemo, useCallback } from 'react'

/* ============================================================
   TREINOS
   ============================================================ */
const WORKOUTS = {
  A: {
    name: 'Treino A',
    subtitle: 'Pernas · Peito/Costas · Ombro · Braços',
    blocks: [
      {
        title: 'Pernas',
        exercises: [
          { id: 'a-leg-press', name: 'Leg Press', scheme: '4x10' },
          { id: 'a-cadeira', name: 'Cadeira Extensora', scheme: '3x12' },
        ],
      },
      {
        title: 'Peito + Costas',
        exercises: [
          { id: 'a-supino-maq', name: 'Supino Máquina', scheme: '4x8–10' },
          { id: 'a-remada-maq', name: 'Remada Máquina', scheme: '4x10' },
        ],
      },
      {
        title: 'Costas + Ombro',
        exercises: [
          { id: 'a-puxada', name: 'Puxada Frente', scheme: '3x10' },
          { id: 'a-elev-lat', name: 'Elevação Lateral', scheme: '3x12–15' },
        ],
      },
      {
        title: 'Braços',
        exercises: [
          { id: 'a-biceps', name: 'Bíceps', scheme: '3x12' },
          { id: 'a-triceps', name: 'Tríceps', scheme: '3x12' },
        ],
      },
    ],
    cardio: { id: 'a-cardio', name: 'Zona 2', scheme: '20 min' },
  },
  B: {
    name: 'Treino B',
    subtitle: 'Pernas · Peito/Costas · Ombro · Core',
    blocks: [
      {
        title: 'Pernas',
        exercises: [
          { id: 'b-agachamento', name: 'Agachamento Guiado', scheme: '3x10' },
          { id: 'b-mesa-flex', name: 'Mesa Flexora', scheme: '3x12' },
        ],
      },
      {
        title: 'Peito + Costas',
        exercises: [
          { id: 'b-supino-inc', name: 'Supino Inclinado', scheme: '3x10' },
          { id: 'b-remada-baixa', name: 'Remada Baixa', scheme: '3x10' },
        ],
      },
      {
        title: 'Ombro',
        exercises: [
          { id: 'b-desenvolvimento', name: 'Desenvolvimento Máquina', scheme: '3x10' },
        ],
      },
      {
        title: 'Core',
        exercises: [
          { id: 'b-ab-curto', name: 'Abdominal Curto', scheme: '3x15' },
          { id: 'b-prancha', name: 'Prancha', scheme: '3x30s' },
        ],
      },
    ],
    cardio: { id: 'b-cardio', name: 'Intervalado leve', scheme: '20 min · 2 min leve + 1 min moderado' },
  },
  C: {
    name: 'Treino C',
    subtitle: 'Pernas · Peito/Costas · Ombro',
    blocks: [
      {
        title: 'Pernas',
        exercises: [
          { id: 'c-leg-press', name: 'Leg Press', scheme: '4x8–10' },
          { id: 'c-panturrilha', name: 'Panturrilha', scheme: '4x15' },
        ],
      },
      {
        title: 'Peito + Costas',
        exercises: [
          { id: 'c-supino', name: 'Supino', scheme: '4x8' },
          { id: 'c-remada', name: 'Remada', scheme: '4x8' },
        ],
      },
      {
        title: 'Costas + Ombro',
        exercises: [
          { id: 'c-puxada', name: 'Puxada', scheme: '3x10' },
          { id: 'c-elev-lat', name: 'Elevação Lateral', scheme: '3x15' },
        ],
      },
    ],
    cardio: { id: 'c-cardio', name: 'Zona 2', scheme: '25 a 30 min' },
  },
  D: {
    name: 'Treino D',
    subtitle: 'Circuito leve + Cardio longo',
    blocks: [
      {
        title: 'Circuito leve',
        exercises: [
          { id: 'd-agachamento', name: 'Agachamento Leve', scheme: '3x12' },
          { id: 'd-flexao', name: 'Flexão ou Supino Leve', scheme: '3x10' },
          { id: 'd-remada', name: 'Remada Leve', scheme: '3x10' },
          { id: 'd-abdominal', name: 'Abdominal', scheme: '3x15' },
        ],
      },
    ],
    cardio: { id: 'd-cardio', name: 'Caminhada, elíptico ou escada leve', scheme: '35 a 45 min' },
  },
}

/* ============================================================
   FRASES MOTIVACIONAIS — pool com tom executivo, sem clichês
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
   HELPERS
   ============================================================ */
const STORAGE_KEY = 'shapemax:data:v1'
const CURRENT_KEY = 'shapemax:current:v1'

const todayKey = () => {
  const d = new Date()
  return formatDateISO(d)
}

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

const emptyDay = (workout) => ({
  workout,
  exercises: {},
  extras: [],
  cardio: { done: false, obs: '' },
  peso: '',
  cintura: '',
  obs: '',
})

const totalItems = (record) => {
  if (!record) return 0
  const w = WORKOUTS[record.workout]
  if (!w) return 0
  const planTotal = w.blocks.reduce((s, b) => s + b.exercises.length, 0)
  const extrasTotal = (record.extras || []).length
  return planTotal + extrasTotal + 1 // +1 cardio
}

const doneItems = (record) => {
  if (!record) return 0
  const ex = Object.values(record.exercises || {}).filter((e) => e?.done).length
  const extras = (record.extras || []).filter((e) => e?.done).length
  const cardio = record.cardio?.done ? 1 : 0
  return ex + extras + cardio
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

/* ===== Volume da sessão (carga × reps somados) ===== */
const sessionVolume = (record) => {
  if (!record) return 0
  let total = 0
  const sum = (e) => {
    if (!e?.done) return
    const c = parseFloat((e.carga || '').toString().replace(',', '.'))
    const r = parseFloat((e.reps || '').toString().replace(',', '.'))
    if (!isNaN(c) && !isNaN(r) && c > 0 && r > 0) total += c * r
  }
  Object.values(record.exercises || {}).forEach(sum)
  ;(record.extras || []).forEach(sum)
  return Math.round(total)
}

/* ===== Personal Record check (volume = carga * reps) ===== */
const isPR = (exId, exData, allData, dayKey) => {
  if (!exData?.done) return false
  const c = parseFloat((exData.carga || '').toString().replace(',', '.'))
  const r = parseFloat((exData.reps || '').toString().replace(',', '.'))
  if (isNaN(c) || isNaN(r) || c <= 0 || r <= 0) return false
  const currentVol = c * r

  let maxBefore = 0
  let hadBefore = false
  for (const [date, rec] of Object.entries(allData)) {
    if (date >= dayKey) continue
    const ex = rec.exercises?.[exId]
    if (!ex?.done) continue
    const pc = parseFloat((ex.carga || '').toString().replace(',', '.'))
    const pr = parseFloat((ex.reps || '').toString().replace(',', '.'))
    if (isNaN(pc) || isNaN(pr) || pc <= 0 || pr <= 0) continue
    hadBefore = true
    const v = pc * pr
    if (v > maxBefore) maxBefore = v
  }
  return hadBefore && currentVol > maxBefore
}

/* ===== Streak (dias consecutivos com sessão registrada) ===== */
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

  if (!trained.has(formatDateISO(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
  }

  while (trained.has(formatDateISO(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
    if (streak > 365) break
  }
  return streak
}

/* ===== Hash determinístico pra escolher frase do dia ===== */
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

/* ===== Histórico de peso (últimos N pontos preenchidos) ===== */
const weightHistory = (data, lastN = 30) => {
  return Object.entries(data)
    .filter(([, r]) => r.peso)
    .map(([date, r]) => ({ date, peso: parseFloat((r.peso || '').toString().replace(',', '.')) }))
    .filter((p) => !isNaN(p.peso))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-lastN)
}

/* ===== Últimos 7 dias com status ===== */
const last7Days = (data) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const out = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = formatDateISO(d)
    const rec = data[key]
    const status =
      !rec || doneItems(rec) === 0 ? 'empty' : isComplete(rec) ? 'complete' : 'partial'
    const wd = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'][d.getDay()]
    out.push({ key, label: wd, status, isToday: i === 0 })
  }
  return out
}

/* ============================================================
   APP
   ============================================================ */
export default function App() {
  const [data, setData] = useState({})
  const [currentWorkout, setCurrentWorkout] = useState('A')
  const [loaded, setLoaded] = useState(false)
  const [expandedHistory, setExpandedHistory] = useState(null)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setData(JSON.parse(raw))
      const cur = localStorage.getItem(CURRENT_KEY)
      if (cur && WORKOUTS[cur]) setCurrentWorkout(cur)
    } catch (e) {
      console.warn('Falha ao ler localStorage', e)
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      console.warn('Falha ao salvar', e)
    }
  }, [data, loaded])

  useEffect(() => {
    if (!loaded) return
    localStorage.setItem(CURRENT_KEY, currentWorkout)
  }, [currentWorkout, loaded])

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

  const toggleCardio = () => {
    setTodayRecord((cur) => ({
      ...cur,
      cardio: { ...(cur.cardio || { obs: '' }), done: !cur.cardio?.done },
    }))
  }
  const updateCardio = (field, value) => {
    setTodayRecord((cur) => ({
      ...cur,
      cardio: { done: false, obs: '', ...(cur.cardio || {}), [field]: value },
    }))
  }

  const updateField = (field, value) => {
    setTodayRecord((cur) => ({ ...cur, [field]: value }))
  }

  /* === EXTRAS === */
  const addExtra = (name, scheme) => {
    if (!name.trim()) return
    const id = `extra-${Date.now()}`
    setTodayRecord((cur) => ({
      ...cur,
      extras: [
        ...(cur.extras || []),
        { id, name: name.trim(), scheme: scheme.trim(), done: false, carga: '', reps: '', obs: '' },
      ],
    }))
    setAdding(false)
  }
  const toggleExtra = (id) => {
    setTodayRecord((cur) => ({
      ...cur,
      extras: (cur.extras || []).map((e) => (e.id === id ? { ...e, done: !e.done } : e)),
    }))
  }
  const updateExtra = (id, field, value) => {
    setTodayRecord((cur) => ({
      ...cur,
      extras: (cur.extras || []).map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    }))
  }
  const removeExtra = (id) => {
    setTodayRecord((cur) => ({
      ...cur,
      extras: (cur.extras || []).filter((e) => e.id !== id),
    }))
  }

  const clearToday = () => {
    if (!window.confirm('Limpar o treino de HOJE? O histórico anterior será mantido.')) return
    setData((prev) => {
      const next = { ...prev }
      delete next[today]
      return next
    })
  }

  const workoutKey = todayRecord.workout || currentWorkout
  const workout = WORKOUTS[workoutKey]
  const progress = progressPct(todayRecord)
  const volume = sessionVolume(todayRecord)
  const streak = useMemo(() => calculateStreak(data), [data])
  const motivation = useMemo(() => motivationLine(todayRecord, today), [todayRecord, today])
  const week = useMemo(() => last7Days(data), [data])
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

  return (
    <div className="app-bg min-h-screen text-slate-100">
      <div className="mx-auto max-w-md px-4 safe-top safe-bottom">
        {/* ===== HEADER ===== */}
        <header className="pt-6 pb-2 animate-rise">
          <div className="flex items-center justify-between">
            <Badge />
            <DateChip date={today} />
          </div>

          <h1 className="font-display text-[34px] font-bold mt-5 leading-[1.05] text-white">
            Treino de hoje
          </h1>
          <p className="text-slate-300 text-sm mt-1.5">
            <span className="text-emerald-300 font-semibold">{workout.name}</span>
            <span className="text-slate-500 mx-1.5">·</span>
            <span className="text-slate-300">{workout.subtitle}</span>
          </p>

          {/* Frase motivacional */}
          <div className="mt-4 px-1">
            <p className="text-[13px] text-slate-400 italic leading-relaxed">
              <span className="text-emerald-400 not-italic mr-1.5">“</span>
              {motivation}
              <span className="text-emerald-400 not-italic ml-1">”</span>
            </p>
          </div>

          {/* Card progresso + volume + streak */}
          <div className="card-base rounded-2xl p-5 mt-4">
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold">
                Progresso
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-3xl font-extrabold text-white tabular-nums">
                  {progress}
                </span>
                <span className="text-slate-500 text-base font-semibold">%</span>
              </div>
            </div>
            <div className="mt-3.5 h-2.5 w-full rounded-full bg-slate-800/80 overflow-hidden ring-1 ring-slate-700/50">
              <div
                className="h-full rounded-full transition-[width] duration-500 ease-out"
                style={{
                  width: `${progress}%`,
                  background:
                    progress >= 70
                      ? 'linear-gradient(90deg, #10b981, #34d399, #6ee7b7)'
                      : 'linear-gradient(90deg, #38bdf8, #818cf8, #a78bfa)',
                  boxShadow:
                    progress >= 70
                      ? '0 0 12px rgba(16, 185, 129, 0.6)'
                      : '0 0 12px rgba(56, 189, 248, 0.5)',
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

            {/* Mini-divisor */}
            <div className="mt-4 pt-4 border-t border-slate-800/60 grid grid-cols-3 gap-2">
              <MiniMetric label="Volume" value={volume > 0 ? volume.toLocaleString('pt-BR') : '—'} unit={volume > 0 ? 'kg' : ''} />
              <MiniMetric label="Streak" value={streak} unit={streak === 1 ? 'dia' : 'dias'} highlight={streak >= 3} />
              <MiniMetric label="Esta semana" value={week.filter((d) => d.status !== 'empty').length} unit="/ 7" />
            </div>
          </div>

          {/* Frequência últimos 7 dias */}
          <WeekDots week={week} />
        </header>

        {/* ===== SELETOR DE TREINO ===== */}
        <section className="mt-7 animate-rise">
          <SectionLabel>Selecione o treino</SectionLabel>
          <div className="grid grid-cols-4 gap-2.5 mt-3">
            {Object.keys(WORKOUTS).map((k) => (
              <WorkoutButton key={k} letter={k} active={workoutKey === k} onClick={() => switchWorkout(k)} />
            ))}
          </div>
        </section>

        {/* ===== EXERCÍCIOS ===== */}
        <section className="mt-7 space-y-6 animate-rise">
          {workout.blocks.map((block) => {
            const bp = blockProgress(block, todayRecord)
            return (
              <Block key={block.title} title={block.title} done={bp.done} total={bp.total}>
                {block.exercises.map((ex) => {
                  const state = todayRecord.exercises[ex.id]
                  const pr = isPR(ex.id, state, data, today)
                  return (
                    <ExerciseCard
                      key={ex.id}
                      exercise={ex}
                      state={state}
                      pr={pr}
                      onToggle={() => toggleExercise(ex.id)}
                      onUpdate={(field, value) => updateExercise(ex.id, field, value)}
                    />
                  )
                })}
              </Block>
            )
          })}

          {/* === EXTRAS === */}
          <ExtrasBlock
            extras={todayRecord.extras || []}
            adding={adding}
            onStartAdd={() => setAdding(true)}
            onCancelAdd={() => setAdding(false)}
            onAdd={addExtra}
            onToggle={toggleExtra}
            onUpdate={updateExtra}
            onRemove={removeExtra}
          />

          <Block title="Cardio" accent="cardio" done={todayRecord.cardio?.done ? 1 : 0} total={1}>
            <CardioCard
              cardio={workout.cardio}
              state={todayRecord.cardio}
              onToggle={toggleCardio}
              onUpdate={updateCardio}
            />
          </Block>
        </section>

        {/* ===== MÉTRICAS DO DIA ===== */}
        <section className="mt-7 animate-rise">
          <SectionLabel>Métricas do dia</SectionLabel>
          <div className="card-base rounded-2xl p-5 mt-3 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Peso (kg)" inputMode="decimal" value={todayRecord.peso} onChange={(v) => updateField('peso', v)} placeholder="82.5" />
              <Field label="Cintura (cm)" inputMode="decimal" value={todayRecord.cintura} onChange={(v) => updateField('cintura', v)} placeholder="88" />
            </div>
            <Field
              label="Observações gerais"
              textarea
              value={todayRecord.obs}
              onChange={(v) => updateField('obs', v)}
              placeholder="Como foi o treino, energia, sono..."
            />
          </div>
        </section>

        {/* ===== EVOLUÇÃO DE PESO ===== */}
        {weights.length >= 2 && (
          <section className="mt-7 animate-rise">
            <SectionLabel>Evolução do peso</SectionLabel>
            <div className="card-base rounded-2xl p-4 mt-3">
              <WeightSparkline points={weights} />
            </div>
          </section>
        )}

        {/* ===== ESTATÍSTICAS ===== */}
        <section className="mt-7 animate-rise">
          <SectionLabel>Estatísticas gerais</SectionLabel>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <StatCard label="Sessões registradas" value={stats.sessions} />
            <StatCard label="Sessões completas" value={stats.completed} accent="emerald" />
            <StatCard label="Frequência" value={`${stats.frequency}%`} accent="sky" />
            <StatCard label="Streak atual" value={streak} unit={streak === 1 ? 'dia' : 'dias'} accent={streak >= 3 ? 'fire' : null} />
          </div>
        </section>

        {/* ===== HISTÓRICO ===== */}
        <section className="mt-7 animate-rise">
          <SectionLabel>Histórico (últimos 10)</SectionLabel>
          <div className="mt-3 space-y-2.5">
            {history.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 p-7 text-center text-sm text-slate-500">
                Nenhum treino registrado ainda. Bora começar?
              </div>
            ) : (
              history.map(([date, rec]) => (
                <HistoryRow
                  key={date}
                  date={date}
                  record={rec}
                  expanded={expandedHistory === date}
                  onToggle={() => setExpandedHistory(expandedHistory === date ? null : date)}
                />
              ))
            )}
          </div>
        </section>

        {/* ===== AÇÕES ===== */}
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
    </div>
  )
}

/* ============================================================
   COMPONENTES
   ============================================================ */

function Badge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 backdrop-blur">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70 pulse-dot" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
      </span>
      <span className="font-display text-[11px] font-bold tracking-[0.2em] uppercase text-emerald-200">
        Projeto Shape Max
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
  return (
    <h2 className="font-display text-[11px] font-bold tracking-[0.24em] uppercase text-slate-400">
      {children}
    </h2>
  )
}

function MiniMetric({ label, value, unit, highlight }) {
  return (
    <div className="text-center">
      <div className="text-[9px] uppercase tracking-[0.18em] text-slate-500 font-bold mb-0.5">
        {label}
      </div>
      <div className="flex items-baseline justify-center gap-1">
        <span
          className={[
            'font-display text-xl font-extrabold tabular-nums leading-none',
            highlight ? 'text-amber-300' : 'text-white',
          ].join(' ')}
        >
          {value}
        </span>
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
          <span
            className={[
              'text-[9px] font-bold uppercase tracking-wider',
              d.isToday ? 'text-white' : 'text-slate-600',
            ].join(' ')}
          >
            {d.label}
          </span>
          <span
            className={[
              'h-2.5 w-2.5 rounded-full transition',
              d.status === 'complete'
                ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]'
                : d.status === 'partial'
                ? 'bg-amber-400/80'
                : d.isToday
                ? 'bg-slate-600 ring-2 ring-slate-500/40'
                : 'bg-slate-700/60',
            ].join(' ')}
          />
        </div>
      ))}
    </div>
  )
}

function WorkoutButton({ letter, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        'relative h-[68px] rounded-2xl font-display font-extrabold text-[26px] transition-all active:scale-[0.97]',
        active
          ? 'bg-gradient-to-br from-white to-slate-200 text-slate-900 shadow-[0_8px_25px_-5px_rgba(255,255,255,0.35),0_0_0_1px_rgba(255,255,255,0.5)]'
          : 'card-base text-slate-200 hover:border-slate-600',
      ].join(' ')}
    >
      <span className="block leading-none">{letter}</span>
      <span
        className={[
          'block text-[9px] font-bold tracking-[0.2em] uppercase mt-1',
          active ? 'text-slate-600' : 'text-slate-500',
        ].join(' ')}
      >
        Treino
      </span>
    </button>
  )
}

function Block({ title, accent, children, done = 0, total = 0 }) {
  const isCardio = accent === 'cardio'
  const isExtras = accent === 'extras'
  const allDone = total > 0 && done === total
  const accentColor = isCardio ? 'sky' : isExtras ? 'amber' : 'emerald'

  const barClass =
    accentColor === 'sky'
      ? 'bg-gradient-to-r from-sky-400 to-blue-500 shadow-[0_0_8px_rgba(56,189,248,0.5)]'
      : accentColor === 'amber'
      ? 'bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_8px_rgba(251,191,36,0.5)]'
      : 'bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.5)]'

  const pillClass = allDone
    ? accentColor === 'sky'
      ? 'text-sky-200 bg-sky-500/20 border border-sky-500/40'
      : accentColor === 'amber'
      ? 'text-amber-200 bg-amber-500/20 border border-amber-500/40'
      : 'text-emerald-200 bg-emerald-500/20 border border-emerald-500/40'
    : 'text-slate-400 bg-slate-800/60 border border-slate-700/60'

  return (
    <div>
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2.5">
          <span className={['h-1.5 w-7 rounded-full', barClass].join(' ')} />
          <h3 className="font-display text-[13px] font-bold uppercase tracking-[0.18em] text-slate-100">
            {title}
          </h3>
        </div>
        {total > 0 && (
          <span className={['text-[11px] font-bold tabular-nums px-2 py-0.5 rounded-full', pillClass].join(' ')}>
            {done}/{total}
          </span>
        )}
      </div>
      <div className="space-y-2.5">{children}</div>
    </div>
  )
}

function ExerciseCard({ exercise, state, pr, onToggle, onUpdate }) {
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
            <h4 className={['font-display font-bold text-[16px] leading-tight flex items-center gap-1.5', done ? 'text-emerald-100' : 'text-white'].join(' ')}>
              {exercise.name}
              {pr && <PRBadge />}
            </h4>
            <span
              className={[
                'shrink-0 text-[11px] font-bold tabular-nums px-2 py-0.5 rounded-md',
                done ? 'text-emerald-200 bg-emerald-500/20' : 'text-slate-300 bg-slate-800/80 border border-slate-700/60',
              ].join(' ')}
            >
              {exercise.scheme}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <Mini label="Carga" value={carga} onChange={(v) => onUpdate('carga', v)} placeholder="kg" done={done} />
            <Mini label="Reps" value={reps} onChange={(v) => onUpdate('reps', v)} placeholder="—" done={done} />
          </div>
          <Mini className="mt-2.5" label="Obs" value={obs} onChange={(v) => onUpdate('obs', v)} placeholder="Sensação, ajuste, dor leve..." done={done} />
        </div>
      </div>
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

function CardioCard({ cardio, state, onToggle, onUpdate }) {
  const done = !!state?.done
  const obs = state?.obs || ''

  return (
    <div className={['rounded-2xl p-4 transition-all', done ? 'card-cardio' : 'card-base'].join(' ')}>
      <div className="flex items-start gap-3.5">
        <CheckButton done={done} onClick={onToggle} variant="sky" />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h4 className={['font-display font-bold text-[16px] leading-tight', done ? 'text-sky-100' : 'text-white'].join(' ')}>
              {cardio.name}
            </h4>
            <span
              className={[
                'shrink-0 text-[10px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-md',
                done ? 'text-sky-200 bg-sky-500/20' : 'text-sky-300 bg-sky-500/15 border border-sky-500/30',
              ].join(' ')}
            >
              Cardio
            </span>
          </div>
          <p className={done ? 'mt-1 text-sm text-sky-200/80' : 'mt-1 text-sm text-slate-300'}>{cardio.scheme}</p>
          <Mini className="mt-3" label="Obs" value={obs} onChange={(v) => onUpdate('obs', v)} placeholder="Tempo real, intensidade, BPM..." done={done} cardio />
        </div>
      </div>
    </div>
  )
}

/* ===== EXTRAS ===== */
function ExtrasBlock({ extras, adding, onStartAdd, onCancelAdd, onAdd, onToggle, onUpdate, onRemove }) {
  return (
    <Block title="Extras do dia" accent="extras" done={extras.filter((e) => e.done).length} total={extras.length}>
      {extras.map((ex) => (
        <ExtraCard key={ex.id} extra={ex} onToggle={() => onToggle(ex.id)} onUpdate={(f, v) => onUpdate(ex.id, f, v)} onRemove={() => onRemove(ex.id)} />
      ))}

      {adding ? (
        <AddExtraForm onSave={onAdd} onCancel={onCancelAdd} />
      ) : (
        <button
          onClick={onStartAdd}
          className="w-full rounded-2xl border border-dashed border-amber-500/40 bg-amber-950/15 hover:bg-amber-950/25 active:scale-[0.99] transition py-3.5 text-amber-300 font-semibold text-sm flex items-center justify-center gap-2"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Adicionar exercício
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
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 rounded-xl border border-slate-700 bg-slate-900/50 py-2.5 text-sm font-semibold text-slate-300 active:scale-[0.98] transition"
        >
          Cancelar
        </button>
        <button
          onClick={() => onSave(name, scheme)}
          disabled={!name.trim()}
          className="flex-1 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 py-2.5 text-sm font-bold text-orange-950 active:scale-[0.98] transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Adicionar
        </button>
      </div>
    </div>
  )
}

function ExtraCard({ extra, onToggle, onUpdate, onRemove }) {
  const done = !!extra.done
  return (
    <div className={['rounded-2xl p-4 transition-all', done ? 'card-done' : 'card-base'].join(' ')}>
      <div className="flex items-start gap-3.5">
        <CheckButton done={done} onClick={onToggle} variant="emerald" />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h4 className={['font-display font-bold text-[16px] leading-tight', done ? 'text-emerald-100' : 'text-white'].join(' ')}>
              {extra.name}
            </h4>
            <div className="flex items-center gap-1.5 shrink-0">
              {extra.scheme && (
                <span
                  className={[
                    'text-[11px] font-bold tabular-nums px-2 py-0.5 rounded-md',
                    done ? 'text-emerald-200 bg-emerald-500/20' : 'text-slate-300 bg-slate-800/80 border border-slate-700/60',
                  ].join(' ')}
                >
                  {extra.scheme}
                </span>
              )}
              <button
                onClick={onRemove}
                aria-label="Remover"
                className="h-7 w-7 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition flex items-center justify-center"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
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

function CheckButton({ done, onClick, variant = 'emerald' }) {
  const palette =
    variant === 'sky'
      ? {
          on: 'bg-gradient-to-br from-sky-400 to-blue-500 border-sky-300 text-white shadow-[0_0_0_4px_rgba(56,189,248,0.2),0_4px_15px_-2px_rgba(56,189,248,0.6)]',
          off: 'bg-slate-900/80 border-slate-600 hover:border-sky-400/70',
        }
      : {
          on: 'bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-300 text-white shadow-[0_0_0_4px_rgba(16,185,129,0.2),0_4px_15px_-2px_rgba(16,185,129,0.6)]',
          off: 'bg-slate-900/80 border-slate-600 hover:border-emerald-400/70',
        }

  return (
    <button
      onClick={onClick}
      aria-pressed={done}
      className={['mt-0.5 h-10 w-10 shrink-0 rounded-xl border-2 flex items-center justify-center transition-all active:scale-90', done ? palette.on : palette.off].join(' ')}
    >
      {done && (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </button>
  )
}

function Mini({ label, value, onChange, placeholder, className = '', done = false, cardio = false }) {
  const focusRing = cardio ? 'focus:border-sky-400/70' : 'focus:border-emerald-400/70'
  return (
    <label className={`block ${className}`}>
      <span className="block text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-1.5">{label}</span>
      <input
        type="text"
        inputMode={label === 'Carga' || label === 'Reps' ? 'decimal' : 'text'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={[
          'w-full rounded-xl border px-3 py-2.5 text-[15px] font-medium text-white placeholder:text-slate-500 transition focus:outline-none',
          done ? 'bg-slate-950/40 border-emerald-700/40' : 'bg-slate-950/60 border-slate-700/70',
          focusRing,
        ].join(' ')}
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
  const accentClass =
    accent === 'emerald'
      ? 'text-emerald-300'
      : accent === 'sky'
      ? 'text-sky-300'
      : accent === 'fire'
      ? 'text-amber-300'
      : 'text-white'

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
   SPARKLINE de peso
   ============================================================ */
function WeightSparkline({ points }) {
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
    peso: p.peso,
    date: p.date,
  }))

  const path = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ')
  const areaPath = `${path} L ${coords[coords.length - 1].x.toFixed(1)} ${H - P} L ${coords[0].x.toFixed(1)} ${H - P} Z`

  const first = points[0], last = points[points.length - 1]
  const delta = last.peso - first.peso
  const deltaPct = (delta / first.peso) * 100

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2 px-1">
        <div>
          <div className="font-display text-2xl font-extrabold text-white tabular-nums leading-none">
            {last.peso.toFixed(1)}
            <span className="text-sm text-slate-500 font-semibold ml-1">kg</span>
          </div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-bold mt-1">
            Atual · {formatDateShort(last.date)}
          </div>
        </div>
        <div
          className={[
            'text-right',
            delta < 0 ? 'text-emerald-300' : delta > 0 ? 'text-amber-300' : 'text-slate-400',
          ].join(' ')}
        >
          <div className="font-display text-base font-extrabold tabular-nums leading-none">
            {delta > 0 ? '+' : ''}
            {delta.toFixed(1)} kg
          </div>
          <div className="text-[10px] uppercase tracking-[0.18em] font-bold mt-1 opacity-80">
            {deltaPct > 0 ? '+' : ''}
            {deltaPct.toFixed(1)}% · {points.length} regs
          </div>
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
          <circle
            key={i}
            cx={c.x}
            cy={c.y}
            r={i === coords.length - 1 ? 3.5 : 1.5}
            fill={i === coords.length - 1 ? 'rgb(52 211 153)' : 'rgb(100 116 139)'}
          />
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

  // Lista de exercícios feitos
  const doneList = []
  if (w) {
    w.blocks.forEach((b) =>
      b.exercises.forEach((ex) => {
        const s = record.exercises?.[ex.id]
        if (s?.done) doneList.push({ name: ex.name, carga: s.carga, reps: s.reps })
      }),
    )
  }
  ;(record.extras || []).forEach((ex) => {
    if (ex.done) doneList.push({ name: ex.name, carga: ex.carga, reps: ex.reps, extra: true })
  })
  const cardioDone = record.cardio?.done

  return (
    <div className={['rounded-2xl transition overflow-hidden', complete ? 'card-done' : 'card-base'].join(' ')}>
      <button onClick={onToggle} className="w-full p-3.5 flex items-center gap-3 text-left active:bg-white/5 transition">
        <div
          className={[
            'h-12 w-12 shrink-0 rounded-xl flex items-center justify-center font-display font-extrabold text-lg',
            complete ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-[0_4px_12px_-2px_rgba(16,185,129,0.5)]' : 'bg-slate-800/80 text-slate-300 border border-slate-700',
          ].join(' ')}
        >
          {record.workout || '–'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-display font-bold text-white text-sm tabular-nums">{formatDate(date)}</span>
            <span className={['text-xs font-bold tabular-nums', complete ? 'text-emerald-300' : 'text-slate-400'].join(' ')}>{pct}%</span>
          </div>
          <div className="mt-0.5 text-[11px] text-slate-400 flex flex-wrap gap-x-3 gap-y-0.5">
            <span>
              <span className="text-slate-200 tabular-nums">{done}</span>
              <span className="text-slate-500">/</span>
              <span className="tabular-nums">{total}</span> itens
            </span>
            {vol > 0 && (
              <span>
                Vol: <span className="text-slate-200 tabular-nums">{vol.toLocaleString('pt-BR')}kg</span>
              </span>
            )}
            {record.peso && (
              <span>
                Peso: <span className="text-slate-200">{record.peso}kg</span>
              </span>
            )}
            {record.cintura && (
              <span>
                Cintura: <span className="text-slate-200">{record.cintura}cm</span>
              </span>
            )}
          </div>
        </div>
        <svg
          viewBox="0 0 24 24"
          className={`h-4 w-4 text-slate-500 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {expanded && (
        <div className="px-3.5 pb-3.5 -mt-1 border-t border-slate-800/60 pt-3 space-y-2">
          {doneList.length === 0 && !cardioDone && !record.obs && (
            <p className="text-xs text-slate-500 italic">Nenhum exercício marcado neste dia.</p>
          )}
          {doneList.map((it, i) => (
            <div key={i} className="flex items-center gap-2 text-[12px]">
              <span className={`h-1.5 w-1.5 rounded-full ${it.extra ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              <span className="text-slate-200 flex-1 truncate">{it.name}</span>
              <span className="text-slate-400 tabular-nums shrink-0">
                {it.carga ? `${it.carga}kg` : ''}
                {it.carga && it.reps ? ' · ' : ''}
                {it.reps ? `${it.reps} reps` : ''}
              </span>
            </div>
          ))}
          {cardioDone && (
            <div className="flex items-center gap-2 text-[12px]">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              <span className="text-slate-200 flex-1">Cardio · {w?.cardio?.name}</span>
              {record.cardio?.obs && <span className="text-slate-500 truncate max-w-[120px]">{record.cardio.obs}</span>}
            </div>
          )}
          {record.obs && (
            <p className="text-[11px] text-slate-400 italic mt-2 pt-2 border-t border-slate-800/60">
              “{record.obs}”
            </p>
          )}
        </div>
      )}
    </div>
  )
}
