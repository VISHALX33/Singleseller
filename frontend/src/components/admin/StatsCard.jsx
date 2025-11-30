import formatPrice from '../../utils/formatPrice.js';
export default function StatsCard({ label, value, money }) {
  return (
    <div className='card flex flex-col gap-1'>
      <p className='text-xs uppercase tracking-wide text-slate-500 font-medium'>{label}</p>
      <p className='text-2xl font-semibold text-primary'>{money? formatPrice(value): value}</p>
    </div>
  );
}
