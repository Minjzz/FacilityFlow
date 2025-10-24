const express = require('express');
const session = require('express-session');
const multer = require('multer');
const conn = require('./conn'); 
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'facilityflow-secret', 
    resave: false,
    saveUninitialized: false
    // cookie: { maxAge: 1000 * 60 * 60 }
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

            req.session.user = { id: user.id, role: user.role, email: user.email, name: user.name, contact: user.contact };

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

const uploadDir = path.join(__dirname, 'public', 'images', 'facilities');
fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({ dest: uploadDir });

app.post('/addFacility', upload.single('image'), (req, res, next) => {
    const { name, type, capacity, status } = req.body;
    const imagePath = req.file ? `/images/facilities/${req.file.filename}` : null;

    const sql = `INSERT INTO facilities (name, type, capacity, status, image) VALUES (?, ?, ?, ?, ?)`;
    conn.query(sql, [name, type, capacity, status, imagePath], (err, results) => {
        if (err) return next(err);
        return res.redirect('/admin/facility_mgnt');
    });
});

//Add Student
app.post('/addStudent', (req, res) => {
    const { id_num, name, course, yearLevel, email, password, contact, status } = req.body;
    const sql = `INSERT INTO accounts (id_num, name, course, yearLevel, email, password, contact, status, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Student')`;
    conn.query(sql, [id_num, name, course, yearLevel, email, password, contact, status], (err, results) => {
        if (err) throw err;
        return res.redirect('/admin/stud_records');
    });
});

//Admin
app.get('/admin/dashboard', isAuthenticated, (req, res) => {
    if (req.session.user.role !== 'Admin') return res.redirect('/login');
    const success = req.query.login === 'success';
    res.render('admin/dashboard', { success, user: req.session.user });
});

app.get('/admin/facility_mgnt', isAuthenticated, (req, res, next) => {
    if (req.session.user.role !== 'Admin') return res.redirect('/login');
    const success = req.query.login === 'success';

    const display = `SELECT * FROM facilities`;
    conn.query(display, (err, results) => {
        if (err) return next(err);
        return res.render('admin/facility_mgnt', { facilities: results, success, user: req.session.user });
    });
});

app.get('/admin/reservations', isAuthenticated, (req, res) => {
    if (req.session.user.role !== 'Admin') return res.redirect('/login');
    const success = req.query.login === 'success';

    const display = `SELECT r.*, a.name AS student_name FROM reservations r JOIN accounts a ON r.user_id = a.id ORDER BY r.date DESC`;
    conn.query(display, (err, results) => {
        if (err) return next(err);
        return res.render('admin/reservations', {reservations: results, success, user: req.session.user });
    });
});

app.get('/admin/stud_records', isAuthenticated, (req, res, next) => {
    if (req.session.user.role !== 'Admin') return res.redirect('/login');
    const success = req.query.login === 'success';

    const display = `SELECT * FROM accounts WHERE role = 'Student'`;
    conn.query(display, (err, results) => {
        if (err) return next(err);
        return res.render('admin/stud_records', { students: results, success, user: req.session.user });
    });
});

app.get('/admin/analytics', isAuthenticated, (req, res) => {
    if (req.session.user.role !== 'Admin') return res.redirect('/login');
    const success = req.query.login === 'success';
    res.render('admin/analytics', { success, user: req.session.user });
});

app.get('/admin/feedbacks', isAuthenticated, (req, res) => {
    if (req.session.user.role !== 'Admin') return res.redirect('/login');
    const success = req.query.login === 'success';
    res.render('admin/feedbacks', { success, user: req.session.user });
});

app.get('/admin/settings', isAuthenticated, (req, res) => {
    if (req.session.user.role !== 'Admin') return res.redirect('/login');
    const success = req.query.login === 'success';
    res.render('admin/settings', { success, user: req.session.user });
});


//Student Function
app.post('/studentReservation', isAuthenticated, (req, res, next) => {
    if (req.session.user.role !== 'Student') return res.redirect('/login');
    const { type, date, time } = req.body;
    const userId = req.session.user.id;
    const sql = `INSERT INTO reservations (user_id, type, date, time, status) VALUES (?, ?, ?, ?, 'Pending')`;
    conn.query(sql, [userId, type, date, time], (err, results) => {
        if (err) return next(err);
        return res.redirect('/student/student_db');
    });
});

app.post('/cancelReservation', isAuthenticated, (req, res, next) => {
    if (req.session.user.role !== 'Student') return res.redirect('/login');
    const { reservation_id } = req.body;
    const sql = `UPDATE reservations SET status = 'Cancelled' WHERE id = ? AND user_id = ?`;
    conn.query(sql, [reservation_id, req.session.user.id], (err, results) => {
        if (err) return next(err);
        return res.redirect('/student/student_db');
    });
});

//Students
app.get('/student/student_db', isAuthenticated, (req, res, next) => {
    if (req.session.user.role !== 'Student') return res.redirect('/login');
    const success = req.query.login === 'success';

    const displayReservations = `SELECT * FROM reservations WHERE user_id = ? ORDER BY date DESC`;
    conn.query(displayReservations, [req.session.user.id], (err, results) => {
        if (err) return next(err);
        return res.render('student/student_db', { bookings: results, success, user: req.session.user });
    });
});

app.get('/student/reservations', isAuthenticated, (req, res, next) => {
    if (req.session.user.role !== 'Student') return res.redirect('/login');

    const displayReservations = `SELECT * FROM reservations WHERE user_id = ? ORDER BY date DESC`;
    conn.query(displayReservations, [req.session.user.id], (err, results) => {
        if (err) return next(err);
        return res.render('student/reservations', { 
            bookings: results, 
            user: req.session.user 
        });
    });
});

app.get('/student/feedbacks', isAuthenticated, (req, res) => {
    if (req.session.user.role !== 'Student') return res.redirect('/login');
    res.render('student/feedbacks', { user: req.session.user });
});

app.listen(8000, () => {
    console.log("Listening to this port");
})
