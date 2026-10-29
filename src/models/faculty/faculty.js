import db from "../db.js";

// Convert database rows into faculty objects
const formatFaculty = (faculty) => ({
  id: faculty.id,
  firstName: faculty.first_name,
  lastName: faculty.last_name,
  name: `${faculty.first_name} ${faculty.last_name}`,
  office: faculty.office,
  phone: faculty.phone,
  email: faculty.email,
  department: faculty.department_name,
  departmentCode: faculty.department_code,
  title: faculty.title,
  gender: faculty.gender,
  slug: faculty.slug,
});

// Get faculty member by ID
const getFacultyById = async (facultyId) => {
  const result = await db.query(
    `SELECT f.*, d.name AS department_name,
                d.code AS department_code
         FROM faculty f
         JOIN departments d ON f.department_id = d.id
         WHERE f.id = $1`,
    [facultyId],
  );

  return result.rows.length > 0 ? formatFaculty(result.rows[0]) : {};
};

// Get faculty member by slug
const getFacultyBySlug = async (facultySlug) => {
  const result = await db.query(
    `SELECT f.*, d.name AS department_name,
                d.code AS department_code
         FROM faculty f
         JOIN departments d ON f.department_id = d.id
         WHERE f.slug = $1`,
    [facultySlug],
  );

  return result.rows.length > 0 ? formatFaculty(result.rows[0]) : {};
};

// Get faculty sorted by name, department, or title
const getSortedFaculty = async (sortBy = "name") => {
  const orderBy =
    sortBy === "department"
      ? "d.name, f.last_name, f.first_name"
      : sortBy === "title"
        ? "f.title, f.last_name, f.first_name"
        : "f.last_name, f.first_name";

  const result = await db.query(`
        SELECT f.*, d.name AS department_name,
               d.code AS department_code
        FROM faculty f
        JOIN departments d ON f.department_id = d.id
        ORDER BY ${orderBy}
    `);

  return result.rows.map(formatFaculty);
};

// Get faculty from a particular department
const getFacultyByDepartment = async (departmentCode) => {
  const result = await db.query(
    `SELECT f.*, d.name AS department_name,
                d.code AS department_code
         FROM faculty f
         JOIN departments d ON f.department_id = d.id
         WHERE d.code = $1
         ORDER BY f.last_name, f.first_name`,
    [departmentCode],
  );

  return result.rows.map(formatFaculty);
};

export {
  getFacultyById,
  getFacultyBySlug,
  getSortedFaculty,
  getFacultyByDepartment,
};
