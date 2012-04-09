/**
 * Author: Jan Myler <honza.myler@gmail.com>
 * 
 * View for main editor panel.
 */

define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    return Backbone.View.extend({
        // parent DOM element
        el: $('#editor-view'),

        // DOM events listeners
        events: {
           'mousewheel' : 'zoomHandler',
           'scroll' : 'scrollHandler'
        },

        // listeners to a model's changes
        initialize: function() {
            _.bindAll(this, 
                'render', 
                'changeTitle', 
                'resizeView', 
                'scrollHandler', 
                'zoomHandler'
                /*'getActiveTrack',
                'isActiveTrack',
                'setActiveTrack', 
                'unsetActiveTrack', 
                'getCursor',
                'setSelectionFrom',
                'setSelectionTo',
                'getSelectionTo'*/
            );
            this.model.bind('change:name', this.changeTitle);
            
            // rewrite title tag with proper project name value
            $('title').text(this.model.get('name') + ' :: Audiee');

            // window resize listener
            $(window).on('resize', this.resizeView);            
            this.resizeView();
        },

        // render function
        render: function() {
            return this;
        },

        // update page title when project name is changed
        changeTitle: function() {
            $('title').text(this.model.get('name') + ' :: Audiee');
        },

        resizeView: function() {
            var $editorView = $(this.el),
                height = $(window).height() - $editorView.position().top
                            - parseInt($editorView.css('margin-top'));

            $editorView.height(height);
        },

        scrollHandler: function() {
            // trigger the custom event on tracks view
            Audiee.Views.Tracks.trigger('Audiee:scroll');  
            Audiee.Views.Timeline.trigger('Audiee:scroll');
        },

        scrollLeftOffset: function() {
            return $(this.el).scrollLeft();
        },

        scrollTopOffset: function() {
            return $(this.el).scrollTop();
        },

        zoomHandler: function(e) {
            // TODO: scrolling when zooming needs to be fixed...
            if (e.altKey) {
                e.preventDefault();     // don't scroll the view
                var originalOffset = Audiee.Display.px2sec(e.originalEvent.offsetX);
                (e.originalEvent.wheelDelta < 0) ? Audiee.Display.zoomOut() : Audiee.Display.zoomIn();
                var newOffset = Audiee.Display.sec2px(originalOffset),
                    scrollChange = this.scrollLeftOffset() + newOffset - e.originalEvent.offsetX;
                $(this.el).scrollLeft(scrollChange);
                
                Audiee.Views.Tracks.trigger('Audiee:zoomChange');
                Audiee.Views.Timeline.trigger('Audiee:zoomChange');

                return false;
            }
        },

        selectionOn: function() {
            this.selecting = true;
        },

        selectionOff: function() {
            this.selecting = false;
        },

        selectionActive: function() {
            return this.selecting;
        },

        setActiveTrack: function($track) {
            this.activeTrack = $track;
            $track.addClass('active').siblings().removeClass('active');
        },

        getActiveTrack: function() {
            return this.activeTrack;
        },

        isActiveTrack: function() {
            return typeof this.activeTrack !== 'undefined';
        },

        unsetActiveTrack: function() {
            this.activeTrack.removeClass('active').siblings().removeClass('active');
            this.activeTrack = undefined;
        },

        setSelectionFrom: function(position) {
            this.selectionFrom = position;
        },

        setSelectionTo: function(position) {
            if (position < this.selectionFrom) {
                var tmp = this.selectionFrom;
                this.selectionFrom = position;
                this.selectionTo = tmp;
            } else {
                this.selectionTo = position;
            } 
        },

        setMultiSelection: function($track) {
            this.multilineTo = $track;
        },

        getMultiSelection: function() {
            return this.multilineTo;
        },

        unsetMultiSelection: function() {
            this.multilineTo = undefined;
        },

        isMultiSelection: function() {
            return typeof this.multilineTo !== 'undefined';
        },

        getCursor: function() {
            return this.selectionFrom;
        },

        getSelectionTo: function() {
            return this.selectionTo;
        }

        // TODO: get selection or something... (return this.selectionTo? or an array [from, to]? or even w/tracks?)

    });
});