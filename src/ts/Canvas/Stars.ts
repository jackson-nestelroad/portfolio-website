// Configuration for Stars particles

import { IParticlesConfig } from '../Particles/ParticleSettings'

export const Stars: IParticlesConfig = {
    Particles: {
        number: 300,
        density: 200,
        color: '#FFFFFF',
        opacity: 'random',
        radius: [2, 2.5, 3, 3.5, 4, 4.5],
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
                radius: 8,
                opacity: 1
            }
        }
    }
}