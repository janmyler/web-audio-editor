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
		jquery    	: 'libs/jquery-1.7.1',
		underscore 	: 'libs/underscore-1.3.1',
		backbone  	: 'libs/backbone-0.9.1',
		modernizr 	: 'libs/modernizr-2.5.3-respond-1.1.0.min',	// delete?
		
		// templates
		templates	: '../templates',

		// plugins
		text 		: 'libs/text-1.0.7.js',
		order		: 'libs/order-1.0.5',
	},
});

require(['app'], function(App) {
	//console.log('main:',App);
});