/**
 * Author: Jan Myler <honza.myler@gmail.com>
 * 
 * View for main playback controls.
 */

define([
    'underscore',
    'backbone'
], function(_, Backbone) {
    return Backbone.View.extend({
        el: $('#playback-controls'),

        // DOM events listeners
        events: {
            'click #play'       : 'play',
            'click #stop'       : 'stop',
            'click #seek-start' : 'test',
            'click #seek-end'   : 'test',
        },

        // listeners to a model's changes
        initialize: function() {
            this.render();
        },

        // render function
        render: function() {
            var time = this.model.get('currTime'),
                min  = Math.floor(time / 60),
                sec  = time % 60;
            this.el.children('#time-display').val(min + ' : ' + sec);
            return this;
        },

        // test debug only
        test: function(e) {
            alert('clicked: ' + e.srcElement.id);
        },

        play: function() {
            var $play = $('#play');
            Audiee.Player.play();

            $play.addClass('playing');
        },

        stop: function() {
            var $play = $('#play');
            Audiee.Player.stop();

            $play.removeClass('playing');
        }
    });
});