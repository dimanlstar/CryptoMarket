import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Achievement } from '../types';
import { User as UserIcon, Lock, Save, Shield, Coins, Award, Share2, Copy, TrendingUp, Zap, Star, Image, Upload, Camera } from 'lucide-react';

interface ProfileProps {
    currentUser: User;
}

const RANKS = [
    { name: 'Хомяк (Hamster)', threshold: 0, icon: '🐹' },
    { name: 'Ходлер (Hodler)', threshold: 1001, icon: '💎' },
    { name: 'Трейдер (Trader)', threshold: 5001, icon: '📈' },
    { name: 'Кит (Whale)', threshold: 20001, icon: '🐋' }
];

const ACHIEVEMENTS_LIST: Achievement[] = [
    { id: 'early_adopter', title: 'Early Adopter', description: 'Регистрация в числе первых', icon: 'zap', threshold: Number.MAX_SAFE_INTEGER },
    { id: 'knowledge_seeker', title: 'Ученик', description: 'Завершить 1 курс', icon: 'book', threshold: Number.MAX_SAFE_INTEGER },
    { id: 'shopaholic', title: 'Шопоголик', description: 'Сделать первую покупку', icon: 'shopping-cart', threshold: Number.MAX_SAFE_INTEGER },
    { id: 'rich_guy', title: 'Богатей', description: 'Накопить 10 000 Баллов', icon: 'trending-up', threshold: 10000 },
];

const Profile: React.FC<ProfileProps> = ({ currentUser }) => {
    const { users, updateUser } = useAuth();
    const user = users.find(u => u.id === currentUser.id) || currentUser;

    const [name, setName] = useState(user.name);
    const [password, setPassword] = useState(user.password || '');
    const [avatar, setAvatar] = useState(user.avatar || '');
    const [message, setMessage] = useState('');
    const [copySuccess, setCopySuccess] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const currentRank = RANKS.slice().reverse().find(r => user.balance >= r.threshold) || RANKS[0];
    const nextRank = RANKS.find(r => r.threshold > user.balance);
    
    const currentThreshold = currentRank.threshold;
    const nextThreshold = nextRank ? nextRank.threshold : currentThreshold * 1.5;
    const progressPercent = Math.min(100, Math.max(0, ((user.balance - currentThreshold) / (nextThreshold - currentThreshold)) * 100));

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateUser({
            ...user,
            name: name,
            password: password,
            avatar: avatar
        });
        setMessage('Данные успешно обновлены!');
        setTimeout(() => setMessage(''), 3000);
    };

    const copyReferral = () => {
        const cleanUrl = `${window.location.protocol}//${window.location.host}/?ref=${user.referralCode}`;
        navigator.clipboard.writeText(cleanUrl);
        setCopySuccess('Ссылка скопирована!');
        setTimeout(() => setCopySuccess(''), 2000);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert("Файл слишком большой (макс. 5MB)");
            // Reset input so user can try again if they pick the wrong file then the right one
            e.target.value = ''; 
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 250; // Reduced slightly to ensure stability
                const MAX_HEIGHT = 250;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);
                
                // Compress to JPEG with 0.6 quality (more compression) to save localStorage space
                const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
                setAvatar(dataUrl);
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
        
        // Critical fix: Reset input value to allow selecting the same file again if needed
        e.target.value = '';
    };

    const getIcon = (iconName: string) => {
        switch(iconName) {
            case 'zap': return <Zap size={24} />;
            case 'book': return <Award size={24} />;
            case 'shopping-cart': return <UserIcon size={24} />;
            case 'trending-up': return <TrendingUp size={24} />;
            default: return <Star size={24} />;
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen py-8">
            <div className="max-w-4xl mx-auto px-4 space-y-6">
                
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-r from-primary to-[#0f3d2e] p-8 text-white flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-secondary border-4 border-white/10 shadow-xl overflow-hidden relative">
                                {avatar ? (
                                    <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : user.avatar ? (
                                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl">{currentRank.icon}</span>
                                )}
                                
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="text-white" size={24} />
                                </div>
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-secondary text-primary rounded-full p-1.5 shadow-md border border-white/20">
                                <Upload size={14} />
                            </div>
                        </div>
                        
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
                            <p className="text-emerald-200 mb-3">{user.email}</p>
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                <span className="px-3 py-1 rounded-full bg-black/30 text-xs font-bold flex items-center">
                                    <Shield size={12} className="mr-1" />
                                    {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-bold border border-secondary/50">
                                    ID: {user.id.slice(-6)}
                                </span>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 min-w-[180px] text-center border border-white/10">
                            <div className="text-xs text-emerald-200 uppercase font-semibold mb-1">Бонусы</div>
                            <div className="text-3xl font-bold text-secondary flex items-center justify-center gap-2">
                                <Coins size={28} className="fill-secondary text-secondary" />
                                {user.balance.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-emerald-100 mt-1 opacity-70">Программа лояльности</div>
                        </div>
                    </div>

                    <div className="px-8 py-6 bg-white">
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <span className="text-sm text-gray-400 font-medium">Текущий ранг</span>
                                <div className="text-lg font-bold text-primary">{currentRank.name}</div>
                            </div>
                            {nextRank ? (
                                <div className="text-right">
                                    <span className="text-sm text-gray-400 font-medium">Следующий ранг ({nextRank.threshold.toLocaleString()} Баллов)</span>
                                    <div className="text-sm font-bold text-gray-600">{nextRank.name}</div>
                                </div>
                            ) : (
                                <div className="text-right">
                                    <span className="text-sm text-gray-400 font-medium">Максимальный ранг!</span>
                                    <div className="text-sm font-bold text-secondary">Легенда</div>
                                </div>
                            )}
                        </div>
                        
                        <div className="h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner relative mb-2">
                            <div 
                                className="h-full bg-gradient-to-r from-secondary to-yellow-500 transition-all duration-1000 ease-out relative"
                                style={{ width: `${progressPercent}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            </div>
                        </div>
                        
                        {nextRank && (
                             <p className="text-xs text-gray-400 text-right">
                                Осталось <span className="font-bold text-secondary">{(nextRank.threshold - user.balance).toLocaleString()} Баллов</span> до повышения
                             </p>
                        )}

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Карта рангов</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {RANKS.map((rank) => {
                                    const isCurrent = currentRank.name === rank.name;
                                    const isPassed = user.balance >= rank.threshold;
                                    
                                    return (
                                        <div key={rank.name} className={`relative p-3 rounded-xl border flex flex-col items-center transition-all ${
                                            isCurrent 
                                                ? 'bg-secondary/5 border-secondary ring-1 ring-secondary shadow-sm scale-105 z-10' 
                                                : isPassed 
                                                    ? 'bg-emerald-50/50 border-emerald-200' 
                                                    : 'bg-gray-50 border-gray-100 opacity-60 grayscale'
                                        }`}>
                                            {isCurrent && (
                                                <div className="absolute -top-2.5 bg-secondary text-primary text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                                    ВЫ ЗДЕСЬ
                                                </div>
                                            )}
                                            <div className="text-2xl mb-2">{rank.icon}</div>
                                            <div className="font-bold text-gray-800 text-xs text-center leading-tight mb-1">{rank.name}</div>
                                            <div className="text-[10px] text-center font-mono text-gray-500 bg-white/50 px-2 rounded-full border border-gray-200/50">
                                                {rank.threshold.toLocaleString()}+
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                            <Award className="mr-2 text-primary" size={20} />
                            Достижения
                        </h3>
                        <div className="grid grid-cols-4 gap-4">
                            {ACHIEVEMENTS_LIST.map((ach) => {
                                const isUnlocked = (user.achievements && user.achievements.includes(ach.id)) || user.balance >= ach.threshold;
                                return (
                                    <div key={ach.id} className="flex flex-col items-center text-center group relative">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                                            isUnlocked 
                                                ? 'bg-gradient-to-br from-yellow-100 to-orange-100 text-orange-500 shadow-md scale-100' 
                                                : 'bg-gray-100 text-gray-300 grayscale'
                                        }`}>
                                            {getIcon(ach.icon)}
                                        </div>
                                        <span className={`text-[10px] leading-tight font-medium ${isUnlocked ? 'text-gray-700' : 'text-gray-400'}`}>
                                            {ach.title}
                                        </span>
                                        <div className="absolute bottom-full mb-2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                            {ach.description}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                            <Share2 className="mr-2 text-primary" size={20} />
                            Реферальная программа
                        </h3>
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                            <p className="text-sm text-blue-800 mb-3">
                                Пригласи друга и получи <span className="font-bold text-secondary">25 Баллов</span>! 
                                Друг получит <span className="font-bold">+10 Баллов</span> при регистрации.
                            </p>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 bg-white px-3 py-2 rounded-lg border border-blue-200 text-center font-mono font-bold text-gray-700 tracking-wider overflow-hidden">
                                    {user.referralCode}
                                </code>
                                <button 
                                    onClick={copyReferral}
                                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition shadow-md flex items-center gap-1 min-w-[120px] justify-center"
                                    title="Скопировать ссылку"
                                >
                                    <Copy size={16} /> 
                                    <span className="text-xs font-bold">Скопировать</span>
                                </button>
                            </div>
                            {copySuccess && <p className="text-xs text-green-600 text-center mt-2 font-bold">{copySuccess}</p>}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                        <Lock className="mr-2 text-primary" size={20} /> 
                        Настройки безопасности
                    </h2>

                    {message && (
                        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-2">Аватар профиля</label>
                             <div className="flex items-center space-x-4">
                                <button 
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition flex items-center"
                                >
                                    <Image size={18} className="mr-2" />
                                    Загрузить фото
                                </button>
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <span className="text-xs text-gray-400">
                                    Рекомендуемый размер 300x300. Макс 5MB.
                                </span>
                             </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Имя пользователя</label>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Новый пароль</label>
                                <input 
                                    type="text" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button 
                                type="submit" 
                                className="bg-gray-900 text-white font-bold py-2 px-6 rounded-lg hover:bg-black transition shadow flex items-center"
                            >
                                <Save className="mr-2" size={18} />
                                Сохранить
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;