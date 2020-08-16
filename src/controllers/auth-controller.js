function getLogin(req, res) {
  if (req.session.loggedIn) {
    return res.redirect('/');
  }
  res.render('login');
}

function postLogin(req, res) {
  const { email, password } = req.body;
  if (!email || !password || !email.length || !password.length) {
    return res.render('login', { error: 'Bad email or password.' });
  }
  req.session.loggedIn = true;
  res.redirect('/');
}

function getLogout(req, res) {
  req.session.destroy(() => res.redirect('/login'));
}

module.exports = {
  getLogin,
  postLogin,
  getLogout,
};
