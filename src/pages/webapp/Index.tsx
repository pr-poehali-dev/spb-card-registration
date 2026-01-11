import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { 
  CreditCard, Plus, Edit2, MapPin, Car, Cloud, Sun, CloudRain, 
  Snowflake, Wind, Home, FileText, Bell, Settings, ChevronRight,
  Wallet, AlertCircle, Check, X, Menu, Building2, Gift, DollarSign,
  Calendar, Users, FileCheck, Shield, Receipt, Phone, Mail
} from 'lucide-react';

// Types
interface UserData {
  id: number;
  phone: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email?: string;
  birthDate?: string;
  weatherCity?: string;
  passport?: Passport;
  podorozhnikCards: PodorozhnikCard[];
  bankCards: BankCard[];
  vehicles: Vehicle[];
  intercoms: Intercom[];
  widgets: WidgetConfig[];
}

interface Passport {
  id: number;
  series: string;
  number: string;
  issuedBy: string;
  issuedDate: string;
}

interface PodorozhnikCard {
  id: number;
  cardNumber: string;
  balance: number;
  type: 'physical' | 'virtual';
}

interface BankCard {
  id: number;
  cardNumber: string;
  bankName: string;
  balance: number;
  bonusBalance?: number;
}

interface Vehicle {
  id: number;
  plateNumber: string;
  model?: string;
  fines?: Fine[];
}

interface Fine {
  id: number;
  amount: number;
  date: string;
  description: string;
  paid: boolean;
}

interface Intercom {
  id: number;
  address: string;
  city: string;
  code: string;
}

interface Weather {
  temp: number;
  condition: string;
  icon: string;
}

interface GosuslugiData {
  taxes: Tax[];
  benefits: Benefit[];
}

interface Tax {
  id: number;
  type: string;
  amount: number;
  dueDate: string;
  paid: boolean;
}

interface Benefit {
  id: number;
  name: string;
  amount: number;
  validUntil: string;
}

interface WidgetConfig {
  id: string;
  type: string;
  visible: boolean;
  order: number;
}

export default function Index() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [gosuslugi, setGosuslugi] = useState<GosuslugiData | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showPodorozhnikDialog, setShowPodorozhnikDialog] = useState(false);
  const [showPassportDialog, setShowPassportDialog] = useState(false);
  const [showTopupDialog, setShowTopupDialog] = useState(false);
  const [showEditProfileDialog, setShowEditProfileDialog] = useState(false);
  const [showCitySelectDialog, setShowCitySelectDialog] = useState(false);
  const [showVehicleDialog, setShowVehicleDialog] = useState(false);
  const [showWidgetManagerDialog, setShowWidgetManagerDialog] = useState(false);
  const [showIntercomDialog, setShowIntercomDialog] = useState(false);
  const [selectedCard, setSelectedCard] = useState<PodorozhnikCard | null>(null);
  const [activeTab, setActiveTab] = useState<'main' | 'profile'>('main');
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (userData?.weatherCity) {
      loadWeather(userData.weatherCity);
    }
  }, [userData?.weatherCity]);

  useEffect(() => {
    if (userData?.id) {
      loadGosuslugi();
    }
  }, [userData?.id]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadUserData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        window.location.href = '/login';
        return;
      }
      const data = await api.getUserData(parseInt(userId));
      setUserData(data);
    } catch (error) {
      showToast('Ошибка загрузки данных', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadWeather = async (city: string) => {
    try {
      const data = await api.getWeather(city);
      setWeather(data);
    } catch (error) {
      console.error('Error loading weather:', error);
    }
  };

  const loadGosuslugi = async () => {
    try {
      const data = await api.getGosuslugi(userData!.id);
      setGosuslugi(data);
    } catch (error) {
      console.error('Error loading gosuslugi:', error);
    }
  };

  const handleAddBankCard = async (cardData: any) => {
    try {
      await api.addBankCard({ ...cardData, userId: userData!.id });
      await loadUserData();
      showToast('Банковская карта добавлена');
      setShowAddDialog(false);
    } catch (error) {
      showToast('Ошибка добавления карты', 'error');
    }
  };

  const handleAddPodorozhnik = async (type: 'have' | 'create', cardNumber?: string) => {
    try {
      await api.addPodorozhnik({
        userId: userData!.id,
        cardNumber: cardNumber || `9643${Math.floor(Math.random() * 1000000000)}`,
        type: type === 'create' ? 'virtual' : 'physical',
        balance: type === 'create' ? 0 : Math.floor(Math.random() * 500)
      });
      await loadUserData();
      showToast('Подорожник добавлен');
      setShowPodorozhnikDialog(false);
    } catch (error) {
      showToast('Ошибка добавления карты', 'error');
    }
  };

  const handleAddPassport = async (type: 'have' | 'create', passportData?: any) => {
    try {
      const data = type === 'create' ? {
        userId: userData!.id,
        series: '4024',
        number: String(Math.floor(Math.random() * 1000000)).padStart(6, '0'),
        issuedBy: 'ОУФМС России по Санкт-Петербургу',
        issuedDate: '2020-01-15'
      } : { ...passportData, userId: userData!.id };
      
      await api.addPassport(data);
      await loadUserData();
      showToast('Паспорт добавлен');
      setShowPassportDialog(false);
    } catch (error) {
      showToast('Ошибка добавления паспорта', 'error');
    }
  };

  const handleTopupPodorozhnik = async (cardId: number, amount: number, method: string) => {
    try {
      await api.topupPodorozhnik(cardId, amount);
      await loadUserData();
      showToast(`Пополнено ${amount} ₽ через ${method}`);
      setShowTopupDialog(false);
      setSelectedCard(null);
    } catch (error) {
      showToast('Ошибка пополнения', 'error');
    }
  };

  const handleUpdateProfile = async (profileData: any) => {
    try {
      await api.updateUser({ ...profileData, userId: userData!.id });
      await loadUserData();
      showToast('Профиль обновлен');
      setShowEditProfileDialog(false);
    } catch (error) {
      showToast('Ошибка обновления профиля', 'error');
    }
  };

  const handleSelectCity = async (city: string) => {
    try {
      await api.setWeatherCity(userData!.id, city);
      await loadUserData();
      showToast('Город выбран');
      setShowCitySelectDialog(false);
    } catch (error) {
      showToast('Ошибка выбора города', 'error');
    }
  };

  const handleAddVehicle = async (plateNumber: string, model?: string) => {
    try {
      await api.addVehicle({ userId: userData!.id, plateNumber, model });
      await loadUserData();
      showToast('Автомобиль добавлен');
      setShowVehicleDialog(false);
    } catch (error) {
      showToast('Ошибка добавления автомобиля', 'error');
    }
  };

  const handleAddIntercom = async (intercomData: any) => {
    try {
      await api.addIntercom({ ...intercomData, userId: userData!.id });
      await loadUserData();
      showToast('Домофон добавлен');
      setShowIntercomDialog(false);
    } catch (error) {
      showToast('Ошибка добавления домофона', 'error');
    }
  };

  const handleSaveWidgets = async (widgets: WidgetConfig[]) => {
    try {
      await api.saveWidgets(userData!.id, widgets);
      await loadUserData();
      showToast('Виджеты сохранены');
      setShowWidgetManagerDialog(false);
    } catch (error) {
      showToast('Ошибка сохранения виджетов', 'error');
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear': return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'rain': return <CloudRain className="w-8 h-8 text-blue-500" />;
      case 'snow': return <Snowflake className="w-8 h-8 text-blue-300" />;
      case 'clouds': return <Cloud className="w-8 h-8 text-gray-500" />;
      default: return <Wind className="w-8 h-8 text-gray-400" />;
    }
  };

  const getVisibleWidgets = () => {
    if (!userData) return [];
    const widgets = userData.widgets || [];
    return widgets.filter(w => w.visible).sort((a, b) => a.order - b.order);
  };

  const hasSberCard = () => {
    return userData?.bankCards.some(card => card.bankName.toLowerCase().includes('сбер'));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <button className="p-2"><Menu className="w-6 h-6" /></button>
          <h1 className="text-xl font-bold">Карта Петербуржца</h1>
          <button className="p-2"><Bell className="w-6 h-6" /></button>
        </div>
        {userData && (
          <div className="text-center">
            <p className="text-sm opacity-90">Привет, {userData.firstName}!</p>
            <p className="text-xs opacity-75">{userData.phone}</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-4">
        <button
          onClick={() => setActiveTab('main')}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
            activeTab === 'main'
              ? 'bg-primary text-white shadow-lg'
              : 'bg-white text-gray-600'
          }`}
        >
          Главная
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
            activeTab === 'profile'
              ? 'bg-primary text-white shadow-lg'
              : 'bg-white text-gray-600'
          }`}
        >
          Профиль
        </button>
      </div>

      {/* Main Content */}
      {activeTab === 'main' ? (
        <div className="p-4 space-y-4">
          {/* Main Card Widget - Always visible */}
          <MainCardWidget userData={userData} />

          {/* Weather Widget - Only if city selected */}
          {userData?.weatherCity && weather && (
            <WeatherWidget weather={weather} city={userData.weatherCity} />
          )}

          {!userData?.weatherCity && (
            <EmptyWidget
              icon={<MapPin className="w-8 h-8 text-gray-400" />}
              title="Выберите город"
              description="Выберите город для отображения погоды"
              action={() => setShowCitySelectDialog(true)}
              actionText="Выбрать город"
            />
          )}

          {/* Podorozhnik Widgets */}
          {userData?.podorozhnikCards.map(card => (
            <PodorozhnikWidget
              key={card.id}
              card={card}
              onTopup={() => {
                setSelectedCard(card);
                setShowTopupDialog(true);
              }}
            />
          ))}

          {/* Bank Cards Widgets */}
          {userData?.bankCards.map(card => (
            <BankCardWidget key={card.id} card={card} />
          ))}

          {/* SberSpasibo Widget - Only if Sber card exists */}
          {hasSberCard() && (
            <SberSpasiboWidget
              bonuses={userData.bankCards.find(c => c.bankName.toLowerCase().includes('сбер'))?.bonusBalance || 0}
            />
          )}

          {/* Fines Widget - Only if vehicles with fines exist */}
          {userData?.vehicles.some(v => v.fines && v.fines.length > 0) && (
            <FinesWidget vehicles={userData.vehicles.filter(v => v.fines && v.fines.length > 0)} />
          )}

          {/* Gosuslugi Widget */}
          {gosuslugi && (
            <GosuslugiWidget gosuslugi={gosuslugi} />
          )}

          {/* Passport Widget */}
          {userData?.passport && (
            <PassportWidget passport={userData.passport} />
          )}

          {/* Intercoms Widget */}
          {userData?.intercoms.map(intercom => (
            <IntercomWidget key={intercom.id} intercom={intercom} />
          ))}

          {/* Widget Manager Button */}
          <button
            onClick={() => setShowWidgetManagerDialog(true)}
            className="w-full py-4 bg-white rounded-2xl shadow-md flex items-center justify-center gap-2 text-primary font-medium hover:shadow-lg transition-shadow"
          >
            <Settings className="w-5 h-5" />
            Настроить виджеты
          </button>
        </div>
      ) : (
        <ProfileTab
          userData={userData}
          onEditProfile={() => setShowEditProfileDialog(true)}
          onAddVehicle={() => setShowVehicleDialog(true)}
          onAddIntercom={() => setShowIntercomDialog(true)}
          onAddPassport={() => setShowPassportDialog(true)}
        />
      )}

      {/* FAB Button */}
      <button
        onClick={() => setShowAddDialog(true)}
        className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-r from-primary to-secondary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Dialogs */}
      {showAddDialog && (
        <AddDialog
          onClose={() => setShowAddDialog(false)}
          onAddBankCard={handleAddBankCard}
          onAddPodorozhnik={() => {
            setShowAddDialog(false);
            setShowPodorozhnikDialog(true);
          }}
        />
      )}

      {showPodorozhnikDialog && (
        <PodorozhnikDialog
          onClose={() => setShowPodorozhnikDialog(false)}
          onAdd={handleAddPodorozhnik}
        />
      )}

      {showPassportDialog && (
        <PassportDialog
          onClose={() => setShowPassportDialog(false)}
          onAdd={handleAddPassport}
        />
      )}

      {showTopupDialog && selectedCard && (
        <TopupDialog
          onClose={() => {
            setShowTopupDialog(false);
            setSelectedCard(null);
          }}
          onTopup={(amount, method) => handleTopupPodorozhnik(selectedCard.id, amount, method)}
          card={selectedCard}
        />
      )}

      {showEditProfileDialog && userData && (
        <EditProfileDialog
          userData={userData}
          onClose={() => setShowEditProfileDialog(false)}
          onSave={handleUpdateProfile}
        />
      )}

      {showCitySelectDialog && (
        <CitySelectDialog
          onClose={() => setShowCitySelectDialog(false)}
          onSelect={handleSelectCity}
        />
      )}

      {showVehicleDialog && (
        <VehicleDialog
          onClose={() => setShowVehicleDialog(false)}
          onAdd={handleAddVehicle}
        />
      )}

      {showWidgetManagerDialog && userData && (
        <WidgetManagerDialog
          widgets={userData.widgets || []}
          onClose={() => setShowWidgetManagerDialog(false)}
          onSave={handleSaveWidgets}
        />
      )}

      {showIntercomDialog && (
        <IntercomDialog
          onClose={() => setShowIntercomDialog(false)}
          onAdd={handleAddIntercom}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg z-50 ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white font-medium animate-slide-up`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

// Widget Components
function MainCardWidget({ userData }: { userData: UserData | null }) {
  return (
    <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white p-6 rounded-3xl shadow-xl">
      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="text-sm opacity-90 mb-1">Карта Петербуржца</p>
          <p className="text-2xl font-bold">{userData?.firstName} {userData?.lastName}</p>
        </div>
        <CreditCard className="w-8 h-8 opacity-80" />
      </div>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs opacity-75">Баланс</p>
          <p className="text-3xl font-bold">0 ₽</p>
        </div>
        <div className="text-right">
          <p className="text-xs opacity-75">ID</p>
          <p className="text-sm font-mono">{userData?.id || '0000'}</p>
        </div>
      </div>
    </div>
  );
}

function WeatherWidget({ weather, city }: { weather: Weather; city: string }) {
  const cityNames: Record<string, string> = {
    spb: 'Санкт-Петербург',
    msk: 'Москва',
    sochi: 'Сочи',
    shushary: 'Шушары'
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{cityNames[city]}</p>
          <p className="text-4xl font-bold">{weather.temp}°</p>
          <p className="text-gray-600 mt-1">{weather.condition}</p>
        </div>
        {weather.icon && <div>{weather.icon}</div>}
      </div>
    </div>
  );
}

function PodorozhnikWidget({ card, onTopup }: { card: PodorozhnikCard; onTopup: () => void }) {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm opacity-90">Подорожник</p>
          <p className="text-lg font-mono">{card.cardNumber}</p>
        </div>
        <Wallet className="w-6 h-6 opacity-80" />
      </div>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs opacity-75">Баланс</p>
          <p className="text-3xl font-bold">{card.balance} ₽</p>
        </div>
        <button
          onClick={onTopup}
          className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          Пополнить
        </button>
      </div>
    </div>
  );
}

function BankCardWidget({ card }: { card: BankCard }) {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm opacity-90">{card.bankName}</p>
          <p className="text-lg font-mono">•••• {card.cardNumber.slice(-4)}</p>
        </div>
        <CreditCard className="w-6 h-6 opacity-80" />
      </div>
      <div>
        <p className="text-xs opacity-75">Баланс</p>
        <p className="text-3xl font-bold">{card.balance.toLocaleString()} ₽</p>
      </div>
    </div>
  );
}

function SberSpasiboWidget({ bonuses }: { bonuses: number }) {
  return (
    <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-6 rounded-2xl shadow-lg">
      <div className="flex items-center gap-3 mb-3">
        <Gift className="w-6 h-6" />
        <p className="text-lg font-bold">СберСпасибо</p>
      </div>
      <div>
        <p className="text-xs opacity-75">Доступно бонусов</p>
        <p className="text-3xl font-bold">{bonuses}</p>
      </div>
    </div>
  );
}

function FinesWidget({ vehicles }: { vehicles: Vehicle[] }) {
  const totalFines = vehicles.reduce((sum, v) => 
    sum + (v.fines?.filter(f => !f.paid).reduce((s, f) => s + f.amount, 0) || 0), 0
  );
  const fineCount = vehicles.reduce((sum, v) => 
    sum + (v.fines?.filter(f => !f.paid).length || 0), 0
  );

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-red-500">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <div>
            <p className="font-bold text-lg">Штрафы ГИБДД</p>
            <p className="text-sm text-gray-500">{fineCount} неоплаченных</p>
          </div>
        </div>
        <p className="text-2xl font-bold text-red-500">{totalFines} ₽</p>
      </div>
      {vehicles.map(v => (
        <div key={v.id} className="mt-3 pt-3 border-t">
          <p className="font-medium mb-2">{v.plateNumber}</p>
          {v.fines?.filter(f => !f.paid).map(fine => (
            <div key={fine.id} className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{fine.description}</span>
              <span className="font-medium">{fine.amount} ₽</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function GosuslugiWidget({ gosuslugi }: { gosuslugi: GosuslugiData }) {
  const unpaidTaxes = gosuslugi.taxes.filter(t => !t.paid);
  const totalTaxes = unpaidTaxes.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <Shield className="w-6 h-6 text-blue-600" />
        <p className="font-bold text-lg">Госуслуги</p>
      </div>
      
      {unpaidTaxes.length > 0 && (
        <div className="mb-4 p-4 bg-orange-50 rounded-xl">
          <p className="text-sm text-gray-600 mb-1">Налоги к оплате</p>
          <p className="text-2xl font-bold text-orange-600">{totalTaxes} ₽</p>
          <div className="mt-2 space-y-1">
            {unpaidTaxes.map(tax => (
              <div key={tax.id} className="flex justify-between text-sm">
                <span>{tax.type}</span>
                <span className="font-medium">{tax.amount} ₽</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {gosuslugi.benefits.length > 0 && (
        <div className="p-4 bg-green-50 rounded-xl">
          <p className="text-sm text-gray-600 mb-2">Активные льготы</p>
          {gosuslugi.benefits.map(benefit => (
            <div key={benefit.id} className="flex justify-between text-sm mb-1">
              <span>{benefit.name}</span>
              <span className="text-gray-500 text-xs">{benefit.validUntil}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PassportWidget({ passport }: { passport: Passport }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <FileText className="w-6 h-6 text-purple-600" />
        <p className="font-bold text-lg">Паспорт РФ</p>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Серия и номер</span>
          <span className="font-mono font-medium">{passport.series} {passport.number}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Дата выдачи</span>
          <span className="font-medium">{passport.issuedDate}</span>
        </div>
      </div>
    </div>
  );
}

function IntercomWidget({ intercom }: { intercom: Intercom }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <div className="flex items-center gap-3 mb-3">
        <Home className="w-6 h-6 text-indigo-600" />
        <p className="font-bold">Домофон</p>
      </div>
      <p className="text-sm text-gray-600 mb-1">{intercom.address}</p>
      <p className="text-xs text-gray-500 mb-3">{intercom.city}</p>
      <div className="bg-gray-100 p-3 rounded-xl">
        <p className="text-xs text-gray-600">Код домофона</p>
        <p className="text-2xl font-bold font-mono">{intercom.code}</p>
      </div>
    </div>
  );
}

function EmptyWidget({ icon, title, description, action, actionText }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: () => void;
  actionText: string;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md text-center">
      <div className="flex justify-center mb-3">{icon}</div>
      <p className="font-bold mb-1">{title}</p>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <button
        onClick={action}
        className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        {actionText}
      </button>
    </div>
  );
}

// Profile Tab Component
function ProfileTab({ userData, onEditProfile, onAddVehicle, onAddIntercom, onAddPassport }: {
  userData: UserData | null;
  onEditProfile: () => void;
  onAddVehicle: () => void;
  onAddIntercom: () => void;
  onAddPassport: () => void;
}) {
  return (
    <div className="p-4 space-y-4">
      {/* Profile Info */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-2xl font-bold mb-1">{userData?.firstName} {userData?.lastName}</p>
            {userData?.middleName && <p className="text-gray-600">{userData.middleName}</p>}
            <p className="text-sm text-gray-500 mt-2">{userData?.phone}</p>
            {userData?.email && <p className="text-sm text-gray-500">{userData.email}</p>}
            {userData?.birthDate && (
              <p className="text-sm text-gray-500">Дата рождения: {userData.birthDate}</p>
            )}
          </div>
          <button
            onClick={onEditProfile}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Edit2 className="w-5 h-5 text-primary" />
          </button>
        </div>
      </div>

      {/* My Vehicles */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Car className="w-6 h-6 text-primary" />
            <p className="font-bold text-lg">Мои авто</p>
          </div>
          <button
            onClick={onAddVehicle}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5 text-primary" />
          </button>
        </div>
        {userData?.vehicles.length ? (
          <div className="space-y-2">
            {userData.vehicles.map(vehicle => (
              <div key={vehicle.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-bold">{vehicle.plateNumber}</p>
                  {vehicle.model && <p className="text-sm text-gray-600">{vehicle.model}</p>}
                </div>
                {vehicle.fines && vehicle.fines.length > 0 && (
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-lg">
                    {vehicle.fines.filter(f => !f.paid).length} штрафов
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">Автомобили не добавлены</p>
        )}
      </div>

      {/* Documents */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <p className="font-bold text-lg mb-4">Документы</p>
        <div className="space-y-2">
          <button
            onClick={onAddPassport}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-600" />
              <span>Паспорт РФ</span>
            </div>
            {userData?.passport ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Services */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <p className="font-bold text-lg mb-4">Сервисы</p>
        <div className="space-y-2">
          <button
            onClick={onAddIntercom}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <Home className="w-5 h-5 text-gray-600" />
              <span>Домофоны</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Dialog Components
function AddDialog({ onClose, onAddBankCard, onAddPodorozhnik }: {
  onClose: () => void;
  onAddBankCard: (data: any) => void;
  onAddPodorozhnik: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-t-3xl p-6 w-full max-w-lg animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
        <p className="text-xl font-bold mb-4">Добавить</p>
        <div className="space-y-2">
          <button
            onClick={() => {
              const cardNumber = prompt('Введите номер карты:');
              const bankName = prompt('Введите название банка:');
              if (cardNumber && bankName) {
                onAddBankCard({ cardNumber, bankName, balance: 5000 });
              }
            }}
            className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <CreditCard className="w-6 h-6 text-primary" />
            <span className="font-medium">Банковскую карту</span>
          </button>
          <button
            onClick={onAddPodorozhnik}
            className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <Wallet className="w-6 h-6 text-blue-500" />
            <span className="font-medium">Подорожник</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function PodorozhnikDialog({ onClose, onAdd }: {
  onClose: () => void;
  onAdd: (type: 'have' | 'create', cardNumber?: string) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 w-full max-w-md animate-scale-in" onClick={e => e.stopPropagation()}>
        <p className="text-xl font-bold mb-4">Подорожник</p>
        <div className="space-y-3">
          <button
            onClick={() => {
              const cardNumber = prompt('Введите номер карты:');
              if (cardNumber) onAdd('have', cardNumber);
            }}
            className="w-full py-4 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            У меня есть карта
          </button>
          <button
            onClick={() => onAdd('create')}
            className="w-full py-4 bg-gray-100 text-gray-800 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Создать новую карту
          </button>
          <button
            onClick={onClose}
            className="w-full py-4 text-gray-600 font-medium"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}

function PassportDialog({ onClose, onAdd }: {
  onClose: () => void;
  onAdd: (type: 'have' | 'create', data?: any) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 w-full max-w-md animate-scale-in" onClick={e => e.stopPropagation()}>
        <p className="text-xl font-bold mb-4">Паспорт РФ</p>
        <div className="space-y-3">
          <button
            onClick={() => {
              const series = prompt('Серия:');
              const number = prompt('Номер:');
              if (series && number) {
                onAdd('have', {
                  series,
                  number,
                  issuedBy: 'ОУФМС России',
                  issuedDate: '2020-01-01'
                });
              }
            }}
            className="w-full py-4 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            У меня есть паспорт
          </button>
          <button
            onClick={() => onAdd('create')}
            className="w-full py-4 bg-gray-100 text-gray-800 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Создать паспорт
          </button>
          <button onClick={onClose} className="w-full py-4 text-gray-600 font-medium">
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}

function TopupDialog({ onClose, onTopup, card }: {
  onClose: () => void;
  onTopup: (amount: number, method: string) => void;
  card: PodorozhnikCard;
}) {
  const [amount, setAmount] = useState(100);
  const [method, setMethod] = useState<'card' | 'sbp'>('card');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 w-full max-w-md animate-scale-in" onClick={e => e.stopPropagation()}>
        <p className="text-xl font-bold mb-4">Пополнение</p>
        <p className="text-sm text-gray-600 mb-4">Карта {card.cardNumber}</p>
        
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Сумма пополнения</p>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[100, 200, 500].map(val => (
              <button
                key={val}
                onClick={() => setAmount(val)}
                className={`py-2 px-4 rounded-xl font-medium transition-colors ${
                  amount === val ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'
                }`}
              >
                {val} ₽
              </button>
            ))}
          </div>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Другая сумма"
          />
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium mb-2">Способ оплаты</p>
          <div className="space-y-2">
            <button
              onClick={() => setMethod('card')}
              className={`w-full p-4 rounded-xl flex items-center justify-between transition-colors ${
                method === 'card' ? 'bg-primary/10 border-2 border-primary' : 'bg-gray-50 border-2 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5" />
                <span className="font-medium">Банковская карта</span>
              </div>
              {method === 'card' && <Check className="w-5 h-5 text-primary" />}
            </button>
            <button
              onClick={() => setMethod('sbp')}
              className={`w-full p-4 rounded-xl flex items-center justify-between transition-colors ${
                method === 'sbp' ? 'bg-primary/10 border-2 border-primary' : 'bg-gray-50 border-2 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5" />
                <span className="font-medium">СБП</span>
              </div>
              {method === 'sbp' && <Check className="w-5 h-5 text-primary" />}
            </button>
          </div>
        </div>

        <button
          onClick={() => onTopup(amount, method === 'card' ? 'Карта' : 'СБП')}
          className="w-full py-4 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors mb-2"
        >
          Пополнить {amount} ₽
        </button>
        <button onClick={onClose} className="w-full py-4 text-gray-600 font-medium">
          Отмена
        </button>
      </div>
    </div>
  );
}

function EditProfileDialog({ userData, onClose, onSave }: {
  userData: UserData;
  onClose: () => void;
  onSave: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    middleName: userData.middleName || '',
    email: userData.email || '',
    birthDate: userData.birthDate || ''
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 w-full max-w-md animate-scale-in max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <p className="text-xl font-bold mb-4">Редактировать профиль</p>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Имя</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={e => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Фамилия</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={e => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Отчество</label>
            <input
              type="text"
              value={formData.middleName}
              onChange={e => setFormData({ ...formData, middleName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Дата рождения</label>
            <input
              type="date"
              value={formData.birthDate}
              onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary mt-1"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <button
            onClick={() => onSave(formData)}
            className="flex-1 py-4 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            Сохранить
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-gray-100 text-gray-800 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}

function CitySelectDialog({ onClose, onSelect }: {
  onClose: () => void;
  onSelect: (city: string) => void;
}) {
  const cities = [
    { id: 'spb', name: 'Санкт-Петербург' },
    { id: 'msk', name: 'Москва' },
    { id: 'sochi', name: 'Сочи' },
    { id: 'shushary', name: 'Шушары' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-t-3xl p-6 w-full max-w-lg animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
        <p className="text-xl font-bold mb-4">Выберите город</p>
        <div className="space-y-2">
          {cities.map(city => (
            <button
              key={city.id}
              onClick={() => onSelect(city.id)}
              className="w-full p-4 hover:bg-gray-50 rounded-xl transition-colors text-left font-medium"
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function VehicleDialog({ onClose, onAdd }: {
  onClose: () => void;
  onAdd: (plateNumber: string, model?: string) => void;
}) {
  const [plateNumber, setPlateNumber] = useState('');
  const [model, setModel] = useState('');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 w-full max-w-md animate-scale-in" onClick={e => e.stopPropagation()}>
        <p className="text-xl font-bold mb-4">Добавить автомобиль</p>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Номер</label>
            <input
              type="text"
              value={plateNumber}
              onChange={e => setPlateNumber(e.target.value.toUpperCase())}
              placeholder="А123БВ777"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Модель (необязательно)</label>
            <input
              type="text"
              value={model}
              onChange={e => setModel(e.target.value)}
              placeholder="Toyota Camry"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary mt-1"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <button
            onClick={() => plateNumber && onAdd(plateNumber, model || undefined)}
            disabled={!plateNumber}
            className="flex-1 py-4 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            Добавить
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-gray-100 text-gray-800 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}

function IntercomDialog({ onClose, onAdd }: {
  onClose: () => void;
  onAdd: (data: any) => void;
}) {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('spb');
  const [code, setCode] = useState('');

  const cities = [
    { id: 'spb', name: 'Санкт-Петербург' },
    { id: 'msk', name: 'Москва' },
    { id: 'shushary', name: 'Шушары' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 w-full max-w-md animate-scale-in" onClick={e => e.stopPropagation()}>
        <p className="text-xl font-bold mb-4">Добавить домофон</p>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Город</label>
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary mt-1"
            >
              {cities.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Адрес</label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="ул. Ленина, д. 1"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Код домофона</label>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="123#456"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary mt-1"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <button
            onClick={() => address && code && onAdd({ address, city, code })}
            disabled={!address || !code}
            className="flex-1 py-4 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            Добавить
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-gray-100 text-gray-800 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}

function WidgetManagerDialog({ widgets, onClose, onSave }: {
  widgets: WidgetConfig[];
  onClose: () => void;
  onSave: (widgets: WidgetConfig[]) => void;
}) {
  const [localWidgets, setLocalWidgets] = useState(widgets);

  const toggleWidget = (id: string) => {
    setLocalWidgets(prev => prev.map(w => 
      w.id === id ? { ...w, visible: !w.visible } : w
    ));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 w-full max-w-md animate-scale-in max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <p className="text-xl font-bold mb-4">Настроить виджеты</p>
        <p className="text-sm text-gray-600 mb-4">Выберите, какие виджеты отображать на главной</p>
        <div className="space-y-2 mb-6">
          {localWidgets.map(widget => (
            <div
              key={widget.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
            >
              <span className="font-medium">{widget.type}</span>
              <button
                onClick={() => toggleWidget(widget.id)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  widget.visible ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  widget.visible ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onSave(localWidgets)}
            className="flex-1 py-4 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            Сохранить
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-gray-100 text-gray-800 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
