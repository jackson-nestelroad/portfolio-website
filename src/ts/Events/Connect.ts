// Drawing all social media icons in the Connect section

import { DOM } from '../Modules/DOM'
import { SocialGrid } from '../Modules/WebPage'
import { Social } from '../Classes/Elements/Social'
import { Social as Data } from '../Data/Social'

DOM.load().then(document => {
    let card: Social;
    for(let data of Data) {
        card = new Social(data);
        card.appendTo(SocialGrid);
    }
});
