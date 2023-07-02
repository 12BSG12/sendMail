import express from 'express';
import bodyParser from 'body-parser'
import cors from 'cors';
import Mail from './mail.js'

const app = express()
const tokenKey = process.env.API_KEY;

app.use(cors());

app.use(bodyParser.json())

// Middleware для проверки наличия токена
const checkToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.substring(7); // Удалить префикс "Bearer " из заголовка

  if(token === tokenKey){
    next();
  } else {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

app.post('/mail', checkToken, async (req, res) => {
  const { name, emailFrom, emailTo, message } = req.body;
  return res.status(200).json({ result: await Mail.send(name, emailFrom, emailTo, message)});
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port :3000')
})