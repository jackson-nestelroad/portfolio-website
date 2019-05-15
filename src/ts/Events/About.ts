// Setting content for About section

import { DOM } from '../Modules/DOM'
import { FlavorText } from '../Modules/WebPage'
import { AboutMe } from '../Data/About'

DOM.load().then(document => {
    FlavorText.innerText = AboutMe;
});