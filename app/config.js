require.config({
  baseUrl:'../app',
  paths: {
    'jquery':'components/vendor/jquery/dist/jquery',
    'requirejs' : 'components/vendor/require/build/require',
    'backbone':'components/vendor/backbone/backbone',
    'underscore':'components/vendor/underscore/underscore',
    'flexible':'components/plugin/flexible'
  }, 
  shim:{
  	'backbone': {
		  deps: ['jquery','underscore'],
		  exports: 'Backbone'
	   }
  }
});



