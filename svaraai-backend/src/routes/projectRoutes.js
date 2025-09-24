const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/authMiddleware');

router.use(auth);
router.post('/', projectController.create);
router.get('/', projectController.list);
router.delete('/:id', projectController.remove);

module.exports = router;
