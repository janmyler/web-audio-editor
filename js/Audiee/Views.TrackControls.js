/**
 * Author: Jan Myler <honza.myler@gmail.com>
 * 
 * View for a track controls.
 */

define([
    'jquery',
    'underscore',
    'backbone',
], function($, _, Backbone) {
    // sets the Mustache format delimiter: {{ variable }}
    _.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g
    };

    return Backbone.View.extend({
        tagName: 'div',
        className: 'track-controls',

        template: _.template(
            '<button class="btn mute">M</button>' +
            '<button class="btn solo">S</button>' +
            '<input type="range" class="volume" value="100">'
        ),

        initialize: function() {
            _.bindAll(this, 'render', 'volumeChange', 'solo', 'mute');
            this.render();            
            $('input.volume', this.el).on('change', this.volumeChange);
        },

        render: function() {
            $(this.el).html(this.template());
            return this;
        },

        volumeChange: function() {
            var volume = $('input.volume', this.el).val() / 100,
                cid = $(this.el).parents('.track').data('cid');

            Audiee.Player.volumeChange(volume, cid);
        },

        mute: function() {

        },

        solo: function() {

        }
    });
});