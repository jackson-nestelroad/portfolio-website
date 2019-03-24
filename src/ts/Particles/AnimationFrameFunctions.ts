// This namespace is for defining which animation frame functions to use.

export namespace AnimationFrameFunctions {
    export function requestAnimationFrame() {
        return  window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                function(callback: FrameRequestCallback): number {
                    return window.setTimeout(callback, 1000/60);
                };
    }
    
    export function cancelAnimationFrame() {
        return  window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        clearTimeout;
    }
}