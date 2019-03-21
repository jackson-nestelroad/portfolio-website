// Particles configuration for hexagons
// Used a bit for testing

const Shapes = {
    Particles: {
        number: 50,
        density: 1000,
        color: '#FFD577',
        opacity: 0.5,
        radius: [15, 27, 40, 40, 40],
        shape: '6-gon',
        stroke: {
            width: 0,
            color: '#FF7875'
        },
        move: {
            speed: 1,
            direction: 'bottom-left',
            straight: true,
            random: true,
            edgeBounce: false,
            attract: false
        },
        events: {
            resize: true,
            hover: 'bubble'
        },
        animate: {
            opacity: false,
            radius: false
        }
    },
    Interactive: {
        hover: {
            bubble: {
                distance: 75,
                radius: 7,
                opacity: 0.5
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

export default Shapes;