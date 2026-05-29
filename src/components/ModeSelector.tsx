import type { AlgorithmMode } from '../algorithms/types'

interface Props {
  mode: AlgorithmMode
  onModeChange: (m: AlgorithmMode) => void
}

const MODES: { value: AlgorithmMode; label: string; icon: string; desc: string }[] = [
  { value: 'even', label: '균등 분산', icon: '◈', desc: '고르게 나눠서' },
  { value: 'append', label: '연휴 이어붙이기', icon: '⟡', desc: '최고 효율로' },
  { value: 'golden', label: '황금연휴', icon: '◉', desc: '밀도 높은 달' },
  { value: 'minmax', label: '최소·최대', icon: '⌖', desc: '적게 써서 길게' },
  { value: 'quarterly', label: '분기 균형', icon: '⊞', desc: '4분기 분배' },
  { value: 'season', label: '시즌 집중', icon: '◎', desc: '여름 또는 겨울' },
]

export function ModeSelector({ mode, onModeChange }: Props) {
  return (
    <div className="space-y-1">
      {MODES.map((m) => (
        <button
          key={m.value}
          onClick={() => onModeChange(m.value)}
          className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center gap-3 ${
            mode === m.value
              ? 'bg-accent text-white'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <span className="text-base leading-none w-4 flex-shrink-0">{m.icon}</span>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium leading-tight">{m.label}</span>
            <span className={`text-xs leading-tight mt-0.5 ${mode === m.value ? 'text-purple-200' : 'text-gray-400'}`}>
              {m.desc}
            </span>
          </div>
        </button>
      ))}
    </div>
  )
}
