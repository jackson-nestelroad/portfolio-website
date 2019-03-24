// Configuration for Stars particles

import { IParticlesConfig } from '../Particles/ParticleSettings'

export const Stars: IParticlesConfig = {
    Particles: {
        number: 350,
        density: 200,
        color: '#FFFFFF',
        opacity: 'random',
        radius: [1, 1.5, 2, 2.5, 3, 3.5],
        shape: 'circle',
        stroke: {
            width: 0,
            color: '#000000'
        },
        move: {
            speed: 0.2,
            direction: 'random',
            straight: false,
            random: true,
            edgeBounce: false,
            attract: false
        },
        events: {
            resize: true,
            hover: 'bubble',
            click: false
        },
        animate: {
            opacity: {
                speed: 0.2,
                min: 0,
                sync: false
            },
            radius: {
                speed: 3,
                min: 0,
                sync: false
            }
        }
    },
    Interactive: {
        hover: {
            bubble: {
                distance: 75,
                radius: 7,
                opacity: 1
            }
        }
    }
}