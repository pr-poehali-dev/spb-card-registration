import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface UserData {
  phone: string;
  firstName: string;
  lastName: string;
  middleName: string;
  birthDate: string;
  photo: string;
}

const Index = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    phone: '',
    firstName: '',
    lastName: '',
    middleName: '',
    birthDate: '',
    photo: '',
  });

  const handleRegister = () => {
    if (!userData.phone || !userData.firstName || !userData.lastName || !userData.birthDate) {
      toast.error('Заполните все обязательные поля');
      return;
    }
    setIsRegistered(true);
    toast.success('Регистрация успешна!');
  };

  const transactions = [
    { id: 1, type: 'payment', title: 'Метро', amount: -60, date: '10 янв, 14:30', icon: 'Train' },
    { id: 2, type: 'bonus', title: 'Кэшбэк в кафе', amount: 150, date: '10 янв, 12:15', icon: 'Coffee' },
    { id: 3, type: 'payment', title: 'Автобус', amount: -50, date: '09 янв, 18:45', icon: 'Bus' },
    { id: 4, type: 'payment', title: 'Музей', amount: -400, date: '08 янв, 11:00', icon: 'Landmark' },
  ];

  const partners = [
    { id: 1, name: 'Кофемания', discount: '10%', category: 'Кафе', distance: '0.5 км', icon: 'Coffee' },
    { id: 2, name: 'Эрмитаж', discount: '15%', category: 'Музеи', distance: '1.2 км', icon: 'Landmark' },
    { id: 3, name: 'Спортмастер', discount: '20%', category: 'Спорт', distance: '2.3 км', icon: 'Dumbbell' },
    { id: 4, name: 'Буквоед', discount: '5%', category: 'Книги', distance: '0.8 км', icon: 'BookOpen' },
  ];

  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 shadow-2xl animate-scale-in">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[#0EA5E9] to-[#8B5CF6] rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-lg">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20">
      <div className="max-w-md mx-auto p-4 space-y-4">
        <div className="pt-4 pb-2">
          <div className="flex items-center justify-between mb-6">
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
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <Icon name="CreditCard" size={24} />
                  <span className="font-semibold">Карта Петербуржца</span>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  Активна
                </Badge>
              </div>

              <div className="space-y-2 mb-6">
                <p className="text-sm opacity-80">Баланс</p>
                <p className="text-4xl font-bold">2 450 ₽</p>
              </div>

              <div className="flex gap-3">
                <Button size="sm" className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">
                  <Icon name="Plus" size={16} className="mr-2" />
                  Пополнить
                </Button>
                <Button size="sm" className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">
                  <Icon name="Scan" size={16} className="mr-2" />
                  QR-код
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-4 gap-3 mt-6">
            {[
              { icon: 'Train', label: 'Метро', color: 'from-[#0EA5E9] to-[#0284C7]' },
              { icon: 'Ticket', label: 'Музеи', color: 'from-[#8B5CF6] to-[#7C3AED]' },
              { icon: 'MapPin', label: 'Места', color: 'from-[#D946EF] to-[#C026D3]' },
              { icon: 'Gift', label: 'Бонусы', color: 'from-[#F97316] to-[#EA580C]' },
            ].map((item, idx) => (
              <button
                key={idx}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center`}>
                  <Icon name={item.icon as any} size={24} className="text-white" />
                </div>
                <span className="text-xs font-medium text-center">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="history" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="history">История</TabsTrigger>
            <TabsTrigger value="partners">Партнёры</TabsTrigger>
            <TabsTrigger value="profile">Профиль</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-3 mt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">Последние операции</h3>
              <Button variant="ghost" size="sm">
                <Icon name="Filter" size={16} />
              </Button>
            </div>
            {transactions.map((tx) => (
              <Card key={tx.id} className="p-4 hover:shadow-md transition-shadow duration-300 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      tx.type === 'bonus' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Icon name={tx.icon as any} size={20} className={tx.type === 'bonus' ? 'text-green-600' : 'text-gray-600'} />
                    </div>
                    <div>
                      <p className="font-medium">{tx.title}</p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <p className={`font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-foreground'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount} ₽
                  </p>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="partners" className="space-y-3 mt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">Партнёры рядом</h3>
              <Button variant="ghost" size="sm">
                <Icon name="MapPin" size={16} />
              </Button>
            </div>
            {partners.map((partner) => (
              <Card key={partner.id} className="p-4 hover:shadow-md transition-shadow duration-300 animate-fade-in">
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
          </TabsContent>

          <TabsContent value="profile" className="space-y-4 mt-4">
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-20 w-20 border-4 border-white shadow-xl">
                  <AvatarImage src={userData.photo} />
                  <AvatarFallback className="bg-gradient-to-br from-[#0EA5E9] to-[#8B5CF6] text-white text-2xl font-semibold">
                    {userData.firstName[0]}{userData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-xl">{userData.firstName} {userData.lastName}</h3>
                  <p className="text-sm text-muted-foreground">{userData.phone}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Icon name="User" size={20} className="text-muted-foreground" />
                    <span className="text-sm">ФИО</span>
                  </div>
                  <span className="text-sm font-medium">
                    {userData.lastName} {userData.firstName} {userData.middleName}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Icon name="Calendar" size={20} className="text-muted-foreground" />
                    <span className="text-sm">Дата рождения</span>
                  </div>
                  <span className="text-sm font-medium">{userData.birthDate}</span>
                </div>
              </div>
            </Card>

            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Icon name="Shield" size={20} className="mr-3" />
                Настройки безопасности
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Icon name="BellRing" size={20} className="mr-3" />
                Уведомления
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Icon name="HelpCircle" size={20} className="mr-3" />
                Помощь и поддержка
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                <Icon name="LogOut" size={20} className="mr-3" />
                Выйти из аккаунта
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
