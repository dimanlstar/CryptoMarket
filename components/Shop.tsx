import React from 'react';
import { useMarket } from '../context/MarketContext';
import { ShoppingCart } from 'lucide-react';

const Shop: React.FC = () => {
  const { products } = useMarket();

  const featuredProduct = products.length > 0 ? products[0] : null;
  const otherProducts = products.length > 1 ? products.slice(1) : [];

  return (
    <div className="bg-white py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-primary mb-4">Магазин оборудования</h1>
            <p className="text-xl text-gray-600">Мы выбираем для Вас самые лучшие модели холодных кошельков</p>
        </div>

        {/* Featured Product Highlight */}
        {featuredProduct ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
                <div className="bg-gray-100 rounded-3xl p-8 flex items-center justify-center shadow-inner">
                    <img 
                        src={featuredProduct.image} 
                        alt={featuredProduct.name} 
                        className="w-full max-w-md object-contain mix-blend-multiply drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                        onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/400?text=No+Image'}
                    />
                </div>
                <div>
                    <h2 className="text-4xl font-bold text-primary mb-6">{featuredProduct.name}</h2>
                    <div className="space-y-4 mb-8">
                        {featuredProduct.features.map((feature, i) => (
                            <p key={i} className="text-lg text-gray-700 border-l-4 border-secondary pl-4">
                                {feature}
                            </p>
                        ))}
                    </div>
                    
                    <div className="flex items-end space-x-4 mb-8">
                        <span className="text-4xl font-bold text-primary">
                            {featuredProduct.price.toLocaleString()} ₸
                        </span>
                        {featuredProduct.oldPrice && (
                            <span className="text-xl text-gray-400 line-through decoration-red-500 mb-1">
                                {featuredProduct.oldPrice.toLocaleString()} ₸
                            </span>
                        )}
                    </div>

                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-12 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center">
                        <ShoppingCart className="mr-2" />
                        Заказать
                    </button>
                </div>
            </div>
        ) : (
            <div className="text-center text-gray-500 py-10">Товары пока не добавлены</div>
        )}

        {/* Other Products Grid */}
        <div className="border-t pt-12">
            <h3 className="text-2xl font-bold text-primary mb-8">Другие товары</h3>
            {otherProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {otherProducts.map(product => (
                        <div key={product.id} className="group border rounded-2xl p-4 hover:shadow-xl transition-shadow bg-white">
                            <div className="bg-gray-50 rounded-xl p-6 mb-4 flex justify-center h-64 items-center">
                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="max-h-full object-contain mix-blend-multiply" 
                                    onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/400?text=No+Image'}
                                />
                            </div>
                            <h4 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h4>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-primary text-lg">{product.price.toLocaleString()} ₸</span>
                                <button className="text-blue-500 font-medium hover:text-blue-700">Подробнее</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">Больше товаров нет в наличии.</p>
            )}
        </div>

      </div>
    </div>
  );
};

export default Shop;