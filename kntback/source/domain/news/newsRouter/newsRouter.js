const express = require('express');
const router = express.Router();
const NewsController = require('../newsController/newsController');

// Маршрут для отримання новин
router.get('/', NewsController.fetchNews);
router.post('/marked', NewsController.saveNews);
router.post('/unsaved', NewsController.unsaveNews);
router.get('/marked/:username', NewsController.fetchMarkedNews);
router.get('/popular', NewsController.fetchPopularNews);


module.exports = router;