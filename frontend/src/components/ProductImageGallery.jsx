import { useState } from 'react';

export default function ProductImageGallery({ product }) {
  const localAsset = product?.slug ? `/assets/${product.slug}.svg` : '/placeholder.svg';
  const images = [product.thumbnail || localAsset, ...(product.images || [])].filter(Boolean);
  const [active, setActive] = useState(images[0]);

  return (
    <div className="space-y-4">
      <div className="border rounded p-2 flex items-center justify-center bg-white">
        <img src={active || localAsset} alt={product.title} className="max-h-96 object-contain transition-transform hover:scale-105" />
      </div>
      <div className="flex gap-2 flex-wrap">
        {images.map(img => (
          <button key={img} onClick={() => setActive(img)} className={`h-20 w-20 border rounded p-1 flex items-center justify-center bg-white ${active === img ? 'ring-2 ring-primary' : ''}`}>
          <img src={img} alt="thumb" className="max-h-full object-contain" />          
          </button>
        ))}
      </div>
    </div>
  );
}
