import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { User, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const { users, addUser } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
        const params = new URLSearchParams(window.location.search);
        const refParam = params.get('ref');
        if (refParam) {
            setReferralCode(refParam);
            setIsRegister(true); 
        }
    }
  }, [isOpen]);

  const getDynamicBonus = () => {
    if (!referralCode) return 0;
    const referrer = users.find(u => u.referralCode === referralCode);
    return referrer ? (referrer.referralReward || 10) : 0;
  };

  const dynamicBonus = getDynamicBonus();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            setError('Пользователь с таким email уже существует');
            return;
        }

        const newUser: User = {
            id: Date.now().toString(),
            name: name,
            email: email,
            password: password,
            role: UserRole.USER,
            balance: 10,
            referralCode: Math.random().toString(36).substring(7).toUpperCase(),
            referralReward: 10,
            achievements: [] 
        };

        addUser(newUser, referralCode);
        
        const refBonus = dynamicBonus;
        let earlyAdopterBonus = 0;
        const finalAchievements = [];

        if (users.length < 1000) {
            finalAchievements.push('early_adopter');
            earlyAdopterBonus = 1000;
        }

        const finalBalance = newUser.balance + refBonus + earlyAdopterBonus;

        onLogin({
            ...newUser, 
            balance: finalBalance,
            achievements: finalAchievements
        });
        
        onClose();
    } else {
        const user = users.find(u => 
            ((u.email === email) || (email === 'admin' && u.role === UserRole.ADMIN)) && 
            u.password === password
        );
        
        if (user) {
            onLogin(user);
            onClose();
        } else {
            setError('Неверный email/логин или пароль');
        }
    }
  };

  const inputClasses = "w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-secondary focus:border-transparent outline-none placeholder-gray-400 transition-colors";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl">
        <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
            <X size={24} />
        </button>

        <div className="p-8">
            <h2 className="text-2xl font-bold text-center text-primary mb-6">
                {isRegister ? 'Регистрация' : 'Вход в систему'}
            </h2>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {isRegister && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                            <input 
                                type="text" 
                                required 
                                className={inputClasses}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Введите ваше имя"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Реферальный код (необязательно)</label>
                            <input 
                                type="text" 
                                className={inputClasses}
                                value={referralCode}
                                onChange={(e) => setReferralCode(e.target.value)}
                                placeholder="Например: USER123"
                            />
                            {dynamicBonus > 0 && (
                                <p className="text-xs text-green-600 mt-1 font-bold animate-pulse">
                                    Код активен! Вы получите +{dynamicBonus} Баллов!
                                </p>
                            )}
                        </div>
                    </>
                )}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {isRegister ? 'Email' : 'Email или Логин'}
                    </label>
                    <input 
                        type="text" 
                        required 
                        placeholder={isRegister ? "example@mail.com" : "admin или example@mail.com"}
                        className={inputClasses}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                    <input 
                        type="password" 
                        required 
                        className={inputClasses}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                </div>

                <button 
                    type="submit"
                    className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-[#1e3a8a] transition shadow-lg mt-4"
                >
                    {isRegister ? 'Создать аккаунт' : 'Войти'}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
                {isRegister ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}
                <button 
                    onClick={() => { setIsRegister(!isRegister); setError(''); }}
                    className="ml-2 text-secondary font-bold hover:underline"
                >
                    {isRegister ? 'Войти' : 'Зарегистрироваться'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;