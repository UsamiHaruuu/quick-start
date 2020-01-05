import React from 'react';

const schedule = {
  "title": "CS Courses for 2018-2019",
  "courses": [
    {
      "id": "F101",
      "title": "Computer Science: Concepts, Philosophy, and Connections",
      "meets": "MWF 11:00-11:50"
    },
    {
      "id": "F110",
      "title": "Intro Programming for non-majors",
      "meets": "MWF 10:00-10:50"
    },
    {
      "id": "F111",
      "title": "Fundamentals of Computer Programming I",
      "meets": "MWF 13:00-13:50"
    },
    {
      "id": "F211",
      "title": "Fundamentals of Computer Programming II",
      "meets": "TuTh 12:30-13:50"
    }
  ]
};

const terms = { F: 'Fall', W: 'Winter', S: 'Spring'};

const Banner = p => (
  <h1>{p.title}</h1>
);

const getCourseTerm = p => (
  terms[p.id.charAt(0)]
);

const getCourseNumber = p => (
  p.id.slice(1, 4)
);

const Course = (prop) => (
  <p>
    { getCourseTerm(prop.course) } CS { getCourseNumber(prop.course) }: { prop.course.title }
  </p>
);

const CourseList = (prop) => (
  <div>
    { prop.courses.map(course => <Course key={course.title} course={ course } />) }
  </div>
);
//key should be unique

const App = () =>  (
  <div>
    <Banner title={ schedule.title } />
    <CourseList courses={ schedule.courses } />
  </div>
);
export default App;