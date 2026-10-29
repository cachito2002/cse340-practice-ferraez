import db from "../db.js";

// Convert database rows into course objects
const formatCourse = (course) => ({
  id: course.id,
  courseCode: course.course_code,
  name: course.name,
  description: course.description,
  creditHours: course.credit_hours,
  department: course.department_name,
  departmentCode: course.department_code,
  slug: course.slug,
});

// Get all courses
const getAllCourses = async () => {
  const result = await db.query(`
        SELECT c.*, d.name AS department_name,
               d.code AS department_code
        FROM courses c
        JOIN departments d ON c.department_id = d.id
        ORDER BY c.course_code
    `);

  return result.rows.map(formatCourse);
};

// Get a course by ID
const getCourseById = async (courseId) => {
  const result = await db.query(
    `SELECT c.*, d.name AS department_name,
                d.code AS department_code
         FROM courses c
         JOIN departments d ON c.department_id = d.id
         WHERE c.id = $1`,
    [courseId],
  );

  return result.rows.length > 0 ? formatCourse(result.rows[0]) : {};
};

// Get a course by slug
const getCourseBySlug = async (courseSlug) => {
  const result = await db.query(
    `SELECT c.*, d.name AS department_name,
                d.code AS department_code
         FROM courses c
         JOIN departments d ON c.department_id = d.id
         WHERE c.slug = $1`,
    [courseSlug],
  );

  return result.rows.length > 0 ? formatCourse(result.rows[0]) : {};
};

// Get courses from a particular department
const getCoursesByDepartment = async (departmentCode) => {
  const result = await db.query(
    `SELECT c.*, d.name AS department_name,
                d.code AS department_code
         FROM courses c
         JOIN departments d ON c.department_id = d.id
         WHERE d.code = $1
         ORDER BY c.course_code`,
    [departmentCode],
  );

  return result.rows.map(formatCourse);
};

export {
  getAllCourses,
  getCourseById,
  getCourseBySlug,
  getCoursesByDepartment,
};
