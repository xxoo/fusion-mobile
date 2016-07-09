'use strict';
define(['module', 'common/kernel/kernel'], function(module, kernel){
    var thispopup = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
        dom = document.querySelector('#popup>.content>.'+thispopup);
    return {
        onloadend:function(param){
            kernel.setPopupBackParam('going back to samplePopup');
        }
    }
});