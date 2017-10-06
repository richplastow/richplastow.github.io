console.log('infopop 20171006');


$(function () { // on load

//// Local variables.
var $window  = $(window)
  , $body    = $('body')
  , $infopop = $('#infopop')
  , $message = $('#infopop .infopop-message')
  , $button  = $('#infopop .infopop-button')
  , $arrow   = $('#infopop .infopop-arrow')
  , glossary = {}
  , prefixes = {
        'Learn more about ': {} // default width, height and style
      , 'Donate to '       : {}
      , 'Try out '         : { style:'demo' }
      , 'Read the '        : { height:95, style:'case-study', svg:internalSVG }
      , 'Drop me an '      : { height:95, style:'contact'}
      , 'Visit my '        : { height:95, style:'contact'}
      , 'Check out my '    : { height:95, style:'contact'}
      , 'Follow me on '    : { height:95, style:'contact'}
    }

//// Populate the glossary.
$('.infopop-glossary').each( function () { // each glossary <article>
    $('details', $(this)).each( function () { // each article’s <details>
        glossary[ $('summary', $(this)).text().toLowerCase() ] = // eg 'the bbc'
            $('p', $(this)).html() // eg 'The <b>British Broadcasting ...'
    })
})


//// The infopop should disappear on window-resize, or when anything is clicked.
$window.on('resize click', closeInfopop)
$('body, #navigation, #content').on('click', closeInfopop) // iOS Safari 7
$message.click( function (evt) { evt.stopPropagation() } )


//// The infopop should disappear when it scrolls out of view.
$window.on('scroll', function () {
    if (! $body.hasClass('show-infopop') ) return // not currently shown
    var windowTop = $window.scrollTop()
      , windowBottom = windowTop + $window.height()
      , infopopTop = $infopop.offset().top
    if ( // infopop is below window bottom or above window top
        ( windowBottom < infopopTop )
     || ( windowTop > infopopTop + $infopop.height() )
    ) return closeInfopop()
})


//// Enable infopop-button.
$button.click(function (evt) {
    var href = $(this).data().href
      , fragment = href.split('#').slice(1).join('#')
      , $menuLink = $('#menu a[href$="#' + fragment + '"]')
    if ($menuLink[0]) // internal
        $menuLink.click()
    else // external
        window.open(href)
})


//// Enable infopop on every link which is described in the glossary.
$('a').each( function () { // step through every <a> element
    var p, summary, width, height, style, svg
      , title = this.title, href = this.href

    if (! href) return // has no `href` attribute

    //// Make sure that the link has a glossary entry.
    for (p in prefixes)
        if ( p === title.substr(0, p.length) ) {
            summary = title.substr(p.length).toLowerCase()
            break
        }

    if (! summary) return // title does not begin with a recognised prefix
    if (! glossary[summary] ) return // summary does not exist in the glossary

    //// Get the width, height and style.
    width  = prefixes[p].width  || 200
    height = prefixes[p].height || 150
    style  = prefixes[p].style  || 'default'
    svg    = prefixes[p].svg    || externalSVG

    //// Improve title formatting.
    if ('case-study' === style) { // case study titles need special rearranging
        title =
            summary.slice(0, -11) // trim ' case study' from the end
          + ':<br><span class="infopop-underline">'
          + 'Read the Case Study</span>'
    } else if ('demo' === style) { // demo titles need special rearranging
        title =
            summary
          + ':<br><span class="infopop-underline">'
          + 'Try It Out Online</span>'
    } else {
        title =
            p // eg 'Learn more about '
          + '<br><span class="infopop-underline">'
          + summary // eg 'Web applications'
          + '</span>'
    }

    //// Prepare the <a> element for displaying an infopop.
    $(this)
       .data('infopop', {
            title: title
          , message: glossary[summary]
          , width: width
          , height: height
          , style: style
          , href: href
          , svg: svg
         })
       .removeAttr('title')
       .removeAttr('href') // prevent browser’s status-bar opening on hover
       .keypress( function (evt) { if (13 === evt.which) $(this).click() })
       .click( function (evt) {
            var offset, top, left, scrollTop, gap
              , $el = $(this), data = $el.data('infopop')
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

            //// Reset the class attribute.
            $infopop[0].className = 'infopop-' + data.style

            //// fit the infopop either above or below the link.
            top = offset.top - data.height - 20
            gap = top - scrollTop // to top
            if (0 < top) { // there IS enough room above the link
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
                gap = scrollTop + $window.height() - top - data.height // to bottom
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

            //// Tweak `left` in the footer.
            if ('footer-email-sm-up' === this.id)
                left = $('span', $el).offset().left - 10
            else if ( $el.hasClass('footer-icon') )
                left = $('svg', $el).offset().left - 10
            else
                left = offset.left - 10

            //// Fit the infopop to the left or right edge of the link.
            gap = $window.width() - left - data.width // to right
            if (25 > gap) {
                if ('footer-email-sm-up' === this.id)
                    left += $('span', $el).width() - data.width + 20
                else if ( $el.hasClass('footer-icon') )
                    left += $('svg', $el).width() - data.width + 20
                else
                    left += $el.width() - data.width + 20
                $infopop.addClass('infopop-arrow-right')
            }
            if ( 50 > left && ! $el.hasClass('footer-icon') ) {
                $arrow.css( 'margin-left', Math.max(10, offset.left - 50) )
                left = 50
            } else {
                $arrow.removeAttr('style')
            }
            // console.log(left);

            //// If not currently visible, immediatesly move the infopop just
            //// below its proper position.
            if (! $body.hasClass('show-infopop') ) {
                $infopop.show()
                $body.removeClass('infopop-transition')
                $infopop.css({
                    top:  top + 50
                  , left: left
                })
            }

            //// Next tick, CSS-transition the infopop to its proper position.
            setTimeout( function () {
                $body.addClass('infopop-transition')
                $infopop.css({
                    top:  top
                  , left: left
                })
                // console.log(top, left);
            }, 1)

            $message
               .html( data.message )
            $button
               .html( data.svg() + data.title )
               .data({ href:href })
            $body.addClass('show-infopop')
       })

})

function externalSVG () {
    return [
        '<span class="infopop-icon">'
      , '  <svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640">'
      , '    <rect x="40" y="290" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -132.5485 320)" width="560" height="60"></rect>'
      , '    <rect x="120" y="80" width="440" height="60"></rect>'
      , '    <rect x="500" y="80" width="60" height="440"></rect>'
      , '  </svg>'
      , '</span>'
    ].join('\n')
}

function internalSVG () {
    return [
        '<span class="infopop-icon">'
      , '  <svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640">'
      , '    <rect x="400.009" y="40" width="60" height="475.693"></rect>'
      , '    <rect x="373.674" y="439" transform="matrix(-0.7071 0.7071 -0.7071 -0.7071 1174.308 451.7829)" width="239.824" height="60"></rect>'
      , '    <rect x="246.52" y="439" transform="matrix(0.7071 0.7071 -0.7071 0.7071 439.0275 -121.7103)" width="239.823" height="60"></rect>'
      , '  </svg>'
      , '</span>'
    ].join('\n')
}

function closeInfopop () {
    $body.removeClass('show-infopop')
    $('.current-infopop').removeClass('current-infopop')
    setTimeout( function () {
        if (! $body.hasClass('show-infopop') )
            $infopop.hide() // prevent big empty space below footer after resize
    }, 600)
}


})
