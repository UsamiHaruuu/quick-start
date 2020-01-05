import React, { useState, useEffect } from 'react';
import 'rbx/index.css';
import { Button, Container, Title } from 'rbx';

const terms = { F: 'Fall', W: 'Winter', S: 'Spring' };
const days = ['M', 'Tu', 'W', 'Th', 'F'];

const Banner = p => (
  <Title>{p.title || '[loading...]'}</Title>
);

const getCourseTerm = p => (
  terms[p.id.charAt(0)]
);

const getCourseNumber = p => (
  p.id.slice(1, 4)
);

const Course = ({course, state}) => (
  <div>
    <Button onClick = {() => state.toggle(course)}
            disabled={ hasConflict(course, state.selected) }
            >
      {getCourseTerm(course)} CS {getCourseNumber(course)}: {course.title}
    </Button>
  </div>
);

const buttonColor = selected =>(
  selected ? 'success' : null
)
const CourseList = (prop) => {
  const [term, setTerm] = useState('Fall');
  const [selected, toggle] = useSelection();
  const termCourses = prop.courses.filter(course => term === getCourseTerm(course));
  return (
    <React.Fragment>
      <TermSelector state = {{term, setTerm}}/>
      <Button.Group>
        {termCourses.map(course => 
        <Course key={course.id}
         course={course} 
         state = {{selected, toggle}} 
         />)}
      </Button.Group>
    </React.Fragment>
  )
};
//key should be unique

const Scoreboard = () => {
  const [score, setScore] = useState(0);
}

const useSelection = () => {
  const [selected, setSelected] = useState([]);
  const toggle = (prop) => {
    setSelected(selected.includes(prop) ? selected.filter(y => y !== prop) : [prop].concat(selected))
  };
  return [ selected, toggle ];
};

const hasConflict = (course, selected) =>(
  selected.some(selection => courseConflict (course, selection))
)

const meetsPat = /^ *((?:M|Tu|W|Th|F)+) +(\d\d?):(\d\d) *[ -] *(\d\d?):(\d\d) *$/;

const timeParts = meets => {
  const [match, days, hh1, mm1, hh2, mm2] = meetsPat.exec(meets) || [];
  return !match ? {} : {
    days,
    hours: {
      start: hh1 * 60 + mm1 * 1,
      end: hh2 * 60 + mm2 * 1
    }
  };
};

const addCourseTimes = course => ({
  ...course,
  ...timeParts(course.meets)
});

const addScheduleTimes = schedule => ({
  title: schedule.title,
  courses: schedule.courses.map(addCourseTimes)
});

const daysOverlap = (days1, days2) => ( 
  days.some(day => days1.includes(day) && days2.includes(day))
);

const hoursOverlap = (hours1, hours2) => (
  Math.max(hours1.start, hours2.start) < Math.min(hours1.end, hours2.end)
);

const timeConflict = (course1, course2) => (
  daysOverlap(course1.days, course2.days) && hoursOverlap(course1.hours, course2.hours)
);

const courseConflict = (course1, course2) => (
  course1 !== course2
  && getCourseTerm(course1) === getCourseTerm(course2)
  && timeConflict(course1, course2)
);

const TermSelector = ({state}) => {
  return (
    <Button.Group has Addons>
      {
        Object.values(terms)
          .map(value =>
           <Button key={value} 
                   color = {buttonColor(value===state.term)}
                   onClick = { () => state.setTerm(value) }
            >{value}
            </Button>)
      }
    </Button.Group>
  )
};

const App = () => {
  const [schedule, setSchedule] = useState({ title: '', courses: [] });
  const url = 'https://courses.cs.northwestern.edu/394/data/cs-courses.php';

  useEffect(() => {
    const fetchSchedule = async () => {
      const response = await fetch(url);
      if (!response.ok) throw response;
      const json = await response.json();
      setSchedule(addScheduleTimes(json));
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
