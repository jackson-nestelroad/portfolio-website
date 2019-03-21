// This object is for defining which animation frame functions to use.

const AnimationFrameFunctions = {
    requestAnimationFrame: function() {
        return  window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function(callback) {
                    window.setTimeout(callback, 1000/60);
                };
    },
    
    cancelAnimationFrame: function() {
        return  window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        window.msCancelAnimationFrame ||
        clearTimeout;
    }
}

export default AnimationFrameFunctions;