import React, { useState, useEffect } from 'react';
import 'rbx/index.css';
import { Button, Container, Title, Message } from 'rbx';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';


const firebaseConfig = {
  apiKey: "AIzaSyBFObHvrzBwAFBm40_tK4vioHPfcAnxAH4",
  authDomain: "quick-start-31bbc.firebaseapp.com",
  databaseURL: "https://quick-start-31bbc.firebaseio.com",
  projectId: "quick-start-31bbc",
  storageBucket: "quick-start-31bbc.appspot.com",
  messagingSenderId: "561010780794",
  appId: "1:561010780794:web:f580ca6ef6578bb09869c3",
  measurementId: "G-0JS6EZZZVJ"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref();

const terms = { F: 'Fall', W: 'Winter', S: 'Spring' };
const days = ['M', 'Tu', 'W', 'Th', 'F'];

const Welcome = ({ user }) => (
  <Message color="info">
    <Message.Header>
      Welcome, {user.displayName}
      <Button primary onClick={() => firebase.auth().signOut()}>
        Log out
      </Button>
    </Message.Header>
  </Message>
);

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false
  }
};  

const SignIn = () => (
  <StyledFirebaseAuth
    uiConfig={uiConfig}
    firebaseAuth={firebase.auth()}
  />
);

const Banner = ({ user, title }) => (
  <React.Fragment>
    { user ? <Welcome user={ user } /> : <SignIn /> }
    <Title id = "head">{ title || '[loading...]' }</Title>
  </React.Fragment>
);

const getCourseTerm = p => (
  terms[p.id.charAt(0)]
);

const getCourseNumber = p => (
  p.id.slice(1, 4)
);

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

const moveCourse = (course) => {
  const meets = prompt('Enter new data in this format: ', course.meets);
  if (!meets) return;
  const { days } = timeParts(meets);
  if (days) saveCourse(course, meets);
  else moveCourse(course);
}

const saveCourse = (course, meets) => {
  db.child('courses').child(course.id).update({ meets })
    .catch(error => alert(error));
}

const buttonColor = selected => (
  selected ? 'success' : null
)
const CourseList = ({courses,user}) => {
  const [term, setTerm] = useState('Fall');
  const [selected, toggle] = useSelection();
  const termCourses = courses.filter(course => term === getCourseTerm(course));
  return (
    <React.Fragment>
      <TermSelector state={{ term, setTerm }} />
      <Button.Group>
        {termCourses.map(course =>
          <Course key={course.id}
            course={course}
            state={{ selected, toggle }}
            user={user}
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
  return [selected, toggle];
};

const hasConflict = (course, selected) => (
  selected.some(selection => courseConflict(course, selection))
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

const TermSelector = ({ state }) => {
  return (
    <Button.Group has Addons>
      {
        Object.values(terms)
          .map(value =>
            <Button key={value}
              color={buttonColor(value === state.term)}
              onClick={() => state.setTerm(value)}
            >{value}
            </Button>)
      }
    </Button.Group>
  )
};

const addCourseTimes = course => ({
  ...course,
  ...timeParts(course.meets)
});

const addScheduleTimes = schedule => ({
  title: schedule.title,
  courses: Object.values(schedule.courses).map(addCourseTimes)
});

const App = () => {
  const [user, setUser] = useState(null);
  const [schedule, setSchedule] = useState({ title: '', courses: [] });

  useEffect(() => {
    const handleData = snap => {
      if (snap.val()) setSchedule(addScheduleTimes(snap.val()));
    }
    db.on('value', handleData, error => alert(error));
    return () => { db.off('value', handleData) };
  }, [])
  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);
  return (
    <Container>
      <Banner title={schedule.title} user = {user} />
      <CourseList courses={schedule.courses} user = {user}/>
    </Container>
  )
};
export default App;
