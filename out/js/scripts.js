(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// This object contains a collection of functions for manipulating the DOM
var DOM = {
  getElements: function getElements(query) {
    return document.querySelectorAll(query);
  },
  getFirstElement: function getFirstElement(query) {
    return this.getElements(query)[0];
  }
};
var _default = DOM;
exports.default = _default;

},{}],2:[function(require,module,exports){
"use strict";

var _DOM = _interopRequireDefault(require("../Classes/DOM"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_DOM.default.getFirstElement('main').addEventListener('mousemove', function () {
  console.log("test :)");
});

},{"../Classes/DOM":1}]},{},[1,2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvQ2xhc3Nlcy9ET00uanMiLCJzcmMvanMvRXZlbnRzL01haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNBQTtBQUVBLElBQU0sR0FBRyxHQUFHO0FBQ1IsRUFBQSxXQUFXLEVBQUUscUJBQVMsS0FBVCxFQUFnQjtBQUN6QixXQUFPLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixLQUExQixDQUFQO0FBQ0gsR0FITztBQUtSLEVBQUEsZUFBZSxFQUFFLHlCQUFTLEtBQVQsRUFBZ0I7QUFDN0IsV0FBTyxLQUFLLFdBQUwsQ0FBaUIsS0FBakIsRUFBd0IsQ0FBeEIsQ0FBUDtBQUNIO0FBUE8sQ0FBWjtlQVVlLEc7Ozs7OztBQ1pmOzs7O0FBRUEsYUFBSSxlQUFKLENBQW9CLE1BQXBCLEVBQTRCLGdCQUE1QixDQUE2QyxXQUE3QyxFQUEwRCxZQUFNO0FBQzVELEVBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxTQUFaO0FBQ0gsQ0FGRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vIFRoaXMgb2JqZWN0IGNvbnRhaW5zIGEgY29sbGVjdGlvbiBvZiBmdW5jdGlvbnMgZm9yIG1hbmlwdWxhdGluZyB0aGUgRE9NXHJcblxyXG5jb25zdCBET00gPSB7XHJcbiAgICBnZXRFbGVtZW50czogZnVuY3Rpb24ocXVlcnkpIHtcclxuICAgICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChxdWVyeSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldEZpcnN0RWxlbWVudDogZnVuY3Rpb24ocXVlcnkpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRFbGVtZW50cyhxdWVyeSlbMF07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IERPTTsiLCJpbXBvcnQgRE9NIGZyb20gJy4uL0NsYXNzZXMvRE9NJztcclxuXHJcbkRPTS5nZXRGaXJzdEVsZW1lbnQoJ21haW4nKS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAoKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhcInRlc3QgOilcIik7XHJcbn0pOyJdfQ==
