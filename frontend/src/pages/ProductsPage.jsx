/**
 * Products Page - Browse products with filters, search, and pagination
 */
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext.jsx';
import ProductFilters from '../components/ProductFilters.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import SearchBar from '../components/SearchBar.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import EmptyState from '../components/EmptyState.jsx';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    products,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    setSortBy,
    goToPage,
    clearFilters,
  } = useProducts();

  useEffect(() => {
    // Handle search params from URL
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');
    const category = searchParams.get('category');

    if (search) updateFilters({ search });
    if (sort) setSortBy(sort);
    if (category) updateFilters({ category });
  }, [searchParams]);

  const handlePageChange = (page) => {
    goToPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Products</h1>
          <p className="text-gray-600 mb-6">
            {pagination?.totalItems || 0} products available
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 flex-shrink-0">
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
                title="No Products Found"
                description="We couldn't find any products matching your criteria. Try adjusting your filters or search term."
                icon="🔍"
                showCTA={true}
                ctaText="Clear Filters"
                ctaAction={clearFilters}
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

                    {/* Page Numbers */}
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

                {/* Results Info */}
                <div className="mt-8 text-center text-sm text-gray-600">
                  <p>
                    Showing {(pagination?.currentPage - 1) * pagination?.itemsPerPage + 1} to{' '}
                    {Math.min(pagination?.currentPage * pagination?.itemsPerPage, pagination?.totalItems)} of{' '}
                    {pagination?.totalItems} results
                  </p>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
