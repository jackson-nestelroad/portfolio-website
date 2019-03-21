// Particles configuration for stars

const Stars = {
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
            speed: 0.1,
            direction: 'none',
            straight: false,
            random: true,
            edgeBounce: false,
            attract: false
        },
        events: {
            resize: true,
            hover: 'bubble'
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
            },
            repulse: {
                distance: 100,   
            }
        },
        click: {
            add: {
                number: 4
            },
            remove: {
                number: 2
            }
        }
    }
}

export default Stars;