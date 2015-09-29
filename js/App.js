define(function(require, exports, module) {

  var Makisu = require('Makisu');

  /*
   * Main application
   */
  var App = function() {

    console.log('things are happening');
    var developers = document.getElementsByClassName('developers')[0];
    var prodPartners = document.getElementsByClassName('prod-partners')[0];
    var designers = document.getElementsByClassName('designers')[0];

    console.log(developers);
    console.log(prodPartners);
    console.log(designers);



  };

  App.constructor = App;

  module.exports = App;

 });