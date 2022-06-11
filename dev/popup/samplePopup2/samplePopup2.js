'use strict';
define(['module', 'common/fusion/fusion'], function (module, fusion) {
    var thispopup = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
        dom = document.querySelector('#popup>.content>.' + thispopup);
    return {
        onloadend: function () {
            fusion.setPopupBack('samplePopup', 'going back to samplePopup');
        }
    };
});