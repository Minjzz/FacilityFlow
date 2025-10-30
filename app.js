const express = require('express');
const session = require('express-session');
const multer = require('multer');
const conn = require('./conn');
const app = express();
const path = require('path');
const fs = require('fs');
const { title } = require('process');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'ifacility-secret',
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

function buildBookingEndDate(booking) {
    let dateObj;
    if (booking.date instanceof Date) {
        dateObj = booking.date;
    } else {
        dateObj = new Date(booking.date); 
    }

    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();
    const day = dateObj.getDate();

    const timeParts = (booking.end_time || '').split(':');
    const hour = parseInt(timeParts[0]) || 0;
    const minute = parseInt(timeParts[1]) || 0;
    const second = parseInt(timeParts[2]) || 0;

    return new Date(year, month, day, hour, minute, second);
}

function localYYYYMMDD(dateObj = new Date()) {
  const d = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}


app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

//Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;
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

app.post('/addFacility', (req, res, next) => {
    const { name, type, capacity, status } = req.body;

    const sql = `INSERT INTO facilities (name, type, capacity, status) VALUES (?, ?, ?, ?)`;
    conn.query(sql, [name, type, capacity, status], (err, results) => {
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

// Update facility
app.post('/updateFacility', (req, res) => {
    const { id, name, type, capacity, status } = req.body;

    const sql = `UPDATE facilities SET name = ?, type = ?, capacity = ?, status = ? WHERE id = ?`;

    conn.query(sql, [name, type, capacity, status, id], (err, result) => {
        if (err) {
            req.session.alert = { 
                type: 'error', 
                message: 'Failed to update facility.' 
            };
            return res.redirect('/admin/facility_mgnt');
        }

        req.session.alert = { 
            type: 'success', 
            message: 'Facility updated successfully.' 
        };
        res.redirect('/admin/facility_mgnt');
    });
});


//DELETE Facility
app.post('/deleteFacility', (req, res) => {
    const facilityId = req.body.id; // from hidden input

    const sql = 'DELETE FROM facilities WHERE id = ?';
    conn.query(sql, [facilityId], (err, result) => {
        if (err) {
            console.error(err);
            req.session.alert = {
                type: 'error',
                title: 'Error',
                message: 'Failed to delete facility.'
            };
            return res.redirect('/admin/facility_mgnt'); 
        }

        req.session.alert = {
            type: 'success',
            title: 'Deleted',
            message: 'Facility has been successfully deleted.'
        };
        res.redirect('/admin/facility_mgnt');
    });
});

//Add Student
app.post('/addStudent', (req, res) => {
    const { id_num, name, year, email, password, status } = req.body;
    const sql = `INSERT INTO users (id_num, name, year, email, password, status, role) VALUES (?, ?, ?, ?, ?, ?, 'Student')`;
    conn.query(sql, [id_num, name, year, email, password, status], (err, results) => {
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

app.post('/updateStudent', (req, res) => {
    const { id, id_num, name, year, email, status } = req.body;
    const sql = 'UPDATE users SET id_num=?, name=?, year=?, email=?, status=? WHERE id=?';
    conn.query(sql, [id_num, name, year, email, status, id], (err, result) => {
        if (err) {
            req.session.alert = {
                type: 'error',
                message: 'Failed to update student. Try again.'
            }
            return res.redirect('/admin/stud_records')
        }
        req.session.alert = {
            type: 'success',
            title:'Updated',
            message: 'Student updated successfully!'
        }
        res.redirect('/admin/stud_records');
    });
});

app.post('/deleteStudent', (req, res) => {
    const { id } = req.body;
    conn.query('DELETE FROM users WHERE id=?', [id], (err, result) => {
        if (err) {
            req.session.alert = {
                type: 'error',
                message: 'Failed to update student. Try again.'
            }
            return res.redirect('/admin/stud_records')
        }
        req.session.alert = { 
            type: 'success', 
            title: 'Deleted', 
            message: 'Student deleted successfully!' 
        };
        res.redirect('/admin/stud_records');
    });
});

app.post('/admin/updateProfile', isAuthenticated, (req, res) => {
    const { name, email } = req.body;
    const userId = req.session.user.id;

    const sql = `UPDATE users SET name = ?, email = ? WHERE id = ?`;
    conn.query(sql, [name, email, userId], (err) => {
        if (err) {
            req.session.alert = { type: 'error', message: 'Failed to update profile' };
            return res.redirect('/admin/settings');
        }
        req.session.user.name = name;
        req.session.user.email = email;
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

    const sql = `SELECT password FROM users WHERE id = ?`;
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

            const updateSql = `UPDATE users SET password = ? WHERE id = ?`;
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

app.post('/admin/reservations/approve/:request_id', isAuthenticated, (req, res) => {
    if (req.session.user.role !== 'Admin') return res.redirect('/login');

    const requestId = req.params.request_id;

    const getReservationSql = `SELECT * FROM reservations WHERE request_id = ?`;
    conn.query(getReservationSql, [requestId], (err, reservations) => {
        if (err || reservations.length === 0) {
            req.session.alert = { type: 'error', message: 'Reservation not found.' };
            return res.redirect('/admin/reservations');
        }

        const booking = reservations[0];

        const getFacilitySql = `SELECT * FROM facilities WHERE id = ?`;
        conn.query(getFacilitySql, [booking.facility_id], (err2, facilities) => {
            if (err2 || facilities.length === 0) {
                req.session.alert = { type: 'error', message: 'Facility not found.' };
                return res.redirect('/admin/reservations');
            }

            const facility = facilities[0];

            const bookingDate = new Date(booking.date);
            const [endHour, endMinute, endSecond = 0] = (booking.end_time || '00:00:00').split(':').map(Number);
            const bookingEnd = new Date(
                bookingDate.getFullYear(),
                bookingDate.getMonth(),
                bookingDate.getDate(),
                endHour,
                endMinute,
                endSecond
            );
            const now = new Date();

            let newStatus;
            if (now > bookingEnd && booking.status === 'Pending') {
                newStatus = 'Completed';
            } else {
                newStatus = 'Approved';
            }

            const updateReservationSql = `UPDATE reservations SET status = ? WHERE request_id = ?`;
            conn.query(updateReservationSql, [newStatus, requestId], (err3) => {
                if (err3) {
                    req.session.alert = { type: 'error', message: 'Failed to update reservation status.' };
                    return res.redirect('/admin/reservations');
                }

                if (newStatus === 'Approved') {
                    conn.query('UPDATE facilities SET occupation = occupation + 1 WHERE id = ?', [facility.id], (err4) => {
                        if (err4) console.error(err4);
                    });
                } else if (newStatus === 'Completed' && booking.status === 'Pending') {
                    conn.query('UPDATE facilities SET occupation = CASE WHEN occupation > 0 THEN occupation - 1 ELSE 0 END WHERE id = ?', [facility.id], (err4) => {
                        if (err4) console.error(err4);
                    });
                }

                req.session.alert = {
                    type: 'success',
                    message: newStatus === 'Completed'
                        ? 'Reservation time has passed — automatically marked as Completed and occupation decreased.'
                        : 'Reservation approved successfully and facility occupation updated.'
                };
                return res.redirect('/admin/reservations');
            });
        });
    });
});

app.post('/admin/reservations/reject/:request_id', (req, res) => {
    const requestId = req.params.request_id; 
    const sql = `UPDATE reservations SET status = 'Rejected' WHERE request_id = ?`;
    
    conn.query(sql, [requestId], (err, result) => {
        if (err) {
            console.error(err);
            req.session.alert = {
                type: 'error',
                message: 'Failed to reject reservation'
            };
            return res.redirect('/admin/reservations');
        }

        req.session.alert = {
            type: 'success',
            message: 'Reservation rejected successfully'
        };
        res.redirect('/admin/reservations');
    });
});


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

            conn.query('SELECT COUNT(*) AS count FROM users WHERE role = "Student"', (err, result3) => {
                if (err) return next(err);
                totalStudents = result3[0].count;

                conn.query('SELECT COUNT(*) AS count FROM feedbacks', (err, result4) => {
                    if (err) return next(err);
                    totalFeedbacks = result4[0].count;

                    const display = `SELECT r.*, a.name AS student_name FROM reservations r JOIN users a ON r.user_id = a.id ORDER BY r.date DESC LIMIT 10`;
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
    updateExpiredReservations();

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

    const display = `SELECT r.*, a.name AS student_name FROM reservations r JOIN users a ON r.user_id = a.id ORDER BY r.date DESC`;
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

    const display = `SELECT * FROM users WHERE role = 'Student'`;
    conn.query(display, (err, results) => {
        if (err) return next(err);
        return res.render('admin/stud_records', { students: results, alert, user: req.session.user });
    });
});

app.get('/admin/analytics', isAuthenticated, (req, res) => {
    if (req.session.user.role !== 'Admin') {
        return res.redirect('/login');
    }

    let analyticsData = {};

    conn.query('SELECT COUNT(*) AS activeUsers FROM users WHERE role = "Student"', (err, users) => {
        if (err) return res.status(500).send(err);
        analyticsData.activeUsers = users[0].activeUsers;

        conn.query(`
            SELECT COUNT(*) AS bookingsThisWeek 
            FROM reservations 
            WHERE YEARWEEK(date, 1) = YEARWEEK(CURDATE(), 1)
        `, (err, bookings) => {
            if (err) return res.status(500).send(err);
            analyticsData.bookingsThisWeek = bookings[0].bookingsThisWeek;

            conn.query(`
                SELECT ROUND(AVG(TIMESTAMPDIFF(MINUTE, start_time, end_time)) / 60, 2) AS avgUsageTime
                FROM reservations
            `, (err, avgUsage) => {
                if (err) return res.status(500).send(err);
                analyticsData.avgUsageTime = avgUsage[0].avgUsageTime || 0;

                conn.query(`
                    SELECT COUNT(*) AS thisWeek FROM reservations
                    WHERE YEARWEEK(date,1) = YEARWEEK(CURDATE(),1)
                `, (err, thisWeek) => {
                    if (err) return res.status(500).send(err);

                    conn.query(`
                        SELECT COUNT(*) AS lastWeek FROM reservations
                        WHERE YEARWEEK(date,1) = YEARWEEK(CURDATE(),1)-1
                    `, (err, lastWeek) => {
                        if (err) return res.status(500).send(err);

                        const last = lastWeek[0].lastWeek;
                        const current = thisWeek[0].thisWeek;
                        analyticsData.usageGrowth = last === 0 ? 100 : Math.round(((current - last) / last) * 100);

                        conn.query(`
                            SELECT MONTH(date) AS month, COUNT(*) AS count
                            FROM reservations
                            GROUP BY MONTH(date)
                            ORDER BY MONTH(date)
                        `, (err, monthly) => {
                            if (err) return res.status(500).send(err);

                            const monthlyUsage = Array(12).fill(0);
                            monthly.forEach(row => { monthlyUsage[row.month - 1] = row.count });
                            analyticsData.monthlyUsage = monthlyUsage;

                            conn.query(`
                                SELECT type AS name, COUNT(*) AS count
                                FROM reservations
                                GROUP BY type
                                ORDER BY count DESC
                                LIMIT 5
                            `, (err, topFacilities) => {
                                if (err) return res.status(500).send(err);
                                analyticsData.topFacilities = topFacilities;

                                conn.query(`
                                    SELECT HOUR(start_time) AS hour, COUNT(*) AS count
                                    FROM reservations
                                    GROUP BY HOUR(start_time)
                                    ORDER BY HOUR(start_time)
                                `, (err, hourly) => {
                                    if (err) return res.status(500).send(err);

                                    const hourlyUsage = Array(24).fill(0);
                                    hourly.forEach(row => { hourlyUsage[row.hour] = row.count });
                                    analyticsData.hourlyUsage = hourlyUsage;

                                    res.render('admin/analytics', { analyticsData, user: req.session.user });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

app.get('/admin/feedbacks', isAuthenticated, (req, res, next) => {
    if (req.session.user.role !== 'Admin') return res.redirect('/login');

    const sql = `SELECT f.*, a.name AS student_name FROM feedbacks f JOIN users a ON f.user_id = a.id ORDER BY f.created_at DESC`;

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

app.post('/studentReservation', isAuthenticated, (req, res) => {
    if (req.session.user.role !== 'Student') return res.redirect('/login');

    let { facility_id, name, type, time } = req.body; 
    const userId = req.session.user.id;

    if (!facility_id || !name || !type || !time) {
        console.log(req.body);
        return res.send('Missing data');
    }

    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const date = `${yyyy}-${mm}-${dd}`; 

    conn.query('SELECT * FROM facilities WHERE id = ?', [facility_id], (err, results) => {
        if (err) throw err;
        if (results.length === 0) return res.send('Invalid facility ID');

        const requestId = 'REQ-' + Math.random().toString(36).substring(2, 10).toUpperCase();
        const [start_time, end_time] = time.split('-');

        const sql = `
            INSERT INTO reservations 
            (user_id, facility_id, request_id, name, type, date, start_time, end_time, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [userId, facility_id, requestId, name, type, date, start_time, end_time, 'Pending'];

        conn.query(sql, values, (err2) => {
            if (err2) throw err2;
            req.session.alert = {
                type: 'success',
                title: 'Reserved!',
                message: `${name} has been reserved successfully. Waiting for admin approval.`
            };
            res.redirect('/student/student_db');
        });
    });
});

app.post('/cancelReservation', isAuthenticated, (req, res, next) => {
    if (req.session.user.role !== 'Student') return res.redirect('/login');
    const { reservation_id } = req.body;

    conn.query('SELECT * FROM reservations WHERE id = ? AND user_id = ?', [reservation_id, req.session.user.id], (err, results) => {
        if (err) throw err;
        if (!results[0]) return res.send('Reservation not found');

        const reservation = results[0];

        if (reservation.status === 'Approved') {
            conn.query('UPDATE facilities SET occupation = CASE WHEN occupation > 0 THEN occupation - 1 ELSE 0 END WHERE id = ?', [reservation.facility_id], (err) => {
                if (err) console.error(err);
            });
        }

        conn.query('UPDATE reservations SET status = "Cancelled" WHERE id = ?', [reservation_id], (err) => {
            if (err) throw err;

            req.session.alert = {
                type: 'success',
                message: 'Reservation canceled successfully!'
            };
            res.redirect('/student/student_db');
        });
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


function updateExpiredReservations() {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0];

    const sql = `
        UPDATE reservations r
        JOIN facilities f ON r.facility_id = f.id
        SET 
            r.status = 'Completed',
            f.occupation = CASE 
                WHEN f.occupation > 0 THEN f.occupation - 1
                ELSE 0
            END
        WHERE 
            r.status = 'Pending'
            AND (r.date < ? OR (r.date = ? AND r.end_time < ?))
    `;

    conn.query(sql, [currentDate, currentDate, currentTime], (err, result) => {
        if (err) console.error('Error updating expired reservations:', err);
    });
}

//Students
app.get('/student/student_db', isAuthenticated, (req, res, next) => {
    if (req.session.user.role !== 'Student') return res.redirect('/login');

    const alert = req.session.alert;
    delete req.session.alert;
    updateExpiredReservations();

    // Add 'status' to the SELECT statement
    const getFacilities = `
    SELECT f.id, f.name, f.type, f.capacity, f.occupation, f.status,
        COALESCE(SUM(CASE WHEN r.status='Approved' AND DATE(r.date)=CURDATE() THEN 1 ELSE 0 END),0) AS current_occupation
    FROM facilities f
    LEFT JOIN reservations r ON r.facility_id = f.id
    GROUP BY f.id, f.name, f.type, f.capacity, f.occupation, f.status
    `;
    
    conn.query(getFacilities, (err, facilities) => {
        if (err) return next(err);

        const displayReservations = `
            SELECT r.*, f.name, f.type 
            FROM reservations r
            JOIN facilities f ON r.facility_id = f.id 
            WHERE r.user_id = ? 
            AND r.status = 'Approved' 
            AND DATE(r.date) = CURDATE() 
            ORDER BY r.start_time ASC`;

        conn.query(displayReservations, [req.session.user.id], (err2, bookings) => {
            if (err2) return next(err2);

            if (bookings.length === 0) {
                return res.render('student/student_db', { 
                    user: req.session.user, 
                    alert, 
                    facilities, 
                    bookings: [] 
                });
            }

            const now = new Date();
            let validBookings = [];
            let processed = 0;

            bookings.forEach(booking => {
                const bookingEnd = buildBookingEndDate(booking);

                if (bookingEnd < now) {
                    const updateSql = `
                        UPDATE reservations r
                        JOIN facilities f ON r.facility_id = f.id
                        SET 
                            r.status = 'Completed',
                            f.occupation = CASE WHEN f.occupation > 0 THEN f.occupation - 1 ELSE 0 END
                        WHERE r.id = ?`;

                    conn.query(updateSql, [booking.id], (err3) => {
                        if (err3) {
                            console.error('Failed to complete reservation:', err3);
                        }
                        processed++;
                        
                        if (processed === bookings.length) {
                            res.render('student/student_db', { 
                                user: req.session.user, 
                                alert, 
                                facilities, 
                                bookings: validBookings 
                            });
                        }
                    });
                } else {
                    validBookings.push(booking);
                    processed++;
                    
                    if (processed === bookings.length) {
                        res.render('student/student_db', { 
                            user: req.session.user, 
                            alert, 
                            facilities, 
                            bookings: validBookings 
                        });
                    }
                }
            });
        });
    });
});

app.get('/student/reservations', isAuthenticated, (req, res, next) => {
    if (req.session.user.role !== 'Student') return res.redirect('/login');

    const displayReservations = `SELECT * FROM reservations WHERE user_id = ? ORDER BY date DESC`;
    conn.query(displayReservations, [req.session.user.id], (err, bookings) => {
        if (err) return next(err);

        const now = new Date();

        bookings.forEach(booking => {
            try {
                const bookingEnd = buildBookingEndDate(booking);

                if (bookingEnd < now && booking.status !== 'Completed') {
                    const updateSql = `
                UPDATE reservations r
                JOIN facilities f ON r.facility_id = f.id
                SET 
                r.status = 'Completed',
                f.occupation = CASE WHEN f.occupation > 0 THEN f.occupation - 1 ELSE 0 END
                WHERE r.id = ?
            `;
                    conn.query(updateSql, [booking.id], (err2) => {
                        if (err2) {
                            console.error('Failed to update finished reservation:', err2);
                        } else {
                            booking.status = 'Completed';
                        }
                    });
                }
            } catch (e) {
                console.error('Error processing booking end time:', e, booking);
            }
        });

        return res.render('student/reservations', { bookings, user: req.session.user });
    });
});


app.get('/student/feedbacks', isAuthenticated, (req, res, next) => {
    if (req.session.user.role !== 'Student')
        return res.redirect('/login');
    const alert = req.session.alert;
    delete req.session.alert;

    const displayFeedbacks = `SELECT * FROM feedbacks WHERE user_id = ? ORDER BY created_at DESC`;
    conn.query(displayFeedbacks, [req.session.user.id], (err, feedbacks) => {
        if (err) return next(err);

        res.render('student/feedbacks', { feedbacks, alert, user: req.session.user });
    });
});

setInterval(updateExpiredReservations, 5 * 60 * 1000);

app.listen(8000, () => {
    console.log("Listening to this port");
})
