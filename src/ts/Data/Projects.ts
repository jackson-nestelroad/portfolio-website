// Data for Projects cards

import { ProjectData } from '../Classes/Elements/Project'

export const Projects: ProjectData[] = [
    {
        name: 'AR Sphere',
        color: '#DB4F54',
        image: 'ar-sphere.jpg',
        type: 'ACM Ignite',
        date: 'Fall 2019',
        award: 'First place for Fall 2019 ACM Ignite.',
        flavor: 'Mobile application to place persistent AR models and experiences across the globe.',
        repo: 'https://github.com/jackson-nestelroad/ar-sphere-server',
        external: null,
        details: [
            'Semester-long team entrepreneurial project.',
            'Lead server developer with C#, ASP.NET Core MVC, and Entity Framework.',
            'Stream continuous data and real-time updates with SignalR.',
            'Saves geographical data with Azure Spatial Anchors.',
            'Deployed to Microsoft Azure with SQL Server and Blob Storage.'
        ]
    },
    {
        name: 'Portfolio Website',
        color: '#29AB87',
        image: 'portfolio-website.jpg',
        type: 'Side Project',
        date: 'Spring/Summer 2019',
        award: null,
        flavor: 'Personal website to showcase my work and experience.',
        repo: 'https://github.com/jackson-nestelroad/portfolio-website',
        external: 'https://jackson.nestelroad.com',
        details: [
            'Implemented from scratch with pure TypeScript.',
            'Custom-made, dynamic SCSS library.',
            'Class-based, easy-to-update JSX rendering for recurring content.',
            'Supports Internet Explorer 11.'
        ]
    },
    {
        name: 'Ponder',
        color: '#FFA500',
        image: 'ponder.jpg',
        type: 'Side Project',
        date: 'HackUTD 2019',
        award: '"Best UI/UX" for HackUTD 2019',
        flavor: 'Web and mobile application to make group brainstorming organized and efficient.',
        repo: 'https://github.com/jackson-nestelroad/ponder-hackutd-19',
        external: null,
        details: [
            'Implemented with React and Firebase Realtime Database.',
            'Complete connection and realtime updates with mobile counterpart.',
        ]
    },
    {
        name: 'Key Consumer',
        color: '#7A69AD',
        image: 'key-consumer.jpg',
        type: 'Side Project',
        date: 'January 2019',
        award: null,
        flavor: 'Windows command to attach a low-level keyboard hook in another running process.',
        repo: 'https://github.com/jackson-nestelroad/key-consumer',
        external: null,
        details: [
            'Implemented with C++ and Windows API.',
            'Attaches .dll file to another process to avoid detection.',
            'Intercepts and changes key inputs on the fly.'
        ]
    },
    {
        name: 'Comet Climate API',
        color: '#2D87C6',
        image: 'comet-climate.jpg',
        type: 'Class Project',
        date: 'November 2018',
        award: null,
        flavor: 'Self-updating API to collect current weather and Twitter data for the University of Texas at Dallas.',
        repo: 'https://github.com/jackson-nestelroad/comet-climate-server',
        external: null,
        details: [
            'Implemented with C# and the ASP.NET Core MVC.',
            'Deployed to Heroku with PostgreSQL database.',
            'Always returns data less than 10 minutes old.'
        ]
    },
    {
        name: 'Christ-Centered',
        color: '#FE904E',
        image: 'christ-centered.jpg',
        type: 'Side Project',
        date: 'Fall 2018',
        award: null,
        flavor: 'Google Chrome extension to deliver the YouVersion Verse of the Day to your new tab.',
        repo: 'https://github.com/jackson-nestelroad/christ-centered',
        external: 'http://bit.ly/christ-centered',
        details: [
            'Implemented with React and Chrome API.',
            'Custom verse searching by keyword or number.',
            'Gives current weather for user\'s location via the OpenWeatherMap API.'
        ]
    }
]