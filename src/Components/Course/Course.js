import React from 'react';
import 'rbx/index.css';
import { Button } from 'rbx';
import 'firebase/database';
import 'firebase/auth';
import {db} from "../../App";
import {getCourseTerm, meetsPat, hasConflict} from "./Times";
import {buttonColor} from "../CourseList"
const getCourseNumber = p => (
  p.id.slice(1, 4)
);

const saveCourse = (course, meets) => {
  db.child('courses').child(course.id).update({ meets })
    .catch(error => alert(error));
}
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
const moveCourse = (course) => {
  const meets = prompt('Enter new data in this format: ', course.meets);
  if (!meets) return;
  const { days } = timeParts(meets);
  if (days) saveCourse(course, meets);
  else moveCourse(course);
}

const Course = ({ course, state, user }) => (
  <div>
    <Button onClick={() => state.toggle(course)}
      disabled={hasConflict(course, state.selected)}
      color={buttonColor(state.selected.includes(course))}
      onDoubleClick={user?()=>moveCourse(course):null}
    >
      {getCourseTerm(course)} CS {getCourseNumber(course)}: {course.title}
    </Button>
  </div>
);
export default Course;