import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, NewsItem, ExchangeService, Course } from '../types';
import { MOCK_PRODUCTS, MOCK_NEWS, MOCK_SERVICES, MOCK_COURSES } from '../constants';

interface MarketContextType {
  products: Product[];
  news: NewsItem[];
  services: ExchangeService[];
  courses: Course[];
  
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  
  addNews: (news: Omit<NewsItem, 'id'>) => void;
  updateNews: (news: NewsItem) => void;
  deleteNews: (id: string) => void;
  
  addService: (service: Omit<ExchangeService, 'id'>) => void;
  updateService: (service: ExchangeService) => void;
  deleteService: (id: string) => void;

  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (id: string) => void;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
};

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
  });

  const [news, setNews] = useState<NewsItem[]>(() => {
    const saved = localStorage.getItem('news');
    return saved ? JSON.parse(saved) : MOCK_NEWS;
  });

  const [services, setServices] = useState<ExchangeService[]>(() => {
    const saved = localStorage.getItem('services');
    return saved ? JSON.parse(saved) : MOCK_SERVICES;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('courses');
    return saved ? JSON.parse(saved) : MOCK_COURSES;
  });

  useEffect(() => { localStorage.setItem('products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('news', JSON.stringify(news)); }, [news]);
  useEffect(() => { localStorage.setItem('services', JSON.stringify(services)); }, [services]);
  useEffect(() => { localStorage.setItem('courses', JSON.stringify(courses)); }, [courses]);

  // Product Actions
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now().toString() };
    setProducts([...products, newProduct]);
  };
  const updateProduct = (updatedProduct: Product) => setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  const deleteProduct = (id: string) => setProducts(products.filter(p => p.id !== id));

  // News Actions
  const addNews = (item: Omit<NewsItem, 'id'>) => {
    const newItem = { ...item, id: Date.now().toString() };
    setNews([newItem, ...news]);
  };
  const updateNews = (updatedItem: NewsItem) => setNews(news.map(n => n.id === updatedItem.id ? updatedItem : n));
  const deleteNews = (id: string) => setNews(news.filter(n => n.id !== id));

  // Service Actions
  const addService = (service: Omit<ExchangeService, 'id'>) => {
    const newService = { ...service, id: Date.now().toString() };
    setServices([...services, newService]);
  };
  const updateService = (updatedService: ExchangeService) => setServices(services.map(s => s.id === updatedService.id ? updatedService : s));
  const deleteService = (id: string) => setServices(services.filter(s => s.id !== id));

  // Course Actions
  const addCourse = (course: Omit<Course, 'id'>) => {
    const newCourse = { ...course, id: Date.now().toString() };
    setCourses([...courses, newCourse]);
  };
  const updateCourse = (updatedCourse: Course) => setCourses(courses.map(c => c.id === updatedCourse.id ? updatedCourse : c));
  const deleteCourse = (id: string) => setCourses(courses.filter(c => c.id !== id));

  return (
    <MarketContext.Provider value={{
      products, news, services, courses,
      addProduct, updateProduct, deleteProduct,
      addNews, updateNews, deleteNews,
      addService, updateService, deleteService,
      addCourse, updateCourse, deleteCourse,
    }}>
      {children}
    </MarketContext.Provider>
  );
};