// Connect the canvas element to a Particles class

import Particles from '../Particles/Particles'
import { Stars } from './Stars'

let canvas = new Particles('#particles', '2d');
canvas.setParticleSettings(Stars.Particles);
canvas.setInteractiveSettings(Stars.Interactive);
canvas.start();