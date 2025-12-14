import React from 'react';
import { useMarket } from '../context/MarketContext';
import { CheckCircle2, ArrowRight, Shield } from 'lucide-react';

const Exchange: React.FC = () => {
  const { services } = useMarket();

  return (
    <div className="bg-gray-50 py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-primary mb-4">Обмен криптовалют</h1>
          <p className="text-xl text-gray-600">Выберите удобный способ для покупки или продажи активов</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* General Partner Card - Large Left */}
          <div className="bg-gradient-to-br from-primary to-[#061424] rounded-3xl p-8 text-white shadow-xl flex flex-col justify-between min-h-[500px]">
            <div>
                <span className="inline-block bg-secondary text-primary px-3 py-1 rounded-full text-sm font-bold mb-6">
                    GENERAL PARTNER
                </span>
                <h2 className="text-4xl font-bold mb-6">Надежный партнер для ваших инвестиций</h2>
                <p className="text-gray-300 text-lg max-w-md">
                    Мы сотрудничаем с ведущими финансовыми институтами Казахстана для обеспечения максимальной безопасности.
                </p>
            </div>
            <div className="mt-8">
                <div className="flex items-center text-accent text-sm">
                    <Shield className="w-5 h-5 mr-2" />
                    Лицензия N0000101
                </div>
            </div>
          </div>

          {/* Service Cards - Right Column */}
          <div className="space-y-6">
            {services.length === 0 ? (
                <div className="text-center text-gray-500 py-10 bg-white rounded-2xl">
                    Партнеры еще не добавлены
                </div>
            ) : (
                services.map((service) => (
                    <div key={service.id} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-2xl font-bold text-primary">{service.title}</h3>
                            <span className="px-2 py-1 bg-gray-100 text-xs font-bold text-gray-500 rounded uppercase">
                                {service.type}
                            </span>
                        </div>
                        <ul className="space-y-3 mb-8">
                            {service.features.map((feature, index) => (
                                <li key={index} className="flex items-center text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-secondary mr-3 flex-shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button className="flex items-center text-primary font-bold hover:text-secondary transition-colors">
                            Открыть все услуги <ArrowRight className="w-5 h-5 ml-2" />
                        </button>
                    </div>
                ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Exchange;