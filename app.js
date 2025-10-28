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
                req.session.alert = {
                    type: 'success',
                    title: 'Welcome back!',
                    message: 'You have logged in successfully.'
                }
                res.redirect('/student/student_db');
            } else if (user.role === 'Admin') {
                req.session.alert = {
                    type: 'success',
                    title: 'Welcome back!',
                    message: 'You have logged in successfully.'
                }
                res.redirect('/admin/dashboard');
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
        if (err) {
            req.session.alert = {
                type: 'error',
                message: 'Failed to add facility. Try again.'
            }
            return res.redirect('/admin/facility_mgnt')
        }
        req.session.alert = {
            type: 'success',
            message: 'Add facility successfully!'
        }
        return res.redirect('/admin/facility_mgnt');
    });
});

//Add Student
app.post('/addStudent', (req, res) => {
    const { id_num, name, course, yearLevel, email, password, contact, status } = req.body;
    const sql = `INSERT INTO accounts (id_num, name, course, yearLevel, email, password, contact, status, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Student')`;
    conn.query(sql, [id_num, name, course, yearLevel, email, password, contact, status], (err, results) => {
        if (err) {
            req.session.alert = {
                type: 'error',
                message: 'Failed to add student. Try again.'
            }
            return res.redirect('/admin/stud_records')
        }
        req.session.alert = {
            type: 'success',
            message: 'Add student succesfully!'
        }
        return res.redirect('/admin/stud_records');
    });
});

app.post('/admin/updateProfile', isAuthenticated, (req, res) => {
    const { name, email, contact } = req.body;
    const userId = req.session.user.id;

    const sql = `UPDATE accounts SET name = ?, email = ?, contact = ? WHERE id = ?`;
    conn.query(sql, [name, email, contact, userId], (err) => {
        if (err) {
            req.session.alert = { type: 'error', message: 'Failed to update profile' };
            return res.redirect('/admin/settings');
        }
        req.session.user.name = name;
        req.session.user.email = email;
        req.session.user.contact = contact;
        req.session.alert = {
            type: 'success',
            message: 'Profile updated successfully'
        };
        res.redirect('/admin/settings');
    });
});

app.post('/admin/changePassword', isAuthenticated, (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.session.user.id;

    if (newPassword !== confirmPassword) {
        req.session.alert = { type: 'error', message: 'New passwords do not match' };
        return res.redirect('/admin/settings');
    }

    const sql = `SELECT password FROM accounts WHERE id = ?`;
    conn.query(sql, [userId], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            const current = results[0].password;
            if (current !== currentPassword) {
                req.session.alert = {
                    type: 'error',
                    message: 'Current password is incorrect'
                };
                return res.redirect('/admin/settings');
            }

            const updateSql = `UPDATE accounts SET password = ? WHERE id = ?`;
            conn.query(updateSql, [newPassword, userId], (err) => {
                if (err) throw err;
                req.session.alert = {
                    type: 'success',
                    message: 'Password updated successfully'
                };

                res.redirect('/admin/settings');
            });
        }
    });
});

app.post('/admin/reservations/:id/approve', (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE reservations SET status = 'Approved' WHERE id = ?`;
    conn.query(sql, [id], (err, result) => {
        if (err) throw err;
        req.session.alert = {
            type: 'success',
            message: 'Reservation approved successfully'
        };
        res.redirect('/admin/reservations');
    });
});

app.post('/admin/reservations/:id/reject', (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE reservations SET status = 'Rejected' WHERE id = ?`;
    conn.query(sql, [id], (err, result) => {
        if (err) throw err;
        req.session.alert = {
            type: 'success',
            message: 'Reservation rejected successfully'
        };
        res.redirect('/admin/reservations');
    });
});

// Route to get reservations JSON
app.get('/admin/dashboard/reservations', (req, res) => {
    const sql = `
        SELECT r.id, r.type, r.date, r.time, r.status, s.name AS student_name
        FROM reservations r
        JOIN students s ON r.user_id = s.id
    `;
    conn.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});


//Admin
app.get('/admin/dashboard', isAuthenticated, (req, res, next) => {
    if (req.session.user.role !== 'Admin') return res.redirect('/login');

    const alert = req.session.alert;
    delete req.session.alert;

    let totalFacilities = 0;
    let todayReservations = 0;
    let totalStudents = 0;
    let totalFeedbacks = 0;

    conn.query('SELECT COUNT(*) AS count FROM facilities', (err, result1) => {
        if (err) return next(err);
        totalFacilities = result1[0].count;

        conn.query('SELECT COUNT(*) AS count FROM reservations WHERE DATE(date) = CURDATE()', (err, result2) => {
            if (err) return next(err);
            todayReservations = result2[0].count;

            conn.query('SELECT COUNT(*) AS count FROM accounts WHERE role = "Student"', (err, result3) => {
                if (err) return next(err);
                totalStudents = result3[0].count;

                conn.query('SELECT COUNT(*) AS count FROM feedbacks', (err, result4) => {
                    if (err) return next(err);
                    totalFeedbacks = result4[0].count;

                    const display = `SELECT r.*, a.name AS student_name FROM reservations r JOIN accounts a ON r.user_id = a.id ORDER BY r.date DESC LIMIT 10`;
                    conn.query(display, (err, reservations) => {
                        if (err) return next(err);

                        const facilityChartQuery = `SELECT type, COUNT(*) AS count FROM reservations GROUP BY type`;
                        conn.query(facilityChartQuery, (err, facilityStats) => {
                            if (err) return next(err);

                            const dailyChartQuery = `
                            SELECT DATE(date) AS day, COUNT(*) AS count
                            FROM reservations
                            WHERE date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
                            GROUP BY DATE(date)
                            ORDER BY DATE(date);
                            `;
                            conn.query(dailyChartQuery, (err, dailyStats) => {
                                if (err) return next(err);

                                return res.render('admin/dashboard', {
                                    user: req.session.user,
                                    alert,
                                    totalFacilities,
                                    todayReservations,
                                    totalStudents,
                                    totalFeedbacks,
                                    reservations,
                                    facilityStats,
                                    dailyStats
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});


app.get('/admin/facility_mgnt', isAuthenticated, (req, res, next) => {
    if (req.session.user.role !== 'Admin') {
        return res.redirect('/login');
    }

    const alert = req.session.alert;
    delete req.session.alert;

    const display = `SELECT * FROM facilities`;
    conn.query(display, (err, results) => {
        if (err) return next(err);
        return res.render('admin/facility_mgnt', { facilities: results, alert, user: req.session.user });
    });
});

app.get('/admin/reservations', isAuthenticated, (req, res) => {
    if (req.session.user.role !== 'Admin') {
        return res.redirect('/login');
    }

    const alert = req.session.alert;
    delete req.session.alert;

    const display = `SELECT r.*, a.name AS student_name FROM reservations r JOIN accounts a ON r.user_id = a.id ORDER BY r.date DESC`;
    conn.query(display, (err, results) => {
        if (err) return next(err);
        return res.render('admin/reservations', { reservations: results, alert, user: req.session.user });
    });
});

app.get('/admin/stud_records', isAuthenticated, (req, res, next) => {
    if (req.session.user.role !== 'Admin') {
        return res.redirect('/login');
    }
    const alert = req.session.alert;
    delete req.session.alert;

    const display = `SELECT * FROM accounts WHERE role = 'Student'`;
    conn.query(display, (err, results) => {
        if (err) return next(err);
        return res.render('admin/stud_records', { students: results, alert, user: req.session.user });
    });
});

app.get('/admin/analytics', isAuthenticated, (req, res) => {
    if (req.session.user.role !== 'Admin') {
        return res.redirect('/login');
    }
    const success = req.query.login === 'success';

    res.render('admin/analytics', { success, user: req.session.user });
});

app.get('/admin/feedbacks', isAuthenticated, (req, res, next) => {
    if (req.session.user.role !== 'Admin') return res.redirect('/login');

    const sql = `SELECT f.*, a.name AS student_name FROM feedbacks f JOIN accounts a ON f.user_id = a.id ORDER BY f.created_at DESC`;

    conn.query(sql, (err, feedbacks) => {
        if (err) return next(err);

        let positiveCount = 0, negativeCount = 0, suggestionsCount = 0;
        let totalRating = 0;

        feedbacks.forEach(fb => {
            if (fb.rating >= 4) positiveCount++;
            else if (fb.rating <= 2) negativeCount++;
            if (fb.suggestions && fb.suggestions.trim() !== '') suggestionsCount++;
            totalRating += fb.rating;
        });

        const insights = feedbacks.length > 0 ? (totalRating / feedbacks.length).toFixed(1) : 0;

        res.render('admin/feedbacks', {
            feedbacks,
            stats: { positiveCount, negativeCount, suggestionsCount, insights },
            user: req.session.user
        });
    });
});

app.get('/admin/settings', isAuthenticated, (req, res) => {
    if (req.session.user.role !== 'Admin') {
        return res.redirect('/login');
    }
    const success = req.query.login === 'success';
    const alert = req.session.alert;
    delete req.session.alert;
    res.render('admin/settings', { success, user: req.session.user, alert });
});


//Student Function
app.post('/studentReservation', isAuthenticated, (req, res, next) => {
    if (req.session.user.role !== 'Student') return res.redirect('/login');
    const { type, date, time } = req.body;
    const userId = req.session.user.id;
    const sql = `INSERT INTO reservations (user_id, type, date, time, status) VALUES (?, ?, ?, ?, 'Pending')`;
    conn.query(sql, [userId, type, date, time], (err, results) => {
        if (err) {
            req.session.alert = {
                type: 'error',
                message: 'Reservation not successs. Try again.'
            }
            return res.redirect('/student/student_db');
        }
        req.session.alert = {
            type: 'success',
            message: 'Reservation sucess. Wait for the approval.'
        }
        return res.redirect('/student/student_db');
    });
});

app.post('/cancelReservation', isAuthenticated, (req, res, next) => {
    if (req.session.user.role !== 'Student') return res.redirect('/login');
    const { reservation_id } = req.body;
    const sql = `UPDATE reservations SET status = 'Cancelled' WHERE id = ? AND user_id = ?`;
    conn.query(sql, [reservation_id, req.session.user.id], (err, results) => {
        if (err) {
            req.session.alert = {
                type: 'error',
                message: 'Failed to cancel reservation. Try again.'
            };
            return res.redirect('/student/student_db');
        }

        req.session.alert = {
            type: 'success',
            message: 'Reservation canceled successfully!'
        }
        return res.redirect('/student/student_db');
    });
});

app.post('/student/addFeedback', isAuthenticated, (req, res) => {
    const { rating, service_quality, facility_cleanliness, comments, suggestions } = req.body;
    const userId = req.session.user.id;

    if (!rating || !service_quality || !facility_cleanliness || !comments) {
        req.session.alert = {
            type: 'error',
            title: 'Incomplete Form',
            message: 'Please fill in all required fields.'
        };
        return res.redirect('/student/dashboard');
    }

    const sql = `INSERT INTO feedbacks (user_id, rating, service_quality, facility_cleanliness, comments, suggestions) VALUES (?, ?, ?, ?, ?, ?)`;

    conn.query(sql, [userId, rating, service_quality, facility_cleanliness, comments, suggestions], (err, result) => {
        if (err) {
            console.error(err);
            req.session.alert = {
                type: 'error',
                title: 'Error',
                message: 'Failed to submit feedback.'
            };
            return res.redirect('/student/student_db');
        }

        req.session.alert = {
            type: 'success',
            title: 'Feedback Submitted',
            message: 'Thank you for your feedback!'
        };
        return res.redirect('/student/student_db');
    });
});


//Students
app.get('/student/student_db', isAuthenticated, (req, res, next) => {
    if (req.session.user.role !== 'Student') {
        return res.redirect('/login');
    }

    const alert = req.session.alert;
    delete req.session.alert;

    const displayReservations = `SELECT * FROM reservations WHERE user_id = ? ORDER BY date DESC`;
    conn.query(displayReservations, [req.session.user.id], (err, results) => {
        if (err) return next(err);
        return res.render('student/student_db', { bookings: results, alert, user: req.session.user });
    });

});

app.get('/student/reservations', isAuthenticated, (req, res, next) => {
    if (req.session.user.role !== 'Student')
        return res.redirect('/login');
    const displayReservations = `SELECT * FROM reservations WHERE user_id = ? ORDER BY date DESC`;
    conn.query(displayReservations, [req.session.user.id], (err, results) => {
        if (err) return next(err);
        return res.render('student/reservations', { bookings: results, user: req.session.user });
    });
});

app.get('/student/feedbacks', isAuthenticated, (req, res, next) => {
    if (req.session.user.role !== 'Student') return res.redirect('/login');

    const alert = req.session.alert;
    delete req.session.alert;

    const displayFeedbacks = `SELECT * FROM feedbacks WHERE user_id = ? ORDER BY created_at DESC`;
    conn.query(displayFeedbacks, [req.session.user.id], (err, feedbacks) => {
        if (err) return next(err);

        res.render('student/feedbacks', { feedbacks, alert, user: req.session.user });
    });
});

app.listen(8000, () => {
    console.log("Listening to this port");
})
