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
