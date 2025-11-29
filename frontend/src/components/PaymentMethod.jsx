import React from 'react';
import { CreditCard, Wallet, Banknote, DollarSign, Info } from 'lucide-react';

const PAYMENT_METHODS = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Visa, Mastercard, RuPay',
    icon: CreditCard,
  },
  {
    id: 'upi',
    name: 'UPI',
    description: 'Google Pay, PhonePe, BHIM',
    icon: DollarSign,
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    description: 'All major banks supported',
    icon: Banknote,
  },
  {
    id: 'wallet',
    name: 'Digital Wallet',
    description: 'PayTM, Amazon Pay',
    icon: Wallet,
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay when you receive',
    icon: Info,
  },
];

export default function PaymentMethod({ selectedMethod, onChange, isLoading = false }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Select Payment Method</h3>

      <div className="space-y-3">
        {PAYMENT_METHODS.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;

          return (
            <label
              key={method.id}
              className={`relative flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={isSelected}
                onChange={(e) => onChange(e.target.value)}
                disabled={isLoading}
                className="w-4 h-4 text-blue-600 cursor-pointer"
              />
              <Icon
                size={24}
                className={isSelected ? 'text-blue-600' : 'text-gray-400'}
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{method.name}</p>
                <p className="text-sm text-gray-600">{method.description}</p>
              </div>
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </label>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
        <p className="font-medium mb-2">💡 Pro Tip</p>
        <p>
          {selectedMethod === 'cod'
            ? 'Your order will be delivered before payment. Easy returns available.'
            : 'Your payment is secured with industry-standard encryption.'}
        </p>
      </div>
    </div>
  );
}
