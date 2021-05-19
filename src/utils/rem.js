function updateFontSize() {
    var width = document.documentElement.getBoundingClientRect().width
    var fontSize
    if (width <= 1200) {
        width = 1200
        // document.body.style.width = width + 'px'
        document.body.style['min-width'] = width + 'px'
        document.body.style.margin = '0 auto'
    }
    // if (width >= 3840) {
    //     width = 3840
    //     // document.body.style.width = width + 'px'
    //     document.body.style['max-width'] = width + 'px'
    //     document.body.style.margin = '0 auto'
    // }
    fontSize = width / 19.2
    document.documentElement.style.fontSize = fontSize + 'px'
}
updateFontSize()
window.addEventListener('resize', function () {
    updateFontSize()
})