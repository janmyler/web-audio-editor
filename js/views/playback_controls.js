/*
 * Author: Jan Myler <honza.myler@gmail.com>
 * Filename: playback_controls.js
 * 
 * View for main playback controls.
 */

define([
    'underscore',
    'backbone',
    'text!templates/playback_controls.html'
], function(_, Backbone, playbackControlsTemplate) {

    var PlaybackControls = Backbone.View.extend({
        // parent DOM element
        el: $('#playback-controls'),

        // render function
        render: function() {
            var compiled_template = _.template(playbackControlsTemplate);
            this.el.html(compiled_template);
            return this;
        }

    });

    return new PlaybackControls;
});