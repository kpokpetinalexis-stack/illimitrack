import { getClientStatus } from '../utils/notifications';

const OPERATORS = [
  { key: 'moov', label: 'MOOV', color: '#3b82f6', bg: 'bg-blue-100', text: 'text-blue-800' },
  { key: 'mtn', label: 'MTN', color: '#eab308', bg: 'bg-yellow-100', text: 'text-yellow-800' },
  { key: 'celtis', label: 'CELTIS', color: '#ef4444', bg: 'bg-red-100', text: 'text-red-800' },
];

function DonutChart({ data, total }) {
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r = 72;
  const strokeWidth = 28;

  if (total === 0) {
    return (
      <svg width={size} height={size} className="mx-auto">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
        <text x={cx} y={cy + 6} textAnchor="middle" className="text-gray-400" fontSize="14" fill="#9ca3af">Aucun client</text>
      </svg>
    );
  }

  let offset = 0;
  const circumference = 2 * Math.PI * r;
  const segments = data
    .filter(d => d.count > 0)
    .map(d => {
      const pct = d.count / total;
      const dash = pct * circumference;
      const gap = circumference - dash;
      const seg = { ...d, dash, gap, offset };
      offset += dash;
      return seg;
    });

  return (
    <svg width={size} height={size} className="mx-auto" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth={strokeWidth} />
      {segments.map((seg) => (
        <circle
          key={seg.key}
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={seg.color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${seg.dash} ${seg.gap}`}
          strokeDashoffset={-seg.offset}
          strokeLinecap="butt"
        />
      ))}
      <text x={cx} y={cy - 8} textAnchor="middle" fontSize="28" fontWeight="bold" fill="#111827" style={{ transform: 'rotate(90deg)', transformOrigin: `${cx}px ${cy}px` }}>
        {total}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fill="#6b7280" style={{ transform: 'rotate(90deg)', transformOrigin: `${cx}px ${cy}px` }}>
        clients
      </text>
    </svg>
  );
}

export default function StatsView({ clients }) {
  const total = clients.length;

  const byOperator = OPERATORS.map(op => ({
    ...op,
    count: clients.filter(c => c.operator === op.key).length,
    active: clients.filter(c => c.operator === op.key && getClientStatus(c.expirationDate) === 'active').length,
    expired: clients.filter(c => c.operator === op.key && getClientStatus(c.expirationDate) === 'expired').length,
  }));

  return (
    <div className="pt-4">
      <h2 className="text-base font-bold text-gray-800 mb-4">Répartition par opérateur</h2>

      <DonutChart data={byOperator} total={total} />

      <div className="mt-6 space-y-3">
        {byOperator.map(op => {
          const pct = total > 0 ? Math.round((op.count / total) * 100) : 0;
          return (
            <div key={op.key} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: op.color }} />
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${op.bg} ${op.text}`}>{op.label}</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{op.count} <span className="text-sm text-gray-400 font-normal">({pct}%)</span></span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: op.color }}
                />
              </div>
              <div className="flex gap-4 mt-2 text-xs text-gray-500">
                <span>✅ {op.active} actifs</span>
                <span>❌ {op.expired} expirés</span>
              </div>
            </div>
          );
        })}
      </div>

      {total === 0 && (
        <p className="text-center text-gray-400 text-sm mt-8">Ajoutez des clients pour voir les statistiques</p>
      )}
    </div>
  );
}
