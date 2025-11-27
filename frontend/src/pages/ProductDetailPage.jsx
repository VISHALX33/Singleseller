/**
 * ProductDetail Page - Individual product detail view
 * Gallery, information, reviews, similar products
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useProducts } from '../context/ProductContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import ProductImageGallery from '../components/ProductImageGallery.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import EmptyState from '../components/EmptyState.jsx';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getProductBySlug, getCategoryProducts } = useProducts();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      const productData = await getProductBySlug(slug);
      if (productData) {
        setProduct(productData);

        // Load related products from same category
        if (productData.category) {
          const related = await getCategoryProducts(productData.category, 1);
          setRelatedProducts(
            related.filter(p => p._id !== productData._id).slice(0, 4)
          );
        }
      } else {
        setError('Product not found');
      }
    } catch (err) {
      console.error('Error loading product:', err);
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product && addToCart) {
      addToCart(product, quantity);
      toast.success(`${quantity} item(s) added to cart!`);
      setQuantity(1);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <EmptyState
            title="Product Not Found"
            description={error || 'The product you are looking for is no longer available.'}
            icon="😕"
            showCTA={true}
            ctaText="Browse Products"
          />
        </div>
      </div>
    );
  }

  const discountPercentage = product.mrp && product.price 
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-lg shadow-md mb-8">
          {/* Left: Image Gallery */}
          <div>
            <ProductImageGallery
              images={product.images || [product.thumbnail]}
              title={product.title}
            />
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Title & Category */}
            <div>
              <p className="text-sm text-gray-600 mb-2">
                SKU: {product.sku || product._id}
              </p>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              {product.description && (
                <p className="text-gray-600">{product.description}</p>
              )}
            </div>

            {/* Rating */}
            {product.ratings && (
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  <span className="font-semibold">{product.ratings.average || 0}</span>
                  <span className="text-gray-600">
                    ({product.ratings.count || 0} reviews)
                  </span>
                </div>
              </div>
            )}

            {/* Price */}
            <div className="space-y-2 pb-4 border-b">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-gray-900">
                  ₹{product.price?.toLocaleString('en-IN')}
                </span>
                {product.mrp && product.mrp > product.price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{product.mrp?.toLocaleString('en-IN')}
                    </span>
                    <span className="text-lg font-bold text-red-600">
                      {discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div className="pb-4 border-b">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-semibold">✓ In Stock</span>
                  {product.stock < 5 && (
                    <span className="text-orange-600 text-sm font-semibold">
                      Only {product.stock} left!
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-red-600 font-semibold">Out of Stock</span>
              )}
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              {product.stock > 0 && (
                <div className="flex items-center gap-4">
                  <label className="font-semibold text-gray-700">Quantity:</label>
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-gray-100"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      max={product.stock}
                      className="w-16 text-center border-x py-2 focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-4 py-2 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  🛒 Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-blue-50 p-4 rounded-lg space-y-2 text-sm">
              <p>✓ <strong>Easy Returns:</strong> 30-day return policy</p>
              <p>✓ <strong>Free Shipping:</strong> On orders above ₹500</p>
              <p>✓ <strong>Secure Payment:</strong> 100% safe & secure</p>
              <p>✓ <strong>24/7 Support:</strong> Contact us anytime</p>
            </div>
          </div>
        </div>

        {/* Specifications */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="border-b pb-3">
                  <p className="font-semibold text-gray-700 capitalize">{key}</p>
                  <p className="text-gray-600">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Related Products
            </h2>
            <ProductGrid
              products={relatedProducts}
              loading={false}
              error={null}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
