# Настройка Supabase для MEANLY

## 1. Создание проекта

Проект уже создан:
- **URL:** https://dagdugwedwiuqzosmjby.supabase.co
- **Dashboard:** https://supabase.com/dashboard/project/dagdugwedwiuqzosmjby

## 2. Запуск миграций

Зайдите в Supabase Dashboard > SQL Editor и выполните миграции из папки:
- `supabase/migrations/001_initial_schema.sql` - создание таблиц
- `supabase/migrations/002_seed_data.sql` - тестовые данные

## 3. Настройка Auth Providers

### Google OAuth
1. Перейдите в Dashboard > Authentication > Providers > Google
2. Включите Google provider
3. Создайте OAuth credentials в [Google Cloud Console](https://console.cloud.google.com/):
   - APIs & Services > Credentials > Create Credentials > OAuth client ID
   - Тип: Web application
   - Authorized redirect URIs: `https://dagdugwedwiuqzosmjby.supabase.co/auth/v1/callback`
4. Скопируйте Client ID и Client Secret в Supabase

### Apple Sign-In
1. Перейдите в Dashboard > Authentication > Providers > Apple
2. Включите Apple provider
3. В [Apple Developer Console](https://developer.apple.com/):
   - Создайте App ID с Sign in with Apple capability
   - Создайте Services ID для web redirect
   - Создайте Key для Sign in with Apple
4. Заполните поля в Supabase:
   - Services ID (Client ID)
   - Key ID
   - Team ID
   - Private Key (содержимое .p8 файла)

### Email Auth
- Уже включён по умолчанию
- Настройте SMTP для production (Dashboard > Project Settings > Auth > SMTP)

## 4. Получение API ключей

1. Dashboard > Project Settings > API
2. Скопируйте:
   - **Project URL** (уже есть: https://dagdugwedwiuqzosmjby.supabase.co)
   - **anon public key** - нужен для клиента

## 5. Настройка в приложении

Создайте файл `.env` в корне проекта meanly:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://dagdugwedwiuqzosmjby.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=ваш_anon_key_из_dashboard
```

## 6. Проверка RLS политик

После выполнения миграций убедитесь что RLS включён:
- Dashboard > Table Editor > выберите таблицу > RLS должен быть enabled

## 7. Структура таблиц

| Таблица | Описание |
|---------|----------|
| profiles | Профили пользователей (расширяет auth.users) |
| words | Словарь слов |
| examples | Примеры использования слов |
| user_words | Сохранённые слова пользователей |
| practice_sessions | История практики |
| word_packs | Наборы слов |
| word_pack_items | Связь слов с наборами |
| user_purchases | Покупки пользователей |

## 8. Edge Functions (опционально)

Для LLM проверки предложений можно создать Edge Function:
- Dashboard > Edge Functions > New Function
- Имя: `check-sentence`
- Код для обработки запросов к LLM API
