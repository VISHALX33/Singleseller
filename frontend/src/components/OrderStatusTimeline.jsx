export default function OrderStatusTimeline({ history }) {
  if (!history || !history.length) return <p className="text-sm text-slate">No status history.</p>;
  return (
    <ol className="relative border-l ml-2 pl-4 border-slate-200 space-y-4">
      {history.map((h,i)=>(
        <li key={i} className="space-y-1">
          <div className="absolute -left-2.5 w-4 h-4 rounded-full border border-primary bg-white"></div>
          <p className="font-medium capitalize text-primary">{h.status}</p>
          <p className="text-xs text-slate-500">{new Date(h.timestamp || h.changedAt).toLocaleString()}</p>
          {h.note && <p className="text-xs text-slate-600">{h.note}</p>}
        </li>
      ))}
    </ol>
  );
}
