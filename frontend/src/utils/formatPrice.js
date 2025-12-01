export default function formatPrice(value) {
  if (typeof value !== 'number') return '₹0.00';
  return new Intl.NumberFormat('en-IN', { 
    style: 'currency', 
    currency: 'INR' 
  }).format(value);
}
