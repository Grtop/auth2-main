const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const winston = require('winston');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express();
const HID = require('node-hid');
const WebAuthn = require('webauthn');

app.use(express.json({
  limit: '50mb' // изменить значение jsonLimit на 50MB
}));

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'server.log' })
  ]
});

app.use((req, res, next) => {
  logger.info(`Получен запрос ${req.method} на ${req.url}`);
  next();
});

const corsOptions = {
  origin: 'http://localhost:3000', // разрешаем запросы только из этого источника
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // разрешаем только эти методы
  allowedHeaders: ['Content-Type', 'Authorization'], // разрешаем эти заголовки
  credentials: true, // разрешаем передавать cookies
  exposedHeaders: ['Set-Cookie'], // добавляем Set-Cookie в exposedHeaders
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: '1',
  database: 'mydatabase',
  port: 5432,
});

pool.connect()
.then(() => {
    logger.info('База данных успешно подключена');
  })
.catch((err) => {
    logger.error('Ошибка подключения к базе данных', err);
    process.exit(1);
  });

const saltRounds = 10;

// Создание сертификата для сервера
const createServerCertificate = async () => {
  try {
    const cert = await WebAuthn.createCertificate({
      username: 'example@example.com',
      rpId: 'example.com',
      rpName: 'Example',
      rpIcon: 'https://example.com/favicon.ico',
      keyType: 'pkcs8',
      certType: 'pki',
      algorithm: 'RS256',
    });

    logger.info('Сертификат сервера создан');
    return cert;
  } catch (error) {
    logger.error('Ошибка создания сертификата сервера:', error);
    throw error;
  }
};

// Настройка сервера для работы с WebAuthn
const setupWebAuthnServer = async (cert) => {
  try {
    const server = await WebAuthn.createServer({
      rpId: 'example.com',
      rpName: 'Example',
      rpIcon: 'https://example.com/favicon.ico',
      key: cert.publicKey,
      cert: cert.certificate,
    });

    logger.info('Сервер WebAuthn настроен');
    return server;
  } catch (error) {
    logger.error('Ошибка настройки сервера WebAuthn:', error);
    throw error;
  }
};

// Регистрация пользователя по WebAuthn
app.post('/register-webauthn', cors(corsOptions), async (req, res) => {
  const { username, email } = req.body;

  if (!username ||!email) {
    logger.warn('Отсутствуют обязательные поля для регистрации');
    return res.status(400).json({ message: 'Пожалуйста, заполните все обязательные поля' });
  }

  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      logger.warn(`Пользователь уже существует: ${email}`);
      return res.status(400).json({ message: 'Пользователь уже существует' });
    }

    const result = await pool.query('INSERT INTO users (username, email) VALUES ($1, $2) RETURNING id', [username, email]);
    const userId = result.rows[0].id;

    const cert = await createServerCertificate();
    const server = await setupWebAuthnServer(cert);

    const credentials = await server.register({
      id: userId,
      name: username,
      icon: 'https://example.com/favicon.ico',
    });

    logger.info(`Пользователь успешно зарегистрирован: ${email}`);

    await pool.query(
      'INSERT INTO webauthn_credentials (user_id, credentials) VALUES ($1, $2)',
      [userId, JSON.stringify(credentials)]
    );

    res.status(200).json({ message: 'Регистрация прошла успешно' });
  } catch (error) {
    logger.error('Ошибка регистрации пользователя по WebAuthn:', error);
    res.status(500).json({ message: 'Ошибка регистрации пользователя по WebAuthn' });
  }
});

// Аутентификация пользователя по WebAuthn
app.post('/authenticate-webauthn', cors(corsOptions), async (req, res) => {
  const { email, credential } = req.body;

  if (!email ||!credential) {
    logger.warn('Email и ключ аутентификации обязательны для аутентификации');
    return res.status(400).json({ message: 'Email и ключ аутентификации обязательны' });
  }

  try {
    const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      logger.warn(`Пользователь не найден: ${email}`);
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const userId = userResult.rows[0].id;

    const credentials = JSON.parse(await pool.query('SELECT credentials FROM webauthn_credentials WHERE user_id = $1', [userId]));

    const isValid = await WebAuthn.verify({
      rpId: 'example.com',
      rpName: 'Example',
      rpIcon: 'https://example.com/favicon.ico',
      key: credentials.key,
      cert: credentials.certificate,
    }, credential);

    if (isValid) {
      logger.info(`Успешная аутентификация пользователя: ${email}`);
      res.status(200).json({ success: true, message: 'Аутентификация прошла успешно' });
    } else {
      logger.warn(`Несуcessfull аутентификация пользователя: ${email}`);
      res.status(401).json({ success: false, message: 'Аутентификация не прошла' });
    }
  } catch (error) {
    logger.error('Ошибка аутентификации пользователя по WebAuthn:', error);
    res.status(500).json({ success: false, message: 'Ошибка аутентификации пользователя по WebAuthn' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Сервер запущен на порту ${PORT}`);
});