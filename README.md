# Portfolio Website
This repository features the source code for my personal portfolio website. 
## About
This website is built using **TypeScript** and **SCSS**, transpiled quickly using **Gulp** build tools. I opted away from any frameworks to experience what creating an interactive web page from scratch feels like.
## Process
Originally, I was writing my source code in ES6 JavaScript using the Babel transpiler. However, I began to realize I was unable to achieve the quality, control, and organization over my code I was aiming for. I quickly converted everything over to TypeScript; it was now easier to communicate internal states and HTML elements across multiple files.

I designed my SVG logo using **Figma**.

The particle effects are heavily based on [VincentGarreau's particles.js framework](https://github.com/VincentGarreau/particles.js). My goal was to re-imagine his framework using classes and internal states. Type annotations via TypeScript also help a lot in creating the configuration settings.

Nearly all of the page's content is organized using **CSS Flexbox**. I created an [extensive library](https://github.com/jackson-nestelroad/portfolio-website/blob/master/src/scss/General/Flex.scss) for working with flexbox grids and flex items in multiple viewports.

The hamburger menu button and the actual pullout menu are detached, so I created a simple [Event Dispatcher](https://github.com/jackson-nestelroad/portfolio-website/blob/master/src/ts/Modules/EventDispatcher.ts) class to communicate custom events to elements on the page. For example, the `<main>` tag subscribes to the `MenuButton` dispatcher, so when the `MenuButton` dispatches the `toggle` event, the `<main>` tag knows whether to open or close the menu. These events are not dispatches when the Web API, so they cannot be intercepted.

With the skills, experience, projects, and education sections, I needed an easy way to create reusable bits of HTML for recurring content. I decided to begin using **JSX** syntax since it is natively supported in TypeScript using a custom JSX Factory function. Opposed to creating a React Node, my JSX compiles directly to an `HTMLElement` to be placed onto the page.

Originally, these JSX-oriented classes would transform a set of data into HTML, but I later created a tiny [Component class](https://github.com/jackson-nestelroad/portfolio-website/blob/master/src/ts/Classes/Component/index.ts) to strengthen my solution and make it more interface-oriented. These components now create their element in the constructor, have references to rendered elements, and have the ability to update the HTML displayed on the page. I plan to study more about creating JavaScript Web Components (similar to how React works) in the future as a side project.
