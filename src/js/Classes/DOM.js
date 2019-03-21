// This object contains a collection of functions for manipulating the DOM

const DOM = {
    // Get array of elements by query
    getElements: function(query) {
        return document.querySelectorAll(query);
    },

    // Get first element only by query
    getFirstElement: function(query) {
        return this.getElements(query)[0];
    },

    // Remove class from element
    removeClass: function(element, className) {
        return element.classList.remove(className);
    }
}

export default DOM;