import db from "../db.js";

// Convert database rows into section objects
const formatSection = (section) => ({
  id: section.id,
  time: section.time,
  room: section.room,
  courseSlug: section.course_slug,
  courseCode: section.course_code,
  courseName: section.course_name,
  description: section.description,
  creditHours: section.credit_hours,
  professor: `${section.first_name} ${section.last_name}`,
  professorSlug: section.faculty_slug,
  professorTitle: section.faculty_title,
  department: section.department_name,
  departmentCode: section.department_code,
});

// Get sections for a specific course
const getSectionsByCourse = async (
  identifier,
  identifierType = "slug",
  sortBy = "time",
) => {
  const whereClause = identifierType === "id" ? "c.id = $1" : "c.slug = $1";

  const orderByClause =
    sortBy === "room"
      ? "cat.room"
      : sortBy === "professor"
        ? "f.last_name, f.first_name"
        : "cat.time";

  const query = `
    SELECT cat.id, cat.time, cat.room,
           c.slug AS course_slug,
           c.course_code, c.name AS course_name,
           c.description, c.credit_hours,
           f.first_name, f.last_name,
           f.slug AS faculty_slug,
           f.title AS faculty_title,
           d.name AS department_name,
           d.code AS department_code
    FROM catalog cat
    JOIN courses c ON cat.course_slug = c.slug
    JOIN faculty f ON cat.faculty_slug = f.slug
    JOIN departments d ON c.department_id = d.id
    WHERE ${whereClause}
    ORDER BY ${orderByClause}
  `;

  const result = await db.query(query, [identifier]);
  return result.rows.map(formatSection);
};

// Get courses taught by a specific faculty member
const getCoursesByFaculty = async (
  identifier,
  identifierType = "slug",
  sortBy = "time",
) => {
  const whereClause = identifierType === "id" ? "f.id = $1" : "f.slug = $1";

  const orderByClause =
    sortBy === "room"
      ? "cat.room"
      : sortBy === "course"
        ? "c.course_code"
        : "cat.time";

  const query = `
    SELECT cat.id, cat.time, cat.room,
           c.slug AS course_slug,
           c.course_code, c.name AS course_name,
           c.description, c.credit_hours,
           f.first_name, f.last_name,
           f.slug AS faculty_slug,
           f.title AS faculty_title,
           d.name AS department_name,
           d.code AS department_code
    FROM catalog cat
    JOIN courses c ON cat.course_slug = c.slug
    JOIN faculty f ON cat.faculty_slug = f.slug
    JOIN departments d ON c.department_id = d.id
    WHERE ${whereClause}
    ORDER BY ${orderByClause}
  `;

  const result = await db.query(query, [identifier]);
  return result.rows.map(formatSection);
};

// Search by course ID or slug
const getSectionsByCourseId = (courseId, sortBy = "time") =>
  getSectionsByCourse(courseId, "id", sortBy);

const getSectionsByCourseSlug = (courseSlug, sortBy = "time") =>
  getSectionsByCourse(courseSlug, "slug", sortBy);

// Search by faculty ID or slug
const getCoursesByFacultyId = (facultyId, sortBy = "time") =>
  getCoursesByFaculty(facultyId, "id", sortBy);

const getCoursesByFacultySlug = (facultySlug, sortBy = "time") =>
  getCoursesByFaculty(facultySlug, "slug", sortBy);

export {
  getSectionsByCourseId,
  getSectionsByCourseSlug,
  getCoursesByFacultyId,
  getCoursesByFacultySlug,
};
