/**
 * HomePage Component - Home page with hero, featured products, categories
 */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import CategoryGrid from '../components/CategoryGrid.jsx';
import SearchBar from '../components/SearchBar.jsx';
import LoadingSkeletons from '../components/LoadingSkeletons.jsx';

const HomePage = () => {
  const { products, categories, loading, error, getFeatured, fetchProducts } = useProducts();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const featured = getFeatured(8);
        setFeaturedProducts(featured);
      } catch (err) {
        console.error('Error loading featured products:', err);
      }
    };

    loadFeatured();
  }, [products, getFeatured]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to SingleSeller
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              Discover premium products handpicked just for you. Quality, reliability, and exceptional value.
            </p>

            {/* Search Bar */}
            <div className="mb-6">
              <SearchBar />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="inline-block px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Browse All Products
              </Link>
              <a
                href="#categories"
                className="inline-block px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-600 transition border border-white"
              >
                Shop by Category
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">✓</div>
              <p className="text-gray-700 font-semibold">Verified Products</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🚚</div>
              <p className="text-gray-700 font-semibold">Fast Shipping</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🛡️</div>
              <p className="text-gray-700 font-semibold">Secure Payment</p>
            </div>
            <div>
              <div className="text-3xl mb-2">💬</div>
              <p className="text-gray-700 font-semibold">24/7 Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              ⭐ Featured Products
            </h2>
            <Link
              to="/products?featured=true"
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
            >
              View All <span>→</span>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <LoadingSkeletons count={8} />
            </div>
          ) : (
            <ProductGrid
              products={featuredProducts.length > 0 ? featuredProducts : products.slice(0, 8)}
              loading={false}
              error={error}
            />
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              🏷️ Shop by Category
            </h2>
            <Link
              to="/categories"
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
            >
              View All <span>→</span>
            </Link>
          </div>

          {categories && categories.length > 0 ? (
            <CategoryGrid categories={categories.slice(0, 8)} loading={categoriesLoading} />
          ) : (
            <div className="text-center py-12 text-gray-600">
              <p>Loading categories...</p>
            </div>
          )}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Special Offer! Save up to 50%
          </h2>
          <p className="text-lg text-purple-100 mb-6">
            Explore our latest deals and discounted items. Limited time offer!
          </p>
          <Link
            to="/products?sort=-price"
            className="inline-block px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition"
          >
            Shop Deals Now
          </Link>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Choose SingleSeller?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Assurance</h3>
              <p className="text-gray-600">
                Every product is carefully vetted to ensure premium quality and customer satisfaction.
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Best Prices</h3>
              <p className="text-gray-600">
                Competitive pricing without compromising on quality. Get the best value for your money.
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">🎁</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Returns</h3>
              <p className="text-gray-600">
                Not satisfied? Hassle-free returns and exchanges within 30 days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Stay Updated
            </h2>
            <p className="text-gray-600 mb-6">
              Subscribe to our newsletter and get exclusive deals, new arrivals, and special offers.
            </p>

            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
              />
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
