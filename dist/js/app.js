"use strict";$(function(){$("html,body").on("click",function(e){e.target==document.documentElement&&$("html").removeClass("open-sidebar")}),$(".js-open-sidebar").on("click",function(){$("html").addClass("open-sidebar")})});