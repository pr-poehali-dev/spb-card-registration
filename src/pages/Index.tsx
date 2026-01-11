import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import QRCode from 'react-qr-code';

interface UserData {
  phone: string;
  firstName: string;
  lastName: string;
  middleName: string;
  birthDate: string;
  photo: string;
  balance: number;
  bonusPoints: number;
}

interface Passport {
  series: string;
  number: string;
  inn?: string;
  qrData: string;
}

interface Podorozhnik {
  cardNumber: string;
  balance: number;
}

interface Intercom {
  address: string;
  provider: string;
  brand: string;
  image?: string;
}

const Index = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [currentTab, setCurrentTab] = useState('main');
  const [userData, setUserData] = useState<UserData>({
    phone: '',
    firstName: '',
    lastName: '',
    middleName: '',
    birthDate: '',
    photo: '',
    balance: 2450,
    bonusPoints: 3420,
  });

  const [passport, setPassport] = useState<Passport | null>(null);
  const [podorozhnik, setPodorozhnik] = useState<Podorozhnik | null>(null);
  const [intercom, setIntercom] = useState<Intercom | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [weather] = useState({ temp: 5, condition: 'Облачно', icon: 'Cloud' });

  const [passportForm, setPassportForm] = useState({ series: '', number: '', inn: '' });
  const [podorozhnikForm, setPodorozhnikForm] = useState({ cardNumber: '', createNew: false });
  const [intercomForm, setIntercomForm] = useState({
    city: '',
    street: '',
    house: '',
    apartment: '',
    entrance: '',
    brand: '',
    provider: '',
  });

  const partners = [
    { id: 1, name: 'Кофемания', discount: '10%', category: 'Кафе', distance: '0.5 км', icon: 'Coffee', lat: 59.9386, lng: 30.3141 },
    { id: 2, name: 'Эрмитаж', discount: '15%', category: 'Музеи', distance: '1.2 км', icon: 'Landmark', lat: 59.9398, lng: 30.3146 },
    { id: 3, name: 'Спортмастер', discount: '20%', category: 'Спорт', distance: '2.3 км', icon: 'Dumbbell', lat: 59.9311, lng: 30.3609 },
    { id: 4, name: 'Буквоед', discount: '5%', category: 'Книги', distance: '0.8 км', icon: 'BookOpen', lat: 59.9343, lng: 30.3351 },
  ];

  const handleRegister = () => {
    if (!userData.phone || !userData.firstName || !userData.lastName || !userData.birthDate) {
      toast.error('Заполните все обязательные поля');
      return;
    }
    setIsRegistered(true);
    toast.success('🎉 Добро пожаловать! Получите 500 бонусов за регистрацию');
    setUserData({ ...userData, bonusPoints: 500 });
  };

  const createPassport = () => {
    if (!passportForm.series || !passportForm.number) {
      toast.error('Заполните серию и номер паспорта');
      return;
    }
    const qrData = JSON.stringify({
      firstName: userData.firstName,
      lastName: userData.lastName,
      middleName: userData.middleName,
      birthDate: userData.birthDate,
      series: passportForm.series,
      number: passportForm.number,
      inn: passportForm.inn,
    });
    setPassport({ ...passportForm, qrData });
    toast.success('✅ Паспорт успешно добавлен');
  };

  const createPodorozhnik = () => {
    if (podorozhnikForm.createNew) {
      const cardNumber = `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
      setPodorozhnik({ cardNumber, balance: 0 });
      toast.success(`🎫 Подорожник создан: ${cardNumber}`);
    } else {
      if (!podorozhnikForm.cardNumber) {
        toast.error('Введите номер карты');
        return;
      }
      setPodorozhnik({ cardNumber: podorozhnikForm.cardNumber, balance: 450 });
      toast.success('✅ Подорожник добавлен');
    }
  };

  const topUpPodorozhnik = () => {
    if (!podorozhnik) return;
    setPodorozhnik({ ...podorozhnik, balance: podorozhnik.balance + 500 });
    toast.success('💰 Подорожник пополнен на 500₽');
  };

  const payWithPodorozhnik = () => {
    if (!podorozhnik || podorozhnik.balance < 60) {
      toast.error('❌ Недостаточно средств');
      return;
    }
    setPodorozhnik({ ...podorozhnik, balance: podorozhnik.balance - 60 });
    toast.success('📱 Оплачено 60₽. Приложите телефон к валидатору');
  };

  const createIntercom = () => {
    if (!intercomForm.city || !intercomForm.street || !intercomForm.house) {
      toast.error('Заполните адрес');
      return;
    }
    if (!intercomForm.brand || !intercomForm.provider) {
      toast.error('Выберите марку и провайдера');
      return;
    }
    setIntercom({
      address: `${intercomForm.city}, ${intercomForm.street}, ${intercomForm.house}, кв.${intercomForm.apartment}`,
      brand: intercomForm.brand,
      provider: intercomForm.provider,
      image: `https://picsum.photos/seed/${Date.now()}/400/300`,
    });
    toast.success('🏠 Домофон добавлен');
  };

  const openIntercom = () => {
    toast.success('🚪 Домофон открыт!');
  };

  const qrCodeData = JSON.stringify({
    firstName: userData.firstName,
    lastName: userData.lastName,
    middleName: userData.middleName,
    birthDate: userData.birthDate,
  });

  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 shadow-2xl animate-scale-in">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[#0EA5E9] to-[#8B5CF6] rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-lg animate-pulse-glow">
              <Icon name="CreditCard" size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] bg-clip-text text-transparent">
              Карта Петербуржца
            </h1>
            <p className="text-muted-foreground mt-2">Ваш город в одном приложении</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Номер телефона *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (___) ___-__-__"
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="lastName">Фамилия *</Label>
              <Input
                id="lastName"
                placeholder="Иванов"
                value={userData.lastName}
                onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="firstName">Имя *</Label>
              <Input
                id="firstName"
                placeholder="Иван"
                value={userData.firstName}
                onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="middleName">Отчество</Label>
              <Input
                id="middleName"
                placeholder="Иванович"
                value={userData.middleName}
                onChange={(e) => setUserData({ ...userData, middleName: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="birthDate">Дата рождения *</Label>
              <Input
                id="birthDate"
                type="date"
                value={userData.birthDate}
                onChange={(e) => setUserData({ ...userData, birthDate: e.target.value })}
                className="mt-1"
              />
            </div>

            <Button
              onClick={handleRegister}
              className="w-full bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] hover:opacity-90 transition-all duration-300 h-12 text-base font-semibold shadow-lg"
            >
              Зарегистрироваться
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-24">
      <div className="max-w-md mx-auto">
        {currentTab === 'main' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-white shadow-lg">
                  <AvatarImage src={userData.photo} />
                  <AvatarFallback className="bg-gradient-to-br from-[#0EA5E9] to-[#8B5CF6] text-white font-semibold">
                    {userData.firstName[0]}{userData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">{userData.firstName}</p>
                  <p className="text-sm text-muted-foreground">{userData.phone}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Icon name="Bell" size={20} />
              </Button>
            </div>

            <Card className="relative overflow-hidden shadow-2xl animate-slide-up">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0EA5E9] via-[#8B5CF6] to-[#D946EF] opacity-90" />
              <div className="relative p-6 text-white">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Icon name="CreditCard" size={24} />
                    <span className="font-semibold">Карта Петербуржца</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setShowQR(!showQR)}
                    className="bg-white/20 hover:bg-white/30 text-white border-0"
                  >
                    <Icon name="QrCode" size={16} />
                  </Button>
                </div>

                {showQR ? (
                  <div className="bg-white p-4 rounded-2xl animate-scale-in">
                    <QRCode value={qrCodeData} size={200} className="mx-auto" />
                    <p className="text-center text-sm text-gray-600 mt-2">
                      {userData.firstName} {userData.lastName}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2 mb-6">
                      <p className="text-sm opacity-80">Баланс</p>
                      <p className="text-4xl font-bold">{userData.balance} ₽</p>
                    </div>

                    <div className="flex gap-3">
                      <Button size="sm" className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0">
                        <Icon name="Plus" size={16} className="mr-2" />
                        Пополнить
                      </Button>
                      <Button size="sm" className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0">
                        <Icon name="Send" size={16} className="mr-2" />
                        Перевод
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </Card>

            <Card className="p-4 shadow-lg animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon name="Gift" size={20} className="text-[#F97316]" />
                  <span className="font-semibold">Бонусы</span>
                </div>
                <span className="text-2xl font-bold text-[#F97316]">{userData.bonusPoints}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>До следующего уровня</span>
                  <span>{5000 - userData.bonusPoints} баллов</span>
                </div>
                <Progress value={(userData.bonusPoints / 5000) * 100} className="h-2" />
              </div>
            </Card>

            <Card className="p-4 shadow-lg animate-fade-in">
              <div className="flex items-center gap-3">
                <Icon name={weather.icon as any} size={32} className="text-[#0EA5E9]" />
                <div>
                  <p className="text-2xl font-bold">{weather.temp}°C</p>
                  <p className="text-sm text-muted-foreground">{weather.condition}</p>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Документы</h3>
              
              {passport && (
                <Card className="p-4 shadow-lg hover:shadow-xl transition-shadow animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center">
                        <Icon name="FileText" size={24} className="text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Паспорт РФ</p>
                        <p className="text-xs text-muted-foreground">
                          {passport.series} {passport.number}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => setCurrentTab('documents')}>
                      <Icon name="ChevronRight" size={20} />
                    </Button>
                  </div>
                </Card>
              )}

              {podorozhnik && (
                <Card className="p-4 shadow-lg hover:shadow-xl transition-shadow animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center">
                        <Icon name="Ticket" size={24} className="text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Подорожник</p>
                        <p className="text-xs text-muted-foreground">{podorozhnik.cardNumber}</p>
                        <p className="text-sm font-semibold text-green-600">{podorozhnik.balance} ₽</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={topUpPodorozhnik}>
                        <Icon name="Plus" size={16} />
                      </Button>
                      <Button size="sm" onClick={payWithPodorozhnik} className="bg-green-600 hover:bg-green-700 text-white">
                        <Icon name="Smartphone" size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              <Card className="p-4 shadow-lg opacity-50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                    <Icon name="Heart" size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Медицинская карта</p>
                    <p className="text-xs text-muted-foreground">Временно недоступна</p>
                  </div>
                </div>
              </Card>
            </div>

            {intercom && (
              <Card className="p-4 shadow-lg animate-fade-in">
                <div className="flex items-center gap-3 mb-3">
                  <Icon name="Home" size={24} className="text-[#8B5CF6]" />
                  <div className="flex-1">
                    <p className="font-medium">Умный домофон</p>
                    <p className="text-xs text-muted-foreground">{intercom.address}</p>
                  </div>
                </div>
                {intercom.image && (
                  <img src={intercom.image} alt="Домофон" className="w-full h-32 object-cover rounded-lg mb-3" />
                )}
                <Button onClick={openIntercom} className="w-full bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] text-white">
                  <Icon name="DoorOpen" size={20} className="mr-2" />
                  Открыть домофон
                </Button>
              </Card>
            )}

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Партнёры рядом</h3>
              {partners.map((partner) => (
                <Card key={partner.id} className="p-4 hover:shadow-lg transition-all animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#8B5CF6] to-[#D946EF] rounded-xl flex items-center justify-center">
                        <Icon name={partner.icon as any} size={24} className="text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{partner.name}</p>
                        <p className="text-xs text-muted-foreground">{partner.category} • {partner.distance}</p>
                      </div>
                    </div>
                    <Badge className="bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white border-0">
                      {partner.discount}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentTab === 'documents' && (
          <div className="p-4 space-y-4">
            <h2 className="text-2xl font-bold pt-4">Документы</h2>

            {!passport ? (
              <Card className="p-6 animate-scale-in">
                <h3 className="font-semibold mb-4">Добавить паспорт</h3>
                <div className="space-y-3">
                  <Input
                    placeholder="Серия (4 цифры)"
                    value={passportForm.series}
                    onChange={(e) => setPassportForm({ ...passportForm, series: e.target.value })}
                    maxLength={4}
                  />
                  <Input
                    placeholder="Номер (6 цифр)"
                    value={passportForm.number}
                    onChange={(e) => setPassportForm({ ...passportForm, number: e.target.value })}
                    maxLength={6}
                  />
                  <Input
                    placeholder="ИНН (необязательно)"
                    value={passportForm.inn}
                    onChange={(e) => setPassportForm({ ...passportForm, inn: e.target.value })}
                  />
                  <Button onClick={createPassport} className="w-full bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6]">
                    Создать паспорт
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="p-6 animate-scale-in">
                <div className="text-center mb-4">
                  <h3 className="font-semibold mb-2">Паспорт РФ</h3>
                  <div className="bg-white p-4 rounded-lg inline-block">
                    <QRCode value={passport.qrData} size={200} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {passport.series} {passport.number}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Icon name="Edit" size={16} className="mr-2" />
                    Редактировать
                  </Button>
                  <Button variant="outline" className="flex-1 text-red-600" onClick={() => setPassport(null)}>
                    <Icon name="Trash2" size={16} className="mr-2" />
                    Удалить
                  </Button>
                </div>
              </Card>
            )}

            {!podorozhnik ? (
              <Card className="p-6 animate-scale-in">
                <h3 className="font-semibold mb-4">Подорожник</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="createNew"
                      checked={podorozhnikForm.createNew}
                      onChange={(e) =>
                        setPodorozhnikForm({ ...podorozhnikForm, createNew: e.target.checked })
                      }
                      className="w-4 h-4"
                    />
                    <Label htmlFor="createNew">Создать новую карту</Label>
                  </div>
                  {!podorozhnikForm.createNew && (
                    <Input
                      placeholder="Номер карты"
                      value={podorozhnikForm.cardNumber}
                      onChange={(e) =>
                        setPodorozhnikForm({ ...podorozhnikForm, cardNumber: e.target.value })
                      }
                    />
                  )}
                  <Button onClick={createPodorozhnik} className="w-full bg-gradient-to-r from-green-500 to-green-700">
                    {podorozhnikForm.createNew ? 'Создать' : 'Добавить'}
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="p-6 animate-scale-in">
                <h3 className="font-semibold mb-2">Подорожник</h3>
                <p className="text-2xl font-bold text-green-600 mb-2">{podorozhnik.balance} ₽</p>
                <p className="text-sm text-muted-foreground mb-4">{podorozhnik.cardNumber}</p>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={topUpPodorozhnik}>
                    <Icon name="Plus" size={16} className="mr-2" />
                    Пополнить
                  </Button>
                  <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={payWithPodorozhnik}>
                    <Icon name="Smartphone" size={16} className="mr-2" />
                    Оплатить
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}

        {currentTab === 'gooddeeds' && (
          <div className="p-4 space-y-4">
            <h2 className="text-2xl font-bold pt-4">Добрые дела</h2>
            {!passport ? (
              <Card className="p-6 text-center animate-scale-in">
                <Icon name="Lock" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">Для доступа к этому разделу необходим паспорт</p>
                <Button onClick={() => setCurrentTab('documents')} className="bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6]">
                  Добавить паспорт
                </Button>
              </Card>
            ) : (
              <Card className="p-6 animate-scale-in">
                <div className="text-center">
                  <Icon name="Heart" size={48} className="mx-auto mb-4 text-red-500" />
                  <h3 className="font-semibold mb-2">Раздел в разработке</h3>
                  <p className="text-sm text-muted-foreground">
                    Скоро здесь можно будет подавать заявки на добрые дела
                  </p>
                </div>
              </Card>
            )}
          </div>
        )}

        {currentTab === 'profile' && (
          <div className="p-4 space-y-4">
            <h2 className="text-2xl font-bold pt-4">Профиль</h2>

            <Card className="p-6 animate-scale-in">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-20 w-20 border-4 border-white shadow-xl">
                  <AvatarImage src={userData.photo} />
                  <AvatarFallback className="bg-gradient-to-br from-[#0EA5E9] to-[#8B5CF6] text-white text-2xl font-semibold">
                    {userData.firstName[0]}{userData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-bold text-xl">{userData.firstName} {userData.lastName}</h3>
                  <p className="text-sm text-muted-foreground">{userData.phone}</p>
                </div>
                <Button size="icon" variant="ghost">
                  <Icon name="Edit" size={20} />
                </Button>
              </div>
            </Card>

            {!intercom ? (
              <Card className="p-6 animate-scale-in">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Icon name="Home" size={20} />
                  Умный домофон
                </h3>
                <div className="space-y-3">
                  <Select onValueChange={(value) => setIntercomForm({ ...intercomForm, city: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите город" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spb">Санкт-Петербург</SelectItem>
                      <SelectItem value="msk">Москва</SelectItem>
                      <SelectItem value="sochi">Сочи</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select onValueChange={(value) => setIntercomForm({ ...intercomForm, street: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите улицу" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Московская">Московская</SelectItem>
                      <SelectItem value="Московская набережная">Московская набережная</SelectItem>
                      <SelectItem value="Ведровская набережная">Ведровская набережная</SelectItem>
                      <SelectItem value="Московское шоссе">Московское шоссе</SelectItem>
                      <SelectItem value="Колпинское шоссе">Колпинское шоссе</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Номер дома (67, 29 и др.)"
                    value={intercomForm.house}
                    onChange={(e) => setIntercomForm({ ...intercomForm, house: e.target.value })}
                  />

                  <Input
                    placeholder="Квартира"
                    value={intercomForm.apartment}
                    onChange={(e) => setIntercomForm({ ...intercomForm, apartment: e.target.value })}
                  />

                  <Input
                    placeholder="Подъезд"
                    value={intercomForm.entrance}
                    onChange={(e) => setIntercomForm({ ...intercomForm, entrance: e.target.value })}
                  />

                  <Select onValueChange={(value) => setIntercomForm({ ...intercomForm, brand: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Марка домофона" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Рост">Рост домофон</SelectItem>
                      <SelectItem value="Визит">Визит</SelectItem>
                      <SelectItem value="Цифрал">Цифрал</SelectItem>
                      <SelectItem value="Элтис">Элтис</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select onValueChange={(value) => setIntercomForm({ ...intercomForm, provider: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Провайдер" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="МТТ">МТТ Телеком</SelectItem>
                      <SelectItem value="Ростикс">Ростикс</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button onClick={createIntercom} className="w-full bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6]">
                    <Icon name="Plus" size={20} className="mr-2" />
                    Добавить домофон
                  </Button>
                </div>
              </Card>
            ) : null}

            <div className="space-y-2">
              {passport && (
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="CreditCard" size={20} className="mr-3" />
                  Банковские карты
                </Button>
              )}
              <Button variant="outline" className="w-full justify-start">
                <Icon name="LayoutGrid" size={20} className="mr-3" />
                Настроить виджеты
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Icon name="Shield" size={20} className="mr-3" />
                Безопасность
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Icon name="Bell" size={20} className="mr-3" />
                Уведомления
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                <Icon name="LogOut" size={20} className="mr-3" />
                Выйти
              </Button>
            </div>
          </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-md mx-auto flex justify-around py-3">
            <button
              onClick={() => setCurrentTab('main')}
              className={`flex flex-col items-center gap-1 px-4 transition-colors ${
                currentTab === 'main' ? 'text-[#0EA5E9]' : 'text-gray-500'
              }`}
            >
              <Icon name="Home" size={24} />
              <span className="text-xs font-medium">Главная</span>
            </button>
            <button
              onClick={() => setCurrentTab('documents')}
              className={`flex flex-col items-center gap-1 px-4 transition-colors ${
                currentTab === 'documents' ? 'text-[#0EA5E9]' : 'text-gray-500'
              }`}
            >
              <Icon name="FileText" size={24} />
              <span className="text-xs font-medium">Документы</span>
            </button>
            <button
              onClick={() => setCurrentTab('gooddeeds')}
              className={`flex flex-col items-center gap-1 px-4 transition-colors ${
                currentTab === 'gooddeeds' ? 'text-[#0EA5E9]' : 'text-gray-500'
              }`}
            >
              <Icon name="Heart" size={24} />
              <span className="text-xs font-medium">Добрые дела</span>
            </button>
            <button
              onClick={() => setCurrentTab('profile')}
              className={`flex flex-col items-center gap-1 px-4 transition-colors ${
                currentTab === 'profile' ? 'text-[#0EA5E9]' : 'text-gray-500'
              }`}
            >
              <Icon name="User" size={24} />
              <span className="text-xs font-medium">Профиль</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
