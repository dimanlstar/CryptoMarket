import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User as UserIcon, LogOut, ShieldCheck, Pickaxe, Coins } from 'lucide-react';
import { User, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onOpenAuth: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onOpenAuth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { claimDailyBonus, users } = useAuth();
  
  // Need fresh user data for mining updates
  const currentUser = user ? users.find(u => u.id === user.id) || user : null;

  const [timeLeft, setTimeLeft] = useState<string>('');
  const [canMine, setCanMine] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const checkMiningStatus = () => {
        const lastClaim = currentUser.lastDailyBonus ? new Date(currentUser.lastDailyBonus) : null;
        if (!lastClaim) {
            setCanMine(true);
            setTimeLeft('');
            return;
        }

        const now = new Date();
        const diff = now.getTime() - lastClaim.getTime();
        const cooldown = 24 * 60 * 60 * 1000;

        if (diff >= cooldown) {
            setCanMine(true);
            setTimeLeft('');
        } else {
            setCanMine(false);
            const remaining = cooldown - diff;
            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            setTimeLeft(`${hours}ч ${minutes}м`);
        }
    };

    checkMiningStatus();
    const timer = setInterval(checkMiningStatus, 60000); // Check every minute
    return () => clearInterval(timer);
  }, [currentUser]);

  const handleMine = () => {
    if (currentUser && canMine) {
        const res = claimDailyBonus(currentUser.id);
        if (res.success) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 2000); // Reset visual after 2s
        }
    }
  };

  const navLinks = [
    { name: 'ГЛАВНАЯ', path: '/' },
    { name: 'ОБМЕН', path: '/exchange' },
    { name: 'МАГАЗИН', path: '/shop' },
    { name: 'НОВОСТИ', path: '/news' },
    { name: 'ОБУЧЕНИЕ', path: '/education' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Prevent scroll when mobile menu is open
  useEffect(() => {
      if (isOpen) {
          document.body.style.overflow = 'hidden';
      } else {
          document.body.style.overflow = 'unset';
      }
      return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <nav className="bg-primary text-white sticky top-0 z-50 shadow-lg border-b border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center space-x-2 z-50 relative">
            <div className="w-10 h-10 bg-gradient-to-br from-secondary to-yellow-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>
            <Link to="/" className="font-bold text-xl tracking-wider hidden sm:block">CRYPTOMARKET.KZ</Link>
            <Link to="/" className="font-bold text-xl tracking-wider block sm:hidden">CM.KZ</Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive(link.path) 
                      ? 'bg-emerald-800 text-secondary' 
                      : 'hover:bg-emerald-800 hover:text-white text-gray-200'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Auth & Mining */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                 <button 
                    onClick={handleMine}
                    disabled={!canMine}
                    className={`
                        relative group flex items-center space-x-2 px-3 py-1.5 rounded-full border border-secondary/50 transition-all
                        ${canMine 
                            ? 'bg-secondary/20 hover:bg-secondary/40 text-secondary cursor-pointer animate-pulse' 
                            : 'bg-black/20 text-gray-400 cursor-not-allowed'
                        }
                    `}
                    title={canMine ? 'Собрать ежедневный бонус' : `Доступно через ${timeLeft}`}
                 >
                    {showConfetti && (
                        <span className="absolute -top-8 left-0 right-0 text-center text-yellow-400 font-bold animate-bounce whitespace-nowrap">
                            +5 Баллов!
                        </span>
                    )}
                    <Pickaxe size={16} className={canMine ? 'animate-bounce' : ''} />
                    <span className="font-bold text-sm">
                        {canMine ? 'БОНУС' : timeLeft}
                    </span>
                 </button>

                <Link to="/profile" className="flex items-center space-x-2 text-sm hover:opacity-80 transition-opacity">
                   <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-secondary border border-secondary relative overflow-hidden">
                      {currentUser.avatar ? (
                          <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                      ) : (
                          <UserIcon size={16} />
                      )}
                   </div>
                   <div className="flex flex-col leading-tight">
                       <span className="text-secondary font-medium">{currentUser.name}</span>
                       <span className="text-[10px] text-gray-300 flex items-center gap-1">
                           <Coins size={10} /> {currentUser.balance}
                       </span>
                   </div>
                </Link>
                   {currentUser.role === UserRole.ADMIN && (
                       <Link to="/admin" className="text-xs bg-red-600 px-2 py-1 rounded text-white hover:bg-red-700 flex items-center gap-1">
                         <ShieldCheck size={12} />
                       </Link>
                   )}
                <button 
                  onClick={onLogout}
                  className="p-2 rounded-full hover:bg-emerald-800 transition text-gray-300"
                  title="Выйти"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="bg-secondary text-primary font-bold px-4 py-2 rounded hover:bg-yellow-500 transition shadow-md"
              >
                Войти
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden z-50 relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-emerald-800 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden animate-in fade-in duration-200">
            <div className="fixed inset-y-0 right-0 w-64 bg-emerald-900 shadow-2xl border-l border-emerald-800 p-4 pt-20 animate-in slide-in-from-right duration-300">
                <div className="space-y-2">
                    {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`block px-4 py-3 rounded-lg text-base font-bold transition-all ${
                            isActive(link.path) 
                            ? 'bg-secondary text-primary shadow-md' 
                            : 'text-gray-200 hover:bg-emerald-800'
                        }`}
                    >
                        {link.name}
                    </Link>
                    ))}
                </div>

                <div className="mt-8 pt-8 border-t border-emerald-800">
                    {currentUser ? (
                        <div className="space-y-4">
                            <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 bg-emerald-800/50 p-3 rounded-xl">
                                <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-secondary border border-secondary overflow-hidden">
                                     {currentUser.avatar ? (
                                        <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <UserIcon size={20} />
                                    )}
                                </div>
                                <div>
                                    <div className="text-secondary font-bold">{currentUser.name}</div>
                                    <div className="text-xs text-gray-300 flex items-center gap-1">
                                        <Coins size={12} /> {currentUser.balance} Баллов
                                    </div>
                                </div>
                            </Link>
                            
                            <button 
                                onClick={handleMine}
                                disabled={!canMine}
                                className={`w-full flex justify-center items-center space-x-2 px-3 py-3 rounded-lg border border-secondary/50 font-bold shadow-sm transition-all active:scale-95 ${
                                    canMine ? 'bg-secondary text-primary' : 'bg-black/20 text-gray-400'
                                }`}
                            >
                                <Pickaxe size={18} />
                                <span>{canMine ? 'СОБРАТЬ БОНУС' : timeLeft}</span>
                            </button>

                            {currentUser.role === UserRole.ADMIN && (
                                <Link to="/admin" onClick={() => setIsOpen(false)} className="block text-center text-white bg-red-600 py-2 rounded-lg font-bold hover:bg-red-700">
                                    Панель Админа
                                </Link>
                            )}
                            <button onClick={() => { onLogout(); setIsOpen(false); }} className="w-full text-center text-gray-400 hover:text-white py-2">
                                Выйти
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => {
                                onOpenAuth();
                                setIsOpen(false);
                            }}
                            className="w-full bg-secondary text-primary font-bold py-3 rounded-lg shadow-md hover:bg-yellow-500"
                        >
                            Войти / Регистрация
                        </button>
                    )}
                </div>
            </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;