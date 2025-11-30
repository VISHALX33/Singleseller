import { useState } from 'react';

export default function AddressForm({ onSave }) {
  const [form, setForm] = useState({ name:'', street:'', city:'', state:'', pincode:'', phone:'' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    Object.entries(form).forEach(([k,v])=>{ if(!v) e[k] = 'Required'; });
    setErrors(e); return Object.keys(e).length===0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
    setForm({ name:'', street:'', city:'', state:'', pincode:'', phone:'' });
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        {['name','street','city','state','pincode','phone'].map(f => (
          <div key={f} className="flex flex-col">
            <label className="text-xs font-medium uppercase tracking-wide mb-1">{f}</label>
            <input value={form[f]} onChange={e=>setForm({...form,[f]:e.target.value})} className="border rounded px-3 py-2" />
            {errors[f] && <span className="text-xs text-red-600">{errors[f]}</span>}
          </div>
        ))}
      </div>
      <button className="btn-primary">Save Address</button>
    </form>
  );
}
