import { useState, useEffect, useMemo, useCallback } from 'react'

/* ============================================================
   DADOS DOS TREINOS
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
    cardio: {
      id: 'b-cardio',
      name: 'Intervalado leve',
      scheme: '20 min · 2 min leve + 1 min moderado',
    },
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
    cardio: {
      id: 'd-cardio',
      name: 'Caminhada, elíptico ou escada leve',
      scheme: '35 a 45 min',
    },
  },
}

/* ============================================================
   HELPERS
   ============================================================ */
const STORAGE_KEY = 'shapemax:data:v1'
const CURRENT_KEY = 'shapemax:current:v1'

const todayKey = () => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const formatDate = (key) => {
  const [y, m, d] = key.split('-')
  return `${d}/${m}/${y}`
}

const emptyDay = (workout) => ({
  workout,
  exercises: {},
  cardio: { done: false, obs: '' },
  peso: '',
  cintura: '',
  obs: '',
})

const totalItems = (workoutKey) => {
  const w = WORKOUTS[workoutKey]
  if (!w) return 0
  return w.blocks.reduce((s, b) => s + b.exercises.length, 0) + 1 // +1 cardio
}

const doneItems = (record) => {
  if (!record) return 0
  const ex = Object.values(record.exercises || {}).filter((e) => e?.done).length
  const cardio = record.cardio?.done ? 1 : 0
  return ex + cardio
}

const progressPct = (record) => {
  if (!record) return 0
  const total = totalItems(record.workout)
  return total === 0 ? 0 : Math.round((doneItems(record) / total) * 100)
}

const isComplete = (record) => progressPct(record) >= 70

/* ============================================================
   COMPONENTE PRINCIPAL
   ============================================================ */
export default function App() {
  const [data, setData] = useState({})
  const [currentWorkout, setCurrentWorkout] = useState('A')
  const [loaded, setLoaded] = useState(false)

  /* --- carregar do localStorage --- */
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

  /* --- salvar dados --- */
  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      console.warn('Falha ao salvar', e)
    }
  }, [data, loaded])

  /* --- salvar treino atual --- */
  useEffect(() => {
    if (!loaded) return
    localStorage.setItem(CURRENT_KEY, currentWorkout)
  }, [currentWorkout, loaded])

  const today = todayKey()
  const todayRecord = data[today] || emptyDay(currentWorkout)

  /* --- atualizar registro do dia --- */
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
      return {
        ...cur,
        exercises: { ...cur.exercises, [id]: { ...ex, done: !ex.done } },
      }
    })
  }

  const updateExercise = (id, field, value) => {
    setTodayRecord((cur) => {
      const ex = cur.exercises[id] || { done: false, carga: '', reps: '', obs: '' }
      return {
        ...cur,
        exercises: { ...cur.exercises, [id]: { ...ex, [field]: value } },
      }
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

  /* --- histórico (últimos 10 dias com qualquer registro) --- */
  const history = useMemo(() => {
    return Object.entries(data)
      .filter(([, rec]) => doneItems(rec) > 0 || rec.peso || rec.cintura || rec.obs)
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .slice(0, 10)
  }, [data])

  /* --- estatísticas globais --- */
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
        {/* ---------- Header ---------- */}
        <header className="pt-6 pb-2 animate-rise">
          <div className="flex items-center justify-between">
            <Badge />
            <DateChip date={today} />
          </div>

          <h1 className="font-display text-3xl font-bold mt-5 leading-tight text-white">
            Treino de hoje
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {workout.name} · <span className="text-slate-300">{workout.subtitle}</span>
          </p>

          {/* Progresso */}
          <div className="mt-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Progresso
              </span>
              <span className="font-display text-2xl font-bold text-white tabular-nums">
                {progress}<span className="text-slate-500 text-base">%</span>
              </span>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-slate-800/80 overflow-hidden">
              <div
                className="h-full rounded-full transition-[width] duration-500 ease-out"
                style={{
                  width: `${progress}%`,
                  background:
                    progress >= 70
                      ? 'linear-gradient(90deg, #10b981, #34d399)'
                      : 'linear-gradient(90deg, #38bdf8, #818cf8)',
                }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>
                {doneItems(todayRecord)} de {totalItems(workoutKey)} itens
              </span>
              {isComplete(todayRecord) ? (
                <span className="text-emerald-400 font-medium">Sessão completa ✓</span>
              ) : (
                <span>Meta: 70%</span>
              )}
            </div>
          </div>
        </header>

        {/* ---------- Seletor de treino ---------- */}
        <section className="mt-6 animate-rise">
          <SectionLabel>Selecione o treino</SectionLabel>
          <div className="grid grid-cols-4 gap-2 mt-3">
            {Object.keys(WORKOUTS).map((k) => (
              <WorkoutButton
                key={k}
                letter={k}
                active={workoutKey === k}
                onClick={() => switchWorkout(k)}
              />
            ))}
          </div>
        </section>

        {/* ---------- Exercícios ---------- */}
        <section className="mt-6 space-y-5 animate-rise">
          {workout.blocks.map((block) => (
            <Block key={block.title} title={block.title}>
              {block.exercises.map((ex) => (
                <ExerciseCard
                  key={ex.id}
                  exercise={ex}
                  state={todayRecord.exercises[ex.id]}
                  onToggle={() => toggleExercise(ex.id)}
                  onUpdate={(field, value) => updateExercise(ex.id, field, value)}
                />
              ))}
            </Block>
          ))}

          {/* Cardio */}
          <Block title="Cardio" accent="cardio">
            <CardioCard
              cardio={workout.cardio}
              state={todayRecord.cardio}
              onToggle={toggleCardio}
              onUpdate={updateCardio}
            />
          </Block>
        </section>

        {/* ---------- Métricas do dia ---------- */}
        <section className="mt-6 animate-rise">
          <SectionLabel>Métricas do dia</SectionLabel>
          <div className="mt-3 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Peso (kg)"
                inputMode="decimal"
                value={todayRecord.peso}
                onChange={(v) => updateField('peso', v)}
                placeholder="82.5"
              />
              <Field
                label="Cintura (cm)"
                inputMode="decimal"
                value={todayRecord.cintura}
                onChange={(v) => updateField('cintura', v)}
                placeholder="88"
              />
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

        {/* ---------- Estatísticas ---------- */}
        <section className="mt-6 animate-rise">
          <SectionLabel>Estatísticas</SectionLabel>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <StatCard label="Sessões registradas" value={stats.sessions} />
            <StatCard label="Sessões completas" value={stats.completed} accent="emerald" />
            <StatCard label="Frequência" value={`${stats.frequency}%`} accent="sky" />
            <StatCard label="Progresso de hoje" value={`${progress}%`} />
          </div>
        </section>

        {/* ---------- Histórico ---------- */}
        <section className="mt-6 animate-rise">
          <SectionLabel>Histórico (últimos 10)</SectionLabel>
          <div className="mt-3 space-y-2">
            {history.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/20 p-6 text-center text-sm text-slate-500">
                Nenhum treino registrado ainda. Bora começar?
              </div>
            ) : (
              history.map(([date, rec]) => <HistoryRow key={date} date={date} record={rec} />)
            )}
          </div>
        </section>

        {/* ---------- Limpar dia ---------- */}
        <div className="mt-8 mb-4 animate-rise">
          <button
            onClick={clearToday}
            className="w-full rounded-2xl border border-rose-900/40 bg-rose-950/30 hover:bg-rose-950/50 active:scale-[0.99] transition py-4 text-rose-300 font-medium text-sm"
          >
            Limpar treino de hoje
          </button>
          <p className="mt-3 text-center text-[11px] text-slate-600">
            Projeto Shape Max · dados salvos no seu celular
          </p>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   COMPONENTES AUXILIARES
   ============================================================ */

function Badge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 pulse-dot" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      <span className="font-display text-[11px] font-semibold tracking-[0.18em] uppercase text-emerald-300">
        Projeto Shape Max
      </span>
    </div>
  )
}

function DateChip({ date }) {
  return (
    <div className="rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-[11px] text-slate-400 tabular-nums">
      {formatDate(date)}
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <h2 className="font-display text-[11px] font-semibold tracking-[0.22em] uppercase text-slate-500">
      {children}
    </h2>
  )
}

function WorkoutButton({ letter, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        'relative h-16 rounded-2xl font-display font-bold text-2xl transition-all active:scale-[0.97]',
        active
          ? 'bg-white text-ink-950 shadow-[0_8px_30px_-10px_rgba(255,255,255,0.4)]'
          : 'bg-slate-900/60 border border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900',
      ].join(' ')}
    >
      <span className="block leading-none">{letter}</span>
      <span
        className={[
          'block text-[9px] font-semibold tracking-[0.18em] uppercase mt-1',
          active ? 'text-ink-950/60' : 'text-slate-500',
        ].join(' ')}
      >
        Treino
      </span>
    </button>
  )
}

function Block({ title, accent, children }) {
  const isCardio = accent === 'cardio'
  return (
    <div>
      <div className="flex items-center gap-2 mb-2 px-1">
        <span
          className={[
            'h-1 w-6 rounded-full',
            isCardio ? 'bg-sky-400' : 'bg-emerald-400',
          ].join(' ')}
        />
        <h3 className="font-display text-sm font-bold uppercase tracking-[0.15em] text-slate-200">
          {title}
        </h3>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function ExerciseCard({ exercise, state, onToggle, onUpdate }) {
  const done = !!state?.done
  const carga = state?.carga || ''
  const reps = state?.reps || ''
  const obs = state?.obs || ''

  return (
    <div
      className={[
        'rounded-2xl border bg-slate-900/40 backdrop-blur p-4 transition-all',
        done
          ? 'border-emerald-500/40 bg-emerald-950/20 shadow-glow'
          : 'border-slate-800/80',
      ].join(' ')}
    >
      <div className="flex items-start gap-3">
        <CheckButton done={done} onClick={onToggle} variant="emerald" />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h4
              className={[
                'font-display font-bold text-base leading-tight',
                done ? 'text-emerald-200 line-through decoration-emerald-500/40' : 'text-white',
              ].join(' ')}
            >
              {exercise.name}
            </h4>
            <span className="shrink-0 text-xs font-semibold text-slate-400 tabular-nums">
              {exercise.scheme}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <Mini
              label="Carga"
              value={carga}
              onChange={(v) => onUpdate('carga', v)}
              placeholder="kg"
            />
            <Mini
              label="Reps"
              value={reps}
              onChange={(v) => onUpdate('reps', v)}
              placeholder="—"
            />
          </div>
          <Mini
            className="mt-2"
            label="Obs"
            value={obs}
            onChange={(v) => onUpdate('obs', v)}
            placeholder="Sensação, ajuste de altura, dor leve..."
            wide
          />
        </div>
      </div>
    </div>
  )
}

function CardioCard({ cardio, state, onToggle, onUpdate }) {
  const done = !!state?.done
  const obs = state?.obs || ''

  return (
    <div
      className={[
        'rounded-2xl border bg-slate-900/40 backdrop-blur p-4 transition-all',
        done
          ? 'border-sky-500/40 bg-sky-950/20 shadow-cardio'
          : 'border-slate-800/80',
      ].join(' ')}
    >
      <div className="flex items-start gap-3">
        <CheckButton done={done} onClick={onToggle} variant="sky" />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h4
              className={[
                'font-display font-bold text-base leading-tight',
                done ? 'text-sky-200' : 'text-white',
              ].join(' ')}
            >
              {cardio.name}
            </h4>
            <span className="shrink-0 text-xs font-semibold text-sky-300/80">
              cardio
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">{cardio.scheme}</p>

          <Mini
            className="mt-3"
            label="Obs"
            value={obs}
            onChange={(v) => onUpdate('obs', v)}
            placeholder="Tempo real, intensidade, BPM..."
            wide
          />
        </div>
      </div>
    </div>
  )
}

function CheckButton({ done, onClick, variant = 'emerald' }) {
  const palette =
    variant === 'sky'
      ? {
          on: 'bg-sky-500 border-sky-400 text-white shadow-[0_0_0_4px_rgba(56,189,248,0.15)]',
          off: 'border-slate-700 hover:border-sky-500/60',
        }
      : {
          on: 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_0_4px_rgba(16,185,129,0.15)]',
          off: 'border-slate-700 hover:border-emerald-500/60',
        }

  return (
    <button
      onClick={onClick}
      aria-pressed={done}
      className={[
        'mt-0.5 h-9 w-9 shrink-0 rounded-xl border-2 flex items-center justify-center transition-all active:scale-90',
        done ? palette.on : `bg-slate-950 ${palette.off}`,
      ].join(' ')}
    >
      {done && (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </button>
  )
}

function Mini({ label, value, onChange, placeholder, wide, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-1">
        {label}
      </span>
      <input
        type="text"
        inputMode={label === 'Carga' || label === 'Reps' ? 'decimal' : 'text'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={[
          'w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2.5 text-sm text-white placeholder:text-slate-600',
          'focus:outline-none focus:border-emerald-500/60 focus:bg-slate-950',
          'transition',
        ].join(' ')}
      />
    </label>
  )
}

function Field({ label, value, onChange, placeholder, textarea, inputMode }) {
  const Tag = textarea ? 'textarea' : 'input'
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-1.5">
        {label}
      </span>
      <Tag
        type={textarea ? undefined : 'text'}
        inputMode={inputMode}
        rows={textarea ? 3 : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-3 text-base text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 transition resize-none"
      />
    </label>
  )
}

function StatCard({ label, value, accent }) {
  const accentClass =
    accent === 'emerald'
      ? 'text-emerald-400'
      : accent === 'sky'
      ? 'text-sky-400'
      : 'text-white'

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur p-4">
      <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold">
        {label}
      </div>
      <div className={`font-display text-3xl font-bold mt-1 tabular-nums ${accentClass}`}>
        {value}
      </div>
    </div>
  )
}

function HistoryRow({ date, record }) {
  const total = totalItems(record.workout)
  const done = doneItems(record)
  const pct = progressPct(record)
  const complete = isComplete(record)

  return (
    <div
      className={[
        'rounded-2xl border bg-slate-900/40 backdrop-blur p-3.5 flex items-center gap-3',
        complete ? 'border-emerald-500/30' : 'border-slate-800/80',
      ].join(' ')}
    >
      <div
        className={[
          'h-12 w-12 shrink-0 rounded-xl flex items-center justify-center font-display font-bold text-lg',
          complete
            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
            : 'bg-slate-800/60 text-slate-400 border border-slate-700',
        ].join(' ')}
      >
        {record.workout || '–'}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-display font-bold text-white text-sm tabular-nums">
            {formatDate(date)}
          </span>
          <span
            className={[
              'text-xs font-semibold tabular-nums',
              complete ? 'text-emerald-400' : 'text-slate-400',
            ].join(' ')}
          >
            {pct}%
          </span>
        </div>
        <div className="mt-0.5 text-[11px] text-slate-500 flex flex-wrap gap-x-3 gap-y-0.5">
          <span>
            {done}/{total} itens
          </span>
          {record.peso && <span>Peso: {record.peso}kg</span>}
          {record.cintura && <span>Cintura: {record.cintura}cm</span>}
        </div>
      </div>
    </div>
  )
}
