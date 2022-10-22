import { DOM } from '../Modules/DOM'
import { ScrollHook } from '../Modules/WebPage'

DOM.load().then(document => {
    let scrollPos = localStorage.getItem('scrollPos');
    if(scrollPos) {
        ScrollHook.scrollTo(0, parseInt(scrollPos));
    }
});

window.addEventListener('beforeunload', () => {
    const scrollPos = isHTMLElement(ScrollHook) ? ScrollHook.scrollTop : ScrollHook.scrollY;
    localStorage.setItem('scrollPos', `${scrollPos}`);
});

let isHTMLElement = (scrollObject: HTMLElement | Window): scrollObject is HTMLElement => {
    return "scrollTop" in scrollObject;
}