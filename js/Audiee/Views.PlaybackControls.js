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

            var min  = Math.floor(currentTime / 60),
                sec  = currentTime % 60,
                i;


            // number to string conversion and string shortening
            sec += '';            
            i = sec.indexOf('.');
            if (i !== -1)
                sec = sec.substring(0, i + 4);

            this.el.children('#time-display').val(min + ' : ' + sec);
            /*this.el.children('#time-display').val(min + ' : ' + sec + '.' + msec);*/
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