import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useNavigate } from 'react-router-dom';
import AddressForm from '../components/AddressForm.jsx';
import AddressList from '../components/AddressList.jsx';
import PaymentMethod from '../components/PaymentMethod.jsx';
import OrderSummary from '../components/OrderSummary.jsx';
import { placeOrder } from '../services/orderService.js';
import toast from 'react-hot-toast';

const STEPS = ['Address','Payment','Review'];

export default function Checkout() {
  const { cartItems, itemCount } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [addresses, setAddresses] = useState(()=>{
    try { return JSON.parse(localStorage.getItem('addresses')||'[]'); } catch { return []; }
  });
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [placing, setPlacing] = useState(false);

  const currentAddress = selectedAddressIndex!=null ? addresses[selectedAddressIndex] : null;

  const saveAddress = (addr) => {
    const next = [...addresses, addr];
    setAddresses(next);
    localStorage.setItem('addresses', JSON.stringify(next));
    setSelectedAddressIndex(next.length - 1);
    toast.success('Address saved');
  };

  const nextStep = () => setStep(s => Math.min(s+1, STEPS.length-1));
  const prevStep = () => setStep(s => Math.max(s-1,0));

  const place = async () => {
    if (!currentAddress) { toast.error('Select address'); return; }
    setPlacing(true);
    try {
      const order = await placeOrder({ shippingAddress: currentAddress, paymentMethod });
      toast.success('Order placed');
      navigate(`/orders/${order._id}`);
    } catch (e) { /* handled globally */ } finally { setPlacing(false); }
  };

  if (itemCount === 0) return <p className='text-slate'>Cart empty. Add items first.</p>;

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-semibold text-primary'>Checkout</h2>
      <div className='flex gap-2 text-xs'>
        {STEPS.map((s,i)=>(
          <div key={s} className={`px-3 py-1 rounded ${i===step?'bg-primary text-white':'bg-slate-100 text-slate-600'}`}>{i+1}. {s}</div>
        ))}
      </div>

      {step===0 && (
        <div className='grid md:grid-cols-2 gap-8'>
          <div>
            <h3 className='font-semibold mb-2'>Saved Addresses</h3>
            <AddressList addresses={addresses} selectedId={selectedAddressIndex} onSelect={setSelectedAddressIndex} />
          </div>
          <div>
            <h3 className='font-semibold mb-2'>Add New Address</h3>
            <AddressForm onSave={saveAddress} />
          </div>
        </div>
      )}

      {step===1 && (
        <div className='max-w-md'>
          <h3 className='font-semibold mb-2'>Payment Method</h3>
          <PaymentMethod value={paymentMethod} onChange={setPaymentMethod} />
        </div>
      )}

      {step===2 && (
        <div className='grid md:grid-cols-2 gap-8'>
          <OrderSummary address={currentAddress} paymentMethod={paymentMethod} />
          <div className='space-y-2'>
            <h3 className='font-semibold'>Items</h3>
            <ul className='space-y-2 max-h-64 overflow-auto pr-2'>
              {cartItems.map(it => (
                <li key={it.itemId} className='flex justify-between text-sm border-b py-1'>
                  <span>{(it.product?.title || it.product?.name || 'Item')}</span>
                  <span>{it.quantity} x {it.unitPrice}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className='flex gap-3'>
        {step>0 && <button onClick={prevStep} className='px-4 py-2 border rounded'>Back</button>}
        {step<STEPS.length-1 && <button onClick={nextStep} className='btn-primary'>Next</button>}
        {step===STEPS.length-1 && <button disabled={placing} onClick={place} className='btn-primary disabled:opacity-50'>{placing?'Placing...':'Place Order'}</button>}
      </div>
    </div>
  );
}
