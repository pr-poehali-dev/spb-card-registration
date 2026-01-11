import json
import os
import psycopg2
import urllib.request
import urllib.parse
from datetime import datetime, timedelta
import random

def handler(event: dict, context) -> dict:
    '''Универсальный API для всех операций приложения Карта Петербуржца'''
    method = event.get('httpMethod', 'GET')
    path = event.get('queryStringParameters', {}).get('action', '')
    
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type'}, 'body': '', 'isBase64Encoded': False}
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    schema = os.environ['MAIN_DB_SCHEMA']
    
    try:
        if path == 'register' and method == 'POST':
            data = json.loads(event.get('body', '{}'))
            cur.execute(f"INSERT INTO {schema}.users (phone, first_name, last_name, middle_name, birth_date) VALUES (%s, %s, %s, %s, %s) RETURNING id", 
                       (data['phone'], data['firstName'], data['lastName'], data.get('middleName', ''), data['birthDate']))
            user_id = cur.fetchone()[0]
            conn.commit()
            return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'userId': user_id, 'success': True}), 'isBase64Encoded': False}
        
        elif path == 'login' and method == 'POST':
            data = json.loads(event.get('body', '{}'))
            cur.execute(f"SELECT id, first_name, last_name, middle_name, birth_date, balance, bonus_points, photo_url, phone FROM {schema}.users WHERE phone = %s", (data['phone'],))
            user = cur.fetchone()
            if user:
                return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'userId': user[0], 'firstName': user[1], 'lastName': user[2], 'middleName': user[3], 'birthDate': str(user[4]), 'balance': float(user[5]), 'bonusPoints': user[6], 'photoUrl': user[7], 'phone': user[8]}), 'isBase64Encoded': False}
            return {'statusCode': 404, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'User not found'}), 'isBase64Encoded': False}
        
        elif path == 'user-data' and method == 'GET':
            user_id = event.get('queryStringParameters', {}).get('userId')
            cur.execute(f"""SELECT u.id, u.first_name, u.last_name, u.middle_name, u.birth_date, u.balance, u.bonus_points, u.photo_url, u.phone,
                (SELECT json_agg(json_build_object('id', p.id, 'series', p.series, 'number', p.number, 'inn', p.inn)) FROM {schema}.passports p WHERE p.user_id = u.id) as passports,
                (SELECT json_agg(json_build_object('id', pc.id, 'cardNumber', pc.card_number, 'balance', pc.balance)) FROM {schema}.podorozhnik_cards pc WHERE pc.user_id = u.id) as podorozhnik,
                (SELECT json_agg(json_build_object('id', bc.id, 'cardNumber', bc.card_number, 'holderName', bc.holder_name, 'expireDate', bc.expire_date, 'bankName', bc.bank_name, 'isSber', bc.is_sber, 'sberSpasibo', bc.sber_spasibo)) FROM {schema}.bank_cards bc WHERE bc.user_id = u.id) as bank_cards,
                (SELECT json_agg(json_build_object('id', v.id, 'plateNumber', v.plate_number, 'brand', v.brand, 'model', v.model, 'year', v.year)) FROM {schema}.vehicles v WHERE v.user_id = u.id) as vehicles,
                (SELECT json_agg(json_build_object('id', i.id, 'city', i.city, 'street', i.street, 'house', i.house, 'apartment', i.apartment, 'entrance', i.entrance, 'brand', i.brand, 'provider', i.provider, 'imageUrl', i.image_url)) FROM {schema}.intercoms i WHERE i.user_id = u.id) as intercoms,
                (SELECT json_agg(json_build_object('widgetType', ws.widget_type, 'isVisible', ws.is_visible, 'position', ws.position)) FROM {schema}.widget_settings ws WHERE ws.user_id = u.id) as widgets,
                (SELECT city FROM {schema}.weather_settings WHERE user_id = u.id LIMIT 1) as weather_city
                FROM {schema}.users u WHERE u.id = %s""", (user_id,))
            row = cur.fetchone()
            if row:
                return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'userId': row[0], 'firstName': row[1], 'lastName': row[2], 'middleName': row[3], 'birthDate': str(row[4]), 'balance': float(row[5]), 'bonusPoints': row[6], 'photoUrl': row[7], 'phone': row[8], 'passports': row[9] or [], 'podorozhnik': row[10] or [], 'bankCards': row[11] or [], 'vehicles': row[12] or [], 'intercoms': row[13] or [], 'widgets': row[14] or [], 'weatherCity': row[15]}), 'isBase64Encoded': False}
        
        elif path == 'update-user' and method == 'PUT':
            data = json.loads(event.get('body', '{}'))
            fields = []
            values = []
            for field, col in [('firstName', 'first_name'), ('lastName', 'last_name'), ('middleName', 'middle_name'), ('birthDate', 'birth_date'), ('photoUrl', 'photo_url')]:
                if field in data:
                    fields.append(f'{col} = %s')
                    values.append(data[field])
            if fields:
                values.append(data['userId'])
                cur.execute(f"UPDATE {schema}.users SET {', '.join(fields)} WHERE id = %s", tuple(values))
                conn.commit()
            return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'success': True}), 'isBase64Encoded': False}
        
        elif path == 'add-passport' and method == 'POST':
            data = json.loads(event.get('body', '{}'))
            cur.execute(f"INSERT INTO {schema}.passports (user_id, series, number, inn) VALUES (%s, %s, %s, %s) RETURNING id", (data['userId'], data['series'], data['number'], data.get('inn', '')))
            doc_id = cur.fetchone()[0]
            conn.commit()
            return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'id': doc_id, 'success': True}), 'isBase64Encoded': False}
        
        elif path == 'add-podorozhnik' and method == 'POST':
            data = json.loads(event.get('body', '{}'))
            cur.execute(f"INSERT INTO {schema}.podorozhnik_cards (user_id, card_number, balance) VALUES (%s, %s, %s) RETURNING id", (data['userId'], data['cardNumber'], data.get('balance', 0)))
            card_id = cur.fetchone()[0]
            conn.commit()
            return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'id': card_id, 'cardNumber': data['cardNumber'], 'success': True}), 'isBase64Encoded': False}
        
        elif path == 'podorozhnik-topup' and method == 'POST':
            data = json.loads(event.get('body', '{}'))
            cur.execute(f"UPDATE {schema}.podorozhnik_cards SET balance = balance + %s WHERE id = %s RETURNING balance", (data.get('amount', 500), data['cardId']))
            new_balance = cur.fetchone()[0]
            cur.execute(f"INSERT INTO {schema}.podorozhnik_transactions (card_id, amount, transaction_type, description) VALUES (%s, %s, 'topup', 'Пополнение')", (data['cardId'], data.get('amount', 500)))
            conn.commit()
            return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'newBalance': float(new_balance), 'success': True}), 'isBase64Encoded': False}
        
        elif path == 'podorozhnik-pay' and method == 'POST':
            data = json.loads(event.get('body', '{}'))
            cur.execute(f"SELECT balance FROM {schema}.podorozhnik_cards WHERE id = %s", (data['cardId'],))
            if float(cur.fetchone()[0]) < data.get('amount', 60):
                return {'statusCode': 400, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Insufficient funds'}), 'isBase64Encoded': False}
            cur.execute(f"UPDATE {schema}.podorozhnik_cards SET balance = balance - %s WHERE id = %s RETURNING balance", (data.get('amount', 60), data['cardId']))
            new_balance = cur.fetchone()[0]
            cur.execute(f"INSERT INTO {schema}.podorozhnik_transactions (card_id, amount, transaction_type, description) VALUES (%s, %s, 'payment', 'Оплата')", (data['cardId'], -data.get('amount', 60)))
            conn.commit()
            return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'newBalance': float(new_balance), 'success': True}), 'isBase64Encoded': False}
        
        elif path == 'add-bank-card' and method == 'POST':
            data = json.loads(event.get('body', '{}'))
            is_sber = 'сбер' in data.get('holderName', '').lower() or 'сбер' in data.get('bankName', '').lower()
            sber_spasibo = 1000 if is_sber else 0
            cur.execute(f"INSERT INTO {schema}.bank_cards (user_id, card_number, holder_name, expire_date, bank_name, is_sber, sber_spasibo) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id", 
                       (data['userId'], data['cardNumber'], data['holderName'], data['expireDate'], data['bankName'], is_sber, sber_spasibo))
            card_id = cur.fetchone()[0]
            conn.commit()
            return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'id': card_id, 'isSber': is_sber, 'sberSpasibo': sber_spasibo, 'success': True}), 'isBase64Encoded': False}
        
        elif path == 'add-vehicle' and method == 'POST':
            data = json.loads(event.get('body', '{}'))
            cur.execute(f"INSERT INTO {schema}.vehicles (user_id, plate_number, brand, model, year) VALUES (%s, %s, %s, %s, %s) RETURNING id", 
                       (data['userId'], data['plateNumber'], data.get('brand', ''), data.get('model', ''), data.get('year')))
            vehicle_id = cur.fetchone()[0]
            
            fines_data = [("Превышение скорости на 20-40 км/ч", 500, "Невский проспект, д.1"), ("Проезд на красный свет", 1000, "Лиговский проспект, д.30"), 
                         ("Нарушение правил парковки", 1500, "ул. Рубинштейна, д.15"), ("Непредоставление преимущества пешеходу", 1500, "Садовая ул., д.50")]
            
            if random.random() > 0.3:
                for i in range(random.randint(0, 2)):
                    fine_data = random.choice(fines_data)
                    fine_date = datetime.now() - timedelta(days=random.randint(1, 60))
                    fine_number = f"18810{random.randint(100000, 999999)}"
                    cur.execute(f"INSERT INTO {schema}.fines (vehicle_id, fine_number, amount, description, date, location) VALUES (%s, %s, %s, %s, %s, %s)",
                               (vehicle_id, fine_number, fine_data[1], fine_data[0], fine_date.date(), fine_data[2]))
            conn.commit()
            return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'id': vehicle_id, 'success': True}), 'isBase64Encoded': False}
        
        elif path == 'get-fines' and method == 'GET':
            vehicle_id = event.get('queryStringParameters', {}).get('vehicleId')
            cur.execute(f"SELECT id, fine_number, amount, description, date, location, is_paid FROM {schema}.fines WHERE vehicle_id = %s ORDER BY date DESC", (vehicle_id,))
            fines = [{'id': r[0], 'fineNumber': r[1], 'amount': float(r[2]), 'description': r[3], 'date': str(r[4]), 'location': r[5], 'isPaid': r[6]} for r in cur.fetchall()]
            return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'fines': fines}), 'isBase64Encoded': False}
        
        elif path == 'weather' and method == 'GET':
            city = event.get('queryStringParameters', {}).get('city', 'Saint Petersburg')
            api_key = os.environ.get('WEATHER_API_KEY', '')
            
            if not api_key:
                return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'temp': 5, 'condition': 'Облачно', 'icon': 'Cloud', 'needsSetup': True}), 'isBase64Encoded': False}
            
            city_map = {'spb': 'Saint Petersburg', 'msk': 'Moscow', 'sochi': 'Sochi', 'Шушары': 'Shushary'}
            url = f"https://api.openweathermap.org/data/2.5/weather?q={urllib.parse.quote(city_map.get(city, city))}&appid={api_key}&units=metric&lang=ru"
            
            req = urllib.request.Request(url)
            with urllib.request.urlopen(req) as response:
                weather_data = json.loads(response.read().decode())
            
            temp = round(weather_data['main']['temp'])
            condition = weather_data['weather'][0]['description'].capitalize()
            weather_id = weather_data['weather'][0]['id']
            icon = 'CloudLightning' if weather_id < 300 else 'CloudRain' if weather_id < 600 else 'CloudSnow' if weather_id < 700 else 'Sun' if weather_id == 800 else 'Cloud'
            
            return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'temp': temp, 'condition': condition, 'icon': icon, 'needsSetup': False}), 'isBase64Encoded': False}
        
        elif path == 'set-weather-city' and method == 'POST':
            data = json.loads(event.get('body', '{}'))
            cur.execute(f"DELETE FROM {schema}.weather_settings WHERE user_id = %s", (data['userId'],))
            cur.execute(f"INSERT INTO {schema}.weather_settings (user_id, city) VALUES (%s, %s)", (data['userId'], data['city']))
            conn.commit()
            return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'success': True}), 'isBase64Encoded': False}
        
        elif path == 'gosuslugi' and method == 'GET':
            user_id = event.get('queryStringParameters', {}).get('userId')
            
            cur.execute(f"SELECT id, tax_type, amount, year, is_paid, due_date FROM {schema}.taxes WHERE user_id = %s", (user_id,))
            taxes = cur.fetchall()
            
            if not taxes and random.random() > 0.3:
                tax_types = [("Налог на имущество физических лиц", random.uniform(1000, 5000), "2025-12-01"), ("Транспортный налог", random.uniform(2000, 8000), "2025-12-01"), ("Земельный налог", random.uniform(500, 3000), "2025-12-01")]
                for tax_type, amount, due_date in random.sample(tax_types, random.randint(1, 2)):
                    cur.execute(f"INSERT INTO {schema}.taxes (user_id, tax_type, amount, year, due_date) VALUES (%s, %s, %s, %s, %s)", (user_id, tax_type, amount, 2025, due_date))
                conn.commit()
                cur.execute(f"SELECT id, tax_type, amount, year, is_paid, due_date FROM {schema}.taxes WHERE user_id = %s", (user_id,))
                taxes = cur.fetchall()
            
            cur.execute(f"SELECT id, benefit_type, status, description, amount FROM {schema}.benefits WHERE user_id = %s", (user_id,))
            benefits = cur.fetchall()
            
            if not benefits:
                benefit_types = [("Субсидия на оплату ЖКХ", "Активна", "Ежемесячная выплата", 2500), ("Льгота на проезд", "Активна", "Бесплатный проезд", 0), ("Социальная выплата", "На рассмотрении", "Единовременная выплата", 10000)]
                for benefit in random.sample(benefit_types, random.randint(0, 2)):
                    cur.execute(f"INSERT INTO {schema}.benefits (user_id, benefit_type, status, description, amount) VALUES (%s, %s, %s, %s, %s)", (user_id, benefit[0], benefit[1], benefit[2], benefit[3]))
                conn.commit()
                cur.execute(f"SELECT id, benefit_type, status, description, amount FROM {schema}.benefits WHERE user_id = %s", (user_id,))
                benefits = cur.fetchall()
            
            return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 
                   'body': json.dumps({'taxes': [{'id': t[0], 'taxType': t[1], 'amount': float(t[2]), 'year': t[3], 'isPaid': t[4], 'dueDate': str(t[5])} for t in taxes], 
                                      'benefits': [{'id': b[0], 'benefitType': b[1], 'status': b[2], 'description': b[3], 'amount': float(b[4]) if b[4] else 0} for b in benefits]}), 'isBase64Encoded': False}
        
        elif path == 'add-intercom' and method == 'POST':
            data = json.loads(event.get('body', '{}'))
            cur.execute(f"INSERT INTO {schema}.intercoms (user_id, city, street, house, apartment, entrance, brand, provider, image_url) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id",
                       (data['userId'], data['city'], data['street'], data['house'], data['apartment'], data.get('entrance', ''), data['brand'], data['provider'], data.get('imageUrl', '')))
            intercom_id = cur.fetchone()[0]
            conn.commit()
            return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'id': intercom_id, 'success': True}), 'isBase64Encoded': False}
        
        elif path == 'widgets' and method == 'POST':
            data = json.loads(event.get('body', '{}'))
            cur.execute(f"DELETE FROM {schema}.widget_settings WHERE user_id = %s", (data['userId'],))
            for widget in data.get('widgets', []):
                cur.execute(f"INSERT INTO {schema}.widget_settings (user_id, widget_type, is_visible, position) VALUES (%s, %s, %s, %s)",
                           (data['userId'], widget['widgetType'], widget['isVisible'], widget['position']))
            conn.commit()
            return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'success': True}), 'isBase64Encoded': False}
        
        return {'statusCode': 400, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Invalid action'}), 'isBase64Encoded': False}
    
    except Exception as e:
        return {'statusCode': 500, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': str(e)}), 'isBase64Encoded': False}
    
    finally:
        cur.close()
        conn.close()
