// Display current year on copyright at bottom of page

import { DOM } from '../Modules/DOM'

DOM.load().then(document => {
    DOM.getFirstElement('#connect .footer .copyright .year').innerText = new Date().getFullYear().toString();
});