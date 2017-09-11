console.log('RPCOM 0.3.1');

$(function () { // on load


//// Use Bootstrap’s tooltip component on all elements with a 'title' attribute.
// $('[title]').tooltip()

//// Remove ‘_ma_ling’ protection and replace at-sign.svg with a real '@'.
$('.ma_ling').each( function (i,el) {
    var $el = $(el)
    $el.attr( 'href', $el.attr('href').replace('_ma_ling','') )
    $('.at', $el).html('@')
})

//// Enable the ‘share’ and ‘menu’ buttons.
$('.share-btn').on('click', function () {
    $('body').removeClass('show-menu')
             .toggleClass('show-share')
})
$('.menu-btn').on('click', function () {
    $('body').removeClass('show-share')
             .toggleClass('show-menu')
})

//// Prevent browser’s status-bar opening when a footer link is hovered.
$('#foot a[href]').each( function (i,el) {
    var $el = $(el)
      , href  = $el.attr('href')
    $el.removeAttr('href')
       .on('click', function () { window.location = href })
})

// //// Tell CSS that the fonts are ready, as soon as they’ve loaded.
// $('html').removeClass('pre-font')

//// All JavaScript files have initialised. See richplastow.com/support/I4.md
setTimeout( function () {
window.dispatchEvent(new CustomEvent('JS-ok'))
},4000)

})
