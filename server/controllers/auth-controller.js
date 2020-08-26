function login_get(req, res) {
  if (req.session.loggedIn) {
    return res.redirect('/');
  }
  res.render('login');
}

function login_post(req, res) {
  const { email, password } = req.body;
  if (!email || !password || !email.length || !password.length) {
    return res.render('login', { error: 'Bad email or password.' });
  }
  req.session.loggedIn = true;
  res.redirect('/');
}

function logout_get(req, res) {
  req.session.destroy(() => res.redirect('/login'));
}

function signup_get(req, res) {
  res.send(`
    <form method="POST" action="/signup">
      <input type="email" name="email"/>
      <input type="password" name="password"/>
      <input type="password" name="confirmPassword"/>
      <input type="submit" />
    </form>
  `);
}

function signup_post(req, res) {
  // Validation goes here
  // Database stuff goes here
  res.send('new signup');
}

module.exports = {
  login_get,
  login_post,
  logout_get,
  signup_get,
  signup_post,
};
