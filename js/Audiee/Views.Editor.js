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
            _.bindAll(this, 'render', 'changeTitle', 'resizeView', 'scrollHandler');
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
        },

        scrollLeftOffset: function() {
            return $(this.el).scrollLeft();
        },

        scrollTopOffset: function() {
            return $(this.el).scrollTop();
        },

        zoomHandler: function(e) {
            if (e.altKey) {
                e.preventDefault();     // don't scroll the view
                (e.originalEvent.wheelDelta < 0) ? Audiee.Display.zoomOut() : Audiee.Display.zoomIn();
                return false;
            }
        }

    });
});