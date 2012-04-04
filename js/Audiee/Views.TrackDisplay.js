/**
 * Author: Jan Myler <honza.myler@gmail.com>
 * 
 * View for clips container within a track.
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
        className: 'track-display',

        template: _.template(
            '<canvas width="{{ width }}" height="{{ height }}">' +
                'Your browser does not support HTML5 canvas.' +
            '</canvas>'
        ),

        initialize: function() {
            _.bindAll(this, 'render', 'zoomChange', 'cursor', 'selection');
            this.model.bind('Audiee:zoomChange', this.zoomChange);  

            // register mouse events
            $(this.el)
                .on('mousedown', 'canvas', this.cursor)
                .on('mouseup', 'canvas', this.selection);

            this.render();
        },

        render: function() {
            console.log('TrackDisplay.render()');
            // calculate width and height
            var width = Audiee.Display.sec2px(this.model.get('length')),
                maxWidth = 20000
                height = 100,
                $wrapperV = $('<div class="display">');

            

            // TODO: ehm, div.container>canvas*pocet do delky
            $(this.el).html(this.template({
                width: width,
                height: height
            })).width(width);
            return this;
        },

        zoomChange: function() {
            var width = Audiee.Display.sec2px(this.model.get('length'));
            $(this.el).width(width)
                .find('canvas').attr('width', width); // FIXME: solution with template re-rendering?
        },

        cursor: function(e) {
            this.selectionFrom = Audiee.Display.px2sec(e.offsetX);

            // set active class to the selected track
            $(this.el).parent('.track').addClass('active').siblings().removeClass('active');

            // clear track-display canvas (all the tracks) 
            // NOTE: this is not gonna be here when the shift keypress function is done (editing selection)
            $('.track-display').children('canvas').each(function() {
                Audiee.Display.clearDisplay(this);
            });

            Audiee.Display.drawCursor($(this.el).children('canvas')[0], e.offsetX);
        },

        /*startSelection: function(e) {
            console.log(e.offsetX);
            this.selectionFrom = Audiee.Display.px2sec(e.offsetX);
        },*/

        selection: function(e) {
            console.log(e.offsetX);
            this.selectionTo = Audiee.Display.px2sec(e.offsetX);

            if (this.selectionFrom !== this.selectionTo) {
                // clear track-display canvas (all the tracks)
                $('.track-display').children('canvas').each(function() {
                    Audiee.Display.clearDisplay(this);
            });
                Audiee.Display.drawSelection($(this.el).children('canvas')[0], this.selectionFrom, this.selectionTo);
            }

        }
        
    });
});