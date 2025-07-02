'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Produk {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  bestseller: boolean;
}

export default function ProdukAdminPage() {
  const router = useRouter();
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [filteredProduk, setFilteredProduk] = useState<Produk[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fetchProduk = async () => {
    const { data, error } = await supabase
      .from('produk')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching produk:', error);
    } else {
      setProdukList(data);
      setFilteredProduk(data);
    }
    setLoading(false);
  };

  const deleteImageFromStorage = async (imageUrl: string) => {
    const parts = imageUrl.split('/');
    const fileName = parts[parts.length - 1];
    const { error } = await supabase.storage
      .from('produk-images')
      .remove([fileName]);

    if (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleDelete = async (id: number, imageUrl: string) => {
    const confirmDelete = confirm('Apakah Anda yakin ingin menghapus produk ini?');
    if (!confirmDelete) return;

    await deleteImageFromStorage(imageUrl);

    const { error } = await supabase.from('produk').delete().eq('id', id);
    if (error) {
      console.error('Error deleting produk:', error);
    } else {
      fetchProduk();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin');
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    applyFilters(value, selectedCategory);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    applyFilters(searchTerm, category);
    setIsMobileMenuOpen(false); // Close mobile menu after selection
  };

  const applyFilters = (search: string, category: string) => {
    let filtered = produkList;

    if (search) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(search)
      );
    }

    if (category !== 'all') {
      filtered = filtered.filter((item) => item.category === category);
    }

    setFilteredProduk(filtered);
  };

  const getUniqueCategories = () => {
    const categories = [...new Set(produkList.map(item => item.category))];
    return categories;
  };

  useEffect(() => {
    fetchProduk();
  }, []);

  const LoadingCard = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-4 sm:p-6">
        <div className="h-4 bg-gray-200 rounded mb-3"></div>
        <div className="h-3 bg-gray-200 rounded mb-2"></div>
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="flex gap-2">
          <div className="h-8 bg-gray-200 rounded flex-1"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row justify-between items-start lg:items-center py-4 lg:py-6">
            {/* Title & Mobile Menu Button */}
            <div className="flex items-center justify-between w-full lg:w-auto">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Manajemen Produk
                  </h1>
                  <p className="text-gray-500 text-xs sm:text-sm hidden sm:block">Kelola produk Anda dengan mudah</p>
                </div>
              </div>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Cari produk..."
                  className="pl-10 pr-4 py-3 border text-black border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 w-64"
                />
              </div>

              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>

              {/* Add Button */}
              <a
                href="/admin/produk/create"
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="hidden xl:inline">Tambah Produk</span>
                <span className="xl:hidden">Tambah</span>
              </a>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden xl:inline">Logout</span>
              </button>
            </div>

            {/* Mobile Actions */}
            {isMobileMenuOpen && (
              <div className="lg:hidden w-full bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200">
                {/* Mobile Search */}
                <div className="relative mb-4">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Cari produk..."
                    className="w-full pl-10 pr-4 py-3 border text-black border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Mobile View Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex-1 p-2 rounded-md transition-all duration-200 text-center ${
                      viewMode === 'grid' 
                        ? 'bg-white shadow-sm text-blue-600' 
                        : 'text-gray-400'
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex-1 p-2 rounded-md transition-all duration-200 text-center ${
                      viewMode === 'list' 
                        ? 'bg-white shadow-sm text-blue-600' 
                        : 'text-gray-400'
                    }`}
                  >
                    List
                  </button>
                </div>

                {/* Mobile Action Buttons */}
                <div className="flex gap-2">
                  <a
                    href="/admin/produk/create"
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl text-center font-medium"
                  >
                    Tambah Produk
                  </a>
                  <button
                    onClick={handleLogout}
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-xl font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Filters */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => handleCategoryFilter('all')}
              className={`px-3 py-2 sm:px-4 text-sm sm:text-base rounded-full transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Semua ({produkList.length})
            </button>
            {getUniqueCategories().map((category) => {
              const count = produkList.filter(p => p.category === category).length;
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryFilter(category)}
                  className={`px-3 py-2 sm:px-4 text-sm sm:text-base rounded-full transition-all duration-300 capitalize ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {category} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6' : 'space-y-4'}`}>
            {[...Array(8)].map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        ) : filteredProduk.length === 0 ? (
          <div className="text-center py-12 lg:py-16">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Produk tidak ditemukan</h3>
            <p className="text-gray-500 mb-6 text-sm sm:text-base px-4">Coba ubah filter pencarian atau tambah produk baru</p>
            <a
              href="/admin/produk/create"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Tambah Produk Pertama
            </a>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProduk.map((produk) => (
              <div key={produk.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105">
                {/* Image */}
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <img
                    src={produk.image}
                    alt={produk.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {produk.bestseller && (
                    <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 sm:px-3 rounded-full text-xs font-semibold shadow-lg">
                      ⭐ Bestseller
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  <div className="mb-3">
                    <span className="inline-block px-2 py-1 sm:px-3 bg-blue-100 text-blue-800 text-xs font-medium rounded-full capitalize">
                      {produk.category}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {produk.name}
                  </h3>
                  
                  <div className="mb-4">
                    <span className="text-lg sm:text-2xl font-bold text-green-600">
                      Rp {produk.price.toLocaleString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <a
                      href={`/admin/produk/edit/${produk.id}`}
                      className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 sm:px-4 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-center font-medium text-sm sm:text-base"
                    >
                      Edit
                    </a>
                    <button
                      onClick={() => handleDelete(produk.id, produk.image)}
                      className="bg-red-50 text-red-600 py-2 px-3 sm:px-4 rounded-lg hover:bg-red-100 transition-colors duration-200 font-medium text-sm sm:text-base"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Mobile List View */}
            <div className="block sm:hidden">
              <div className="divide-y divide-gray-200">
                {filteredProduk.map((produk) => (
                  <div key={produk.id} className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={produk.image}
                        alt={produk.name}
                        className="h-16 w-16 rounded-xl object-cover shadow-md flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-sm truncate pr-2">{produk.name}</h3>
                          {produk.bestseller && (
                            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full flex-shrink-0">
                              ⭐
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full capitalize">
                            {produk.category}
                          </span>
                          <span className="text-sm font-bold text-green-600">
                            Rp {produk.price.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <a
                            href={`/admin/produk/edit/${produk.id}`}
                            className="flex-1 bg-blue-50 text-blue-600 py-1.5 px-3 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-center font-medium text-sm"
                          >
                            Edit
                          </a>
                          <button
                            onClick={() => handleDelete(produk.id, produk.image)}
                            className="flex-1 bg-red-50 text-red-600 py-1.5 px-3 rounded-lg hover:bg-red-100 transition-colors duration-200 font-medium text-sm"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Produk</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Harga</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProduk.map((produk) => (
                    <tr key={produk.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={produk.image}
                            alt={produk.name}
                            className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl object-cover shadow-md"
                          />
                          <div className="min-w-0">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{produk.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-500">ID: {produk.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2 py-1 sm:px-3 bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium rounded-full capitalize">
                          {produk.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm sm:text-lg font-bold text-green-600">
                          Rp {produk.price.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {produk.bestseller ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 bg-orange-100 text-orange-800 text-xs sm:text-sm font-medium rounded-full">
                            ⭐ Bestseller
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 sm:px-3 bg-gray-100 text-gray-600 text-xs sm:text-sm font-medium rounded-full">
                            Regular
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <a
                            href={`/admin/produk/edit/${produk.id}`}
                            className="bg-blue-50 text-blue-600 py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg hover:bg-blue-100 transition-colors duration-200 font-medium text-xs sm:text-base"
                          >
                            Edit
                          </a>
                          <button
                            onClick={() => handleDelete(produk.id, produk.image)}
                            className="bg-red-50 text-red-600 py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg hover:bg-red-100 transition-colors duration-200 font-medium text-xs sm:text-base"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}