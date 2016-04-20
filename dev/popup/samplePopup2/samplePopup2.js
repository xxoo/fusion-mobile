define(['site/kernel/kernel'], function(kernel){
    return {
        //如果指定了这个方法则需要在其中调用kernel.showPopup(thispopup)来显示此弹窗
        onloadend:function(param){
            kernel.setPopupBackParam('going back to samplePopup');
        }
    }
});