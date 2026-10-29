import {
  getAllCourses,
  getCourseBySlug,
} from "../../models/catalog/courses.js";

import { getSectionsByCourseSlug } from "../../models/catalog/catalog.js";

// Display the course catalog
const catalogPage = async (req, res) => {
  const courses = await getAllCourses();

  res.render("catalog", {
    title: "Course Catalog",
    courses: courses,
  });
};

// Display an individual course
const courseDetailPage = async (req, res, next) => {
  const courseSlug = req.params.slugId;

  const course = await getCourseBySlug(courseSlug);

  // Return 404 if course doesn't exist
  if (Object.keys(course).length === 0) {
    const err = new Error(`Course ${courseSlug} not found`);
    err.status = 404;
    return next(err);
  }

  // Validate sorting options
  const validSorts = ["time", "room", "professor"];

  const sortBy = validSorts.includes(req.query.sort) ? req.query.sort : "time";

  const sections = await getSectionsByCourseSlug(courseSlug, sortBy);

  res.render("course-detail", {
    title: `${course.courseCode} - ${course.name}`,
    course: course,
    sections: sections,
    currentSort: sortBy,
  });
};

export { catalogPage, courseDetailPage };
