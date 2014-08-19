var MTUserId=rotisUser;
var MTFontIds = new Array();

MTFontIds.push("735476"); // Rotis® Serif W01 55 Roman 
MTFontIds.push("735473"); // Rotis® Serif W01 56 Italic 
MTFontIds.push("735470"); // Rotis® Serif W01 65 Bold 

(function() {
    var mtTracking = document.createElement('script');
    mtTracking.type='text/javascript';
    mtTracking.async='true';
    mtTracking.src=('https:'==document.location.protocol?'https:':'http:')+'//fast.fonts.net/lt/trackingCode.js';

    (document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')[0]).appendChild(mtTracking);
})();