// This class wraps the Particles class so only certain functions may directly accessed.
// This class is call all of the functions necessary in the Particles class.

import Particles from './Particles/Particles'

export default class ParticlesCanvas {
    constructor(htmlID, context) {
        this.particles = new Particles(htmlID, context);
        this.running = false;
    }

    setParticleSettings(settings) {
        if(this.running)
            throw 'Cannot change settings while ParticlesCanvas is running.';
        else
            this.particles.particleSettings = settings;
    }
    
    setInteractivitySettings(settings) {
        if(this.running)
            throw 'Cannot change settings while ParticlesCanvas is running.';
        else
            this.particles.interactiveSettings = settings;
    }

    start() {
        if(this.particles.particleSettings === null)
            throw 'Particle settings must be initalized before a particle is created.';

        if(this.running)
            throw 'ParticlesCanvas is already running.';
            
        this.running = true;

        this.particles.initialize();
        this.particles.draw();
    }
}