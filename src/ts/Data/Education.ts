// Data for Education cards

import { EducationData } from '../Classes/Elements/Education'

export const Education: EducationData[] = [
    {
        name: 'The University of Texas at Dallas',
        color: '#C75B12',
        image: 'utd.svg',
        link: 'http://utdallas.edu',
        location: 'Richardson, TX, USA',
        degree: 'Bachelor of Science in Computer Science',
        start: 'Fall 2018',
        end: 'Spring 2022',
        credits: {
            total: 124,
            completed: 62,
            taking: 16
        },
        gpa: {
            overall: '4.0',
            major: '4.0'
        },
        courses: [
            'Two Semesters of C++ Programming',
            'Discrete Mathematics I',
            'Data Science with R Workshop'
        ]
    }
];