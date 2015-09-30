define(function (require, exports, module) {

  function Makisu() {

    // Global initialization flag
    this.initialized = false;

    // For detecting browser prefix and capabilities
    this.element = document.createElement('div');
    this.vendors = 'moz ms o webkit'.split(' ');
    this.toupper = function(str) { return str.toUpperCase(); };

    // Establish vendor prefix and CSS 3D support
    this.vendor;

    for (var prop, i = 0; i < this.vendors.length; i++) {

      prop = (this.vendor = this.vendors[i]) + 'Perspective';
      if(prop in this.element.style || prop.replace(/^(\w)/, this.toupper) in this.element.style) break;
    }

    this.canRun = !!this.vendor;
    var prefix = '-' + this.vendor + '-';

    var ctrl, root, base, kids, node, item, over, back, wait, anim, last;

    // Public API
    var api = {

      // Toggle open / closed
      toggle: function() {

        ctrl = this;
        console.log('this: ', this);
        ctrl.Makisu(ctrl.classList.contains('open') ? 'close' : 'open');
      },

      // Trigger the unfold animation
      open: function(speed, overlap, easing) {

        //Cache DOM references
        ctrl = this;
        root = ctrl.querySelectorAll('.root');
        kids = ctrl.querySelectorAll('.node:not(.root)');

        // Establish values or fallbacks
        speed = utils.resolve(ctrl, 'speed', speed);
        easing = utils.resolve(ctrl, 'easing', easing);
        overlap = utils.resolve(ctrl, 'overlap', overlap);

        Array.prototype.forEach.call(kids, function(el, index) {

          // Establish settings for this iteration
          anim = 'unfold' + (!index ? '-first' : '');
          last = index === kids.length - 1;
          time = speed * ( 1 - overlap);
          wait = index * time;

          // Cache DOM references
          item = el;
          over = item.querySelectorAll('.over');

          // Element animation
          item.style = utils.prefix({
            'transform' : 'rotateX(0deg)',
            'animation' : anim + ' ' + speed + 's ' + easing + ' ' + wait + 's 1 normal forwards'
          });

          // Shading animation happens when the next item starts
          if (!last) wait = (index + 1) * time;

          // Shading animation
          over.style = utils.prefix({
            'animation' : 'unfold-over' + (speed * 0.45) + 's ' + easing + ' ' + wait + 's 1 normal forwards' 
          });

        });

        // Add momentum to the container
        root.style = utils.prefix({
          'animation' : ' swing-out ' + (kids.length * time * 1.4) + 's ease-in-out 0s 1 normal forwards'
        });

        ctrl.classList.add('open');

      },

      // Trigger the fold animation
      close: function(speed, overlap, easing) {

        // Cache DOM references
        ctrl = this;
        root = ctrl.querySelectorAll('.root');
        kids = ctrl.querySelectorAll('.node:not(.root)');

        // Establish value or fallbacks
        speed = utils.resolve(ctrl, 'speed', speed)  * 0.66;
        easing = utils.resolve(ctrl, 'easing', easing);
        overlap = utils.resolve(ctrl, 'overlap', overlap);

        Array.prototype.forEach.call(kids, function(el, index) {

          // Establish settings for this iteration
          anim = 'fold' + (!index ? '-first' : '');
          last = index === 0;
          time = speed * (1 - overlap);
          wait = (kids.length - index - 1) * time;

          // Cache DOM references
          item = el;
          over = item.querySelectorAll('.over');

          // Element animation
          item.style = utils.prefix({
            'transform' : 'rotateX(0deg)',
            'animation' : anim + ' ' + speepd + 's ' + easing + ' ' + wait + 's 1 normal forwards'
          });

          // Adjust delay for shading
          if(!last) wait = ((kids.length - index - 2) * time) + (speed * 0.35);

          // Shading animation
          over.style = utils.prefix({
            'animation' : 'fold-over ' + (speed * 0.45) + 's ' + easing + ' ' + wait + 's 1 normal forwards'
          });

        });

        // Add momentum to the container
        root.style = utils.prefix({
          'animation' : 'swing-in ' + (kids.length * time * 1.0) + 's ease-in-out 0s 1 normal forwards'  
        });

        ctrl.classList.remove('open');

      }
    };

    // Utils
    var utils = {

      // Resolves argument values to defaults
      resolve: function(el, key, val) {
        return typeof val === 'undefined' ? el.data(key) : val;
      },

      // Prefixes a hash of styles with the current vendor
      prefix: function(style) {

        for (var key in style) {
          style[prefix + key] = style[key];
        }

        return style;
      },

      // Inserts rules into the document styles
      inject: function(rule) {

        try {
          var style = document.createElement('style');
          style.innerHTML = rule;
          document.getElementsByTagName('head')[0].appendChild(style);
        
        } catch (error) {}

      },

      // Keyframe setup
      keyframes: function(name, frames) {

        var anim = '@' + prefix + 'keyframes' + name + '{';

        for (var frame in frames) {
          anim += frame + '%' + '{' + prefix + frames[frame] + ';}';
        }

        utils.inject(anim + '}'); 
      }
    };

    // Element templates
    var markup = {
      node: '<span class="node"/>',
      back: '<span class="face back"/>',
      over: '<span class="face over"/>'
    }
  };

  Makisu.prototype.constructor = Makisu;

  Makisu.prototype.newMakisu = function(options) {

    // Notify if 3D isn't available
    if(!this.canRun) {
      var message = 'Failed to detect CSS 3D support';

      if(console && console.warn) {

        // Print warning to the console
        console.warn(message);

        // Trigger errors on elements
        Array.prototype.forEach.call(this, function(el, index) {
          var event = document.createEvent('HTMLEvents');
          event.initEvent('click', true, false);
          this.dispatchEvent(event);
        }.bind(this);
      }
    }
  };

  module.exports = new Makisu();

});
