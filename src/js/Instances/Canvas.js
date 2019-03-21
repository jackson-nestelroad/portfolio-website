// Start up the Particles Canvas

import ParticlesCanvas from '../Classes/ParticlesCanvas'

import Stars from '../Classes/Particle Configs/Stars'

let canvas = new ParticlesCanvas('#particles', '2d');
canvas.setParticleSettings(Stars.Particles);
canvas.setInteractivitySettings(Stars.Interactive);
canvas.start();