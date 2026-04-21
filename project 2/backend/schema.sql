-- ============================================================
--  ClubHub Database Schema + Seed Data
--  Run: mysql -u root -p < schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS clubhub_db;
USE clubhub_db;

-- ── Tables ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS events (
    id           VARCHAR(20)    PRIMARY KEY,
    title        VARCHAR(120)   NOT NULL,
    club         VARCHAR(80)    NOT NULL,
    category     VARCHAR(40)    NOT NULL,
    event_date   DATE           NOT NULL,
    event_time   TIME           NOT NULL,
    venue        VARCHAR(120)   NOT NULL,
    capacity     INT            NOT NULL DEFAULT 30,
    price        DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
    description  TEXT,
    color        VARCHAR(10)    DEFAULT '#6366F1',
    emoji        VARCHAR(10)    DEFAULT '🎯',
    created_at   DATETIME       DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
    student_id    VARCHAR(20)   PRIMARY KEY,
    full_name     VARCHAR(100)  NOT NULL,
    email         VARCHAR(100)  UNIQUE NOT NULL,
    phone         VARCHAR(15),
    year_of_study VARCHAR(20),
    department    VARCHAR(60),
    created_at    DATETIME      DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS registrations (
    reg_id        INT           PRIMARY KEY AUTO_INCREMENT,
    event_id      VARCHAR(20)   NOT NULL,
    student_id    VARCHAR(20)   NOT NULL,
    registered_at DATETIME      DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id)    REFERENCES events(id)   ON DELETE CASCADE,
    FOREIGN KEY (student_id)  REFERENCES students(student_id) ON DELETE CASCADE,
    UNIQUE KEY uq_event_student (event_id, student_id)
);

-- ── Seed: Events ──────────────────────────────────────────────────────────────

INSERT INTO events (id, title, club, category, event_date, event_time, venue, capacity, price, description, color, emoji) VALUES
('e1', 'Golden Hour Shoot',              'Photography Club', 'Photography', '2026-04-05', '17:30:00', 'Rooftop Terrace, Block C',    20,   0.00, 'Capture campus bathed in golden light. All skill levels welcome.',                    '#F59E0B', '📷'),
('e2', 'Line-Follower Bot Championship', 'Robotics Society', 'Tech',        '2026-04-12', '10:00:00', 'Engineering Lab 2B',           30, 150.00, 'Build and race autonomous line-follower bots. Prize money for top 3 teams.',        '#6366F1', '🤖'),
('e3', 'Open Mic Poetry Night',          'Literary Society', 'Arts',        '2026-04-18', '18:00:00', 'Auditorium Foyer',             60,   0.00, 'Share your words or just listen. Original poetry, spoken word, even prose.',       '#EC4899', '🎤'),
('e4', '48-Hour Hackathon',              'Coding Club',      'Tech',        '2026-04-25', '09:00:00', 'Innovation Hub',               80, 200.00, 'Form teams of 2-4, pick a problem, ship a solution. Mentors and snacks on us.',    '#10B981', '💻'),
('e5', 'Contemporary Fusion Workshop',   'Dance Society',    'Dance',       '2026-05-03', '15:00:00', 'Studio A, Sports Complex',     25, 100.00, 'Blend bharatanatyam with contemporary movement. Professional choreographer.',      '#F97316', '💃'),
('e6', 'Meteor Shower Night',            'Astronomy Club',   'Science',     '2026-05-10', '21:00:00', 'Open Ground, North Campus',    50,   0.00, 'Track the Eta Aquariids with club telescopes. Hot chai and star maps provided.',   '#8B5CF6', '🔭')
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- ── Seed: Students ────────────────────────────────────────────────────────────

INSERT INTO students (student_id, full_name, email, phone, year_of_study, department) VALUES
('s001', 'Ananya Krishnan',  'ananya@college.edu',  '9876543210', '2nd Year', 'Computer Science'),
('s002', 'Rohan Mehta',      'rohan@college.edu',   '9123456789', '3rd Year', 'Electronics'),
('s003', 'Priya Sharma',     'priya@college.edu',   '9988776655', '1st Year', 'Mechanical'),
('s004', 'Vikram Nair',      'vikram@college.edu',  '9871234560', '4th Year', 'Electronics'),
('s005', 'Deepika Rao',      'deepika@college.edu', '9765432100', '2nd Year', 'Computer Science'),
('s006', 'Arjun Patel',      'arjun@college.edu',   '9654321098', '3rd Year', 'Civil'),
('s007', 'Kavya Iyer',       'kavya@college.edu',   '9543210987', '1st Year', 'IT'),
('s008', 'Siddharth Gupta',  'sid@college.edu',     '9432109876', '2nd Year', 'Arts'),
('s009', 'Meera Pillai',     'meera@college.edu',   '9321098765', '3rd Year', 'Commerce'),
('s010', 'Aditya Kumar',     'aditya@college.edu',  '9210987654', '4th Year', 'Computer Science'),
('s011', 'Sneha Reddy',      'sneha@college.edu',   '9109876543', '2nd Year', 'IT'),
('s012', 'Karan Singh',      'karan@college.edu',   '9998877665', '1st Year', 'Electronics'),
('s013', 'Lakshmi Nambiar',  'lakshmi@college.edu', '9887766554', '3rd Year', 'Physics'),
('s014', 'Rahul Verma',      'rahul@college.edu',   '9776655443', '2nd Year', 'Astronomy')
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

-- ── Seed: Registrations ───────────────────────────────────────────────────────

INSERT IGNORE INTO registrations (event_id, student_id, registered_at) VALUES
('e1','s001','2026-03-10 09:15:00'),
('e1','s002','2026-03-11 14:30:00'),
('e1','s003','2026-03-12 11:00:00'),
('e2','s004','2026-03-08 10:20:00'),
('e2','s005','2026-03-09 16:45:00'),
('e2','s006','2026-03-10 08:30:00'),
('e2','s007','2026-03-11 12:00:00'),
('e3','s008','2026-03-15 09:00:00'),
('e3','s009','2026-03-16 11:30:00'),
('e4','s010','2026-03-18 14:00:00'),
('e4','s011','2026-03-19 10:15:00'),
('e4','s012','2026-03-20 08:45:00'),
('e6','s013','2026-03-22 15:00:00'),
('e6','s014','2026-03-22 16:30:00');

-- ── Useful Views ──────────────────────────────────────────────────────────────

CREATE OR REPLACE VIEW v_registrations AS
SELECT
    r.reg_id,
    r.registered_at,
    s.student_id,
    s.full_name,
    s.email,
    s.phone,
    s.year_of_study,
    s.department,
    e.id          AS event_id,
    e.title       AS event_title,
    e.club,
    e.category,
    e.price,
    e.color,
    e.emoji
FROM registrations r
JOIN students s ON r.student_id = s.student_id
JOIN events   e ON r.event_id   = e.id;

CREATE OR REPLACE VIEW v_event_summary AS
SELECT
    e.id,
    e.title,
    e.club,
    e.category,
    e.event_date,
    e.event_time,
    e.venue,
    e.capacity,
    e.price,
    COUNT(r.reg_id)                  AS registered,
    e.capacity - COUNT(r.reg_id)     AS seats_left,
    ROUND(COUNT(r.reg_id) / e.capacity * 100, 1) AS fill_pct
FROM events e
LEFT JOIN registrations r ON e.id = r.event_id
GROUP BY e.id;
