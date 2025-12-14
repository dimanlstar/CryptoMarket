import React from 'react';
import { useMarket } from '../context/MarketContext';
import { Bot, Calendar, ExternalLink, Coins } from 'lucide-react';

const News: React.FC = () => {
  const { news } = useMarket();

  const handleRead = () => {
     // Placeholder for potential future earning logic
  };

  return (
    <div className="bg-gray-50 py-12 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-gray-100 text-center">
            <h1 className="text-3xl font-bold text-primary">
                Crypto Market KZ <span className="text-gray-300 mx-2">|</span> <span className="text-blue-600">Последние новости</span>
            </h1>
            <p className="text-sm text-gray-400 mt-2">Читайте новости и получайте баллы активности!</p>
        </div>

        <div className="space-y-6">
            {news.length === 0 ? (
                <div className="text-center text-gray-500">Новостей пока нет.</div>
            ) : (
                news.map((item) => (
                    <div key={item.id} onClick={handleRead} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
                        {/* Gamification Badge */}
                        <div className="absolute top-0 right-0 bg-yellow-400 text-xs font-bold px-3 py-1 rounded-bl-xl text-primary flex items-center shadow-sm z-10">
                            <Coins size={12} className="mr-1" /> +0.5 Баллов
                        </div>

                        <h2 className="text-xl font-bold text-gray-800 mb-4 leading-tight group-hover:text-blue-600 transition-colors pr-16">
                            {item.title}
                        </h2>
                        
                        <div className="bg-blue-50 rounded-lg p-4 mb-4 border-l-4 border-blue-500">
                            <div className="flex items-center text-blue-700 font-bold text-sm mb-2">
                                <Bot className="w-4 h-4 mr-2" />
                                AI Пересказ:
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">
                                {item.summary}
                            </p>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-50">
                            <div className="flex items-center">
                                <span className="font-medium text-gray-500">Источник: {item.source}</span>
                                <ExternalLink className="w-3 h-3 ml-1" />
                            </div>
                            <div className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                Опубликовано: {item.date}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>

      </div>
    </div>
  );
};

export default News;