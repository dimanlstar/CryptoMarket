import React, { useState } from 'react';
import { LayoutDashboard, Users, ShoppingBag, FileText, Settings, Trash2, Edit, Plus, X, ArrowRightLeft, BookOpen, Upload } from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { useAuth } from '../context/AuthContext';
import { Product, NewsItem, User, UserRole, ExchangeService, Course } from '../types';

const AdminPanel: React.FC = () => {
  const { 
    products, addProduct, updateProduct, deleteProduct,
    news, addNews, updateNews, deleteNews,
    services, addService, updateService, deleteService,
    courses, addCourse, updateCourse, deleteCourse
  } = useMarket();

  const { users, addUser, updateUser, deleteUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'users' | 'products' | 'news' | 'services' | 'courses'>('products');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [productForm, setProductForm] = useState<Partial<Product>>({});
  const [newsForm, setNewsForm] = useState<Partial<NewsItem>>({});
  const [userForm, setUserForm] = useState<Partial<User>>({});
  const [serviceForm, setServiceForm] = useState<Partial<ExchangeService>>({});
  const [courseForm, setCourseForm] = useState<Partial<Course>>({});

  const SidebarItem = ({ id, icon: Icon, label }: { id: any, icon: any, label: string }) => (
    <button 
        onClick={() => { setActiveTab(id); setIsModalOpen(false); }}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === id ? 'bg-white/10 text-white shadow-md' : 'text-gray-300 hover:bg-white/5'
        }`}
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </button>
  );

  const openAddModal = () => {
    setEditingId(null);
    setProductForm({ name: '', price: 0, description: '', image: '', features: [''] });
    setNewsForm({ title: '', summary: '', source: '', date: new Date().toLocaleDateString() });
    setServiceForm({ title: '', type: 'Partner', features: [] });
    setCourseForm({ title: '', level: 'Beginner', lessons: 5, price: 0, image: '' });
    
    const randomCode = Math.random().toString(36).substring(7).toUpperCase();
    setUserForm({ name: '', email: '', password: '', role: UserRole.USER, referralCode: randomCode, referralReward: 10 });
    
    setIsModalOpen(true);
  };

  const openEditModal = (item: any, type: 'product' | 'news' | 'user' | 'service' | 'course') => {
    setEditingId(item.id);
    if (type === 'product') setProductForm({ ...item });
    if (type === 'news') setNewsForm({ ...item });
    if (type === 'user') setUserForm({ ...item });
    if (type === 'service') setServiceForm({ ...item });
    if (type === 'course') setCourseForm({ ...item });
    setIsModalOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = productForm as Product;
    if (!p.name || !p.price) return alert('Name and Price required');
    if (editingId) updateProduct({ ...p, id: editingId });
    else addProduct(p);
    setIsModalOpen(false);
  };

  const handleNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = newsForm as NewsItem;
    if (!n.title || !n.summary) return alert('Title and Summary required');
    if (editingId) updateNews({ ...n, id: editingId });
    else addNews(n);
    setIsModalOpen(false);
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const u = userForm as User;
    if (!u.email) return alert('Email required');
    
    if (editingId) {
        updateUser({ ...u, id: editingId });
    } else {
        if (!u.password) return alert('Password required for new user');
        addUser({ 
            ...u, 
            balance: u.balance || 0,
            achievements: [], 
            courseProgress: {} 
        });
    }
    setIsModalOpen(false);
  };

  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const s = serviceForm as ExchangeService;
    if (!s.title) return alert('Title required');
    if (editingId) updateService({ ...s, id: editingId });
    else addService(s);
    setIsModalOpen(false);
  };

  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const c = courseForm as Course;
    if (!c.title) return alert('Title required');
    if (editingId) updateCourse({ ...c, id: editingId });
    else addCourse(c);
    setIsModalOpen(false);
  };

  // Generic Image Uploader
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setForm: Function, currentForm: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
        alert("Файл слишком большой (макс. 5MB)");
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800; 
            const MAX_HEIGHT = 800;
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
            
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            setForm({ ...currentForm, image: dataUrl });
        };
        img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-100">
      <aside className="w-64 bg-primary text-white shadow-xl flex-shrink-0 hidden md:block">
        <div className="p-6">
            <h2 className="text-xl font-bold text-secondary flex items-center">
                <LayoutDashboard className="mr-2" /> Admin Panel
            </h2>
        </div>
        <nav className="px-4 space-y-2">
            <SidebarItem id="products" icon={ShoppingBag} label="Товары" />
            <SidebarItem id="courses" icon={BookOpen} label="Курсы" />
            <SidebarItem id="news" icon={FileText} label="Новости" />
            <SidebarItem id="services" icon={ArrowRightLeft} label="Обмен / Партнеры" />
            <SidebarItem id="users" icon={Users} label="Пользователи" />
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-8 relative">
        <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 capitalize">
                {activeTab === 'products' ? 'Управление товарами' : 
                 activeTab === 'courses' ? 'Управление обучением' :
                 activeTab === 'news' ? 'Управление новостями' : 
                 activeTab === 'services' ? 'Управление партнерами' : 'Пользователи и Рефералы'}
            </h1>
            <button 
                onClick={openAddModal}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-[#1e3a8a] transition shadow flex items-center"
            >
                <Plus size={20} className="mr-2" /> Добавить
            </button>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {activeTab === 'products' && (
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-700">Фото</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-700">Название</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-700">Цена</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-right">Действия</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4">
                                    <img src={p.image} className="h-10 w-10 object-contain rounded bg-gray-100" alt="" onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40'} />
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                                <td className="px-6 py-4 text-gray-600">{Number(p.price).toLocaleString()} ₸</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button onClick={() => openEditModal(p, 'product')} className="text-blue-500 hover:text-blue-700 p-1"><Edit size={18} /></button>
                                    <button onClick={() => deleteProduct(p.id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {activeTab === 'courses' && (
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-700">Фото</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-700">Название</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-700">Уровень</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-right">Действия</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {courses.map(c => (
                            <tr key={c.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4">
                                    <img src={c.image} className="h-10 w-16 object-cover rounded bg-gray-100" alt="" onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40'} />
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">{c.title}</td>
                                <td className="px-6 py-4 text-gray-600">{c.level}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button onClick={() => openEditModal(c, 'course')} className="text-blue-500 hover:text-blue-700 p-1"><Edit size={18} /></button>
                                    <button onClick={() => deleteCourse(c.id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {activeTab === 'news' && (
                 <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-700">Заголовок</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-700">Источник</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-700">Дата</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-right">Действия</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {news.map(n => (
                            <tr key={n.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 font-medium text-gray-900 max-w-md truncate">{n.title}</td>
                                <td className="px-6 py-4 text-gray-600">{n.source}</td>
                                <td className="px-6 py-4 text-gray-600">{n.date}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button onClick={() => openEditModal(n, 'news')} className="text-blue-500 hover:text-blue-700 p-1"><Edit size={18} /></button>
                                    <button onClick={() => deleteNews(n.id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

             {activeTab === 'services' && (
                 <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-700">Название</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-700">Тип</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-700">Особенности</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-right">Действия</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {services.map(s => (
                            <tr key={s.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 font-medium text-gray-900">{s.title}</td>
                                <td className="px-6 py-4 text-gray-600">
                                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">{s.type}</span>
                                </td>
                                <td className="px-6 py-4 text-gray-600 text-sm">{s.features.join(', ')}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button onClick={() => openEditModal(s, 'service')} className="text-blue-500 hover:text-blue-700 p-1"><Edit size={18} /></button>
                                    <button onClick={() => deleteService(s.id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {activeTab === 'users' && (
                <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-700">Имя</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-700">Реф. Код / Награда</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-700">Роль</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-right">Действия</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {users.map(u => (
                        <tr key={u.id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 font-medium text-gray-900">
                                {u.name}<br/>
                                <span className="text-xs text-gray-500">{u.email}</span>
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                                <span className="font-mono bg-gray-100 px-2 py-1 rounded border border-gray-200 text-xs font-bold mr-2">
                                    {u.referralCode}
                                </span>
                                <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded">
                                    +{u.referralReward || 10} Б.
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === UserRole.ADMIN ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                    {u.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right space-x-2">
                                <button onClick={() => openEditModal(u, 'user')} className="text-blue-500 hover:text-blue-700 p-1"><Edit size={18} /></button>
                                <button onClick={() => deleteUser(u.id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={18} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h3 className="text-xl font-bold text-gray-800">
                        {editingId ? 'Редактировать' : 'Добавить'} {
                            activeTab === 'products' ? 'товар' : 
                            activeTab === 'courses' ? 'курс' :
                            activeTab === 'news' ? 'новость' : 
                            activeTab === 'services' ? 'партнера' : 'пользователя'
                        }
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
                </div>
                
                <div className="p-6">
                    {activeTab === 'products' && (
                        <form onSubmit={handleProductSubmit} className="space-y-4">
                            <div>
                                <label className="label">Название</label>
                                <input className="input" value={productForm.name || ''} onChange={e => setProductForm({...productForm, name: e.target.value})} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Цена (₸)</label>
                                    <input type="number" className="input" value={productForm.price || ''} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} required />
                                </div>
                                <div>
                                    <label className="label">Старая цена</label>
                                    <input type="number" className="input" value={productForm.oldPrice || ''} onChange={e => setProductForm({...productForm, oldPrice: Number(e.target.value)})} />
                                </div>
                            </div>
                            <div>
                                <label className="label">Изображение</label>
                                <div className="flex items-center space-x-4">
                                    {productForm.image && (
                                        <div className="w-16 h-16 bg-gray-700 rounded overflow-hidden flex-shrink-0 border border-gray-600">
                                            <img src={productForm.image} alt="Preview" className="w-full h-full object-contain" />
                                        </div>
                                    )}
                                    <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg border border-gray-500 flex items-center transition">
                                         <Upload size={16} className="mr-2" />
                                         Выбрать файл
                                         <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setProductForm, productForm)} />
                                    </label>
                                </div>
                                <div className="text-[10px] text-gray-500 mt-1">Поддерживаются: JPG, PNG, WEBP. Макс 5MB.</div>
                            </div>
                            <div>
                                <label className="label">Описание</label>
                                <textarea className="input h-24" value={productForm.description || ''} onChange={e => setProductForm({...productForm, description: e.target.value})} />
                            </div>
                            <div>
                                <label className="label">Особенности (через запятую)</label>
                                <input className="input" value={productForm.features?.join(', ') || ''} onChange={e => setProductForm({...productForm, features: e.target.value.split(',').map(s => s.trim())})} />
                            </div>
                            <button type="submit" className="btn-primary w-full mt-4">Сохранить</button>
                        </form>
                    )}

                    {activeTab === 'courses' && (
                         <form onSubmit={handleCourseSubmit} className="space-y-4">
                            <div>
                                <label className="label">Название Курса</label>
                                <input className="input" value={courseForm.title || ''} onChange={e => setCourseForm({...courseForm, title: e.target.value})} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Уровень</label>
                                    <select className="input" value={courseForm.level || 'Beginner'} onChange={e => setCourseForm({...courseForm, level: e.target.value as any})}>
                                        <option value="Beginner">Beginner</option>
                                        <option value="Advanced">Advanced</option>
                                        <option value="Expert">Expert</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Кол-во уроков</label>
                                    <input type="number" className="input" value={courseForm.lessons || 5} onChange={e => setCourseForm({...courseForm, lessons: Number(e.target.value)})} required />
                                </div>
                            </div>
                             <div>
                                <label className="label">Цена (0 = Бесплатно)</label>
                                <input type="number" className="input" value={courseForm.price || 0} onChange={e => setCourseForm({...courseForm, price: Number(e.target.value)})} />
                            </div>
                            <div>
                                <label className="label">Обложка курса</label>
                                <div className="flex items-center space-x-4">
                                    {courseForm.image && (
                                        <div className="w-20 h-14 bg-gray-700 rounded overflow-hidden flex-shrink-0 border border-gray-600">
                                            <img src={courseForm.image} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg border border-gray-500 flex items-center transition">
                                         <Upload size={16} className="mr-2" />
                                         Выбрать файл
                                         <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setCourseForm, courseForm)} />
                                    </label>
                                </div>
                            </div>
                            <button type="submit" className="btn-primary w-full mt-4">Сохранить</button>
                        </form>
                    )}

                    {activeTab === 'news' && (
                        <form onSubmit={handleNewsSubmit} className="space-y-4">
                            <div>
                                <label className="label">Заголовок</label>
                                <input className="input" value={newsForm.title || ''} onChange={e => setNewsForm({...newsForm, title: e.target.value})} required />
                            </div>
                            <div>
                                <label className="label">Краткое содержание (AI Summary)</label>
                                <textarea className="input h-32" value={newsForm.summary || ''} onChange={e => setNewsForm({...newsForm, summary: e.target.value})} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Источник</label>
                                    <input className="input" value={newsForm.source || ''} onChange={e => setNewsForm({...newsForm, source: e.target.value})} />
                                </div>
                                <div>
                                    <label className="label">Дата</label>
                                    <input className="input" value={newsForm.date || ''} onChange={e => setNewsForm({...newsForm, date: e.target.value})} />
                                </div>
                            </div>
                            <button type="submit" className="btn-primary w-full mt-4">Сохранить</button>
                        </form>
                    )}

                    {activeTab === 'services' && (
                        <form onSubmit={handleServiceSubmit} className="space-y-4">
                            <div>
                                <label className="label">Название Партнера/Сервиса</label>
                                <input className="input" value={serviceForm.title || ''} onChange={e => setServiceForm({...serviceForm, title: e.target.value})} required />
                            </div>
                            <div>
                                <label className="label">Тип</label>
                                <select 
                                    className="input" 
                                    value={serviceForm.type || 'Partner'} 
                                    onChange={e => setServiceForm({...serviceForm, type: e.target.value as any})}
                                >
                                    <option value="Partner">Partner</option>
                                    <option value="CEX">CEX (Биржа)</option>
                                    <option value="DEX">DEX (Обменник)</option>
                                </select>
                            </div>
                            <div>
                                <label className="label">Особенности (через запятую)</label>
                                <textarea 
                                    className="input h-32" 
                                    value={serviceForm.features?.join(', ') || ''} 
                                    onChange={e => setServiceForm({...serviceForm, features: e.target.value.split(',').map(s => s.trim())})} 
                                    placeholder="Низкие комиссии, Быстрый вывод, Лицензия"
                                />
                            </div>
                            <button type="submit" className="btn-primary w-full mt-4">Сохранить</button>
                        </form>
                    )}

                    {activeTab === 'users' && (
                        <form onSubmit={handleUserSubmit} className="space-y-4">
                             <div>
                                <label className="label">Имя</label>
                                <input className="input" value={userForm.name || ''} onChange={e => setUserForm({...userForm, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="label">Email</label>
                                <input className="input" value={userForm.email || ''} onChange={e => setUserForm({...userForm, email: e.target.value})} />
                            </div>
                             <div>
                                <label className="label">Пароль {editingId && <span className="text-gray-400 font-normal">(оставьте пустым чтобы не менять)</span>}</label>
                                <input className="input" type="password" value={userForm.password || ''} onChange={e => setUserForm({...userForm, password: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div>
                                    <label className="label text-blue-800">Реферальный код</label>
                                    <input className="input bg-white text-gray-900 border-gray-300" value={userForm.referralCode || ''} onChange={e => setUserForm({...userForm, referralCode: e.target.value})} placeholder="Напр: PROMO2025" />
                                </div>
                                <div>
                                    <label className="label text-blue-800">Бонус за регистрацию (СМК)</label>
                                    <input 
                                        className="input bg-white text-gray-900 border-gray-300" 
                                        type="number"
                                        value={userForm.referralReward || 10} 
                                        onChange={e => setUserForm({...userForm, referralReward: Number(e.target.value)})} 
                                        placeholder="10" 
                                    />
                                    <span className="text-[10px] text-gray-500">Сколько получит новичок за этот код</span>
                                </div>
                            </div>
                            <div>
                                <label className="label">Роль</label>
                                <select 
                                    className="input" 
                                    value={userForm.role || UserRole.USER} 
                                    onChange={e => setUserForm({...userForm, role: e.target.value as UserRole})}
                                >
                                    <option value={UserRole.USER}>Пользователь</option>
                                    <option value={UserRole.ADMIN}>Администратор</option>
                                </select>
                            </div>
                            <button type="submit" className="btn-primary w-full mt-4">Сохранить</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
      )}

      <style>{`
        .label { display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem; }
        .input { width: 100%; padding: 0.5rem 1rem; border: 1px solid #4b5563; border-radius: 0.5rem; outline: none; transition: border-color 0.2s; background-color: #374151; color: white; }
        .input:focus { border-color: #0B2545; ring: 2px solid #0B2545; }
        .btn-primary { background-color: #0B2545; color: white; padding: 0.75rem; border-radius: 0.5rem; font-weight: bold; transition: background-color 0.2s; }
        .btn-primary:hover { background-color: #1e3a8a; }
      `}</style>
    </div>
  );
};

export default AdminPanel;