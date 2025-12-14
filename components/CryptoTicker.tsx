import React, { useEffect, useState } from 'react';
import { ArrowRightLeft, TrendingUp, RefreshCw, Clock, AlertCircle } from 'lucide-react';

interface CoinData {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    price_change_percentage_24h: number;
}

const USD_TO_KZT_RATE = 535;

const FALLBACK_COINS: CoinData[] = [
    {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
        current_price: 98500,
        price_change_percentage_24h: 2.5
    },
    {
        id: 'ethereum',
        symbol: 'eth',
        name: 'Ethereum',
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        current_price: 3300,
        price_change_percentage_24h: 1.2
    },
    {
        id: 'solana',
        symbol: 'sol',
        name: 'Solana',
        image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
        current_price: 240,
        price_change_percentage_24h: 5.4
    },
    {
        id: 'ripple',
        symbol: 'xrp',
        name: 'XRP',
        image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
        current_price: 2.50,
        price_change_percentage_24h: -0.5
    }
];

const CryptoTicker: React.FC = () => {
    const [coins, setCoins] = useState<CoinData[]>([]);
    const [loading, setLoading] = useState(true);
    const [inputValue, setInputValue] = useState<string>('50000');
    const [selectedCoin, setSelectedCoin] = useState<string>('bitcoin');
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [isFallback, setIsFallback] = useState<boolean>(false);
    
    const [isKztToCrypto, setIsKztToCrypto] = useState(true);

    useEffect(() => {
        const savedCoins = localStorage.getItem('cached_coins_usd_v2');
        const savedTime = localStorage.getItem('cached_time_usd_v2');
        
        if (savedCoins) {
            setCoins(JSON.parse(savedCoins));
            setLoading(false);
            if (savedTime) setLastUpdated(new Date(savedTime));
        } else {
            // Wait for fetch, start with skeleton
            setLoading(true);
        }
        
        fetchPrices();
        const interval = setInterval(fetchPrices, 120000); 
        return () => clearInterval(interval);
    }, []);

    const fetchPrices = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,ripple&order=market_cap_desc&per_page=4&page=1&sparkline=false'
            );
            
            if (!response.ok) throw new Error('API Rate Limit or Error');
            
            const data = await response.json();
            
            if (!Array.isArray(data) || data.length === 0) throw new Error('Empty data');

            setCoins(data);
            const now = new Date();
            setLastUpdated(now);
            setIsFallback(false);
            
            localStorage.setItem('cached_coins_usd_v2', JSON.stringify(data));
            localStorage.setItem('cached_time_usd_v2', now.toISOString());

        } catch (error) {
            console.warn("API Error, using fallback/cache:", error);
            if (coins.length === 0) {
                setCoins(FALLBACK_COINS);
                setIsFallback(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const activeCoin = coins.find(c => c.id === selectedCoin) || coins[0];

    const getConversionResult = () => {
        if (!activeCoin || !inputValue) return '0.00';
        const amount = parseFloat(inputValue);
        if (isNaN(amount)) return '0.00';
        
        const priceInKzt = activeCoin.current_price * USD_TO_KZT_RATE;

        if (isKztToCrypto) {
            return (amount / priceInKzt).toFixed(6);
        } else {
            return (amount * priceInKzt).toLocaleString('ru-RU', { maximumFractionDigits: 2 });
        }
    };

    const handleSwap = () => {
        setIsKztToCrypto(!isKztToCrypto);
        if (isKztToCrypto) {
             setInputValue('1'); 
        } else {
             setInputValue('50000');
        }
    };

    const CurrencySelector = () => (
        <select 
            value={selectedCoin}
            onChange={(e) => setSelectedCoin(e.target.value)}
            className="bg-white/10 border border-emerald-600 rounded-lg px-2 py-2 text-white text-sm focus:outline-none cursor-pointer hover:bg-white/20 transition-colors"
        >
            {coins.length > 0 ? (
                coins.map(c => (
                    <option key={c.id} value={c.id} className="text-gray-900">{c.symbol.toUpperCase()}</option>
                ))
            ) : (
                <option className="text-gray-900">...</option>
            )}
        </select>
    );

    const StaticLabel = ({ text }: { text: string }) => (
        <div className="bg-white/10 border border-transparent rounded-lg px-3 py-2 text-white font-bold text-sm flex items-center justify-center">
            {text}
        </div>
    );

    return (
        <section className="bg-white py-12 border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="flex flex-col md:flex-row justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-primary flex items-center gap-2">
                            <TrendingUp className="text-secondary" /> Рынок сегодня
                        </h2>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                             <p className="text-gray-500 text-sm">Цены в USD ($)</p>
                             {lastUpdated && !isFallback && (
                                 <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                     <Clock size={10} />
                                     Обновлено: {lastUpdated.toLocaleTimeString()}
                                 </span>
                             )}
                             {isFallback && (
                                 <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-200">
                                     <AlertCircle size={10} />
                                     Демо режим
                                 </span>
                             )}
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <button 
                            onClick={fetchPrices} 
                            disabled={loading}
                            className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2 mt-4 md:mt-0 ${
                                isFallback ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                            }`}
                        >
                            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> 
                            {loading ? 'Загрузка...' : 'Обновить курс'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Ticker Grid - Displays USD */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {loading && coins.length === 0 ? (
                             // SKELETON LOADER
                            [1,2,3,4].map(i => (
                                <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex items-center justify-between animate-pulse">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                        <div className="space-y-2">
                                            <div className="h-4 w-12 bg-gray-200 rounded"></div>
                                            <div className="h-3 w-20 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-right">
                                        <div className="h-4 w-24 bg-gray-200 rounded ml-auto"></div>
                                        <div className="h-3 w-16 bg-gray-200 rounded ml-auto"></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            coins.map((coin) => (
                                <div key={coin.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                            <img 
                                                src={coin.image} 
                                                alt={coin.name} 
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=' + coin.symbol.toUpperCase();
                                                }} 
                                            />
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-800 uppercase">{coin.symbol}</div>
                                            <div className="text-xs text-gray-500">{coin.name}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-mono font-bold text-gray-900">
                                            ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                                        </div>
                                        <div className={`text-xs font-bold ${coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {coin.price_change_percentage_24h > 0 ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Converter */}
                    <div className="bg-primary rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <ArrowRightLeft size={100} />
                        </div>
                        
                        <h3 className="text-xl font-bold mb-4 relative z-10">
                            {isKztToCrypto ? 'Купить крипту (KZT)' : 'Продать крипту (KZT)'}
                        </h3>
                        
                        <div className="space-y-4 relative z-10">
                            <div>
                                <label className="text-xs text-emerald-200 mb-1 block">
                                    Я отдаю ({isKztToCrypto ? 'KZT' : activeCoin?.symbol.toUpperCase()})
                                </label>
                                <div className="flex gap-2">
                                    <input 
                                        type="number" 
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        className="w-full flex-1 bg-white/10 border border-emerald-600 rounded-lg px-4 py-2 text-white placeholder-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-secondary"
                                    />
                                    {!isKztToCrypto ? <CurrencySelector /> : <StaticLabel text="KZT" />}
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <button 
                                    onClick={handleSwap}
                                    className="p-2 rounded-full bg-white/10 hover:bg-secondary hover:text-primary transition-all text-secondary"
                                    title="Поменять местами"
                                >
                                    <ArrowRightLeft size={20} />
                                </button>
                            </div>

                            <div>
                                <label className="text-xs text-emerald-200 mb-1 block">
                                    Я получу ({isKztToCrypto ? activeCoin?.symbol.toUpperCase() : 'KZT'})
                                </label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        readOnly 
                                        value={coins.length > 0 ? getConversionResult() : '---'}
                                        className="flex-1 bg-white/20 border border-emerald-500/50 rounded-lg px-4 py-2 text-white font-mono font-bold"
                                    />
                                    {isKztToCrypto ? <CurrencySelector /> : <StaticLabel text="KZT" />}
                                </div>
                            </div>
                        </div>
                        
                        <p className="text-[10px] text-emerald-300 mt-4 text-center opacity-70">
                            {isFallback 
                                ? "*Данные примерные. Конвертация по курсу ~$1 = " + USD_TO_KZT_RATE + "₸"
                                : "*Курс CoinGecko (USD). Конвертация по курсу ~$1 = " + USD_TO_KZT_RATE + "₸"
                            }
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default CryptoTicker;