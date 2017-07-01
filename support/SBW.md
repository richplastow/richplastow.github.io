SBW
===

Tiny HTML snippet which tells CSS the current browser’s scrollbar-width
-----------------------------------------------------------------------
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
+ __Android:__      Browser 4.4+
+ __iOS:__          Safari 7+
+ __Windows 10:__   Edge 14+, IE 11
+ __Windows 7:__    IE 10
+ __Windows XP:__   Firefox 29+, Chrome 22+, Opera 15+
+ __OS X M’Lion:__  Safari 6.2+
+ __OS X El Cap’:__ Firefox 53, Chrome 59, Opera 46 (maybe 16px?), Safari 9.1


Changelog
---------
+ 1.0.0       works for richplastow.com, but will need tweaks for wider adoption




Usage
=====

Just add the following into your web page’s `<head>` element, placed __before__
your stylesheets:

```html

<!-- Tell CSS this browser’s scrollbar-width. richplastow.com/support/SBW.md -->
<script>document.documentElement.classList.add('SBW-'+(navigator.userAgent.match
(/Edge\/\d+/)?12:{Mac:15,Win:17}[navigator.platform.slice(0,3)]||0))</script>

```


Verbose
-------
Here’s the same code, indented and commented:

```html

<!-- Tell CSS this browser’s scrollbar-width. richplastow.com/support/SBW.md -->
<script>
document.documentElement.classList.add( // add a class-name...
  'SBW-'+( // ...beginning with the text 'SBW-'
    navigator.userAgent.match(/ Edge/) // Microsoft Edge is a special case...
      ? 12 // ...its scrollbars are only 12 pixels wide
      : { Mac:15, Win:17 }[n.platform.slice(0,3)] // eg 'MacIntel' or 'Win32'
        || 0 // some other device - see stackoverflow.com/a/19883965
    ) // one of four class names: SBW-12, SBW-15, SBW-17, or SBW-0
  ) //add()
</script>

```
