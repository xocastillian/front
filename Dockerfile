# Используем Node.js образ
FROM node:18-alpine

# Рабочая директория
WORKDIR /app

# Установка зависимостей
COPY package*.json ./
RUN npm install

# Копируем все остальные файлы
COPY . .

# Сборка фронтенда
RUN npm run build

# Открываем порт, на котором слушает next start
EXPOSE 3000

# Запуск фронта в продакшене
CMD ["npm", "start"]
