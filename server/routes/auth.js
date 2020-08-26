const { Router } = require('express');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // limit each IP to 20 requests per windowMs
});

const controllers = require('../controllers/auth-controller');
const router = new Router();

router.get('/login', controllers.login_get);
router.post('/login', limiter, controllers.login_post);

router.get('/signup', controllers.signup_get);
router.post('/signup', limiter, controllers.signup_post);

router.get('/logout', controllers.logout_get);

module.exports = router;
