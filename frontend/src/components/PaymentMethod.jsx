export default function PaymentMethod({ value, onChange }) {
  return (
    <div className="space-y-2">
      {['cod','razorpay'].map(m => (
        <label key={m} className={`flex items-center gap-2 p-3 border rounded cursor-pointer ${value===m?'border-primary bg-primary/5':'border-slate-200'}`}>
          <input type="radio" name="paymentMethod" value={m} checked={value===m} onChange={e=>onChange(e.target.value)} />
          <span className="capitalize">{m === 'cod' ? 'Cash on Delivery' : 'Razorpay (Test)'}</span>
        </label>
      ))}
    </div>
  );
}
