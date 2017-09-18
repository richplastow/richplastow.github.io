console.log('RPCOM 1.0.0');

$(function () { // on load


//// Use Bootstrap’s tooltip component on all elements with a 'title' attribute.
// $('[title]').tooltip()

//// Remove ‘_ma_ling’ protection and replace at-sign.svg with a real '@'.
$('.ma_ling').each( function (i,el) {
    var $el = $(el)
    $el.attr( 'href', $el.attr('href').replace('_ma_ling','') )
    $('.at', $el).html('@')
})

//// Keep track of the user’s focus.
var $contentFocus
$('#content a').on('focus', function () { $contentFocus = $(this) })


//// Enable the ‘menu’ button.
var $body = $('body')
$('.menu-btn').on('click', function () {
    if ( $body.hasClass('show-menu') ) {
        closeMenu()
    } else {
        $body.addClass('show-menu')
        $('#menu').focus()
        $('.menu-btn a, a.menu-btn').attr('title', 'Close the navigation menu')
        $('#content a').each(
            function () { this.setAttribute('tabindex', '-1') }
        )
        $('#menu a').each(
            function () { this.removeAttribute('tabindex') }
        )
    }
})

//// Clicking the ‘cover’ should also close the menu.
$('#cover').on('click', function () {
    if ( $body.hasClass('show-menu') )
        closeMenu()
})

//// Deal with navigation-menu clicks.
$('#menu').on('click', function (evt) {
    closeMenu()
    var anchor, target
    if (evt.target && evt.target.href) {
        if ( anchor = evt.target.href.match(/#[-a-z0-9]+$/) ) {
            if ( $target = $(anchor[0]) ) {
                evt.preventDefault()
                $('html, body')
                   .delay(250)
                   .animate(
                        { scrollTop: $target.offset().top }
                      , 1000
                    )
            }
        }
    }
})

function closeMenu () {
    $body.removeClass('show-menu')
    $('#menu a').each(
        function () { this.setAttribute('tabindex', '-1') }
    )
    $('#content a').each(
        function () { this.removeAttribute('tabindex') }
    )
    $('.menu-btn a, a.menu-btn').attr('title', 'Open the navigation menu')
    if ($contentFocus) $contentFocus.focus()
}

//// Prevent browser’s status-bar opening when a footer link is hovered.
$('#foot a[href]').each( function (i,el) {
    var $el = $(el)
      , href  = $el.attr('href')
    $el.removeAttr('href')
       .on('click', function () { window.open(href) })
})

// //// Tell CSS that the fonts are ready, as soon as they’ve loaded.
// $('html').removeClass('pre-font')

//// All JavaScript files have initialised. See richplastow.com/support/I4.md
setTimeout( function () {
window.dispatchEvent(new CustomEvent('JS-ok'))
},4000)

})
