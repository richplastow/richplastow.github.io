CustomEventIE
=============

### Tiny HTML snippet which polyfills `window.CustomEvent` in Internet Explorer 9+

+ __Last update:__  2017/07/01
+ __Version:__      1.0.0


Author
------
Created by Rich Plastow, during development of richplastow.com.

+ __LinkedIn:__     [richardplastow](https://linkedin.com/in/richardplastow)
+ __GitHub:__       [richplastow](https://github.com/richplastow)
+ __Twitter:__      [@BtnWebVR](https://twitter.com/BtnWebVR)
+ __Location:__     Brighton, UK


Tested
------
+ __Windows 10:__   IE 11
+ __Windows 8.1:__  IE 11, IE 11 metro
+ __Windows 8:__    IE 10, IE 10 metro
+ __Windows 7:__    IE 9, IE 10, IE 11


Changelog
---------
+ 1.0.0       works for richplastow.com; need to test bubbles, cancelable, etc




Minified
--------

Just add the following into your web page’s `<head>` element, placed __before__
any scripts which use `new CustomEvent('my-lovely-event')`:

```html

<!-- Polyfill CustomEvent for IE9+. richplastow.com/support/CustomEventIE.md -->
<script>!function(W,C,P){/^f/.test(typeof W[C])?0:(W[C]=function(e,p,_){p=p||{}
_=document.createEvent(C);_.initCustomEvent(e,!!p.bubbles,!!p.cancelable,
p.detail);return _},W[C][P]=Event[P])}(this,'CustomEvent','prototype')</script>

```


Verbose
-------
Here’s the same code, indented and commented:

```html

<!-- Polyfill CustomEvent for IE9+. richplastow.com/support/CustomEventIE.md -->
<script>
!function(
  W, // the window object - the `this` keyword refers to the window, saving 2b!
  C, // the string 'CustomEvent' saves bytes
  P  // the string 'prototype' saves bytes
){
  /^f/.test( // in modern browsers, `typeof window.CustomEvent` is 'function'
    typeof W[C] // in IE10/11, `typeof window.CustomEvent` is 'object'
  ) ? 0 // passed the test, so do nothing (JavaScript wont allow `?:`)
  :( // failed, so do the polyfill
    W[C]=function(e,p,_){ // equivalent to MDN’s `event`, `params` and `evt`
      p=p||{} // we can do without defining `bubbles`, `cancelable` and `detail`
      _=document.createEvent(C); // old way of creating an event
      _.initCustomEvent(e,!!p.bubbles,!!p.cancelable,p.detail); // assign params
      return _
    },
    W[C][P]=Event[P] // window.CustomEvent.prototype = window.Event.prototype
   )
}(this,'CustomEvent','prototype') // pass arguments into the closure
</script>

```


Source
------
The original code is from MDN’s CustomEvent
[polyfill](//developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent),
reproduced below:

```js

(function () {

  if ( typeof window.CustomEvent === "function" ) return false;

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

```
