// Connect the canvas element to a Particles class

import Particles from '../Particles/Particles'
import { Stars } from './Stars'
import { Sections, ScrollHook } from '../Modules/WebPage'

let canvas = new Particles('#particles', '2d');
canvas.setParticleSettings(Stars.Particles);
canvas.setInteractiveSettings(Stars.Interactive);
canvas.start();

let paused = false;

ScrollHook.addEventListener('scroll', () => {
    if(Sections.get('canvas').inView()) {
        if(paused) {
            paused = false;
            canvas.resume();
        }
    }
    else {
        if(!paused) {
            paused = true;
            canvas.pause();
        }
    }
},
{
    capture: true,
    passive: true
});