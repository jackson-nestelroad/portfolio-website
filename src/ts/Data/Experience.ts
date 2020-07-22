// Data for Experience cards

import { ExperienceData } from '../Classes/Elements/Experience'

export const Experience: ExperienceData[] = [
    {
        svg: 'fidelity',
        link: 'https://www.fidelity.com/',
        company: 'Fidelity Investments',
        location: 'Remote',
        position: 'Software Engineering Intern',
        begin: 'June 2020',
        end: 'August 2020',
        flavor: 'Fidelity Investments is an international provider of financial services that help individuals and institutions meet their financial objectives. As a leader in the industry, Fidelity is committed to using state-of-the-art technology to serve its customers. I worked remotely as a part of the Single Sign-On team in the Customer Protection division of Workplace Investing.',
        roles: [
            'Created a full-stack web application for single sign-on work intake using Angular and Spring Boot.',
            'Developed a dynamic form component library focused on reusable logic, UI abstraction, and design flexibility.',
            'Integrated front-end and back-end applications using Maven build tools and Docker.',
            'Engaged in professional training sessions for developing on Amazon Web Services.',
            'Worked closely with the Agile process and incremental software delivery.'
        ]
    },
    {
        svg: 'medit',
        link: 'https://medit.online',
        company: 'Medit',
        location: 'Dublin, Ireland',
        position: 'Web Application Developer',
        begin: 'May 2019',
        end: 'July 2019',
        flavor: 'Medit is a start-up company committed to making medical education more efficient through their mobile solutions. By combining technology with curated content, practicing professionals are given a quick, unique, and relevant learning experience. I had the opportunity to work as the company\'s first web developer, laying down the essential foundations for a web-based version of their application.',
        roles: [
            'Architected the initial foundations for a full-scale, single-page web application using Vue, TypeScript, and SASS.',
            'Designed an interface-oriented, modularized state management system to work behind the application.',
            'Developed a Vue configuration library to enhance the ability to mock application state in unit testing.',
            'Established a comprehensive UI component library to accelerate the ability to add new content.'
        ]
    },
    {
        svg: 'lifechurch',
        link: 'https://life.church',
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