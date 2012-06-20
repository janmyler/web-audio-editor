/**
 * View for the track controls
 *
 * @file        Views.TrackControls.js
 * @author      Jan Myler <honza.myler[at]gmail.com>
 * @copyright   Copyright 2012, Jan Myler (http://janmyler.com)
 * @license     MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
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
            '<button class="btn mute {{ muted }}" data-toggle="button" title="mute">M</button>' +
            '<button class="btn solo {{ solo }}" data-toggle="button" title="solo">S</button>' +
            '<input type="range" class="volume" value="{{ gain }}" title="volume">'
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

            // sets the new volume value into the model
            this.model.set('gain', volume);

            // change GainNode's volume only
            //  + if there are no solo tracks
            //  + or there are solo tracks and this track is one of them
            if (!Audiee.Collections.Tracks.isAnySolo() || this.model.get('solo'))
                Audiee.Player.volumeChange(volume, cid);  

            // disables the mute if it was activated
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
                if (!Audiee.Collections.Tracks.isAnySolo() || this.model.get('solo'))
                    Audiee.Player.volumeChange(this.model.get('gain'), this.model.cid);
            } else {
                // track is beeing muted (only if is not set as solo track)
                if (!this.model.get('solo'))
                    Audiee.Player.volumeChange(0, this.model.cid);
            }
        },

        solo: function() {
            this.model.set('solo', !this.model.get('solo'));
            var soloTracks = Audiee.Collections.Tracks.filter(
                                function(model) { 
                                    return model.get('solo') === true;
                                }
                            ),
                otherTracks = Audiee.Collections.Tracks.filter(
                                function(model) {
                                    return model.get('solo') === false;
                                }
                            );

            // no track is solo, restore unmuted tracks' volume
            if (soloTracks.length === 0) {
                Audiee.Collections.Tracks.each(function(model) {
                    if (model.get('muted') === false) {
                        Audiee.Player.volumeChange(model.get('gain'), model.cid);
                    } else {
                        Audiee.Player.volumeChange(0, model.cid);
                    }
                });
            } else {
                _.each(soloTracks, function(model) {
                    Audiee.Player.volumeChange(model.get('gain'), model.cid);
                });
                _.each(otherTracks, function(model) {
                    Audiee.Player.volumeChange(0, model.cid);
                });
            }
        }
    });
});