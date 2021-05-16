// Data for Education cards

import { EducationData } from '../Classes/Elements/Education'

export const Education: EducationData[] = [
    {
        name: 'The University of Texas at Dallas',
        color: '#C75B12',
        image: 'utd.svg',
        link: 'https://utdallas.edu',
        location: 'Richardson, TX, USA',
        degree: 'Master of Science in Computer Science',
        start: 'Spring 2021',
        end: 'Fall 2022',
        credits: {
            total: 33,
            completed: 6,
            taking: 9,
        },
        gpa: {
            overall: '4.0',
        },
        notes: [
            'Systems Track',
            'Jonsson School Fast-Track Program'
        ],
        courses: [
            'Computer Architecture',
            'Design and Analysis of Computer Algorithms',
        ],
    },
    {
        name: 'The University of Texas at Dallas',
        color: '#C75B12',
        image: 'utd.svg',
        link: 'https://utdallas.edu',
        location: 'Richardson, TX, USA',
        degree: 'Bachelor of Science in Computer Science',
        start: 'Fall 2018',
        end: 'Fall 2021',
        credits: {
            total: 124,
            completed: 114,
            taking: 10,
        },
        gpa: {
            overall: '4.0',
            major: '4.0'
        },
        notes: [
            'Collegium V Honors'
        ],
        courses: [
            'Data Structures and Algorithm Analysis',
            'Operating Systems',
            'Software Engineering',
            'Programming in UNIX'
        ]
    }
];