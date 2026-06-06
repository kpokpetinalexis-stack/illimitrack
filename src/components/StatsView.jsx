import { useState } from 'react';
import { ChevronLeft, ChevronRight, Settings, X } from 'lucide-react';
import { getClientStatus } from '../utils/notifications';

const OPERATORS = [
  { key: 'moov', label: 'MOOV', color: '#3b82f6', bg: 'bg-blue-100', text: 'text-blue-800' },
  { key: 'mtn', label: 'MTN', color: '#eab308', bg: 'bg-yellow-100', text: 'text-yellow-800' },
  { key: 'celtis', label: 'CELTIS', color: '#ef4444', bg: 'bg-red-100', text: 'text-red-800' },
];

const MOIS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

const DEFAULT_PRICES = {
  moov:   { cost: 4250 },
  mtn:    { cost: 4000 },
  celtis: { cost: 0 },
};

function loadPrices() {
  try {
    const saved = JSON.parse(localStorage.getItem('kkt-prices'));
    if (!saved) return DEFAULT_PRICES;
    return {
      moov:   { cost: saved.moov?.cost   ?? 4250 },
      mtn:    { cost: saved.mtn?.cost    ?? 4000 },
      celtis: { cost: saved.celtis?.cost ?? 0    },
    };
  } catch { return DEFAULT_PRICES; }
}

const fmt = (n) => n.toLocaleString('fr-FR') + ' F';

function DonutChart({ data, total }) {
  const size = 200, cx = 100, cy = 100, r = 72, sw = 28;
  const circ = 2 * Math.PI * r;
  if (total === 0) return (
    <svg width={size} height={size} className="mx-auto">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} />
      <text x={cx} y={cy + 6} textAnchor="middle" fontSize="13" fill="#9ca3af">Aucun client</text>
    </svg>
  );
  let offset = 0;
  const segs = data.filter(d => d.count > 0).map(d => {
    const dash = (d.count / total) * circ;
    const seg = { ...d, dash, gap: circ - dash, offset };
    offset += dash;
    return seg;
  });
  return (
    <svg width={size} height={size} className="mx-auto" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth={sw} />
      {segs.map(s => (
        <circle key={s.key} cx={cx} cy={cy} r={r} fill="none"
          stroke={s.color} strokeWidth={sw}
          strokeDasharray={`${s.dash} ${s.gap}`}
          strokeDashoffset={-s.offset} strokeLinecap="butt" />
      ))}
      <text x={cx} y={cy - 8} textAnchor="middle" fontSize="28" fontWeight="bold" fill="#111827"
        style={{ transform: 'rotate(90deg)', transformOrigin: `${cx}px ${cy}px` }}>{total}</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fill="#6b7280"
        style={{ transform: 'rotate(90deg)', transformOrigin: `${cx}px ${cy}px` }}>clients</text>
    </svg>
  );
}

function WeeklyChart({ filtered, month, year }) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeks = [
    { label: 'S1', from: 1,  to: 7 },
    { label: 'S2', from: 8,  to: 14 },
    { label: 'S3', from: 15, to: 21 },
    { label: 'S4', from: 22, to: daysInMonth },
  ];
  const counts = weeks.map(w => ({
    label: w.label,
    count: filtered.filter(c => {
      const d = new Date(c.activationDate).getDate();
      return d >= w.from && d <= w.to;
    }).length,
  }));
  const max = Math.max(...counts.map(w => w.count), 1);
  const W = 300, H = 130, bw = 52, gap = (W - 4 * bw) / 5;

  return (
    <svg width={W} height={H} className="mx-auto overflow-visible">
      {counts.map((w, i) => {
        const bh = Math.max((w.count / max) * 85, w.count > 0 ? 4 : 0);
        const x = gap + i * (bw + gap);
        const y = H - bh - 22;
        return (
          <g key={w.label}>
            <rect x={x} y={y} width={bw} height={bh} rx={8} fill="#111827" opacity={w.count === 0 ? 0.08 : 1} />
            {w.count > 0 && (
              <text x={x + bw / 2} y={y - 5} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#111827">
                {w.count}
              </text>
            )}
            <text x={x + bw / 2} y={H - 5} textAnchor="middle" fontSize="11" fill="#9ca3af">{w.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

const todayStr = () => new Date().toISOString().split('T')[0];
const firstOfMonth = () => { const d = new Date(); d.setDate(1); return d.toISOString().split('T')[0]; };

export default function StatsView({ clients }) {
  const now = new Date();
  const [mode, setMode] = useState('month'); // 'month' | 'period'
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [showPicker, setShowPicker] = useState(false);
  const [dateFrom, setDateFrom] = useState(firstOfMonth());
  const [dateTo, setDateTo] = useState(todayStr());
  const [prices, setPrices] = useState(loadPrices);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [editPrices, setEditPrices] = useState(loadPrices);

  const years = [...new Set([
    now.getFullYear(), now.getFullYear() - 1,
    ...clients.map(c => new Date(c.activationDate).getFullYear()),
  ])].sort((a, b) => b - a);

  const filtered = clients.filter(c => {
    const d = new Date(c.activationDate);
    if (mode === 'month') return d.getMonth() === month && d.getFullYear() === year;
    const from = new Date(dateFrom); from.setHours(0,0,0,0);
    const to   = new Date(dateTo);   to.setHours(23,59,59,999);
    return d >= from && d <= to;
  });

  const total = filtered.length;

  const byOperator = OPERATORS.map(op => ({
    ...op,
    count: filtered.filter(c => c.operator === op.key).length,
    active: filtered.filter(c => c.operator === op.key && getClientStatus(c.expirationDate) === 'active').length,
    expired: filtered.filter(c => c.operator === op.key && getClientStatus(c.expirationDate) === 'expired').length,
  }));

  const revenue = filtered.reduce((s, c) => s + (c.price || 0), 0);
  const cost    = filtered.reduce((s, c) => s + (prices[c.operator]?.cost || 0), 0);
  const profit  = revenue - cost;

  const isCurrentMonth = month === now.getMonth() && year === now.getFullYear();

  const periodLabel = mode === 'month'
    ? `${MOIS[month]} ${year}`
    : `${new Date(dateFrom).toLocaleDateString('fr-FR', { day:'2-digit', month:'short' })} → ${new Date(dateTo).toLocaleDateString('fr-FR', { day:'2-digit', month:'short' })}`;

  const savePrices = () => {
    localStorage.setItem('kkt-prices', JSON.stringify(editPrices));
    setPrices(editPrices);
    setShowPriceModal(false);
  };

  return (
    <div className="pt-4">
      {/* Toggle Mois / Période */}
      <div className="flex bg-white rounded-2xl border border-gray-100 shadow-sm p-1 mb-3">
        <button
          onClick={() => setMode('month')}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${mode === 'month' ? 'bg-[#111827] text-white' : 'text-gray-500'}`}
        >
          Par mois
        </button>
        <button
          onClick={() => setMode('period')}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${mode === 'period' ? 'bg-[#111827] text-white' : 'text-gray-500'}`}
        >
          Période libre
        </button>
      </div>

      {/* Sélecteur de mois */}
      {mode === 'month' && (
        <>
          <button
            onClick={() => setShowPicker(v => !v)}
            className="w-full bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 mb-2 text-center active:bg-gray-50 transition-colors"
          >
            <p className="font-bold text-gray-900 text-sm">{MOIS[month]} {year}</p>
            {isCurrentMonth && <p className="text-xs text-[#111827] font-medium">Ce mois-ci</p>}
            <p className="text-xs text-gray-400 mt-0.5">Appuie pour changer</p>
          </button>

          {showPicker && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-md mb-4 overflow-hidden">
              {years.map(y => (
                <div key={y}>
                  <p className="text-xs font-bold text-gray-400 px-4 pt-3 pb-1 uppercase tracking-wide">{y}</p>
                  <div className="grid grid-cols-3 gap-1 px-3 pb-3">
                    {MOIS.map((m, i) => {
                      const selected = i === month && y === year;
                      return (
                        <button key={i} onClick={() => { setMonth(i); setYear(y); setShowPicker(false); }}
                          className={`py-2 rounded-xl text-sm font-semibold transition-all ${selected ? 'bg-[#111827] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                          {m.slice(0, 3)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Sélecteur de période libre */}
      {mode === 'period' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Du</label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Au</label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]" />
            </div>
          </div>
        </div>
      )}

      {/* === FINANCES === */}
      <div className="flex items-center justify-between mb-3 mt-2">
        <h2 className="text-base font-bold text-gray-800">Finances — {periodLabel}</h2>
        <button
          onClick={() => { setEditPrices(prices); setShowPriceModal(true); }}
          className="flex items-center gap-1 text-xs text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <Settings size={13} /> Prix
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: 'Revenus', value: fmt(revenue), color: 'bg-green-50 border-green-100', text: 'text-green-700' },
          { label: 'Coût', value: fmt(cost), color: 'bg-orange-50 border-orange-100', text: 'text-orange-700' },
          { label: 'Bénéfice', value: fmt(profit), color: profit >= 0 ? 'bg-[#111827]' : 'bg-red-600', text: 'text-white' },
        ].map(card => (
          <div key={card.label} className={`${card.color} rounded-2xl p-3 border text-center`}>
            <p className={`text-xs font-semibold ${card.text} opacity-80`}>{card.label}</p>
            <p className={`text-sm font-bold mt-0.5 ${card.text} leading-tight`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Par opérateur — revenus */}
      <div className="space-y-2 mb-5">
        {byOperator.filter(op => op.count > 0).map(op => {
          const opRevenue = filtered.filter(c => c.operator === op.key).reduce((s, c) => s + (c.price || 0), 0);
          const opCost    = op.count * (prices[op.key]?.cost || 0);
          const opProfit  = opRevenue - opCost;
          return (
            <div key={op.key} className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: op.color }} />
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${op.bg} ${op.text}`}>{op.label}</span>
                <span className="text-xs text-gray-400">{op.count} activation{op.count > 1 ? 's' : ''}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-800">{fmt(opRevenue)}</p>
                <p className="text-xs text-gray-400">bén. {fmt(opProfit)}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Graphique hebdomadaire */}
      <h2 className="text-base font-bold text-gray-800 mb-3">Activations par semaine</h2>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-5">
        {total > 0
          ? <WeeklyChart filtered={filtered} month={month} year={year} />
          : <p className="text-center text-gray-400 text-sm py-4">Aucune activation ce mois</p>
        }
      </div>

      {/* Répartition donut */}
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
                <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: op.color }} />
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
        <p className="text-center text-gray-400 text-sm mt-6">
          Aucun client activé en {MOIS[month]} {year}
        </p>
      )}

      {/* Modal prix */}
      {showPriceModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Coût de revient par opérateur</h2>
              <button onClick={() => setShowPriceModal(false)} className="p-2 rounded-xl hover:bg-gray-100">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              {OPERATORS.map(op => (
                <div key={op.key}>
                  <p className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block mb-2 ${op.bg} ${op.text}`}>{op.label}</p>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Coût de revient (F)</label>
                      <input
                        type="number"
                        min="0"
                        value={editPrices[op.key]?.cost || ''}
                        onChange={e => setEditPrices(p => ({ ...p, [op.key]: { ...p[op.key], cost: Number(e.target.value) } }))}
                        placeholder="Ex: 1000"
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={savePrices}
              className="w-full bg-[#111827] text-white py-3.5 rounded-xl font-semibold text-sm mt-5 hover:bg-gray-800 transition-colors"
            >
              Enregistrer les prix
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
