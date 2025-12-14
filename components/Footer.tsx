import React from 'react';
import { Send, Instagram, Video } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-6">Сообщество</h2>
            <p className="mb-8 text-gray-300 text-lg">
                Telegram-чат, AMA с экспертами, обзоры рынка. Присоединяйся к нам!
            </p>
            <div className="flex justify-center space-x-8">
                <a href="#" className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                    <Send size={32} className="text-white ml-1" />
                </a>
                <a href="#" className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                    <Instagram size={32} className="text-white" />
                </a>
                <a href="#" className="w-16 h-16 rounded-full bg-black flex items-center justify-center hover:scale-110 transition-transform shadow-lg border border-gray-700">
                   <div className="relative">
                       <Video size={32} className="text-white relative z-10" />
                       <div className="absolute inset-0 bg-cyan-400 blur-sm opacity-50"></div>
                   </div>
                </a>
            </div>
        </div>

        <div className="border-t border-emerald-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <div className="mb-4 md:mb-0">
            &copy; 2024 CryptoMarket.kz. Все права защищены.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-secondary">Политика конфиденциальности</a>
            <a href="#" className="hover:text-secondary">Условия использования</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;