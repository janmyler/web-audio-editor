/**
 * View for a single editor track
 *
 * @file        Views.Track.js
 * @author      Jan Myler <honza.myler[at]gmail.com>
 * @copyright   Copyright 2012, Jan Myler (http://janmyler.com)
 * @license     MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 */

define([
    'underscore',
    'backbone',
    'Audiee/Views.EditableName',
    'Audiee/Views.TrackDisplay',
    'Audiee/Views.TrackControls',
    'Audiee/Views.Clips'
], function(_, Backbone, EditableNameV, TrackDisplayV, TrackControlsV, ClipsV) {

    return Backbone.View.extend({
        tagName: 'div',
        className: 'track',
        
        initialize: function () {
            _.bindAll(this, 'render', 'remove', 'zoomChange', 'clearDisplay');
            this.model.bind('destroy', this.remove);
            this.model.bind('Audiee:zoomChange', this.zoomChange);
            this.model.bind('Audiee:clearDisplay', this.clearDisplay);
        },

        render: function() {
            var offsetLeft = Audiee.Views.Editor.scrollLeftOffset(),  
                width = Audiee.Display.sec2px(this.model.get('length')),
                $infoV = $('<div class="track-info">');

            this.editableName = new EditableNameV({
                model: this.model,
                className: 'track-name',
                hasColor: true
            }),
            this.trackDisplay = new TrackDisplayV({
                model: this.model
            }),
            this.trackControls = new TrackControlsV({
                model: this.model
            });

            // track-info element completion
            $infoV.append(this.editableName.el).append(this.trackControls.el);

            // track view completion
            $(this.el).empty().width(width)
                .attr('data-cid', this.model.cid)
                .append($infoV)
                .append(this.trackDisplay.el);

            
            // handle left scroll offset if any
            $infoV.css('left', offsetLeft + 'px');
            
            new ClipsV({
                collection: this.model.clips,
                el: $('.track-display', this.el)
            }).render();

            return this;
        },

        remove: function() {
            $(this.el).remove();
        },

        zoomChange: function() {
            var width = Audiee.Display.sec2px(this.model.get('length'));
            $(this.el).width(width);
        },

        clearDisplay: function() {
            this.trackDisplay.clearDisplay();
        }
    });
});