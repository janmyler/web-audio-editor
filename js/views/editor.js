/*
 * Author: Jan Myler <honza.myler@gmail.com>
 * Filename: editr.js
 * 
 * View for main editor panel.
 */

define([
    'underscore',
    'backbone',
], function(_, Backbone) {

    var EditorPanel = Backbone.View.extend({
        // parent DOM element
        el: $('#editor-view'),

        // DOM events listeners
        events: {
           
        },

        // listeners to a model's changes
        initialize: function() {
            _.bindAll(this, 'render');
            $(window).on('resize', this.render);
        },

        // render function
        render: function() {
            console.log('resizing editor view', this);
            var $window = $(window),
                height = $window.height() - parseInt($('body').css('padding-top')) - 50;
                
            this.el.height(height);
            return this;
        },

    });

    return EditorPanel;
});