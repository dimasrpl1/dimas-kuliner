'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function EditProdukPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<{
    name: string;
    category: string;
    price: string;
    image: string;
    bestseller: boolean;
    newImage?: File;
  }>({
    name: '',
    category: '',
    price: '',
    image: '',
    bestseller: false,
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('produk')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        setErrorMsg(error.message);
      } else {
        setForm({
          name: data.name,
          category: data.category,
          price: data.price.toString(),
          image: data.image,
          bestseller: data.bestseller,
        });
        setImagePreview(data.image);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleImageUpload = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('produk-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('produk-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setForm({ ...form, newImage: file });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    let imageUrl = form.image;

    if (form.newImage) {
      try {
        imageUrl = await handleImageUpload(form.newImage);
      } catch {
        setErrorMsg('Gagal upload gambar baru');
        setLoading(false);
        return;
      }
    }

    const { error } = await supabase
      .from('produk')
      .update({
        name: form.name,
        category: form.category,
        price: parseInt(form.price),
        image: imageUrl,
        bestseller: form.bestseller,
      })
      .eq('id', id);

    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push('/admin/produk');
    }

    setLoading(false);
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700 font-medium">Memuat data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 group"
            >
              <svg 
                className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Kembali</span>
            </button>
            
            <div className="text-right">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">Edit Produk</h1>
              <p className="text-gray-600 text-sm">Perbarui informasi produk Anda</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 sm:p-8">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-3 rounded-xl">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-white text-xl font-semibold">Form Edit Produk</h2>
                  <p className="text-white/80 text-sm">Pastikan semua informasi sudah benar</p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {errorMsg && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Nama Produk */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nama Produk
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Masukkan nama produk"
                          className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          required
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Kategori */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Kategori Produk
                      </label>
                      <div className="relative">
                        <select
                          className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 appearance-none bg-white"
                          value={form.category}
                          onChange={(e) => setForm({ ...form, category: e.target.value })}
                          required
                        >
                          <option value="">Pilih Kategori</option>
                          <option value="makanan">🍽️ Makanan</option>
                          <option value="minuman">🥤 Minuman</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Harga */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Harga Produk
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="0"
                          className="w-full border border-gray-300 px-4 py-3 pl-12 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                          value={form.price}
                          onChange={(e) => setForm({ ...form, price: e.target.value })}
                          required
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 font-medium">Rp</span>
                        </div>
                      </div>
                    </div>

                    {/* Bestseller */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={form.bestseller}
                            onChange={(e) => setForm({ ...form, bestseller: e.target.checked })}
                          />
                          <div className={`w-12 h-6 rounded-full transition-all duration-200 ${form.bestseller ? 'bg-amber-400' : 'bg-gray-300'}`}>
                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${form.bestseller ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`}></div>
                          </div>
                        </div>
                        <div>
                          <span className="text-amber-800 font-semibold">Produk Terlaris</span>
                          <p className="text-amber-600 text-sm">Tandai sebagai produk unggulan</p>
                        </div>
                        <div className="text-2xl">⭐</div>
                      </label>
                    </div>
                  </div>

                  {/* Right Column - Image Upload */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Gambar Produk
                      </label>
                      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors duration-200">
                        {imagePreview ? (
                          <div className="space-y-4">
                            <div className="relative inline-block">
                              <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="h-32 w-32 object-cover rounded-xl shadow-lg mx-auto"
                              />
                              <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">
                              {form.newImage ? 'Gambar baru dipilih' : 'Gambar saat ini'}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-500">Belum ada gambar</p>
                          </div>
                        )}
                        
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          {form.newImage ? 'Ganti Gambar' : 'Upload Gambar'}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Menyimpan...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Update Produk</span>
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}