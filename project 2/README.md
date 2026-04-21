<<<<<<< HEAD
<<<<<<< HEAD
# Task 15: Service Registry and Discovery using Netflix Eureka

## Project Structure

```
eureka-full/
├── eureka-server/          → Eureka Registry Server (Port: 8761)
├── student-service/        → Student Microservice  (Port: 8081)
└── course-service/         → Course Microservice   (Port: 8082)
```

## How to Run

### Step 1: Start Eureka Server
```
cd eureka-server
mvn spring-boot:run
```
Open: http://localhost:8761

### Step 2: Start Student Service
```
cd student-service
mvn spring-boot:run
```
Test: http://localhost:8081/students

### Step 3: Start Course Service
```
cd course-service
mvn spring-boot:run
```
Test: http://localhost:8082/courses

## Expected Output

- Eureka Dashboard (http://localhost:8761) shows:
  - STUDENT-SERVICE → UP
  - COURSE-SERVICE  → UP

- http://localhost:8081/students → "Student Service Running Successfully"
- http://localhost:8082/courses  → "Course Service Running Successfully"

## Technologies Used
- Java JDK 17
- Spring Boot 3.2.0
- Spring Cloud 2023.0.0
- Netflix Eureka Server & Client
- Maven
=======
# full-stack-development
>>>>>>> 572fe3b7bfbd98d28c2ac2b376eb27b8fa20425d
=======
# 🏛 ClubHub — Student Event Management System

Full-stack app: **React + Vite** frontend · **Node.js + Express** backend · **MySQL** database

---

## 📁 Project Structure

```
clubhub/
├── backend/
│   ├── server.js        ← Express REST API
│   ├── schema.sql       ← MySQL schema + seed data
│   ├── package.json
│   └── .env             ← DB credentials (edit this)
└── frontend/
    ├── src/
    │   ├── App.jsx              ← Root component
    │   ├── api.js               ← All API calls
    │   ├── utils.js             ← Helpers, constants
    │   ├── index.css
    │   ├── main.jsx
    │   └── components/
    │       ├── UI.jsx           ← Reusable UI parts
    │       ├── BrowseEvents.jsx ← Student event listing + register
    │       ├── RegistrationsView.jsx ← Admin: who registered
    │       ├── EventsManager.jsx     ← Admin: edit events + price
    │       └── SQLTerminal.jsx       ← Admin: raw SQL queries
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## ⚙️ Prerequisites

- **Node.js** v18+  →  https://nodejs.org
- **MySQL** 8.0+   →  https://dev.mysql.com/downloads/

---

## 🚀 Setup (Step by Step)

### 1. Create the MySQL Database

Open MySQL and run the schema file:

```bash
mysql -u root -p < backend/schema.sql
```

Or paste the contents of `backend/schema.sql` into MySQL Workbench and execute it.

### 2. Configure Database Credentials

Edit `backend/.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
DB_NAME=clubhub_db
PORT=5000
```

### 3. Install & Start the Backend

```bash
cd backend
npm install
npm run dev        # uses nodemon (auto-restarts on save)
# or: npm start   (production)
```

You should see:
```
✅ ClubHub API running on http://localhost:5000
```

Test it: http://localhost:5000/api/health

### 4. Install & Start the Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

Open: **http://localhost:3000**

---

## 🎯 Features

| Tab | Who | What |
|-----|-----|------|
| Browse Events | Students | See all events, registration count, price, register |
| My Events | Students | View your own registrations |
| Admin → Registrations | Admin | Full table of all registered students per event |
| Admin → Events & Pricing | Admin | Edit event details, change price inline |
| Admin → SQL Terminal | Admin | Run raw MySQL queries live |

### Changing Event Price (3 ways)

**1. Click the price badge** in Events & Pricing tab → type new value → Enter

**2. SQL Terminal:**
```sql
UPDATE events SET price = 350 WHERE id = 'e4'
```

**3. API call:**
```bash
curl -X PATCH http://localhost:5000/api/events/e4 \
  -H "Content-Type: application/json" \
  -d '{"price": 350}'
```

---

## 🗄️ MySQL Schema

```sql
events         (id, title, club, category, event_date, event_time, venue, capacity, price, ...)
students       (student_id, full_name, email, phone, year_of_study, department, ...)
registrations  (reg_id, event_id, student_id, registered_at)
```

**Views available:**
- `v_registrations` — joined view of all registrations with student + event info
- `v_event_summary` — events with registered count, seats left, fill percentage

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | All events with registration count |
| POST | `/api/events` | Create new event |
| PATCH | `/api/events/:id` | Update event (incl. price) |
| DELETE | `/api/events/:id` | Delete event + cascade registrations |
| GET | `/api/registrations` | All registrations (joined) |
| GET | `/api/registrations?event_id=e1` | Filter by event |
| POST | `/api/registrations` | Register a student |
| DELETE | `/api/registrations/:reg_id` | Remove a registration |
| GET | `/api/students` | All students |
| GET | `/api/stats` | Summary stats |
| POST | `/api/sql` | Run raw SQL (admin) |
| GET | `/api/health` | DB connection check |
>>>>>>> f538e67 (Add ClubHub fullstack project - Project 2)
