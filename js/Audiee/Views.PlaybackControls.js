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
            _.bindAll(this, 'handleKey');
            this.render();
            this.pressingKey = false;
            $(document)
                .on('keydown', this.handleKey)
                .on('keyup', this.handleKey);
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