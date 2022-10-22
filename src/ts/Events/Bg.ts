import { Background } from '../Modules/WebPage'
import { DOM } from '../Modules/DOM'

const maximumDistance: number = 300;
const halfMaxDistance: number = maximumDistance / 2;

DOM.load().then(() => {
    if (!DOM.isIE()) {
        Background.style.width = `calc(100% + ${maximumDistance}px)`;
        Background.style.height = `calc(100% + ${maximumDistance}px)`;

        document.addEventListener('mousemove', event => {
            const center = DOM.getCenterOfViewport();
            let xRatio = (event.x - center.x) / center.x * halfMaxDistance - halfMaxDistance;
            let yRatio = (center.y - event.y) / center.y * halfMaxDistance - halfMaxDistance;

            Background.style.right = `${xRatio}px`;
            Background.style.top = `${yRatio}px`;

        }, {
            passive: true
        });
    }
});