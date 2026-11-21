const router = require('express').Router();
const protect = require('../middleware/auth');
const { createLink, getLinks, getLink, updateLink, deleteLink, updateStatus } = require('../controllers/linkController');

router.use(protect);
router.post('/', createLink);
router.get('/', getLinks);
router.get('/:id', getLink);
router.put('/:id', updateLink);
router.delete('/:id', deleteLink);
router.patch('/:id/status', updateStatus);

module.exports = router;
