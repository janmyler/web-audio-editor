/*
 * Author: Jan Myler <honza.myler@gmail.com>
 * Filename: main.js
 * 
 * Require.js shortcut alias definition. 
 */

require.config({
	paths: {
		// libs
		jquery    	: 'libs/jquery/jquery',
		underscore 	: 'libs/underscore/underscore',
		backbone  	: 'libs/backbone/backbone',
		modernizr 	: 'libs/modernizr-2.5.3-respond-1.1.0.min',	 // TODO delete?
		
		// plugins
		text 		: 'libs/require/text',
		order		: 'libs/require/order',
		plugins		: 'libs/bootstrap'
	},
});

require(['Audiee'], function(Audiee) {
	Audiee.initialize();
});