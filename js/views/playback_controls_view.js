/*
 * Author: Jan Myler <honza.myler@gmail.com>
 * Filename: playback_controls_view.js
 * 
 * View for main playback controls.
 */

define([
    'underscore',
    'backbone',
], function(_, Backbone) {

    var PlaybackControls = Backbone.View.extend({
        // parent DOM element
        el: $('#playback-controls'),

        // DOM events listeners
        events: {
            'click #play'       : 'test',
            'click #stop'       : 'test',
            'click #seek-start' : 'test',
            'click #seek-end'   : 'test',
        },

        // listeners to a model's changes
        initialize: function() {

        },

        // render function
        render: function() {
            var time = this.model.get('curr_time'),
                min  = Math.floor(time / 60),
                sec  = time % 60;
            console.log(time, min, sec);
            this.el.children('#time-display').val(min + ' : ' + sec);
            return this;
        },

        // test debug only
        test: function(options) {
            alert('clicked');
            console.log(options);
        }


    });

    return PlaybackControls;
});