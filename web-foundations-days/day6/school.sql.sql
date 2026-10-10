-- day6/school.sql

-- 1. CREATE TABLE statements
CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);

CREATE TABLE courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL
);

CREATE TABLE enrolments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    UNIQUE (student_id, course_id) -- Rule preventing the same student enrolling on the same course twice
);

-- 2. INSERT statements (3 students, 3 courses, 5 enrolments)
-- Note: Charlie Brown has no enrolments to successfully demonstrate Query 4
INSERT INTO students (name, email) VALUES 
('Alice Smith', 'alice@example.com'),
('Bob Jones', 'bob@example.com'),
('Charlie Brown', 'charlie@example.com');

INSERT INTO courses (title, code) VALUES 
('Mathematics', 'MATH101'),
('Physics', 'PHYS101'),
('Chemistry', 'CHEM101');

INSERT INTO enrolments (student_id, course_id, grade) VALUES 
(1, 1, 'A'), -- Alice enrolls in Mathematics
(1, 2, 'B'), -- Alice enrolls in Physics
(1, 3, 'A'), -- Alice enrolls in Chemistry
(2, 1, 'C'), -- Bob enrolls in Mathematics
(2, 2, 'B'); -- Bob enrolls in Physics

-- 3. Five Required Queries

-- Query 1: All courses for one student (by name)
SELECT c.title, c.code, e.grade
FROM students s
JOIN enrolments e ON s.id = e.student_id
JOIN courses c ON e.course_id = c.id
WHERE s.name = 'Alice Smith';

-- Query 2: All students on one course
SELECT s.name, s.email, e.grade
FROM courses c
JOIN enrolments e ON c.id = e.course_id
JOIN students s ON e.student_id = s.id
WHERE c.title = 'Mathematics';

-- Query 3: The number of students per course
SELECT c.title, COUNT(e.student_id) AS student_count
FROM courses c
LEFT JOIN enrolments e ON c.id = e.course_id
GROUP BY c.id, c.title;

-- Query 4: Students who have no enrolments
SELECT s.name, s.email
FROM students s
LEFT JOIN enrolments e ON s.id = e.student_id
WHERE e.student_id IS NULL;

-- Query 5: Update of one enrolment's grade (e.g., updating Bob's Mathematics grade to 'A')
UPDATE enrolments
SET grade = 'A'
WHERE student_id = (SELECT id FROM students WHERE name = 'Bob Jones')
  AND course_id = (SELECT id FROM courses WHERE title = 'Mathematics');