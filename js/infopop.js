console.log('INFOPOP 20171004');


$(function () { // on load

//// Local variables.
var $window  = $(window)
  , $body    = $('body')
  , $infopop = $('#infopop')
  , $message = $('#infopop .infopop-message')
  , $button  = $('#infopop .infopop-button')
  , $arrow   = $('#infopop .infopop-arrow')
  , glossary = {}
  , prefixes = [
        'Learn more about '
      , 'Zoop voop '
    ]


//// Populate the glossary.
$('.infopop-glossary').each( function () { // each glossary <article>
    $('details', $(this)).each( function () { // each article’s <details>
        glossary[ $('summary', $(this)).text().toLowerCase() ] = // eg 'the bbc'
            $('p', $(this)).html() // eg 'The <b>British Broadcasting ...'
    })
})


//// The infopop should disappear on window-resize, or when anything is clicked.
$(window).on('resize click', closeInfopop)
$('body, #navigation, #content').on('click', closeInfopop) // iOS Safari 7
$message.click( function (evt) { evt.stopPropagation() } )


//// Enable infopop on every link which is described in the glossary.
$('a').each( function () { // step through every <a> element
    var i, summary, title = this.title

    if (! this.href) return // has no `href` attribute

    //// Make sure that the link has a glossary entry.
    for (i in prefixes)
        if ( prefixes[i] === title.substr(0, prefixes[i].length) ) {
            summary = title.substr(prefixes[i].length).toLowerCase()
            break
        }
    if (! summary) return // title does not begin with a recognised prefix
    if (! glossary[summary] ) return // summary does not exist in the glossary

    //// Improve title formatting.
    title =
       prefixes[i] // eg 'Learn more about '
     + '<br><span class="infopop-underline">'
     + summary // eg 'Web applications'
     + '</span>'

    //// Prepare the <a> element for displaying an infopop.
    $(this)
       .data('infopop', { title:title, message:glossary[summary] })
       .removeAttr('title')
       .click( function (evt) {
            var offset, top, left, scrollTop, gap
              , $el = $(this)
            evt.preventDefault() // don’t navigate to the link
            evt.stopPropagation() // don’t let the click reach `window`

            $infopop.show()

            //// Clicking a second time on a link just closes the infopop.
            if ( $el.hasClass('current-infopop') )
                return closeInfopop()
            $('.current-infopop').removeClass('current-infopop')
            $el.addClass('current-infopop')

            //// Set the infopop’s position.
            offset = $el.offset()
            scrollTop = $window.scrollTop()

            //// fit the infopop either above or below the link.
            top = offset.top - 150 - 20
            gap = top - scrollTop // to top
            if (0 < top) { // there IS enough room above the link
                $infopop.removeClass('infopop-arrow-bottom')
                if (50 < gap) {
                    // no need to scroll
                } else {
                    $('html, body')
                       .animate(
                            { scrollTop: scrollTop + gap - 50 }
                          , 500
                        )
                }
            } else { // there’s NOT enough room above the link
                $infopop.addClass('infopop-arrow-bottom')
                top = offset.top + $el.height() + 20
                gap = scrollTop + $window.height() - top - 150 // to bottom
                if (50 < gap) {
                    // no need to scroll
                } else {
                    $('html, body')
                       .animate(
                            { scrollTop: scrollTop - gap + 50 }
                          , 500
                        )
                }
            }

            //// fit the infopop to the left or right edge of the link.
            left = offset.left - 10
            gap = $window.width() - left - 200 // to right
            if (25 > gap) {
                left += $el.width() - 200 + 20
                $infopop.addClass('infopop-arrow-right')
            } else {
                $infopop.removeClass('infopop-arrow-right')
            }
            if (50 > left) {
                $arrow.css( 'margin-left', Math.max(10, offset.left - 50) )
                left = 50
            } else {
                $arrow.removeAttr('style')
            }

            $infopop.css({
                top:  top
              , left: left
            })

            $message
               .html( $el.data('infopop').message )
            $button
               .html( getLinkSVG() + $el.data('infopop').title )
               .attr('href', this.href)
            //    .attr('title', 'Open an external link in a new window') // a bit obvious
            $body.addClass('show-infopop')
       })

})

function getLinkSVG () {
    return [
        '<span class="infopop-icon">'
      , '  <svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640">'
      , '    <rect x="40" y="290.001" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -132.5485 320)" width="560" height="60"></rect>'
      , '    <rect x="120" y="80" width="440" height="60"></rect>'
      , '    <rect x="500" y="80" width="60" height="440"></rect>'
      , '  </svg>'
      , '</span>'
    ].join('\n')
}

function closeInfopop () {
    $body.removeClass('show-infopop')
    $('.current-infopop').removeClass('current-infopop')
}


})
