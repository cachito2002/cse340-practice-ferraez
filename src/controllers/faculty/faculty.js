import {
  getFacultyBySlug,
  getSortedFaculty,
} from "../../models/faculty/faculty.js";

// Display the faculty directory
const facultyListPage = async (req, res) => {
  const sortBy = ["name", "department", "title"].includes(req.query.sort)
    ? req.query.sort
    : "name";

  const faculty = await getSortedFaculty(sortBy);

  res.render("faculty/list", {
    title: "Faculty Directory",
    faculty: faculty,
    currentSort: sortBy,
  });
};

// Display an individual faculty member
const facultyDetailPage = async (req, res, next) => {
  const facultySlug = req.params.slugId;

  const member = await getFacultyBySlug(facultySlug);

  // Return a 404 if the faculty member doesn't exist
  if (Object.keys(member).length === 0) {
    const err = new Error(`Faculty member ${facultySlug} not found`);
    err.status = 404;
    return next(err);
  }

  res.render("faculty/detail", {
    title: member.name,
    member: member,
  });
};

export { facultyListPage, facultyDetailPage };
