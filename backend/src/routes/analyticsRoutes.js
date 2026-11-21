const router = require('express').Router();
const protect = require('../middleware/auth');
const analytics = require('../controllers/analyticsController');

router.use(protect);
router.get('/overview', analytics.overview);
router.get('/links/:id', analytics.linkAnalytics);
router.get('/clicks', analytics.clicks);
router.get('/top-links', analytics.topLinks);

module.exports = router;
