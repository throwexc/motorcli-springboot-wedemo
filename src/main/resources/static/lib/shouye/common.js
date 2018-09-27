var SYS_PATH = "http://localhost:8080";
(function() {

    function getQueryParam(name) {
        var regex = RegExp('[?&]' + name + '=([^&]*)');

        var match = regex.exec(location.search) || regex.exec(path);
        return match && decodeURIComponent(match[1]);
    }

    var scriptEls = document.getElementsByTagName("script"),
        path = scriptEls[scriptEls.length - 1].src,
        i = 2;

    while (i--) {
        path = path.substring(0, path.lastIndexOf('/'));
    }
    SYS_PATH = path;
})();