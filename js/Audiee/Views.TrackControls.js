/**
 * Author: Jan Myler <honza.myler@gmail.com>
 * 
 * View for a track controls.
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'plugins/button'
], function($, _, Backbone) {
    // sets the Mustache format delimiter: {{ variable }}
    _.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g
    };

    return Backbone.View.extend({
        tagName: 'div',
        className: 'track-controls',

        template: _.template(
            '<button class="btn mute {{ muted }}" data-toggle="button">M</button>' +
            '<button class="btn solo {{ solo }}" data-toggle="button">S</button>' +
            '<input type="range" class="volume" value="{{ gain }}">'
        ),

        initialize: function() {
            _.bindAll(this, 'render', 'volumeChange', 'solo', 'mute');
            this.render();            
            $('input.volume', this.el).on('change', this.volumeChange);
            $('button.mute', this.el).on('click', this.mute);
            $('button.solo', this.el).on('click', this.solo);
        },

        render: function() {
            var gain = this.model.get('gain') * 100,
                muted = (this.model.get('muted')) ? 'active' : '',
                solo = (this.model.get('solo')) ? 'active' : '';

            $(this.el).html(this.template({
                gain: gain,
                muted: muted,
                solo: solo
            }));

            $(this.el).find('.btn').button();

            return this;
        },

        volumeChange: function() {
            var volume = $('input.volume', this.el).val() / 100,
                cid = $(this.el).parents('.track').data('cid');

            this.model.set('gain', volume);
            Audiee.Player.volumeChange(volume, cid);

            if ($('button.mute', this.el).hasClass('active')) {
                $('button.mute', this.el).button('toggle');
                this.mute();
            }
                
        },

        mute: function() {
            var muted = this.model.get('muted');
            this.model.set('muted', !muted);
            if (muted) {
                // track was muted -- restores previous gain value
                Audiee.Player.volumeChange(this.model.get('gain'), this.model.cid);
            } else {
                // track is beeing muted
                Audiee.Player.volumeChange(0, this.model.cid);
            }
        },

        solo: function() {
            var solo = this.model.get('solo');
            
            this.model.set('muted', !this.model.get('muted'));
        }
    });
});