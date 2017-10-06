console.log('rpcom 1.1.4');


//// Polyfill `[].indexOf()`:
//// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf#Polyfill
if (! Array.prototype.indexOf)
  Array.prototype.indexOf = function(searchValue, index) {
    var len = this.length >>> 0;
    index |= 0;
    if (index < 0)
      index = Math.max(len - index, 0);
    else if (index >= len)
      return -1;
    if (searchValue === undefined)
      do {
        if (index in this && this[index] === undefined)
          return index;
      } while (++index !== len)
    else
      do {
        if (this[index] === searchValue)
          return index;
      } while (++index !== len)
    return -1;
  };


$(function () { // on load

//// Handy shortcuts.
var $body = $('body')
  , $document = $(document)


//// Use Bootstrap’s tooltip component on all elements with a 'title' attribute.
// $('[title]').tooltip()

//// Remove ‘_ma_ling’ protection and replace at-sign.svg with a real '@'.
$('.ma_ling').each( function (i,el) {
    var $el = $(el)
    $el.attr( 'href', $el.attr('href').replace('_ma_ling','') )
    $('.at', $el).html('@')
})


//// Get all navigation-menu links.
var navs = []
$('#menu a').each( function () {
    var anchor, $target
    if (! ( anchor = this.href.match(/#[-a-z0-9]+$/) ) ) return
    if (0 === ( $target = $(anchor[0]) ).length ) return
    navs.push({
        anchor:  anchor[0].substr(1)
      , $link:   $(this)
      , $target: $target
    })
})

//// Highlight current section in the navigation menu.
var prevTop = null
$document.scroll(focusMenu)
function focusMenu () {
    if (! $body.hasClass('show-menu') ) return
    var currTop = $(this).scrollTop()
    if (prevTop === currTop) return
    prevTop = currTop
    prevNav = navs[0]
    for (var i=1, nav, prevNav; nav=navs[i]; i++) {
        prevNav = navs[i-1]
        if ( nav.$target.offset().top > currTop + 10 )
            return prevNav.$link.focus()
    }
}


//// Fix tabbing between links (will be broken when we infopop removes hrefs).
var tabindex
function resetTabindex () { tabindex = 1 }
function tabindexOn  () { this.setAttribute( 'tabindex', ''+(tabindex++) ) }
function tabindexOff () { this.setAttribute( 'tabindex', '-1' ) }
resetTabindex()
$('#content a, #foot a').each(tabindexOn)
$('#menu a').each(tabindexOff)


//// Enable the ‘menu’ button.
$('.menu-btn').on('click', function () {
    if ( $body.hasClass('show-menu') ) {
        closeMenu()
    } else {
        $body.addClass('show-menu')
        focusMenu()
        $('.menu-btn a, a.menu-btn').attr('title', 'Close the navigation menu')
        resetTabindex()
        $('#menu a').each(tabindexOn)
        $('#content a, #foot a').each(tabindexOff)
    }
})


//// Clicking the ‘cover’ should also close the menu.
$('#cover').on('click', function () {
    if ( $body.hasClass('show-menu') )
        closeMenu()
})


//// Deal with navigation-menu clicks, and also clicks on <A> elements in the
//// main content.
$('#menu, #content a').on('click', function (evt) {
    closeMenu()
    var anchor, $target
    if (evt.target && evt.target.href) {
        if ( anchor = evt.target.href.match(/#[-a-z0-9]+$/) ) {
            if ( $target = $(anchor[0]) ) {
                evt.preventDefault()
                $('html, body')
                   .delay(250)
                   .animate(
                        { scrollTop: $target.offset().top }
                      , 1000
                    //   , function () { console.log(anchor[0]);window.location = anchor[0] }
                    )
            }
        }
    }
})

function closeMenu () {
    $body.removeClass('show-menu')
    $('.menu-btn a, a.menu-btn').attr('title', 'Open the navigation menu')
    resetTabindex()
    $('#content a, #foot a').each(tabindexOn)
    $('#menu a').each(tabindexOff)
}

// //// Tell CSS that the fonts are ready, as soon as they’ve loaded.
// $('html').removeClass('pre-font')


//// All JavaScript files have initialised. See richplastow.com/support/I4.md
setTimeout( function () {
window.dispatchEvent(new CustomEvent('JS-ok'))
},4000)

})
