// Data for Experience cards

import { ExperienceData } from '../Classes/Elements/Experience'

export const Experience: ExperienceData[] = [
    {
        svg: 'medit',
        link: 'http://medit.online',
        company: 'Medit',
        location: 'Dublin, Ireland',
        position: 'Web Application Developer',
        begin: 'May 2019',
        end: 'July 2019',
        flavor: 'Medit is a start-up company committed to making medical education more efficient through their mobile solutions. By combining technology with curated content, practicing professionals are given a quick, unique, and relevant learning experience. I had the opportunity work as the company\'s first web developer, laying down the essential foundations for a web-based version of their application.',
        roles: [
            'Architected the initial foundations for a full-scale, single-page web application using Vue and TypeScript.',
            'Designed an interface-oriented, modularized state management system to work behind the application.',
            'Developed a Vue configuration library to enhance the ability to mock application state in unit testing.',
            'Estbalished a comprehensive UI component library to accelerate the ability to add new content.'
        ]
    },
    {
        svg: 'lifechurch',
        link: 'http://life.church',
        company: 'Life.Church',
        location: 'Edmond, OK, USA',
        position: 'Information Technology Intern',
        begin: 'May 2018',
        end: 'August 2018',
        flavor: 'Life.Church is a multi-site church with a worldwide impact, centered around their mission to "lead people to become fully-devoted followers of Christ." I worked alongside their Central Information Technology team: a group dedicated to utilizing technology to serve and equip the church.',
        roles: [
            'Spent time learning from hardware, software, and database teams in an Agile environment.',
            'Designed and developed a web application for remote volunteer tracking with Node.js and PostgreSQL.',
            'Dynamically deployed application to Google Cloud Platform using Cloud Builds, Docker, and Kubernetes.'
        ]
    }
]