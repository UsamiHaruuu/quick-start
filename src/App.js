import React, { useState, useEffect } from 'react';
import 'rbx/index.css';
import { Button, Container, Title } from 'rbx';
// const schedule = {
//   "title": "CS Courses for 2018-2019",
//   "courses": [
//     {
//       "id": "F101",
//       "title": "Computer Science: Concepts, Philosophy, and Connections",
//       "meets": "MWF 11:00-11:50"
//     },
//     {
//       "id": "F110",
//       "title": "Intro Programming for non-majors",
//       "meets": "MWF 10:00-10:50"
//     },
//     {
//       "id": "F111",
//       "title": "Fundamentals of Computer Programming I",
//       "meets": "MWF 13:00-13:50"
//     },
//     {
//       "id": "F211",
//       "title": "Fundamentals of Computer Programming II",
//       "meets": "TuTh 12:30-13:50"
//     }
//   ]
// };

const terms = { F: 'Fall', W: 'Winter', S: 'Spring' };

const Banner = p => (
  <Title>{p.title || '[loading...]'}</Title>
);

const getCourseTerm = p => (
  terms[p.id.charAt(0)]
);

const getCourseNumber = p => (
  p.id.slice(1, 4)
);

const Course = (prop) => (
  <div>
    <Button>
      {getCourseTerm(prop.course)} CS {getCourseNumber(prop.course)}: {prop.course.title}
    </Button>
  </div>
);

const CourseList = (prop) => (
  <div>
    <Button.Group>
      {prop.courses.map(course => <Course key={course.title} course={course} />)}
    </Button.Group>
  </div>
);
//key should be unique

const Scoreboard = () => {
  const [score, setScore] = useState(0);
}

const App = () => {
  const [schedule, setSchedule] = useState({ title: '', courses: [] });
  const url = 'https://courses.cs.northwestern.edu/394/data/cs-courses.php';

  useEffect(() => {
    const fetchSchedule = async () => {
      const response = await fetch(url);
      if (!response.ok) throw response;
      const json = await response.json();
      setSchedule(json);
      //schedule => json now
    }
    fetchSchedule();
  }, [])
  return (
    <Container>
      <Banner title={schedule.title} />
      <CourseList courses={schedule.courses} />
    </Container>
  )
};
export default App;
