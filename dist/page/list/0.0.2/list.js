"use strict";define("page/list/list",["module","common/kernel/kernel"],function(t,q){var l=t.id.replace(/^[^\/]+\/|\/[^\/]+/g,"");document.querySelector("#page>.content>."+l);return{onload:function(t){t?q.alert("opening list page"):q.alert("going back to list page")},onloadend:function(){},onunload:function(){},onunloadend:function(){}}});