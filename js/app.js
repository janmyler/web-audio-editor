/*
 * Author: Jan Myler <honza.myler@gmail.com>
 * Filename: app.js
 * 
 * Application entry point.
 */

define(['jquery'], function($) {
	var appTest = function() {
		alert('Here I am!');
		$('h1').html('#: Different text');
	}

	return {
		appTest: appTest
	};
});