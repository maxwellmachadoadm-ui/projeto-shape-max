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
  return w.blocks.reduce((s, b) => s + b.exercises.length, 0) + 1
}

const doneItems = (record) => {
  if (!record) return 0
  const ex = Object.values(record.exercises || {}).filter((e) => e?.done).length
  const cardio = record.cardio?.done ? 1 : 0
  return ex + cardio
}

const blockProgress = (block, record) => {
  const total = block.exercises.length
  const done = block.exercises.filter((ex) => record?.exercises?.[ex.id]?.done).length
  return { done, total }
}

const progressPct = (record) => {
  if (!record) return 0
  const total = totalItems(record.workout)
  return total === 0 ? 0 : Math.round((doneItems(record) / total) * 100)
}

const isComplete = (record) => progressPct(record) >= 70

/* ============================================================
   APP
   ============================================================ */
export default function App() {
  const [data, setData] = useState({})
  const [currentWorkout, setCurrentWorkout] = useState('A')
  const [loaded, setLoaded] = useState(false)

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

          {/* Card de progresso */}
          <div className="card-base rounded-2xl p-5 mt-5">
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
                <span className="text-slate-300 tabular-nums">{totalItems(workoutKey)}</span> itens
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
          </div>
        </header>

        {/* ===== SELETOR DE TREINO ===== */}
        <section className="mt-7 animate-rise">
          <SectionLabel>Selecione o treino</SectionLabel>
          <div className="grid grid-cols-4 gap-2.5 mt-3">
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

        {/* ===== EXERCÍCIOS ===== */}
        <section className="mt-7 space-y-6 animate-rise">
          {workout.blocks.map((block) => {
            const bp = blockProgress(block, todayRecord)
            return (
              <Block key={block.title} title={block.title} done={bp.done} total={bp.total}>
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
            )
          })}

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

        {/* ===== ESTATÍSTICAS ===== */}
        <section className="mt-7 animate-rise">
          <SectionLabel>Estatísticas</SectionLabel>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <StatCard label="Sessões registradas" value={stats.sessions} />
            <StatCard label="Sessões completas" value={stats.completed} accent="emerald" />
            <StatCard label="Frequência" value={`${stats.frequency}%`} accent="sky" />
            <StatCard label="Progresso de hoje" value={`${progress}%`} />
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
              history.map(([date, rec]) => <HistoryRow key={date} date={date} record={rec} />)
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
  const allDone = total > 0 && done === total
  return (
    <div>
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2.5">
          <span
            className={[
              'h-1.5 w-7 rounded-full',
              isCardio
                ? 'bg-gradient-to-r from-sky-400 to-blue-500 shadow-[0_0_8px_rgba(56,189,248,0.5)]'
                : 'bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.5)]',
            ].join(' ')}
          />
          <h3 className="font-display text-[13px] font-bold uppercase tracking-[0.18em] text-slate-100">
            {title}
          </h3>
        </div>
        {total > 0 && (
          <span
            className={[
              'text-[11px] font-bold tabular-nums px-2 py-0.5 rounded-full',
              allDone
                ? isCardio
                  ? 'text-sky-200 bg-sky-500/20 border border-sky-500/40'
                  : 'text-emerald-200 bg-emerald-500/20 border border-emerald-500/40'
                : 'text-slate-400 bg-slate-800/60 border border-slate-700/60',
            ].join(' ')}
          >
            {done}/{total}
          </span>
        )}
      </div>
      <div className="space-y-2.5">{children}</div>
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
        'rounded-2xl p-4 transition-all',
        done ? 'card-done' : 'card-base',
      ].join(' ')}
    >
      <div className="flex items-start gap-3.5">
        <CheckButton done={done} onClick={onToggle} variant="emerald" />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h4
              className={[
                'font-display font-bold text-[16px] leading-tight',
                done ? 'text-emerald-100' : 'text-white',
              ].join(' ')}
            >
              {exercise.name}
            </h4>
            <span
              className={[
                'shrink-0 text-[11px] font-bold tabular-nums px-2 py-0.5 rounded-md',
                done
                  ? 'text-emerald-200 bg-emerald-500/20'
                  : 'text-slate-300 bg-slate-800/80 border border-slate-700/60',
              ].join(' ')}
            >
              {exercise.scheme}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <Mini
              label="Carga"
              value={carga}
              onChange={(v) => onUpdate('carga', v)}
              placeholder="kg"
              done={done}
            />
            <Mini
              label="Reps"
              value={reps}
              onChange={(v) => onUpdate('reps', v)}
              placeholder="—"
              done={done}
            />
          </div>
          <Mini
            className="mt-2.5"
            label="Obs"
            value={obs}
            onChange={(v) => onUpdate('obs', v)}
            placeholder="Sensação, ajuste, dor leve..."
            done={done}
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
        'rounded-2xl p-4 transition-all',
        done ? 'card-cardio' : 'card-base',
      ].join(' ')}
    >
      <div className="flex items-start gap-3.5">
        <CheckButton done={done} onClick={onToggle} variant="sky" />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h4
              className={[
                'font-display font-bold text-[16px] leading-tight',
                done ? 'text-sky-100' : 'text-white',
              ].join(' ')}
            >
              {cardio.name}
            </h4>
            <span
              className={[
                'shrink-0 text-[10px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-md',
                done
                  ? 'text-sky-200 bg-sky-500/20'
                  : 'text-sky-300 bg-sky-500/15 border border-sky-500/30',
              ].join(' ')}
            >
              Cardio
            </span>
          </div>
          <p className={done ? 'mt-1 text-sm text-sky-200/80' : 'mt-1 text-sm text-slate-300'}>
            {cardio.scheme}
          </p>

          <Mini
            className="mt-3"
            label="Obs"
            value={obs}
            onChange={(v) => onUpdate('obs', v)}
            placeholder="Tempo real, intensidade, BPM..."
            done={done}
            cardio
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
      className={[
        'mt-0.5 h-10 w-10 shrink-0 rounded-xl border-2 flex items-center justify-center transition-all active:scale-90',
        done ? palette.on : palette.off,
      ].join(' ')}
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
      <span className="block text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-1.5">
        {label}
      </span>
      <input
        type="text"
        inputMode={label === 'Carga' || label === 'Reps' ? 'decimal' : 'text'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={[
          'w-full rounded-xl border px-3 py-2.5 text-[15px] font-medium text-white placeholder:text-slate-500',
          'transition focus:outline-none',
          done
            ? 'bg-slate-950/40 border-emerald-700/40'
            : 'bg-slate-950/60 border-slate-700/70',
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
      <span className="block text-[11px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-2">
        {label}
      </span>
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

function StatCard({ label, value, accent }) {
  const accentClass =
    accent === 'emerald'
      ? 'text-emerald-300'
      : accent === 'sky'
      ? 'text-sky-300'
      : 'text-white'

  const glowClass =
    accent === 'emerald'
      ? 'before:bg-emerald-500/10'
      : accent === 'sky'
      ? 'before:bg-sky-500/10'
      : 'before:bg-transparent'

  return (
    <div
      className={`card-base rounded-2xl p-4 relative overflow-hidden before:absolute before:inset-0 before:rounded-2xl before:pointer-events-none ${glowClass}`}
    >
      <div className="relative">
        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">
          {label}
        </div>
        <div className={`font-display text-[32px] font-extrabold mt-1 tabular-nums leading-none ${accentClass}`}>
          {value}
        </div>
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
        'rounded-2xl p-3.5 flex items-center gap-3 transition',
        complete ? 'card-done' : 'card-base',
      ].join(' ')}
    >
      <div
        className={[
          'h-12 w-12 shrink-0 rounded-xl flex items-center justify-center font-display font-extrabold text-lg',
          complete
            ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-[0_4px_12px_-2px_rgba(16,185,129,0.5)]'
            : 'bg-slate-800/80 text-slate-300 border border-slate-700',
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
              'text-xs font-bold tabular-nums',
              complete ? 'text-emerald-300' : 'text-slate-400',
            ].join(' ')}
          >
            {pct}%
          </span>
        </div>
        <div className="mt-0.5 text-[11px] text-slate-400 flex flex-wrap gap-x-3 gap-y-0.5">
          <span>
            <span className="text-slate-200 tabular-nums">{done}</span>
            <span className="text-slate-500">/</span>
            <span className="tabular-nums">{total}</span> itens
          </span>
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
    </div>
  )
}
