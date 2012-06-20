/**
 * View for a single audio clip
 *
 * @file        Views.Clip.js
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
    'Audiee/Views.ClipDisplay',
    'Audiee/Views.EditableName',
    'drag_resize'
], function($, _, Backbone, ClipDisplayV, EditableNameV) {
    // sets the Mustache format delimiter: {{ variable }}
    _.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g
    };

    return Backbone.View.extend({
        tagName: 'div',
        className: 'clip',

        initialize: function() {
            _.bindAll(this, 
                'render', 
                'remove', 
                'soundwaveRender',
                'positionRender',
                'updatePosition', 
                'scrollChange', 
                '_clipWidth'
            );
            this.model.bind('change:startTime', this.soundwaveRender);
            this.model.bind('change:endTime', this.soundwaveRender);
            this.model.bind('change:trackPos', this.positionRender);
            this.model.bind('destroy', this.remove);
            this.model.collection.bind('Audiee:zoomChange', this.render);
            this.model.collection.bind('Audiee:scroll', this.scrollChange);
            
            this.editableName = new EditableNameV({
                model: this.model,
                className: 'clip-name',
                hasColor: true
            }),
            this.clipDisplay  = new ClipDisplayV({
                model: this.model
            });

            $(this.el).draggable({
                addClasses: false,
                axis: 'x',
                containment: 'parent',
                handle: 'div.clip-name',
                cursor: 'move',
                start: this.startMoving,
                drag: this.scrollChange,
                stop: this.updatePosition,
                // scroll?
            }).css('position', 'absolute');
        },

        render: function() {
            var left  = Audiee.Display.sec2px(this.model.get('trackPos')),
                width = this._clipWidth(),
                that  = this;

            // console.log('Clip.render() ', left, width);

            $(this.el).children().detach().end()  // detach() deletes element's content but saves event listeners etc.
                .css('left', left + 'px')                    
                .width(width)  
                .resizable('destroy')
                .append(this.editableName.el)
                .append('<div class="ui-resizable-handle ui-resizable-w">')
                .append('<div class="ui-resizable-handle ui-resizable-e">')
                .append(this.clipDisplay.render(width).el)
                .resizable({
                    handles: {
                        w: '.ui-resizable-w',
                        e: '.ui-resizable-e'
                    },
                    containment: 'parent',  // TODO: remove this? (track resizing with clip...)
                    // grid: 5,
                    // start: function(e) {console.log(e);},
                    resize: function(e, ui) {
                        var duration = that.model.get('buffer').duration,
                            loop     = that.model.get('loop'),
                            end      = that.model.clipLength(),
                            newStartTime, newEndTime, newTrackPos;
                        
                        Audiee.Views.Editor.movingOn();  // blocks the selection while resizing

                        // resize from left or right border?
                        if (ui.originalPosition.left === ui.position.left) { // from right NOTE: should be ok now
                            // FIXME: overflows right track border...
                            newEndTime = (Audiee.Display.px2sec(ui.size.width) + that.model.get('startTime')) % duration;
                            loop       = loop + Math.floor((that.model.get('endTime') + Audiee.Display.px2sec(ui.size.width) - end) / duration);
                        } else {  // from left
                            newStartTime = Audiee.Display.px2sec(ui.position.left) - that.model.get('trackPos');
                            
                            if (that.model.get('trackPos') <= 0.05) {   // clip is at the very beginning of the track 
                                if (newStartTime > 0) { // resize --> direction to the right NOTE: should be ok now
                                    newStartTime += that.model.get('startTime');
                                    newTrackPos  = Audiee.Display.px2sec(ui.position.left);
                                } else {  // resize <-- direction to the left NOTE: should be ok now
                                    newStartTime = that.model.get('startTime');
                                    newTrackPos  = 0;
                                }
                            } else { // clip is somewhere else 
                                newStartTime += that.model.get('startTime');
                                newTrackPos  = Audiee.Display.px2sec(ui.position.left);
                            }

                            newStartTime %= duration;
                            newStartTime = (newStartTime < 0) ? duration + newStartTime : newStartTime;
                            loop         = loop - Math.floor((that.model.get('startTime') + newTrackPos - that.model.get('trackPos')) / duration);
                        }

                        that.model.set('loop', loop);
                        if (typeof newTrackPos !== 'undefined')
                            that.model.set('trackPos', newTrackPos);
                        if (typeof newStartTime !== 'undefined')
                            that.model.set('startTime', newStartTime);
                        if (typeof newEndTime !== 'undefined')
                            that.model.set('endTime', newEndTime);
                    },
                    stop: function() {
                        var from     = that.model.get('trackPos'),
                            to       = from + that.model.clipLength(),
                            trackCid = $(that.el).parents('.track').data('cid');

                        Audiee.Views.Editor.movingOff();
                        Audiee.Collections.Tracks.deleteSelection(from, to, trackCid, that.model.cid);                        
                        that.soundwaveRender();
                    }
                });
            
            // change clip's name left offset if needed
            this.scrollChange();

            return this;
        },

        remove: function() {
            $(this.el).remove();
        },

        soundwaveRender: function() {
            $(this.el).width(this._clipWidth());
            this.clipDisplay.render(this._clipWidth());  
        },

        positionRender: function() {
            var left = Audiee.Display.sec2px(this.model.get('trackPos'));
            $(this.el).css('left', left + 'px');
        },

        startMoving: function() {
            Audiee.Views.Editor.movingOn();
        },

        updatePosition: function(e) {
            var from     = Audiee.Display.px2sec(e.target.offsetLeft),
                to       = from + this.model.clipLength(),
                trackCid = $(this.el).parents('.track').data('cid');

            // deletes the space before moving clip into the new position
            Audiee.Collections.Tracks.deleteSelection(from, to, trackCid, this.model.cid);
            this.model.set('trackPos', from);
            Audiee.Views.Editor.movingOff();
        },

        scrollChange: function(e, ui) {
            var scrollLeft = Audiee.Views.Editor.scrollLeftOffset(),
                left       = Audiee.Display.px2sec(scrollLeft),
                trackPos   = (typeof ui !== 'undefined') ? Audiee.Display.px2sec(ui.position.left) : this.model.get('trackPos'),
                width      = this._clipWidth(),
                offset     = left - trackPos;

            if (left > trackPos && left < (trackPos + width)) {
                $(this.editableName.el).css('padding-left', Audiee.Display.sec2px(offset))
                    .find('.name-content').text('...' + this.model.get('name'));
            } else {
                $(this.editableName.el).css('padding-left', 0)
                    .find('.name-content').text(this.model.get('name'));
            }
        },

        _clipWidth: function() {
            return Audiee.Display.sec2px(this.model.clipLength());
        },        
    });
});