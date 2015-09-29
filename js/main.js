/**
 * Config for require
 */
require.config( {
    baseUrl : "./js",
    paths : {
      
      'APP_root'      : 'App'

    }
});

require(['APP_root'], function(App) {

  new App();

});