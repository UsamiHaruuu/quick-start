import React, { useState, useEffect } from 'react';
import 'rbx/index.css';
import { Button, Container, Title, Message } from 'rbx';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import {CourseList} from './Components/CourseList'
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
export {App,db};
