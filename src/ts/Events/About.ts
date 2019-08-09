// Setting content for About section

import { DOM } from '../Modules/DOM'
import { FlavorText, QualitiesContainer } from '../Modules/WebPage'
import { AboutMe } from '../Data/About'

import { Qualities } from '../Data/Qualities'
import { Quality } from '../Classes/Elements/Quality'

DOM.load().then(document => {
    FlavorText.innerText = AboutMe;
});

DOM.load().then(document => {
    let object: Quality;
    for(let quality of Qualities) {
        object = new Quality(quality);
        object.appendTo(QualitiesContainer);
    }
});