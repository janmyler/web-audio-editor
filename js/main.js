/**
 * Author: Jan Myler <honza.myler@gmail.com>
 * 
 * Require.js paths configuration, application initialization.
 */

require.config({
	paths: {
		// libs
		jquery    	: 'libs/jquery/jquery',
		drag_resize	: 'libs/jquery/jquery-ui.custom.min',
		underscore 	: 'libs/underscore/underscore-min',
		backbone  	: 'libs/backbone/backbone',
		
		// plugins
		text 		: 'libs/require/text',
		order		: 'libs/require/order',
		plugins		: 'libs/bootstrap'
	},
});

require(['app'], function(App) {
	App.initialize();
});