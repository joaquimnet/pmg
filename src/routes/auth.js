const { Router } = require('express');

const controllers = require('../controllers/auth-controller');
const router = new Router();

router.get('/login', controllers.getLogin);
router.post('/login', controllers.postLogin);
router.get('/logout', controllers.getLogout);

module.exports = router;
