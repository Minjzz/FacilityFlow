const express = require('express');
const session = require('express-session');
const conn = require('./conn'); 
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'facilityflow-secret', 
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }
}));

function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

//Home Page
app.get('/', (req, res) => {
    res.render('index');
});

//Login Page
app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

//Login POST
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = `SELECT * FROM accounts WHERE email = ? AND password = ?`;
    conn.query(sql, [email, password], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            const user = results[0];

            req.session.user = { id: user.id, role: user.role, email: user.email, name: user.name };

            if (user.role === 'Student') {
                res.redirect('/student/student_db?login=success');
            } else if (user.role === 'Admin') {
                res.redirect('/admin/dashboard?login=success');
            } else {
                res.render('login', { error: 'Unknown role' });
            }
        } else {
            res.render('login', { error: 'Invalid email or password' });
        }
    });
});

//Logout
app.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                return res.send('Error logging out');
            }
            res.redirect('/login');
        });
    } else {
        res.redirect('/login');
    }
});

//Admin
app.get('/admin/dashboard', isAuthenticated, (req, res) => {
    if (req.session.user.role !== 'Admin') return res.redirect('/login');
    const success = req.query.login === 'success';
    res.render('admin/dashboard', { success, user: req.session.user });
});

//Students
app.get('/student/student_db', isAuthenticated, (req, res) => {
    if (req.session.user.role !== 'Student') return res.redirect('/login');
    const success = req.query.login === 'success';
    res.render('student/student_db', { success, user: req.session.user });
});

app.get('/student/reservations', isAuthenticated, (req, res) => {
    if (req.session.user.role !== 'Student') return res.redirect('/login');
    res.render('student/reservations', { user: req.session.user });
});

app.get('/student/feedbacks', isAuthenticated, (req, res) => {
    if (req.session.user.role !== 'Student') return res.redirect('/login');
    res.render('student/feedbacks', { user: req.session.user });
});

app.listen(8000, () => {
    console.log("Listening to this port");
})
