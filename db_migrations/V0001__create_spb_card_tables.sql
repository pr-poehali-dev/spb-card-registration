-- Создание таблиц для приложения "Карта Петербуржца"

-- Пользователи
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    birth_date DATE NOT NULL,
    photo_url TEXT,
    balance DECIMAL(10,2) DEFAULT 0,
    bonus_points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Паспорта
CREATE TABLE IF NOT EXISTS passports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    series VARCHAR(4) NOT NULL,
    number VARCHAR(6) NOT NULL,
    inn VARCHAR(12),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Карты Подорожник
CREATE TABLE IF NOT EXISTS podorozhnik_cards (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    card_number VARCHAR(50) UNIQUE NOT NULL,
    balance DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Банковские карты
CREATE TABLE IF NOT EXISTS bank_cards (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    card_number VARCHAR(19) NOT NULL,
    holder_name VARCHAR(200) NOT NULL,
    expire_date VARCHAR(5) NOT NULL,
    bank_name VARCHAR(100) NOT NULL,
    is_sber BOOLEAN DEFAULT FALSE,
    sber_spasibo INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Автомобили
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    plate_number VARCHAR(20) UNIQUE NOT NULL,
    brand VARCHAR(100),
    model VARCHAR(100),
    year INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Штрафы ГИБДД
CREATE TABLE IF NOT EXISTS fines (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER REFERENCES vehicles(id),
    fine_number VARCHAR(50) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    location TEXT,
    is_paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Домофоны
CREATE TABLE IF NOT EXISTS intercoms (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    city VARCHAR(100) NOT NULL,
    street VARCHAR(200) NOT NULL,
    house VARCHAR(20) NOT NULL,
    apartment VARCHAR(10) NOT NULL,
    entrance VARCHAR(10),
    brand VARCHAR(100) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Настройки виджетов
CREATE TABLE IF NOT EXISTS widget_settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    widget_type VARCHAR(50) NOT NULL,
    is_visible BOOLEAN DEFAULT TRUE,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Настройки погоды
CREATE TABLE IF NOT EXISTS weather_settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    city VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Госуслуги: Налоги
CREATE TABLE IF NOT EXISTS taxes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    tax_type VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    year INTEGER NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    due_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Госуслуги: Льготы
CREATE TABLE IF NOT EXISTS benefits (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    benefit_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    description TEXT,
    amount DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Транзакции Подорожник
CREATE TABLE IF NOT EXISTS podorozhnik_transactions (
    id SERIAL PRIMARY KEY,
    card_id INTEGER REFERENCES podorozhnik_cards(id),
    amount DECIMAL(10,2) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_vehicles_plate ON vehicles(plate_number);
CREATE INDEX IF NOT EXISTS idx_fines_vehicle ON fines(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_passports_user ON passports(user_id);
CREATE INDEX IF NOT EXISTS idx_podorozhnik_user ON podorozhnik_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_bank_cards_user ON bank_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_user ON vehicles(user_id);
CREATE INDEX IF NOT EXISTS idx_intercoms_user ON intercoms(user_id);
CREATE INDEX IF NOT EXISTS idx_widget_settings_user ON widget_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_weather_settings_user ON weather_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_taxes_user ON taxes(user_id);
CREATE INDEX IF NOT EXISTS idx_benefits_user ON benefits(user_id);