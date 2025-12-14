import React from 'react';
import { Shield, RefreshCw, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import CryptoTicker from './CryptoTicker';
import { useMarket } from '../context/MarketContext';

const Home: React.FC = () => {
  const { news } = useMarket();
  const latestNews = news.slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-white pt-20 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <div className="mx-auto w-32 h-32 mb-8 relative">
             <div className="absolute inset-0 bg-primary/10 rotate-45 rounded-xl"></div>
             <div className="absolute inset-0 flex items-center justify-center">
                 <svg className="w-20 h-20 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
             </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 tracking-tight">
            CryptoMarket.kz
          </h1>
          
          <p className="max-w-3xl mx-auto text-xl text-gray-600 mb-12 leading-relaxed">
            Платформа Казахстана: надежный обмен криптовалюты, встроенный DEX, 
            эксклюзивный магазин, актуальные новости, образовательные материалы — всё в одном месте.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            
            {/* Card 1 */}
            <div className="group relative bg-gray-900 rounded-2xl p-1 overflow-hidden transition-transform hover:-translate-y-2 duration-300 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="bg-gray-900 rounded-xl p-8 h-full flex flex-col items-center justify-center relative z-10 border border-gray-800">
                    <RefreshCw className="text-cyan-400 w-16 h-16 mb-4" />
                    <h3 className="text-white text-xl font-bold mb-2">CRYPTOFLOW DEX</h3>
                    <p className="text-gray-400 text-sm mb-6">Выгодные обмены</p>
                    <Link to="/exchange" className="bg-secondary text-primary font-bold py-2 px-6 rounded-full hover:bg-yellow-400 transition">
                        НАЧАТЬ ОБМЕН
                    </Link>
                </div>
            </div>

            {/* Card 2 */}
            <div className="group relative bg-gray-900 rounded-2xl p-1 overflow-hidden transition-transform hover:-translate-y-2 duration-300 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="bg-gray-900 rounded-xl p-8 h-full flex flex-col items-center justify-center relative z-10 border border-gray-800">
                    <Globe className="text-emerald-400 w-16 h-16 mb-4" />
                    <h3 className="text-white text-xl font-bold mb-2">GLOBALSWIFT</h3>
                    <p className="text-gray-400 text-sm mb-6">Безопасный CEX Партнер</p>
                    <Link to="/exchange" className="bg-secondary text-primary font-bold py-2 px-6 rounded-full hover:bg-yellow-400 transition">
                        КУПИТЬ КРИПТУ
                    </Link>
                </div>
            </div>

            {/* Card 3 */}
            <div className="group relative bg-gray-900 rounded-2xl p-1 overflow-hidden transition-transform hover:-translate-y-2 duration-300 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="bg-gray-900 rounded-xl p-8 h-full flex flex-col items-center justify-center relative z-10 border border-gray-800">
                    <Shield className="text-purple-400 w-16 h-16 mb-4" />
                    <h3 className="text-white text-xl font-bold mb-2">COLD STORAGE</h3>
                    <p className="text-gray-400 text-sm mb-6">Аппаратные кошельки</p>
                    <Link to="/shop" className="bg-secondary text-primary font-bold py-2 px-6 rounded-full hover:bg-yellow-400 transition">
                        В МАГАЗИН
                    </Link>
                </div>
            </div>

          </div>
        </div>
      </section>

      {/* Crypto Ticker & Converter Section */}
      <CryptoTicker />

      {/* Latest News Section */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-primary">Последние новости</h2>
                <Link to="/news" className="text-secondary font-bold flex items-center hover:underline">
                    Все новости <ArrowRight size={20} className="ml-1"/>
                </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                {latestNews.map(item => (
                    <Link to="/news" key={item.id} className="block group">
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 group-hover:shadow-lg transition h-full flex flex-col">
                            <div className="text-xs text-gray-400 mb-2 flex items-center">
                                <span className="bg-gray-200 px-2 py-0.5 rounded mr-2 text-gray-600">{item.source}</span>
                                {item.date}
                            </div>
                            <h3 className="font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition leading-tight">{item.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-grow">{item.summary}</p>
                            <span className="text-sm text-blue-500 font-medium group-hover:underline">Читать далее &rarr;</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-primary mb-12">Почему выбирают нас?</h2>
            <div className="grid md:grid-cols-4 gap-8">
                {[
                    { title: "Лицензия МФЦА", desc: "Полная легальность операций" },
                    { title: "Низкие комиссии", desc: "Выгодные курсы обмена" },
                    { title: "Техподдержка 24/7", desc: "Всегда на связи" },
                    { title: "Безопасность", desc: "Cold storage активов" }
                ].map((item, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:scale-105 transition-transform">
                        <h4 className="font-bold text-lg text-emerald-800 mb-2">{item.title}</h4>
                        <p className="text-gray-500">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
};

export default Home;