define(['site/kernel/kernel'], function(kernel){
    return {
        onloadend:function(param){
            kernel.setPopupBackParam('going back to samplePopup');
        }
    }
});