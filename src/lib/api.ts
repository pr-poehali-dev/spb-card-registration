const API_URL = 'https://functions.poehali.dev/c4cfcf01-b29f-4634-bd9b-008546e3dc85';

export const api = {
  register: (data: any) => 
    fetch(`${API_URL}?action=register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  
  login: (phone: string) =>
    fetch(`${API_URL}?action=login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone }) }).then(r => r.json()),
  
  getUserData: (userId: number) =>
    fetch(`${API_URL}?action=user-data&userId=${userId}`).then(r => r.json()),
  
  updateUser: (data: any) =>
    fetch(`${API_URL}?action=update-user`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  
  addPassport: (data: any) =>
    fetch(`${API_URL}?action=add-passport`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  
  addPodorozhnik: (data: any) =>
    fetch(`${API_URL}?action=add-podorozhnik`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  
  topupPodorozhnik: (cardId: number, amount: number) =>
    fetch(`${API_URL}?action=podorozhnik-topup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cardId, amount }) }).then(r => r.json()),
  
  payPodorozhnik: (cardId: number, amount: number) =>
    fetch(`${API_URL}?action=podorozhnik-pay`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cardId, amount }) }).then(r => r.json()),
  
  addBankCard: (data: any) =>
    fetch(`${API_URL}?action=add-bank-card`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  
  addVehicle: (data: any) =>
    fetch(`${API_URL}?action=add-vehicle`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  
  getFines: (vehicleId: number) =>
    fetch(`${API_URL}?action=get-fines&vehicleId=${vehicleId}`).then(r => r.json()),
  
  getWeather: (city: string) =>
    fetch(`${API_URL}?action=weather&city=${city}`).then(r => r.json()),
  
  setWeatherCity: (userId: number, city: string) =>
    fetch(`${API_URL}?action=set-weather-city`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, city }) }).then(r => r.json()),
  
  getGosuslugi: (userId: number) =>
    fetch(`${API_URL}?action=gosuslugi&userId=${userId}`).then(r => r.json()),
  
  addIntercom: (data: any) =>
    fetch(`${API_URL}?action=add-intercom`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.dumps(data) }).then(r => r.json()),
  
  saveWidgets: (userId: number, widgets: any[]) =>
    fetch(`${API_URL}?action=widgets`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, widgets }) }).then(r => r.json()),
};
