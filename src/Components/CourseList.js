import React, { useState } from 'react';
import 'rbx/index.css';
import { Button } from 'rbx';
import Course from './Course/index'
import {getCourseTerm} from "./Course/Times"
const terms = { F: 'Fall', W: 'Winter', S: 'Spring' };

const buttonColor = selected => (
    selected ? 'success' : null
)
const useSelection = () => {
    const [selected, setSelected] = useState([]);
    const toggle = (prop) => {
        setSelected(selected.includes(prop) ? selected.filter(y => y !== prop) : [prop].concat(selected))
    };
    return [selected, toggle];
};
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
const CourseList = ({ courses, user }) => {
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
export  {CourseList, buttonColor};