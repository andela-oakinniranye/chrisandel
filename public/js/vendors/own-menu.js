jQuery.fn.ownmenu = function (options) {
  var settings = {
    indicator: true,
    speed: 10,
    delay: 0,
    hideDelay: 200,
    hideClickOut: true,
    align: "left",
    submenuTrigger: "hover"
  }
  $.extend(settings, options);
  var menu = $(".ownmenu");
  var lastScreenWidth = window.innerWidth;
  var bigScreen = false;
  $(menu).prepend("<li class='showhide'><span class='title'></span><span class='icon fa fa-bars'></span></li>");
  if (settings.indicator == true) {
    $(menu).find("a").each(function () {
      if ($(this).siblings(".dropdown, .megamenu").length > 0) {
        $(this).append("<span class='indicator'><i class='fa fa-angle-right'></i></span>");
      }
    });
  }
  screenSize();
  $(window).resize(function () {
    if (lastScreenWidth <= 767 && window.innerWidth > 767) {
      unbindEvents();
      hideCollapse();
      bindHover();
      if (settings.align == "right" && bigScreen == false) {
        rightAlignMenu();
        bigScreen = true;
      }
    }
    if (lastScreenWidth > 767 && window.innerWidth <= 767) {
      unbindEvents();
      showCollapse();
      bindClick();
      if (bigScreen == true) {
        rightAlignMenu();
        bigScreen = false;
      }
    }
    if (settings.align == "right") {
      if (lastScreenWidth > 767 && window.innerWidth > 767) fixSubmenuRight();
    } else {
      if (lastScreenWidth > 767 && window.innerWidth > 767) fixSubmenuLeft();
    }
    lastScreenWidth = window.innerWidth;
  });

  function screenSize() {
    if (window.innerWidth <= 767) {
      showCollapse();
      bindClick();
      if (bigScreen == true) {
        rightAlignMenu();
        bigScreen = false;
      };
    } else {
      hideCollapse();
      bindHover();
      if (settings.align == "right") {
        rightAlignMenu();
        bigScreen = true;
      } else {
        fixSubmenuLeft();
      }
    }
  }

  function bindHover() {
    if (navigator.userAgent.match(/Mobi/i) || window.navigator.msMaxTouchPoints > 0 || settings.submenuTrigger == "click") {
      $(menu).find("a").on("click touchstart", function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).parent("li").siblings("li").find(".dropdown, .megamenu").stop(true, true).fadeOut(settings.speed);
        if ($(this).siblings(".dropdown, .megamenu").css("display") == "none") {
          $(this).siblings(".dropdown, .megamenu").stop(true, true).delay(settings.delay).fadeIn(settings.speed);
          return false;
        } else {
          $(this).siblings(".dropdown, .megamenu").stop(true, true).fadeOut(settings.speed);
          $(this).siblings(".dropdown").find(".dropdown").stop(true, true).fadeOut(settings.speed);
        }
        window.location.href = $(this).attr("href");
      });
      $(menu).find("li").bind("mouseleave", function () {
        $(this).children(".dropdown, .megamenu").stop(true, true).fadeOut(settings.speed);
      });
      if (settings.hideClickOut == true) {
        $(document).bind("click.menu touchstart.menu", function (ev) {
          if ($(ev.target).closest(menu).length == 0) {
            $(menu).find(".dropdown, .megamenu").fadeOut(settings.speed);
          }
        });
      }
    } else {
      $(menu).find("li").bind("mouseenter", function () {
        $(this).children(".dropdown, .megamenu").stop(true, true).delay(settings.delay).fadeIn(settings.speed);
      }).bind("mouseleave", function () {
        $(this).children(".dropdown, .megamenu").stop(true, true).delay(settings.hideDelay).fadeOut(settings.speed);
      });
    }
  }

  function bindClick() {
    $(menu).find("li:not(.showhide)").each(function () {
      if ($(this).children(".dropdown, .megamenu").length > 0) {
        $(this).children("a").bind("click", function (e) {
          if ($(this).siblings(".dropdown, .megamenu").css("display") == "none") {
            $(this).siblings(".dropdown, .megamenu").delay(settings.delay).slideDown(settings.speed).focus();
            $(this).parent("li").siblings("li").find(".dropdown, .megamenu").slideUp(settings.speed);
            return false;
          } else {
            $(this).siblings(".dropdown, .megamenu").slideUp(settings.speed).focus();
            firstItemClick = 1;
          }
        });
      }
    });
  }

  function showCollapse() {
    $(menu).children("li:not(.showhide)").hide(0);
    $(menu).children("li.showhide").show(0);
    $(menu).children("li.showhide").bind("click", function () {
      if ($(menu).children("li").is(":hidden")) {
        $(menu).children("li").slideDown(settings.speed);
      } else {
        $(menu).children("li:not(.showhide)").slideUp(settings.speed);
        $(menu).children("li.showhide").show(0);
        $(menu).find(".dropdown, .megamenu").hide(settings.speed);
      }
    });
  }

  function hideCollapse() {
    $(menu).children("li").show(0);
    $(menu).children("li.showhide").hide(0);
  }

  function rightAlignMenu() {
    $(menu).children("li").addClass("jsright");
    var items = $(menu).children("li");
    $(menu).children("li:not(.showhide)").detach();
    for (var i = items.length; i >= 1; i--) {
      $(menu).append(items[i]);
    }
    fixSubmenuRight();
  }

  function fixSubmenuRight() {
    $(menu).children("li").removeClass("last");
    var items = $(menu).children("li");
    for (var i = 1; i <= items.length; i++) {
      if ($(items[i]).children(".dropdown, .megamenu").length > 0) {
        var lastItemsWidth = 0;
        for (var y = 1; y <= i; y++) {
          lastItemsWidth = lastItemsWidth + $(items[y]).outerWidth();
        }
        if ($(items[i]).children(".dropdown, .megamenu").outerWidth() > lastItemsWidth) {
          $(items[i]).addClass("last");
        }
      }
    }
  }

  function fixSubmenuLeft() {
    $(menu).children("li").removeClass("fix-sub");
    var items = $(menu).children("li");
    var menuWidth = $(menu).outerWidth();
    var itemsWidth = 0;
    for (var i = 1; i <= items.length; i++) {
      if ($(items[i]).children(".dropdown, .megamenu").length > 0) {
        if ($(items[i]).position().left + $(items[i]).children(".dropdown, .megamenu").outerWidth() > menuWidth) {
          $(items[i]).addClass("fix-sub");
        }
      }
    }
  }

  function unbindEvents() {
    $(menu).find("li, a").unbind();
    $(document).unbind("click.menu touchstart.menu");
    $(menu).find(".dropdown, .megamenu").hide(0);
  }
}
$(document).ready(function ($) {
  "use strict"
  $().ownmenu();
});
/*!
Waypoints - 3.1.1
Copyright © 2011-2015 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/waypoints/blog/master/licenses.txt
*/
! function () {
  "use strict";

  function t(o) {
    if (!o) throw new Error("No options passed to Waypoint constructor");
    if (!o.element) throw new Error("No element option passed to Waypoint constructor");
    if (!o.handler) throw new Error("No handler option passed to Waypoint constructor");
    this.key = "waypoint-" + e, this.options = t.Adapter.extend({}, t.defaults, o), this.element = this.options.element, this.adapter = new t.Adapter(this.element), this.callback = o.handler, this.axis = this.options.horizontal ? "horizontal" : "vertical", this.enabled = this.options.enabled, this.triggerPoint = null, this.group = t.Group.findOrCreate({
      name: this.options.group,
      axis: this.axis
    }), this.context = t.Context.findOrCreateByElement(this.options.context), t.offsetAliases[this.options.offset] && (this.options.offset = t.offsetAliases[this.options.offset]), this.group.add(this), this.context.add(this), i[this.key] = this, e += 1
  }
  var e = 0,
    i = {};
  t.prototype.queueTrigger = function (t) {
    this.group.queueTrigger(this, t)
  }, t.prototype.trigger = function (t) {
    this.enabled && this.callback && this.callback.apply(this, t)
  }, t.prototype.destroy = function () {
    this.context.remove(this), this.group.remove(this), delete i[this.key]
  }, t.prototype.disable = function () {
    return this.enabled = !1, this
  }, t.prototype.enable = function () {
    return this.context.refresh(), this.enabled = !0, this
  }, t.prototype.next = function () {
    return this.group.next(this)
  }, t.prototype.previous = function () {
    return this.group.previous(this)
  }, t.invokeAll = function (t) {
    var e = [];
    for (var o in i) e.push(i[o]);
    for (var n = 0, r = e.length; r > n; n++) e[n][t]()
  }, t.destroyAll = function () {
    t.invokeAll("destroy")
  }, t.disableAll = function () {
    t.invokeAll("disable")
  }, t.enableAll = function () {
    t.invokeAll("enable")
  }, t.refreshAll = function () {
    t.Context.refreshAll()
  }, t.viewportHeight = function () {
    return window.innerHeight || document.documentElement.clientHeight
  }, t.viewportWidth = function () {
    return document.documentElement.clientWidth
  }, t.adapters = [], t.defaults = {
    context: window,
    continuous: !0,
    enabled: !0,
    group: "default",
    horizontal: !1,
    offset: 0
  }, t.offsetAliases = {
    "bottom-in-view": function () {
      return this.context.innerHeight() - this.adapter.outerHeight()
    },
    "right-in-view": function () {
      return this.context.innerWidth() - this.adapter.outerWidth()
    }
  }, window.Waypoint = t
}(),
function () {
  "use strict";

  function t(t) {
    window.setTimeout(t, 1e3 / 60)
  }

  function e(t) {
    this.element = t, this.Adapter = n.Adapter, this.adapter = new this.Adapter(t), this.key = "waypoint-context-" + i, this.didScroll = !1, this.didResize = !1, this.oldScroll = {
      x: this.adapter.scrollLeft(),
      y: this.adapter.scrollTop()
    }, this.waypoints = {
      vertical: {},
      horizontal: {}
    }, t.waypointContextKey = this.key, o[t.waypointContextKey] = this, i += 1, this.createThrottledScrollHandler(), this.createThrottledResizeHandler()
  }
  var i = 0,
    o = {},
    n = window.Waypoint,
    r = window.onload;
  e.prototype.add = function (t) {
    var e = t.options.horizontal ? "horizontal" : "vertical";
    this.waypoints[e][t.key] = t, this.refresh()
  }, e.prototype.checkEmpty = function () {
    var t = this.Adapter.isEmptyObject(this.waypoints.horizontal),
      e = this.Adapter.isEmptyObject(this.waypoints.vertical);
    t && e && (this.adapter.off(".waypoints"), delete o[this.key])
  }, e.prototype.createThrottledResizeHandler = function () {
    function t() {
      e.handleResize(), e.didResize = !1
    }
    var e = this;
    this.adapter.on("resize.waypoints", function () {
      e.didResize || (e.didResize = !0, n.requestAnimationFrame(t))
    })
  }, e.prototype.createThrottledScrollHandler = function () {
    function t() {
      e.handleScroll(), e.didScroll = !1
    }
    var e = this;
    this.adapter.on("scroll.waypoints", function () {
      (!e.didScroll || n.isTouch) && (e.didScroll = !0, n.requestAnimationFrame(t))
    })
  }, e.prototype.handleResize = function () {
    n.Context.refreshAll()
  }, e.prototype.handleScroll = function () {
    var t = {},
      e = {
        horizontal: {
          newScroll: this.adapter.scrollLeft(),
          oldScroll: this.oldScroll.x,
          forward: "right",
          backward: "left"
        },
        vertical: {
          newScroll: this.adapter.scrollTop(),
          oldScroll: this.oldScroll.y,
          forward: "down",
          backward: "up"
        }
      };
    for (var i in e) {
      var o = e[i],
        n = o.newScroll > o.oldScroll,
        r = n ? o.forward : o.backward;
      for (var s in this.waypoints[i]) {
        var a = this.waypoints[i][s],
          l = o.oldScroll < a.triggerPoint,
          h = o.newScroll >= a.triggerPoint,
          p = l && h,
          u = !l && !h;
        (p || u) && (a.queueTrigger(r), t[a.group.id] = a.group)
      }
    }
    for (var c in t) t[c].flushTriggers();
    this.oldScroll = {
      x: e.horizontal.newScroll,
      y: e.vertical.newScroll
    }
  }, e.prototype.innerHeight = function () {
    return this.element == this.element.window ? n.viewportHeight() : this.adapter.innerHeight()
  }, e.prototype.remove = function (t) {
    delete this.waypoints[t.axis][t.key], this.checkEmpty()
  }, e.prototype.innerWidth = function () {
    return this.element == this.element.window ? n.viewportWidth() : this.adapter.innerWidth()
  }, e.prototype.destroy = function () {
    var t = [];
    for (var e in this.waypoints)
      for (var i in this.waypoints[e]) t.push(this.waypoints[e][i]);
    for (var o = 0, n = t.length; n > o; o++) t[o].destroy()
  }, e.prototype.refresh = function () {
    var t, e = this.element == this.element.window,
      i = this.adapter.offset(),
      o = {};
    this.handleScroll(), t = {
      horizontal: {
        contextOffset: e ? 0 : i.left,
        contextScroll: e ? 0 : this.oldScroll.x,
        contextDimension: this.innerWidth(),
        oldScroll: this.oldScroll.x,
        forward: "right",
        backward: "left",
        offsetProp: "left"
      },
      vertical: {
        contextOffset: e ? 0 : i.top,
        contextScroll: e ? 0 : this.oldScroll.y,
        contextDimension: this.innerHeight(),
        oldScroll: this.oldScroll.y,
        forward: "down",
        backward: "up",
        offsetProp: "top"
      }
    };
    for (var n in t) {
      var r = t[n];
      for (var s in this.waypoints[n]) {
        var a, l, h, p, u, c = this.waypoints[n][s],
          d = c.options.offset,
          f = c.triggerPoint,
          w = 0,
          y = null == f;
        c.element !== c.element.window && (w = c.adapter.offset()[r.offsetProp]), "function" == typeof d ? d = d.apply(c) : "string" == typeof d && (d = parseFloat(d), c.options.offset.indexOf("%") > -1 && (d = Math.ceil(r.contextDimension * d / 100))), a = r.contextScroll - r.contextOffset, c.triggerPoint = w + a - d, l = f < r.oldScroll, h = c.triggerPoint >= r.oldScroll, p = l && h, u = !l && !h, !y && p ? (c.queueTrigger(r.backward), o[c.group.id] = c.group) : !y && u ? (c.queueTrigger(r.forward), o[c.group.id] = c.group) : y && r.oldScroll >= c.triggerPoint && (c.queueTrigger(r.forward), o[c.group.id] = c.group)
      }
    }
    for (var g in o) o[g].flushTriggers();
    return this
  }, e.findOrCreateByElement = function (t) {
    return e.findByElement(t) || new e(t)
  }, e.refreshAll = function () {
    for (var t in o) o[t].refresh()
  }, e.findByElement = function (t) {
    return o[t.waypointContextKey]
  }, window.onload = function () {
    r && r(), e.refreshAll()
  }, n.requestAnimationFrame = function (e) {
    var i = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || t;
    i.call(window, e)
  }, n.Context = e
}(),
function () {
  "use strict";

  function t(t, e) {
    return t.triggerPoint - e.triggerPoint
  }

  function e(t, e) {
    return e.triggerPoint - t.triggerPoint
  }

  function i(t) {
    this.name = t.name, this.axis = t.axis, this.id = this.name + "-" + this.axis, this.waypoints = [], this.clearTriggerQueues(), o[this.axis][this.name] = this
  }
  var o = {
      vertical: {},
      horizontal: {}
    },
    n = window.Waypoint;
  i.prototype.add = function (t) {
    this.waypoints.push(t)
  }, i.prototype.clearTriggerQueues = function () {
    this.triggerQueues = {
      up: [],
      down: [],
      left: [],
      right: []
    }
  }, i.prototype.flushTriggers = function () {
    for (var i in this.triggerQueues) {
      var o = this.triggerQueues[i],
        n = "up" === i || "left" === i;
      o.sort(n ? e : t);
      for (var r = 0, s = o.length; s > r; r += 1) {
        var a = o[r];
        (a.options.continuous || r === o.length - 1) && a.trigger([i])
      }
    }
    this.clearTriggerQueues()
  }, i.prototype.next = function (e) {
    this.waypoints.sort(t);
    var i = n.Adapter.inArray(e, this.waypoints),
      o = i === this.waypoints.length - 1;
    return o ? null : this.waypoints[i + 1]
  }, i.prototype.previous = function (e) {
    this.waypoints.sort(t);
    var i = n.Adapter.inArray(e, this.waypoints);
    return i ? this.waypoints[i - 1] : null
  }, i.prototype.queueTrigger = function (t, e) {
    this.triggerQueues[e].push(t)
  }, i.prototype.remove = function (t) {
    var e = n.Adapter.inArray(t, this.waypoints);
    e > -1 && this.waypoints.splice(e, 1)
  }, i.prototype.first = function () {
    return this.waypoints[0]
  }, i.prototype.last = function () {
    return this.waypoints[this.waypoints.length - 1]
  }, i.findOrCreate = function (t) {
    return o[t.axis][t.name] || new i(t)
  }, n.Group = i
}(),
function () {
  "use strict";

  function t(t) {
    this.$element = e(t)
  }
  var e = window.jQuery,
    i = window.Waypoint;
  e.each(["innerHeight", "innerWidth", "off", "offset", "on", "outerHeight", "outerWidth", "scrollLeft", "scrollTop"], function (e, i) {
    t.prototype[i] = function () {
      var t = Array.prototype.slice.call(arguments);
      return this.$element[i].apply(this.$element, t)
    }
  }), e.each(["extend", "inArray", "isEmptyObject"], function (i, o) {
    t[o] = e[o]
  }), i.adapters.push({
    name: "jquery",
    Adapter: t
  }), i.Adapter = t
}(),
function () {
  "use strict";

  function t(t) {
    return function () {
      var i = [],
        o = arguments[0];
      return t.isFunction(arguments[0]) && (o = t.extend({}, arguments[1]), o.handler = arguments[0]), this.each(function () {
        var n = t.extend({}, o, {
          element: this
        });
        "string" == typeof n.context && (n.context = t(this).closest(n.context)[0]), i.push(new e(n))
      }), i
    }
  }
  var e = window.Waypoint;
  window.jQuery && (window.jQuery.fn.waypoint = t(window.jQuery)), window.Zepto && (window.Zepto.fn.waypoint = t(window.Zepto))
}();


/*! Stellar.js v0.6.2 | Copyright 2014, Mark Dalgleish | http://markdalgleish.com/projects/stellar.js | http://markdalgleish.mit-license.org */
! function (a, b, c, d) {
  function e(b, c) {
    this.element = b, this.options = a.extend({}, g, c), this._defaults = g, this._name = f, this.init()
  }
  var f = "stellar",
    g = {
      scrollProperty: "scroll",
      positionProperty: "position",
      horizontalScrolling: !0,
      verticalScrolling: !0,
      horizontalOffset: 0,
      verticalOffset: 0,
      responsive: !1,
      parallaxBackgrounds: !0,
      parallaxElements: !0,
      hideDistantElements: !0,
      hideElement: function (a) {
        a.hide()
      },
      showElement: function (a) {
        a.show()
      }
    },
    h = {
      scroll: {
        getLeft: function (a) {
          return a.scrollLeft()
        },
        setLeft: function (a, b) {
          a.scrollLeft(b)
        },
        getTop: function (a) {
          return a.scrollTop()
        },
        setTop: function (a, b) {
          a.scrollTop(b)
        }
      },
      position: {
        getLeft: function (a) {
          return -1 * parseInt(a.css("left"), 10)
        },
        getTop: function (a) {
          return -1 * parseInt(a.css("top"), 10)
        }
      },
      margin: {
        getLeft: function (a) {
          return -1 * parseInt(a.css("margin-left"), 10)
        },
        getTop: function (a) {
          return -1 * parseInt(a.css("margin-top"), 10)
        }
      },
      transform: {
        getLeft: function (a) {
          var b = getComputedStyle(a[0])[k];
          return "none" !== b ? -1 * parseInt(b.match(/(-?[0-9]+)/g)[4], 10) : 0
        },
        getTop: function (a) {
          var b = getComputedStyle(a[0])[k];
          return "none" !== b ? -1 * parseInt(b.match(/(-?[0-9]+)/g)[5], 10) : 0
        }
      }
    },
    i = {
      position: {
        setLeft: function (a, b) {
          a.css("left", b)
        },
        setTop: function (a, b) {
          a.css("top", b)
        }
      },
      transform: {
        setPosition: function (a, b, c, d, e) {
          a[0].style[k] = "translate3d(" + (b - c) + "px, " + (d - e) + "px, 0)"
        }
      }
    },
    j = function () {
      var b, c = /^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/,
        d = a("script")[0].style,
        e = "";
      for (b in d)
        if (c.test(b)) {
          e = b.match(c)[0];
          break
        }
      return "WebkitOpacity" in d && (e = "Webkit"), "KhtmlOpacity" in d && (e = "Khtml"),
        function (a) {
          return e + (e.length > 0 ? a.charAt(0).toUpperCase() + a.slice(1) : a)
        }
    }(),
    k = j("transform"),
    l = a("<div />", {
      style: "background:#fff"
    }).css("background-position-x") !== d,
    m = l ? function (a, b, c) {
      a.css({
        "background-position-x": b,
        "background-position-y": c
      })
    } : function (a, b, c) {
      a.css("background-position", b + " " + c)
    },
    n = l ? function (a) {
      return [a.css("background-position-x"), a.css("background-position-y")]
    } : function (a) {
      return a.css("background-position").split(" ")
    },
    o = b.requestAnimationFrame || b.webkitRequestAnimationFrame || b.mozRequestAnimationFrame || b.oRequestAnimationFrame || b.msRequestAnimationFrame || function (a) {
      setTimeout(a, 1e3 / 60)
    };
  e.prototype = {
    init: function () {
      this.options.name = f + "_" + Math.floor(1e9 * Math.random()), this._defineElements(), this._defineGetters(), this._defineSetters(), this._handleWindowLoadAndResize(), this._detectViewport(), this.refresh({
        firstLoad: !0
      }), "scroll" === this.options.scrollProperty ? this._handleScrollEvent() : this._startAnimationLoop()
    },
    _defineElements: function () {
      this.element === c.body && (this.element = b), this.$scrollElement = a(this.element), this.$element = this.element === b ? a("body") : this.$scrollElement, this.$viewportElement = this.options.viewportElement !== d ? a(this.options.viewportElement) : this.$scrollElement[0] === b || "scroll" === this.options.scrollProperty ? this.$scrollElement : this.$scrollElement.parent()
    },
    _defineGetters: function () {
      var a = this,
        b = h[a.options.scrollProperty];
      this._getScrollLeft = function () {
        return b.getLeft(a.$scrollElement)
      }, this._getScrollTop = function () {
        return b.getTop(a.$scrollElement)
      }
    },
    _defineSetters: function () {
      var b = this,
        c = h[b.options.scrollProperty],
        d = i[b.options.positionProperty],
        e = c.setLeft,
        f = c.setTop;
      this._setScrollLeft = "function" == typeof e ? function (a) {
        e(b.$scrollElement, a)
      } : a.noop, this._setScrollTop = "function" == typeof f ? function (a) {
        f(b.$scrollElement, a)
      } : a.noop, this._setPosition = d.setPosition || function (a, c, e, f, g) {
        b.options.horizontalScrolling && d.setLeft(a, c, e), b.options.verticalScrolling && d.setTop(a, f, g)
      }
    },
    _handleWindowLoadAndResize: function () {
      var c = this,
        d = a(b);
      c.options.responsive && d.bind("load." + this.name, function () {
        c.refresh()
      }), d.bind("resize." + this.name, function () {
        c._detectViewport(), c.options.responsive && c.refresh()
      })
    },
    refresh: function (c) {
      var d = this,
        e = d._getScrollLeft(),
        f = d._getScrollTop();
      c && c.firstLoad || this._reset(), this._setScrollLeft(0), this._setScrollTop(0), this._setOffsets(), this._findParticles(), this._findBackgrounds(), c && c.firstLoad && /WebKit/.test(navigator.userAgent) && a(b).load(function () {
        var a = d._getScrollLeft(),
          b = d._getScrollTop();
        d._setScrollLeft(a + 1), d._setScrollTop(b + 1), d._setScrollLeft(a), d._setScrollTop(b)
      }), this._setScrollLeft(e), this._setScrollTop(f)
    },
    _detectViewport: function () {
      var a = this.$viewportElement.offset(),
        b = null !== a && a !== d;
      this.viewportWidth = this.$viewportElement.width(), this.viewportHeight = this.$viewportElement.height(), this.viewportOffsetTop = b ? a.top : 0, this.viewportOffsetLeft = b ? a.left : 0
    },
    _findParticles: function () {
      {
        var b = this;
        this._getScrollLeft(), this._getScrollTop()
      }
      if (this.particles !== d)
        for (var c = this.particles.length - 1; c >= 0; c--) this.particles[c].$element.data("stellar-elementIsActive", d);
      this.particles = [], this.options.parallaxElements && this.$element.find("[data-stellar-ratio]").each(function () {
        var c, e, f, g, h, i, j, k, l, m = a(this),
          n = 0,
          o = 0,
          p = 0,
          q = 0;
        if (m.data("stellar-elementIsActive")) {
          if (m.data("stellar-elementIsActive") !== this) return
        } else m.data("stellar-elementIsActive", this);
        b.options.showElement(m), m.data("stellar-startingLeft") ? (m.css("left", m.data("stellar-startingLeft")), m.css("top", m.data("stellar-startingTop"))) : (m.data("stellar-startingLeft", m.css("left")), m.data("stellar-startingTop", m.css("top"))), f = m.position().left, g = m.position().top, h = "auto" === m.css("margin-left") ? 0 : parseInt(m.css("margin-left"), 10), i = "auto" === m.css("margin-top") ? 0 : parseInt(m.css("margin-top"), 10), k = m.offset().left - h, l = m.offset().top - i, m.parents().each(function () {
          var b = a(this);
          return b.data("stellar-offset-parent") === !0 ? (n = p, o = q, j = b, !1) : (p += b.position().left, void(q += b.position().top))
        }), c = m.data("stellar-horizontal-offset") !== d ? m.data("stellar-horizontal-offset") : j !== d && j.data("stellar-horizontal-offset") !== d ? j.data("stellar-horizontal-offset") : b.horizontalOffset, e = m.data("stellar-vertical-offset") !== d ? m.data("stellar-vertical-offset") : j !== d && j.data("stellar-vertical-offset") !== d ? j.data("stellar-vertical-offset") : b.verticalOffset, b.particles.push({
          $element: m,
          $offsetParent: j,
          isFixed: "fixed" === m.css("position"),
          horizontalOffset: c,
          verticalOffset: e,
          startingPositionLeft: f,
          startingPositionTop: g,
          startingOffsetLeft: k,
          startingOffsetTop: l,
          parentOffsetLeft: n,
          parentOffsetTop: o,
          stellarRatio: m.data("stellar-ratio") !== d ? m.data("stellar-ratio") : 1,
          width: m.outerWidth(!0),
          height: m.outerHeight(!0),
          isHidden: !1
        })
      })
    },
    _findBackgrounds: function () {
      var b, c = this,
        e = this._getScrollLeft(),
        f = this._getScrollTop();
      this.backgrounds = [], this.options.parallaxBackgrounds && (b = this.$element.find("[data-stellar-background-ratio]"), this.$element.data("stellar-background-ratio") && (b = b.add(this.$element)), b.each(function () {
        var b, g, h, i, j, k, l, o = a(this),
          p = n(o),
          q = 0,
          r = 0,
          s = 0,
          t = 0;
        if (o.data("stellar-backgroundIsActive")) {
          if (o.data("stellar-backgroundIsActive") !== this) return
        } else o.data("stellar-backgroundIsActive", this);
        o.data("stellar-backgroundStartingLeft") ? m(o, o.data("stellar-backgroundStartingLeft"), o.data("stellar-backgroundStartingTop")) : (o.data("stellar-backgroundStartingLeft", p[0]), o.data("stellar-backgroundStartingTop", p[1])), h = "auto" === o.css("margin-left") ? 0 : parseInt(o.css("margin-left"), 10), i = "auto" === o.css("margin-top") ? 0 : parseInt(o.css("margin-top"), 10), j = o.offset().left - h - e, k = o.offset().top - i - f, o.parents().each(function () {
          var b = a(this);
          return b.data("stellar-offset-parent") === !0 ? (q = s, r = t, l = b, !1) : (s += b.position().left, void(t += b.position().top))
        }), b = o.data("stellar-horizontal-offset") !== d ? o.data("stellar-horizontal-offset") : l !== d && l.data("stellar-horizontal-offset") !== d ? l.data("stellar-horizontal-offset") : c.horizontalOffset, g = o.data("stellar-vertical-offset") !== d ? o.data("stellar-vertical-offset") : l !== d && l.data("stellar-vertical-offset") !== d ? l.data("stellar-vertical-offset") : c.verticalOffset, c.backgrounds.push({
          $element: o,
          $offsetParent: l,
          isFixed: "fixed" === o.css("background-attachment"),
          horizontalOffset: b,
          verticalOffset: g,
          startingValueLeft: p[0],
          startingValueTop: p[1],
          startingBackgroundPositionLeft: isNaN(parseInt(p[0], 10)) ? 0 : parseInt(p[0], 10),
          startingBackgroundPositionTop: isNaN(parseInt(p[1], 10)) ? 0 : parseInt(p[1], 10),
          startingPositionLeft: o.position().left,
          startingPositionTop: o.position().top,
          startingOffsetLeft: j,
          startingOffsetTop: k,
          parentOffsetLeft: q,
          parentOffsetTop: r,
          stellarRatio: o.data("stellar-background-ratio") === d ? 1 : o.data("stellar-background-ratio")
        })
      }))
    },
    _reset: function () {
      var a, b, c, d, e;
      for (e = this.particles.length - 1; e >= 0; e--) a = this.particles[e], b = a.$element.data("stellar-startingLeft"), c = a.$element.data("stellar-startingTop"), this._setPosition(a.$element, b, b, c, c), this.options.showElement(a.$element), a.$element.data("stellar-startingLeft", null).data("stellar-elementIsActive", null).data("stellar-backgroundIsActive", null);
      for (e = this.backgrounds.length - 1; e >= 0; e--) d = this.backgrounds[e], d.$element.data("stellar-backgroundStartingLeft", null).data("stellar-backgroundStartingTop", null), m(d.$element, d.startingValueLeft, d.startingValueTop)
    },
    destroy: function () {
      this._reset(), this.$scrollElement.unbind("resize." + this.name).unbind("scroll." + this.name), this._animationLoop = a.noop, a(b).unbind("load." + this.name).unbind("resize." + this.name)
    },
    _setOffsets: function () {
      var c = this,
        d = a(b);
      d.unbind("resize.horizontal-" + this.name).unbind("resize.vertical-" + this.name), "function" == typeof this.options.horizontalOffset ? (this.horizontalOffset = this.options.horizontalOffset(), d.bind("resize.horizontal-" + this.name, function () {
        c.horizontalOffset = c.options.horizontalOffset()
      })) : this.horizontalOffset = this.options.horizontalOffset, "function" == typeof this.options.verticalOffset ? (this.verticalOffset = this.options.verticalOffset(), d.bind("resize.vertical-" + this.name, function () {
        c.verticalOffset = c.options.verticalOffset()
      })) : this.verticalOffset = this.options.verticalOffset
    },
    _repositionElements: function () {
      var a, b, c, d, e, f, g, h, i, j, k = this._getScrollLeft(),
        l = this._getScrollTop(),
        n = !0,
        o = !0;
      if (this.currentScrollLeft !== k || this.currentScrollTop !== l || this.currentWidth !== this.viewportWidth || this.currentHeight !== this.viewportHeight) {
        for (this.currentScrollLeft = k, this.currentScrollTop = l, this.currentWidth = this.viewportWidth, this.currentHeight = this.viewportHeight, j = this.particles.length - 1; j >= 0; j--) a = this.particles[j], b = a.isFixed ? 1 : 0, this.options.horizontalScrolling ? (f = (k + a.horizontalOffset + this.viewportOffsetLeft + a.startingPositionLeft - a.startingOffsetLeft + a.parentOffsetLeft) * -(a.stellarRatio + b - 1) + a.startingPositionLeft, h = f - a.startingPositionLeft + a.startingOffsetLeft) : (f = a.startingPositionLeft, h = a.startingOffsetLeft), this.options.verticalScrolling ? (g = (l + a.verticalOffset + this.viewportOffsetTop + a.startingPositionTop - a.startingOffsetTop + a.parentOffsetTop) * -(a.stellarRatio + b - 1) + a.startingPositionTop, i = g - a.startingPositionTop + a.startingOffsetTop) : (g = a.startingPositionTop, i = a.startingOffsetTop), this.options.hideDistantElements && (o = !this.options.horizontalScrolling || h + a.width > (a.isFixed ? 0 : k) && h < (a.isFixed ? 0 : k) + this.viewportWidth + this.viewportOffsetLeft, n = !this.options.verticalScrolling || i + a.height > (a.isFixed ? 0 : l) && i < (a.isFixed ? 0 : l) + this.viewportHeight + this.viewportOffsetTop), o && n ? (a.isHidden && (this.options.showElement(a.$element), a.isHidden = !1), this._setPosition(a.$element, f, a.startingPositionLeft, g, a.startingPositionTop)) : a.isHidden || (this.options.hideElement(a.$element), a.isHidden = !0);
        for (j = this.backgrounds.length - 1; j >= 0; j--) c = this.backgrounds[j], b = c.isFixed ? 0 : 1, d = this.options.horizontalScrolling ? (k + c.horizontalOffset - this.viewportOffsetLeft - c.startingOffsetLeft + c.parentOffsetLeft - c.startingBackgroundPositionLeft) * (b - c.stellarRatio) + "px" : c.startingValueLeft, e = this.options.verticalScrolling ? (l + c.verticalOffset - this.viewportOffsetTop - c.startingOffsetTop + c.parentOffsetTop - c.startingBackgroundPositionTop) * (b - c.stellarRatio) + "px" : c.startingValueTop, m(c.$element, d, e)
      }
    },
    _handleScrollEvent: function () {
      var a = this,
        b = !1,
        c = function () {
          a._repositionElements(), b = !1
        },
        d = function () {
          b || (o(c), b = !0)
        };
      this.$scrollElement.bind("scroll." + this.name, d), d()
    },
    _startAnimationLoop: function () {
      var a = this;
      this._animationLoop = function () {
        o(a._animationLoop), a._repositionElements()
      }, this._animationLoop()
    }
  }, a.fn[f] = function (b) {
    var c = arguments;
    return b === d || "object" == typeof b ? this.each(function () {
      a.data(this, "plugin_" + f) || a.data(this, "plugin_" + f, new e(this, b))
    }) : "string" == typeof b && "_" !== b[0] && "init" !== b ? this.each(function () {
      var d = a.data(this, "plugin_" + f);
      d instanceof e && "function" == typeof d[b] && d[b].apply(d, Array.prototype.slice.call(c, 1)), "destroy" === b && a.data(this, "plugin_" + f, null)
    }) : void 0
  }, a[f] = function () {
    var c = a(b);
    return c.stellar.apply(c, Array.prototype.slice.call(arguments, 0))
  }, a[f].scrollProperty = h, a[f].positionProperty = i, b.Stellar = e
}(jQuery, this, document);
