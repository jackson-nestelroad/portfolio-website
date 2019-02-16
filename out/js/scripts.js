(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// This object contains a collection of functions for manipulating the DOM
var DOM = {
  // Get array of elements by query
  getElements: function getElements(query) {
    return document.querySelectorAll(query);
  },
  // Get first element only by query
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

// Events for handling the <bg> tag
// This is old code that might be recycled or trashed later
// Mouse move over animation to change speed of background
document.addEventListener('mousemove', function (event) {
  var mousePos = event.clientX;
  var width = window.innerWidth / 2;
  var ratio = (mousePos - width) / width;
  var speed = 20 / ratio;
  var animation = ratio < 0 ? 'grid-animate-right' : 'grid-animate-left'; // DOM.getFirstElement('bg').style.animation = `${animation} ${Math.abs(speed)}s linear infinite`;
});

},{"../Classes/DOM":1}]},{},[1,2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvQ2xhc3Nlcy9ET00uanMiLCJzcmMvanMvRXZlbnRzL0JnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0FDQUE7QUFFQSxJQUFNLEdBQUcsR0FBRztBQUNSO0FBQ0EsRUFBQSxXQUFXLEVBQUUscUJBQVMsS0FBVCxFQUFnQjtBQUN6QixXQUFPLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixLQUExQixDQUFQO0FBQ0gsR0FKTztBQU1SO0FBQ0EsRUFBQSxlQUFlLEVBQUUseUJBQVMsS0FBVCxFQUFnQjtBQUM3QixXQUFPLEtBQUssV0FBTCxDQUFpQixLQUFqQixFQUF3QixDQUF4QixDQUFQO0FBQ0g7QUFUTyxDQUFaO2VBWWUsRzs7Ozs7O0FDVmY7Ozs7QUFKQTtBQUVBO0FBSUE7QUFDQSxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsV0FBMUIsRUFBdUMsVUFBQSxLQUFLLEVBQUk7QUFDNUMsTUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLE9BQXJCO0FBQ0EsTUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLFVBQVAsR0FBb0IsQ0FBaEM7QUFDQSxNQUFJLEtBQUssR0FBRyxDQUFDLFFBQVEsR0FBRyxLQUFaLElBQXFCLEtBQWpDO0FBQ0EsTUFBSSxLQUFLLEdBQUcsS0FBSyxLQUFqQjtBQUNBLE1BQUksU0FBUyxHQUFHLEtBQUssR0FBRyxDQUFSLEdBQVksb0JBQVosR0FBbUMsbUJBQW5ELENBTDRDLENBTTVDO0FBQ0gsQ0FQRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vIFRoaXMgb2JqZWN0IGNvbnRhaW5zIGEgY29sbGVjdGlvbiBvZiBmdW5jdGlvbnMgZm9yIG1hbmlwdWxhdGluZyB0aGUgRE9NXHJcblxyXG5jb25zdCBET00gPSB7XHJcbiAgICAvLyBHZXQgYXJyYXkgb2YgZWxlbWVudHMgYnkgcXVlcnlcclxuICAgIGdldEVsZW1lbnRzOiBmdW5jdGlvbihxdWVyeSkge1xyXG4gICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHF1ZXJ5KTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gR2V0IGZpcnN0IGVsZW1lbnQgb25seSBieSBxdWVyeVxyXG4gICAgZ2V0Rmlyc3RFbGVtZW50OiBmdW5jdGlvbihxdWVyeSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldEVsZW1lbnRzKHF1ZXJ5KVswXTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRE9NOyIsIi8vIEV2ZW50cyBmb3IgaGFuZGxpbmcgdGhlIDxiZz4gdGFnXHJcblxyXG4vLyBUaGlzIGlzIG9sZCBjb2RlIHRoYXQgbWlnaHQgYmUgcmVjeWNsZWQgb3IgdHJhc2hlZCBsYXRlclxyXG5cclxuaW1wb3J0IERPTSBmcm9tICcuLi9DbGFzc2VzL0RPTSc7XHJcblxyXG4vLyBNb3VzZSBtb3ZlIG92ZXIgYW5pbWF0aW9uIHRvIGNoYW5nZSBzcGVlZCBvZiBiYWNrZ3JvdW5kXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGV2ZW50ID0+IHtcclxuICAgIGxldCBtb3VzZVBvcyA9IGV2ZW50LmNsaWVudFg7XHJcbiAgICBsZXQgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDI7XHJcbiAgICBsZXQgcmF0aW8gPSAobW91c2VQb3MgLSB3aWR0aCkgLyB3aWR0aDtcclxuICAgIGxldCBzcGVlZCA9IDIwIC8gcmF0aW87XHJcbiAgICBsZXQgYW5pbWF0aW9uID0gcmF0aW8gPCAwID8gJ2dyaWQtYW5pbWF0ZS1yaWdodCcgOiAnZ3JpZC1hbmltYXRlLWxlZnQnO1xyXG4gICAgLy8gRE9NLmdldEZpcnN0RWxlbWVudCgnYmcnKS5zdHlsZS5hbmltYXRpb24gPSBgJHthbmltYXRpb259ICR7TWF0aC5hYnMoc3BlZWQpfXMgbGluZWFyIGluZmluaXRlYDtcclxufSk7Il19
