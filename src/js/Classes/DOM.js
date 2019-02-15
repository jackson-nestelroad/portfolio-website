// This object contains a collection of functions for manipulating the DOM

const DOM = {
    getElements: function(query) {
        return document.querySelectorAll(query);
    },

    getFirstElement: function(query) {
        return this.getElements(query)[0];
    }
}

export default DOM;