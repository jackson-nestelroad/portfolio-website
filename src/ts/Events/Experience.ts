// Drawing all experience cards in the Experience section

import { DOM } from '../Modules/DOM'
import { Sections } from '../Modules/WebPage'
import { Experience } from '../Classes/Elements/Experience'
import { Experience as Data } from '../Data/Experience'

DOM.load().then(document => {
    const ExperienceSection = Sections.get('experience').element;
    let card: Experience;
    for(let data of Data) {
        card = new Experience(data);
        card.appendTo(ExperienceSection);
    }
});
