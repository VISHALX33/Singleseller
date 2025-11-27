/**
 * CategoryProductsPage - Products filtered by category
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext.jsx';
import ProductFilters from '../components/ProductFilters.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import EmptyState from '../components/EmptyState.jsx';

const CategoryProductsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { categories, products, loading, error, setCategoryFilter, goToPage, pagination } = useProducts();

  const [categoryData, setCategoryData] = useState(null);
  const [categoryError, setCategoryError] = useState(null);

  useEffect(() => {
    // Find category by slug
    const category = categories.find(c => c.slug === slug);
    if (category) {
      setCategoryData(category);
      setCategoryFilter(category._id);
    } else {
      setCategoryError(`Category "${slug}" not found`);
    }
  }, [slug, categories]);

  if (categoryError) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <EmptyState
            title="Category Not Found"
            description={categoryError}
            icon="🏷️"
            showCTA={true}
            ctaText="View All Categories"
          />
        </div>
      </div>
    );
  }

  const handlePageChange = (page) => {
    goToPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-100 hover:text-white font-semibold mb-4"
          >
            ← Back
          </button>

          {categoryData && (
            <>
              <h1 className="text-4xl font-bold mb-2">{categoryData.name}</h1>
              {categoryData.description && (
                <p className="text-blue-100 text-lg">{categoryData.description}</p>
              )}
            </>
          )}

          <p className="text-blue-100 mt-4">
            {pagination?.totalItems || 0} products available
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 shrink-0">
            <ProductFilters />
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <LoadingSpinner size="lg" />
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-800 font-semibold mb-2">Error loading products</p>
                <p className="text-red-700">{error}</p>
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                title="No Products in This Category"
                description="This category doesn't have any products yet. Please check back soon or browse other categories."
                icon="📦"
                showCTA={true}
                ctaText="Browse All Categories"
              />
            ) : (
              <>
                <ProductGrid products={products} loading={loading} error={error} />

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, pagination.currentPage - 2) + i;
                      if (pageNum > pagination.totalPages) return null;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 rounded-lg ${
                            pageNum === pagination.currentPage
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CategoryProductsPage;
