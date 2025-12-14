import { Product, NewsItem, Course, ExchangeService } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'ColdVault Mini',
    description: 'Аппаратный кошелек нового поколения для холодного хранения.',
    price: 35000,
    oldPrice: 50000,
    image: 'https://picsum.photos/400/400?grayscale',
    features: ['Хранение ключей оффлайн', 'Поддержка BTC/ETH/BEP20', 'USB-C + OLED экран', 'Гарантия 12 месяцев']
  },
  {
    id: '2',
    name: 'Ledger Nano X',
    description: 'Популярный кошелек с Bluetooth соединением.',
    price: 65000,
    image: 'https://picsum.photos/400/400?blur=2',
    features: ['Bluetooth', 'Большой экран', 'Поддержка 5000+ монет']
  }
];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: "Crypto's other halving: Bittensor's first 4-year cycle seen as 'maturation' milestone",
    summary: "Превышено максимальное количество попыток API. (Это заглушка, имитирующая скриншот)",
    source: "CoinTelegraph",
    date: "07.12 21:12"
  },
  {
    id: '2',
    title: "Ether supply squeeze looms with exchanges holding lowest levels since 2015",
    summary: "Запасы ETH на биржах достигли исторического минимума, что может привести к дефициту предложения и росту цены.",
    source: "CoinTelegraph",
    date: "07.12 20:12"
  },
  {
    id: '3',
    title: "South Korea to impose bank-level liability on crypto exchanges after Upbit hack",
    summary: "Южная Корея ужесточает регулирование бирж, требуя банковского уровня ответственности для защиты средств пользователей.",
    source: "CoinTelegraph",
    date: "07.12 19:11"
  }
];

export const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Крипта для новичков',
    level: 'Beginner',
    lessons: 5,
    price: 0,
    image: 'https://picsum.photos/300/200?random=1'
  },
  {
    id: '2',
    title: 'Продвинутый трейдинг',
    level: 'Advanced',
    lessons: 10,
    price: 50000,
    image: 'https://picsum.photos/300/200?random=2'
  },
  {
    id: '3',
    title: 'DeFi и Стейкинг',
    level: 'Expert',
    lessons: 8,
    price: 35000,
    image: 'https://picsum.photos/300/200?random=3'
  }
];

export const MOCK_SERVICES: ExchangeService[] = [
  {
    id: '1',
    title: 'Партнер CryptoExchange',
    type: 'Partner',
    features: ['Низкие комиссии', 'Легальный обмен в Казахстане', 'Моментальный вывод']
  },
  {
    id: '2',
    title: 'Криптобиржа (CEX)',
    type: 'CEX',
    features: ['Лицензия МФЦА', 'Низкие комиссии', 'Юридическая поддержка']
  },
  {
    id: '3',
    title: 'Агрегатор обменников',
    type: 'DEX',
    features: ['Официальные партнеры', 'Ввод/Вывод на карты СНГ', 'KYC/AML проверки']
  }
];