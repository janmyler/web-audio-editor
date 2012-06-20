/**
 * View for main playback controls
 *
 * @file        Views.PlaybackControls.js
 * @author      Jan Myler <honza.myler[at]gmail.com>
 * @copyright   Copyright 2012, Jan Myler (http://janmyler.com)
 * @license     MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 */

define([
    'underscore',
    'backbone'
], function(_, Backbone) {
    return Backbone.View.extend({
        el: $('#playback-controls'),

        // DOM events listeners
        events: {
            'click #play'     : 'play',
            'click #stop'     : 'stop',
            'click #follow'   : 'follow'
        },

        // listeners to a model's changes
        initialize: function() {
            _.bindAll(this, 'handleKey');
            this.render();
            this.pressingKey = false;
            $(document)
                .on('keydown', this.handleKey)
                .on('keyup', this.handleKey);
        },

        // render function
        render: function() {
            this.updateTime();
            return this;
        },

        updateTime: function(currentTime) {
            if (typeof currentTime === 'undefined')
                currentTime = 0;

            var hour = Math.floor(currentTime / 60 / 60);
            currentTime -= hour * 60 * 60;

            var minute = Math.floor(currentTime / 60);
            currentTime -= minute * 60;

            var second = Math.floor(currentTime);
            currentTime -= second;

            var milli = '' + Math.floor(currentTime * 1000);

            if (minute < 10) minute = '0' + minute;
            if (second < 10) second = '0' + second;
            while (milli.length < 3) {
                milli = '0' + milli;
            }

            this.el.children('#time-display').val(hour + ':' + minute + ':' + second + '.' + milli);
        },

        play: function() {
            if (Audiee.Collections.Tracks.length <= 0)
                return;

            var $play = $('#play');
            Audiee.Player.play();

            $play.addClass('playing');
        },

        stop: function() {
            if (Audiee.Collections.Tracks.length <= 0)
                return;

            var $play = $('#play');
            Audiee.Player.stop();

            $play.removeClass('playing');
        },

        follow: function() {
            Audiee.Display.playbackCursorFollowing = !Audiee.Display.playbackCursorFollowing;
            $('#follow').toggleClass('following');
        },

        handleKey: function(e) {
            if (!Audiee.Views.Menu.hotkeysEnabled)
               return;

            switch(e.which) {
                case 32:
                    if (e.type === 'keydown' && !this.pressingKey) {
                        if (Audiee.Player.playing)
                            $('#stop').trigger('click');
                        else
                            $('#play').trigger('click');

                        this.pressingKey = true;
                    } else if (e.type === 'keyup') {
                        this.pressingKey = false;
                    }
                    break;
            }
        }
    });
});