"use strict";define(["module","common/kernel/kernel"],function(e,n){var o=e.id.replace(/^[^\/]+\/|\/[^\/]+/g,""),t=document.querySelector("#page>.content>."+o),r=0;return t.querySelector("a").addEventListener("click",function(){n.openPopup("samplePopup",++r)},!1),{autoDestroy:!0}});