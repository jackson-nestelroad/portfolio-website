// Drawing all experience cards in the Experience section

import { DOM } from '../Modules/DOM'
import { ExperienceSection } from '../Modules/WebPage'
import { Experience } from '../Classes/Elements/Experience'
import { Experience as Data } from '../Data/Experience'

DOM.load().then(document => {
    let card: Experience;
    for(let data of Data) {
        card = new Experience(data);
        ExperienceSection.appendChild(card.createElement());
    }
});
