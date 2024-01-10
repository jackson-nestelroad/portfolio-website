// Data for Experience cards

import { ExperienceData } from '../Classes/Elements/Experience'

export const Experience: ExperienceData[] = [
    {
        svg: 'google',
        link: 'https://about.google/',
        company: 'Google',
        team: 'Technical Infrastructure, Cluster Management',
        location: 'Sunnyvale, CA, USA',
        position: 'Software Engineer',
        begin: 'August 2022',
        end: 'Present',
        flavor: 'Google is a multinational technology company that provides a wide variety of Internet-related products and services. As one of the largest technology companies in the world, Google continues to lead the web in innovation and creativity. I currently work on Google\'s internal cluster management system and Google Cloud, increasing the efficiency, reliability, and scalability of our cluster infrastructure. My goal is to prepare our infrastructure for future use cases and bring the efficiencies of internal workloads to open-source containers.',
        roles: [
            'TL for multi-platform workload API for 1P and 3P ML serving use cases. Designed a robust, fault-tolerant, replicated C++ service, generating and guiding work streams implemented by three other engineers over multiple quarters. Owned cross-team collaboration for API design.',
            'Contributed to efficient container-scheduling service for Google Cloud. Reduced container start time by two minutes. Wrote new node agent component for dynamic identity proxying in Go. Owned control plane API design, integration testing, and several hardening efforts that significantly increased service reliability.',
            'Led several widespread refactors of Google\'s internal cluster node agent, reducing technical debt, increasing reliability, and saving memory and CPU cycles across the compute fleet.',
            'Contributed 750+ code changes over 1.5 years, deleting 62K lines of code and adding 80K lines of code.',
        ],
    },
    {
        svg: 'google',
        link: 'https://about.google/',
        company: 'Google',
        team: 'Technical Infrastructure, Cluster Management',
        location: 'Remote',
        position: 'Software Engineering Intern',
        begin: 'May 2021',
        end: 'August 2021',
        flavor: 'Google is a multinational technology company that provides a wide variety of Internet-related products and services. As one of the largest technology companies in the world, Google continues to lead the web in innovation and creativity. I worked remotely in Cloud Technical Infrastructure on the internal cluster management system that powers all of Google at scale.',
        roles: [
            'Designed and implemented running OCI containers in Google\'s large-scale cluster manager using modern C++, Go, and Protobuf, helping bridge the growing gap between the open source stack and internal stack.',
            'Developed internal changes to on-machine package lifecycle, allowing packages to be directly tied to the lifetime of dependent tasks.',
            'Wrote extensive unit tests, integration tests, and design documentation.'
        ],
    },
    {
        collapse: true,
        svg: 'fidelity',
        link: 'https://www.fidelity.com/',
        company: 'Fidelity Investments',
        team: 'Customer Protection, Single Sign-On',
        location: 'Remote',
        position: 'Software Engineer Intern',
        begin: 'June 2020',
        end: 'July 2020',
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
        collapse: true,
        svg: 'medit',
        link: 'https://medit.online',
        disableLink: true,
        company: 'Medit',
        team: 'Web Development',
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
        collapse: true,
        svg: 'lifechurch',
        link: 'https://life.church',
        company: 'Life.Church',
        team: 'Information Technology',
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