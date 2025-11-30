import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext.jsx';

export default function CategoryGrid() {
  const { categories } = useProducts();
  if (!categories.length) return null;
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {categories.map(cat => (
        <Link key={cat._id} to={`/category/${cat._id}`} className="card flex flex-col items-center gap-2 hover:shadow-md transition">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">{cat.name[0]}</div>
          <p className="text-sm font-medium text-slate">{cat.name}</p>
        </Link>
      ))}
    </div>
  );
}
