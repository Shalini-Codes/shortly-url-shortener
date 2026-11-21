require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { UAParser } = require('ua-parser-js');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const linkRoutes = require('./routes/linkRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const Link = require('./models/Link');
const Click = require('./models/Click');

const app = express();
app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin(origin, callback) {
    const allowed = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map(v => v.trim());
    callback(null, !origin || allowed.includes(origin));
  },
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-8', legacyHeaders: false });
const createLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 60, standardHeaders: 'draft-8', legacyHeaders: false });

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/links', (req, res, next) => req.method === 'POST' ? createLimiter(req, res, next) : next(), linkRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/:shortCode', async (req, res) => {
  try {
    const shortCode = req.params.shortCode.toLowerCase();
    if (['api', 'assets', 'favicon.ico'].includes(shortCode)) return res.sendStatus(404);
    const link = await Link.findOne({ shortCode });
    if (!link) return res.status(404).send('Short link not found');
    if (!link.isActive) return res.status(410).send('This short link has been disabled');
    if (link.expiresAt && link.expiresAt < new Date()) return res.status(410).send('This short link has expired');

    const parser = new UAParser(req.headers['user-agent'] || '');
    const result = parser.getResult();
    let referrer = 'Direct';
    if (req.get('referer')) {
      try { referrer = new URL(req.get('referer')).hostname; } catch { referrer = 'Direct'; }
    }
    await Click.create({
      linkId: link._id,
      referrer,
      browser: result.browser.name || 'Unknown',
      device: result.device.type ? (result.device.type[0].toUpperCase() + result.device.type.slice(1)) : 'Desktop',
      operatingSystem: result.os.name || 'Unknown'
    });
    await Link.updateOne({ _id: link._id }, { $inc: { clicks: 1 } });
    return res.redirect(302, link.originalUrl);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Unable to process this link');
  }
});

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((error, req, res, next) => {
  console.error(error);
  const status = error.status || (error.name === 'ValidationError' ? 400 : 500);
  res.status(status).json({ message: error.message || 'Server error' });
});

async function start() {
  await connectDB();
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Shortly API running on http://localhost:${port}`));
}

start().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
