const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const winston = require('winston');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

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

app.post('/register', async (req, res) => {
  const { username, email, image } = req.body;

  if (!username ||!email ||!image) {
    logger.warn('Отсутствуют обязательные поля для регистрации');
    return res.status(400).json({ message: 'Пожалуйста, заполните все обязательные поля' });
  }

  if (image.length > 1024 * 1024 * 10) { // 10 МБ
    image = image.substring(0, 1024 * 1024 * 10);
  }

  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      logger.warn(`Пользователь уже существует: ${email}`);
      return res.status(400).json({ message: 'Пользователь уже существует' });
    }

    const result = await pool.query('INSERT INTO users (username, email) VALUES ($1, $2) RETURNING id', [username, email]);
    const userId = result.rows[0].id;

    const hashedImage = bcrypt.hashSync(image, saltRounds);

    await pool.query(
      'INSERT INTO image_hashes (user_id, image_hash) VALUES ($1, $2)',
      [userId, hashedImage]
    );

    await pool.query(
      'INSERT INTO user_answers (user_id, answers) VALUES ($1, $2)',
      [userId, JSON.stringify([])]
    );

    logger.info(`Пользователь успешно зарегистрирован: ${email}`);
    res.status(200).json({ message: 'Регистрация прошла успешно' });
  } catch (error) {
    logger.error('Ошибка регистрации пользователя:', error);
    res.status(500).json({ message: 'Ошибка регистрации пользователя' });
  }
});

app.get('/get-user-id/:username', async (req, res) => {
  const { username } = req.params;

  if (!username) {
    logger.warn('Имя пользователя обязательно');
    return res.status(400).json({ message: 'Имя пользователя обязательно' });
  }

  try {
    const result = await pool.query('SELECT id FROM users WHERE username = $1 or email = $1', [username]);

    if (result.rows.length === 0) {
      logger.warn(`Пользователь не найден: ${username}`);
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const userId = result.rows[0].id;
    logger.info(`Пользователь найден: ${username}, userId: ${userId}`);

    res.json({ userId });
  } catch (error) {
    logger.error('Ошибка получения userId:', error);
    res.status(500).json({ message: 'Ошибка получения userId' });
  }
});

app.post('/verify-image', async (req, res) => {
  const { email, image } = req.body;

  if (!email ||!image) {
    logger.warn('Email и изображение обязательны для проверки');
    return res.status(400).json({ message: 'Email и изображение обязательны' });
  }

  if (image.length > 1024 * 1024 * 10) { // 10 МБ
    image = image.substring(0, 1024 * 1024 * 10);
  }

  try {
    const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      logger.warn(`Пользователь не найден: ${email}`);
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const userId = userResult.rows[0].id;

    const imageHashResult = await pool.query('SELECT image_hash FROM image_hashes WHERE user_id = $1', [userId]);
    if (imageHashResult.rows.length === 0) {
      logger.warn(`Хэш изображения не найден для пользователя с ID: ${userId}`);
      return res.status(404).json({ message: 'Хэш изображения не найден' });
    }

    const storedImageHash = imageHashResult.rows[0].image_hash;

    const isMatch = bcrypt.compareSync(image, storedImageHash);

    if (isMatch) {
      logger.info(`Успешное совпадение хэшей для пользователя: ${email}`);
      res.status(200).json({ success: true, message: 'Изображение совпадает' });
    } else {
      logger.warn(`Несовпадение хэшей для пользователя: ${email}`);
      res.status(401).json({ success: false, message: 'Изображение не совпадает' });
    }
  } catch (error) {
    logger.error('Ошибка проверки изображения:', error);
    res.status(500).json({ success: false, message: 'Ошибка проверки изображения' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Сервер запущен на порту ${PORT}`);
});