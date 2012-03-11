/*
 * Author: Jan Myler <honza.myler@gmail.com>
 * Filename: main.js
 * 
 * Require.js shortcut alias definition. 
 */

require.config({
	paths: {
		// core
		
		// events

		// libs
		jquery    	: 'libs/jquery/jquery',
		underscore 	: 'libs/underscore/underscore-min',
		backbone  	: 'libs/backbone/backbone-min',
		modernizr 	: 'libs/modernizr-2.5.3-respond-1.1.0.min',	// delete?
		
		// plugins
		text 		: 'libs/require/text',
		order		: 'libs/require/order'
	},
});

require(['app'], function(App) {
	App.initialize();
});