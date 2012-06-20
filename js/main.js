/**
 * Require.js paths configuration, application initialization
 *
 * @file        main.js
 * @author      Jan Myler <honza.myler[at]gmail.com>
 * @copyright   Copyright 2012, Jan Myler (http://janmyler.com)
 * @license     MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
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