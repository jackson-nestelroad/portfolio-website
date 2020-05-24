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
        end: 'Fall 2021',
        credits: {
            total: 124,
            completed: 90,
            taking: 14
        },
        gpa: {
            overall: '4.0',
            major: '4.0'
        },
        notes: [
            'Collegium V Honors'
        ],
        courses: [
            'Two Semesters of C++ Programming',
            'Computer Architecture',
            'Software Engineering',
            'Programming in UNIX'
        ]
    }
];