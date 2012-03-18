/**
 * Author: Jan Myler <honza.myler@gmail.com>
 * 
 * Application entry point.
 */

define([
	'jquery',
	'underscore',
	'backbone',
	'Audiee/Views.PlaybackControls',
	'Audiee/Models.Project',
	'Audiee/Views.EditableName',/*
	'Audiee/Views.Editor',
	'Audiee/Views.Menu',
	'text!templates/alert_modal.html',
	'plugins/modal'*/
	'Audiee/Views.Clips',
	'Audiee/Collections.Clips',
	'Audiee/Views.Tracks',
	'Audiee/Collections.Tracks'
//], function($, _, Backbone, PlaybackControls, Project, EditableName,
//		Editor, Menu, AlertModal) {
], function($, _, Backbone, PlaybackControlsV, ProjectM, EditableNameV, ClipsV, ClipsC, TracksV, TracksC) {
	// Player and Display components – into two modules (Helpers)
	var Audiee = Audiee || {};
	Audiee.Player = {};
	Audiee.Display = {};

	var init = function() {
		// browser compatibility test
		if (typeof webkitAudioContext === 'undefined' && typeof AudioContext === 'undefined') {
			alert('Your browser is not supported yet.');
			return false;
		}

		window.Audiee = Audiee;
		
		// TEST COLLECTION
		clips = new ClipsC([
			{name: 'First clip',  start_time: 10, end_time:  80, track_pos: 10},
			{name: 'Second clip', start_time:  0, end_time: 120, track_pos: 150},
			{name: 'Third clip',  start_time: 48, end_time: 149, track_pos: 300},
			{name: 'Fourth clip', start_time: 10, end_time: 280, track_pos: 500},
		]);
		tracks = new TracksC([
			{name: 'Track 1'},
			{name: 'Track 2'},
			{name: 'Track 3'},
			{},
			{},
			{name: 'Track 5'}
		]);

		// tracks view
		new TracksV({
			collection: tracks,
			el: '#tracks'
		}).render();

		var project = new ProjectM({name: 'New Project'});
		new EditableNameV({model: project});
		new PlaybackControlsV({model: project, hasColor: false});
	};
	/*
	var Audiee = Audiee || {};

	var init = function() {
		// browser compatibility test
		if (typeof webkitAudioContext === 'undefined' && typeof AudioContext === 'undefined') {
			alert('Your browser is not supported yet.');
			return false;
		}

		// init the app
		var project = new Project({name: 'New Project'});
		(new EditableName({model: project})).render();
		(new Editor({model: project})).render();
		(new PlaybackControls({model: project})).render();
		(new Menu);

	};*/
	/*
	(new PlaybackControls).render();
	var proj = new Project,
		view = new EditableName({model: proj}),
		edv = new Editor;
	view.render();
	edv.render();
	*/
	//function(Track, Clip, PlaybackControls) {
	//function(PlaybackControls) {
	// test for API support
	
	//PlaybackControls.render();

	/*var track = new Track({name: 'Track 1'}),
		clip = new Clip;*/

//	console.log(track, clip);
	/*var audioContext = new webkitAudioContext();

	$('#file-switch').on('click', function() {
		console.log('Hooray');
		var $editor_view = $('#editor-view'),
			$file_browser = $('#file-browser');

		if ($editor_view.hasClass('span12')) {
			// show file browser
			$editor_view.removeClass('span12').addClass('span10');
			$file_browser.show();
			$(this).html('Hide files');
		} else {
			$editor_view.removeClass('span10').addClass('span12');
			$file_browser.hide();	
			$(this).html('Show files');
		}
	});

	$(window).on('resize', function() {
		var $canvas = $('.display');
		$canvas.each(function(index) {
			$this = $(this),
			w = parseInt($this.css('width')),
			$this.attr('width', w);
			redraw();
		});
	});

	function redraw() {
		$('.display').each(function(index) {
			var ctx = this.getContext('2d'),
				$this = $(this),
				w = parseInt($this.css('width')),
				h = parseInt($this.css('height'));

			$this.attr('width', w).attr('height', h);
			ctx.font = '12px Verdana';
			ctx.fillText('Drop a music file here (mp3/wave)', w/2 - 50, h/2);
		});
	}

	function handleFile(evt) {
		evt.originalEvent.preventDefault();
		evt.originalEvent.stopPropagation();
		var files = evt.originalEvent.dataTransfer.files;
    	$('#'+evt.target.id).next().append('<li>'+ files[0].fileName +'</li>');
    	var reader = new FileReader();
    	
    	var test = reader.onload = (function(event) {
    		succ = function() {
    			console.log('SUCC');
    		};
    		fail = function() {
    			console.log('FAIL');
    		};
    		return audioContext.decodeAudioData(event.target.result, succ, fail);
    	})(files[0]);

    	console.log('test: ', test);
    	console.log(reader.readAsArrayBuffer(files[0]));

	}

	function handleDragover(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		$(this).css('border','2px dashed black');
	}

	
	$('#app-frame').on('drop', '.display', function(e) {
		handleFile(e);
	});
	
	/*
	for (var i = dropzone.length - 1; i >= 0; i--) {
		dropzone[i].addEventListener('drop', handleFile, false);
	};
	*/
	
	
	//redraw();

	return {	
		initialize: init
	};
});