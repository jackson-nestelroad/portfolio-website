// Drawing all project cards in the Projects section

import { DOM } from '../Modules/DOM'
import { Sections } from '../Modules/WebPage'
import { Project } from '../Classes/Elements/Project'
import { Projects as Data } from '../Data/Projects'

DOM.load().then(() => {
    const ProjectsContainer = Sections.get('projects').element.querySelector('.projects-container');
    let card: Project;
    for(let data of Data) {
        card = new Project(data);
        card.appendTo(ProjectsContainer);
    }
});
