export default function AddressList({ addresses, selectedId, onSelect }) {
  if (!addresses.length) return <p className="text-sm text-slate">No saved addresses yet.</p>;
  return (
    <div className="space-y-2">
      {addresses.map((a, idx) => (
        <button key={idx} onClick={()=>onSelect(idx)} className={`w-full text-left p-3 rounded border ${selectedId===idx?'border-primary bg-primary/5':'border-slate-200 hover:border-primary'}`}>
          <p className="font-medium">{a.name}</p>
          <p className="text-xs text-slate-600">{a.street}, {a.city}, {a.state} {a.pincode}</p>
          <p className="text-xs text-slate-500">{a.phone}</p>
        </button>
      ))}
    </div>
  );
}
