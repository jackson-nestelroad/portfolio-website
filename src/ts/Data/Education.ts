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
        end: 'Summer 2022',
        credits: {
            total: 33,
            completed: 33,
            taking: 0,
        },
        gpa: '4.0',
        notes: [
            'Systems Track',
            'Jonsson School Fast-Track Program'
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
            completed: 124,
            taking: 0,
        },
        gpa: '4.0',
        notes: [
            'Summa Cum Laude',
            'Collegium V Honors',
        ],
    }
];
