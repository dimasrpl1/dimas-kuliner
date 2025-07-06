'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Produk {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
}

const images = [
  'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1470&q=80',
];

export default function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [produkBestseller, setProdukBestseller] = useState<Produk[]>([]);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (filename: string) =>
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/produk-images/${filename}`;

  const isFullUrl = (url: string) =>
    url.startsWith('http://') || url.startsWith('https://');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchProduk = async () => {
      const { data, error } = await supabase
        .from('produk')
        .select('*')
        .eq('bestseller', true);

      if (error) {
        console.error('Gagal fetch data produk:', error.message);
      } else {
        setProdukBestseller(data || []);
      }
      setLoading(false);
    };

    fetchProduk();
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-screen w-full overflow-hidden">
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Slide ${index}`}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}

          <div className="absolute top-0 left-0 w-full h-full bg-black/30 z-10" />

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
            {images.map((_, index) => (
              <span
                key={index}
                className={`w-3 h-3 rounded-full ${
                  currentIndex === index ? 'bg-white' : 'bg-gray-400'
                } transition duration-300`}
              />
            ))}
          </div>
        </section>

        {/* About Section */}
        <section className="bg-gradient-to-br from-slate-50 to-white py-24 px-6 md:px-12">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 tracking-tight">
                Tentang Kami
              </h2>
              <div className="w-20 h-1 bg-orange-500 mx-auto mb-8"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                <p>
                  Saat ini, DimasKuliner telah memiliki beberapa gerai yang tersebar di Jawa Barat. Kami terus berkomitmen untuk menghadirkan produk yang berkualitas serta pengalaman kuliner yang menyenangkan bagi pelanggan kami.
                </p>
                <p>
                  Inovasi dan pengembangan menu menjadi prioritas kami agar tetap relevan dan disukai oleh berbagai kalangan. DimasKuliner akan terus berkembang dengan tetap mempertahankan rasa dan pelayanan terbaik.
                </p>
                <p className="text-sm text-gray-500 pt-2">Terima kasih atas kepercayaan Anda.</p>
              </div>

              <div className="relative">
                <div className="absolute -top-4 -left-4 w-full h-full bg-orange-100 rounded-2xl -z-10"></div>
                <img
                  src="https://images.unsplash.com/photo-1525059337994-6f2a1311b4d4?auto=format&fit=crop&w=800&q=80"
                  alt="Tentang Kami"
                  className="rounded-2xl shadow-xl w-full object-cover h-80 md:h-96"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Produk Bestseller Section - REDESIGNED */}
        <section className="bg-gradient-to-br from-slate-50 to-white py-28 px-4 md:px-8 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-5">
            <div className="absolute top-20 left-10 w-32 h-32 bg-orange-300 rounded-full blur-xl"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-400 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-orange-200 rounded-full blur-2xl"></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Header */}
            <div className="text-center mb-20">
              <div className="inline-block mb-4">
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent text-lg font-semibold tracking-wide uppercase">
                  Pilihan Terbaik
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Produk <span className="text-orange-500">Bestseller</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Temukan koleksi makanan dan minuman favorit yang telah dipercaya ribuan pelanggan
              </p>
              <div className="flex justify-center mt-8">
                <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"></div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {produkBestseller.map((product, index) => (
                  <div
                    key={product.id}
                    className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-gray-100"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Bestseller Badge */}
                    <div className="absolute top-4 left-4 z-20">
                      <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        ⭐ Bestseller
                      </span>
                    </div>

                    {/* Product Image */}
                    <div className="relative overflow-hidden">
                      <img
                        src={
                          isFullUrl(product.image)
                            ? product.image
                            : getImageUrl(product.image)
                        }
                        alt={product.name}
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-2xl font-bold text-orange-600">
                            Rp {product.price.toLocaleString()}
                          </span>
                        </div>
                        
                        
                      </div>

                      {/* CTA Button */}
                      <button className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:from-orange-600 hover:to-red-600 hover:shadow-lg transform hover:scale-105 active:scale-95">
                        Pesan Sekarang
                      </button>
                    </div>

                    {/* Decorative corner */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400 to-transparent opacity-10 rounded-bl-full"></div>
                  </div>
                ))}
              </div>
            )}

            {/* View All Button */}
            <div className="text-center mt-16">
              <button className="inline-flex items-center space-x-2 bg-white text-orange-600 px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50">
                <span>Lihat Semua Produk</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}