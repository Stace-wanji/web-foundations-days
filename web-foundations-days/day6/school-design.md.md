# School Database Design

## Table Explanations
- **students**: Stores core information about each student. It includes a unique identifier (`id`), the student's `name`, and their `email` address. The email is marked as `UNIQUE` to ensure no two students can register with the same email address.
- **courses**: Stores information about available academic courses. It includes a unique identifier (`id`), the course `title`, and a unique course `code` (e.g., 'MATH101') for easy, standardized identification.
- **enrolments**: Acts as a junction (join) table that records the fact that a student is enrolled in a course. It contains foreign keys referencing both the `students` and `courses` tables, along with an optional `grade` field. A `UNIQUE` constraint on the combination of `student_id` and `course_id` enforces the business rule that a student cannot enroll in the same course more than once.

## Relationships
- The relationship between **students** and **enrolments** is **one-to-many**: one student can have many enrolment records, but each enrolment record belongs to exactly one student.
- The relationship between **courses** and **enrolments** is also **one-to-many**: one course can have many enrolment records, but each enrolment record belongs to exactly one course.
- The relationship between **students** and **courses** is **many-to-many**: a student can enroll in multiple courses, and a course can have multiple students enrolled. A join table (`enrolments`) is strictly needed because relational databases cannot directly map many-to-many relationships between two tables. The join table resolves this by breaking it down into two one-to-many relationships, while also providing a dedicated place to store attributes specific to the relationship itself (like the `grade`).

## Index Recommendation
I would add the following index:
```sql
CREATE INDEX idx_enrolments_course_id ON enrolments(course_id);