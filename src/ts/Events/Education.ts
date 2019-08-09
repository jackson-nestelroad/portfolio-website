// Drawing all education cards in the Education section

import { DOM } from '../Modules/DOM'
import { Sections } from '../Modules/WebPage'
import { Education } from '../Classes/Elements/Education'
import { Education as Data } from '../Data/Education'

DOM.load().then(document => {
    const EducationSection = Sections.get('education').element;
    let card: Education;
    for(let data of Data) {
        card = new Education(data);
        card.appendTo(EducationSection);
    }
});
