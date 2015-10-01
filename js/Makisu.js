define(function (require, exports, module) {

  function Makisu() {

    console.log('MAKISU');
    // Global initialization flag
    this.initialized = false;

    this.defaults;

    // For detecting browser prefix and capabilities
    this.element = document.createElement('div');
    this.vendors = 'moz ms o webkit'.split(' ');
    this.toupper = function(str) { return str.toUpperCase(); };

    // Establish vendor prefix and CSS 3D support
    this.vendor;

    for (var prop, i = 0; i < this.vendors.length; i++) {

      prop = (this.vendor = this.vendors[i]) + 'Perspective';
      console.log(prop);
      if(prop in this.element.style || prop.replace(/^(\w)/, this.toupper) in this.element.style) {
        break;
      }
    }

    this.canRun = !!this.vendor;
    var prefix = '-' + this.vendor + '-';

    var ctrl, root, base, kids, node, item, over, back, wait, anim, last;

    // Utils
    this.utils = {

      // Resolves argument values to defaults
      resolve: function(el, key, val) {
        return typeof val === 'undefined' ? el.data(key) : val;
      }.bind(this),

      // Prefixes a hash of styles with the current vendor
      prefix: function(style) {

        for (var key in style) {
          style[prefix + key] = style[key];
        }

        return style;
      }.bind(this),

      // Inserts rules into the document styles
      inject: function(rule) {

        try {
          var style = document.createElement('style');
          style.innerHTML = rule;
          document.getElementsByTagName('head')[0].appendChild(style);
        
        } catch (error) {}

      }.bind(this),

      // Keyframe setup
      keyframes: function(name, frames) {

        var anim = '@' + prefix + 'keyframes' + name + '{';

        for (var frame in frames) {
          anim += frame + '%' + '{' + prefix + frames[frame] + ';}';
        }

        this.utils.inject(anim + '}'); 
      }.bind(this)
    };

    // Element templates
    var markup = {
      node: '<span class="node"/>',
      back: '<span class="face back"/>',
      over: '<span class="face over"/>'
    }

    this.init();
  };

  Makisu.prototype.init = function() {
      this.newMakisu({
        selector : document.getElementsByClassName('developers')[0],
        overlap : 0.85,
        speed : 1.6
      });

  }

  Makisu.prototype.constructor = Makisu;

  // Toggle open / closed
  Makisu.prototype.toggle = function() {

    console.log('this: ', this);
    this.Makisu(this.classList.contains('open') ? 'close' : 'open');

  };

  // Trigger the unfold animation
  Makisu.prototype.open = function(speed, overlap, easing) {

    //Cache DOM references
    root = this.querySelectorAll('.root');
    kids = this.querySelectorAll('.node:not(.root)');

    // Establish values or fallbacks
    speed = this.utils.resolve(this, 'speed', speed);
    easing = this.utils.resolve(this, 'easing', easing);
    overlap = this.utils.resolve(this, 'overlap', overlap);

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
      item.style = this.utils.prefix({
        'transform' : 'rotateX(0deg)',
        'animation' : anim + ' ' + speed + 's ' + easing + ' ' + wait + 's 1 normal forwards'
      });

      // Shading animation happens when the next item starts
      if (!last) wait = (index + 1) * time;

      // Shading animation
      over.style = this.utils.prefix({
        'animation' : 'unfold-over' + (speed * 0.45) + 's ' + easing + ' ' + wait + 's 1 normal forwards' 
      });

    });

    // Add momentum to the container
    root.style = this.utils.prefix({
      'animation' : ' swing-out ' + (kids.length * time * 1.4) + 's ease-in-out 0s 1 normal forwards'
    });

    this.classList.add('open');
  };

  // Trigger the fold animation
  Makisu.prototype.close = function(speed, overlap, easing) {

    console.log('close');

    // Cache DOM references
    root = this.querySelectorAll('.root');
    kids = this.querySelectorAll('.node:not(.root)');

    // Establish value or fallbacks
    speed = this.utils.resolve(this, 'speed', speed)  * 0.66;
    easing = this.utils.resolve(this, 'easing', easing);
    overlap = this.utils.resolve(this, 'overlap', overlap);

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
      item.style = this.utils.prefix({
        'transform' : 'rotateX(0deg)',
        'animation' : anim + ' ' + speepd + 's ' + easing + ' ' + wait + 's 1 normal forwards'
      });

      // Adjust delay for shading
      if(!last) wait = ((kids.length - index - 2) * time) + (speed * 0.35);

      // Shading animation
      over.style = this.utils.prefix({
        'animation' : 'fold-over ' + (speed * 0.45) + 's ' + easing + ' ' + wait + 's 1 normal forwards'
      });

    });

    // Add momentum to the container
    root.style = this.utils.prefix({
      'animation' : 'swing-in ' + (kids.length * time * 1.0) + 's ease-in-out 0s 1 normal forwards'  
    });

    ctrl.classList.remove('open');    
  };

  Makisu.prototype.newMakisu = function(options) {

      console.log(options);

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
        }.bind(this));
      }

      return;

    }

    // Fires only once
    if(!this.initialized) {
      console.log('TRYING TO INITIALIZE');
      this.initialized = true;

      // Unfold
      this.utils.keyframes('unfold', {
          0: 'transform: rotateX(180deg)',
         50: 'transform: rotateX(-30deg)',
        100: 'transform: rotateX(0deg)'        
      });

      // Unfold (first time)
      this.utils.keyframes('unfold-first', {
          0: 'transform: rotateX(-90deg)',
         50: 'transform: rotateX(60deg)',
        100: 'transform: rotateX(0deg)'
      });
      // Fold
      this.utils.keyframes( 'fold', {
          0: 'transform: rotateX(0deg)',
        100: 'transform: rotateX(180deg)'
      });

      // Fold (first item)
      this.utils.keyframes( 'fold-first', {
          0: 'transform: rotateX(0deg)',
        100: 'transform: rotateX(-180deg)'
      });

      // Swing out
      this.utils.keyframes( 'swing-out', {
          0: 'transform: rotateX(0deg)',
         30: 'transform: rotateX(-30deg)',
         60: 'transform: rotateX(15deg)',
        100: 'transform: rotateX(0deg)'
      });

      // Swing in
      this.utils.keyframes( 'swing-in', {
          0: 'transform: rotateX(0deg)',
         50: 'transform: rotateX(-15deg)',
         90: 'transform: rotateX(15deg)',
        100: 'transform: rotateX(0deg)'
      });

      // Shading (unfold)
      this.utils.keyframes( 'unfold-over', {
          0: 'opacity: 1.0',
        100: 'opacity: 0.0'
      });

      // Shading (fold)
      this.utils.keyframes( 'fold-over', {
          0: 'opacity: 0.0',
        100: 'opacity: 1.0'
      });

      // Node styles
      this.utils.inject( '.node {' +
          'position: relative;' +
          'display: block;' +
          '}');

      // Face styles
      this.utils.inject( '.face {' +
          'pointer-events: none;' +
          'position: absolute;' +
          'display: block;' +
          'height: 100%;' +
          'width: 100%;' +
          'left: 0;' +
          'top: 0;' +
          '}');
    }

    // Merge options & defaults
    var opts = this.extend({}, this.defaults, options);

    // Extract api method arguments
    var args = Array.prototype.slice.call( arguments, 1 );

    // Main library loop
    // Array.prototype.forEach.call(this, function(el, index) {

    //   // If the user is calling a method...
    //   if(api[options]) {
    //     return api[options].apply(this, args);
    //   }

    //   // Store options in view

    // }.bind(this));



  };

  Makisu.prototype.extend = function(out) {
    out = out || {};

    for (var i = 1; i < arguments.length; i++) {
      if (!arguments[i])
        continue;

      for (var key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key))
          out[key] = arguments[i][key];
      }
    }

    return out;
  };

  module.exports = new Makisu();

});
