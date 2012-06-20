/**
 * Application entry point
 *
 * @file        app.js
 * @author      Jan Myler <honza.myler[at]gmail.com>
 * @copyright   Copyright 2012, Jan Myler (http://janmyler.com)
 * @license     MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 */

define(function(require) {
	// general
	var $ = require('jquery'),
		_ = require('underscore'),
		Backbone = require('backbone'),

	// helpers
		PlayerH = require('Audiee/Helpers.Player'),
		DisplayH = require('Audiee/Helpers.Display'),

	// models
		ProjectM = require('Audiee/Models.Project'),

	// collections
		TracksC = require('Audiee/Collections.Tracks'),
		//ClipsC = require('Audiee/Collections.Clips'),
	// views
		PlaybackControlsV = require('Audiee/Views.PlaybackControls'),
		EditableNameV = require('Audiee/Views.EditableName'),
		EditorV = require('Audiee/Views.Editor'),
		TracksV = require('Audiee/Views.Tracks'),
		MenuV = require('Audiee/Views.Menu'),
		TimelineV = require('Audiee/Views.Timeline'),

	// templates
		AlertT = require('text!templates/AlertModal.html');

	// plugins without reference
		require('plugins/modal');


	// Audiee global object
	var Audiee = {
		Collections: {},
		Models: {},
		Views: {},
	};
	Audiee.Display = new DisplayH;
	Audiee.Player = new PlayerH;

	// application initialization
	var init = function() {
		window.Audiee = Audiee;						// global reference to object
		
		Audiee.Collections.Tracks = new TracksC;	// tracks collection
		
		Audiee.Models.Project = new ProjectM;		// default project model
		
		Audiee.Views.Editor = new EditorV({			// editor wrapper view
			model: Audiee.Models.Project
		});	
		
		Audiee.Views.Timeline = new TimelineV;		// editor timeline view
		
		Audiee.Views.Tracks = new TracksV({			// tracks collection view
			collection: Audiee.Collections.Tracks,
			el: '#tracks'
		}).render();											
		
		new EditableNameV({							// editable project name view
			model: Audiee.Models.Project,
			el: '#project-name',
			hasColor: false
		});
		
		Audiee.Views.PlaybackControls = new PlaybackControlsV({	// playback controls view
			model: Audiee.Models.Project
		});

		if (typeof webkitAudioContext !== 'undefined' || typeof AudioContext !== 'undefined') 
			Audiee.Views.Menu = new MenuV;			// show menu only if app is supported

		// prompts user before leaving the app page
		window.onbeforeunload = function(e) {
			e = e || window.event;
			
			// for IE and Firefox prior to version 4
			if (e) 
		    	e.returnValue = 'By leaving this page, all changes will be lost.';
		  	
			// for Chrome, Safari and Opera 12+
			return 'By leaving this page, all changes will be lost.';
		};
	};
	
	return {	
		initialize: init
	};
});