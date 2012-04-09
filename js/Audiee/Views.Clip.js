/**
 * Author: Jan Myler <honza.myler@gmail.com>
 * 
 * View for a single audio clip.
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
            _.bindAll(this, 'render', 'remove', 'soundwaveRender', 'updatePosition', 'scrollChange', '_clipWidth');
            this.model.bind('change:startTime', this.soundwaveRender);  
            this.model.bind('change:endTime', this.soundwaveRender);
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
                // start: function?,
                drag: this.scrollChange,
                stop: this.updatePosition,
                // scroll?
            }).css('position', 'absolute');
              
        },

        render: function() {
            var left = Audiee.Display.sec2px(this.model.get('trackPos')),
                width = this._clipWidth(),
                that = this;

            // console.log('Clip.render() ', left, width);

            $(this.el).children().detach().end()  // empty an element, but save the event listeners etc.
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
                        var length  = that.model.get('buffer').duration,
                            loop, loopRemainder;
                        
                        // resize from left or right border?
                        if (ui.originalPosition.left === ui.position.left) { // from right NOTE: should be ok now
                            // FIXME: overflows right track border...
                            var endTime = Audiee.Display.px2sec(ui.size.width) + that.model.get('startTime');
                            that.model.set('endTime', endTime % length);
                        } else {  // from left
                            var newStartTime = Audiee.Display.px2sec(ui.position.left) - that.model.get('trackPos'),
                                newTrackPos;
                            
                            // console.log('left: ' + ui.position.left, 'trackPos: ' + that.model.get('trackPos'), 'newStartTime: ' +  newStartTime);
                            
                            if (that.model.get('trackPos') <= 0.05) {   // clip is at the very beginning of the track 
                                if (newStartTime > 0) { // resize --> direction to the right NOTE: should be ok now
                                    newStartTime += that.model.get('startTime');
                                    newTrackPos = Audiee.Display.px2sec(ui.position.left);
                                } else {  // resize <-- direction to the left NOTE: should be ok now
                                    newStartTime = that.model.get('startTime');
                                    newTrackPos = 0;
                                }
                            } else { // clip is somewhere else 
                                newStartTime += that.model.get('startTime');
                                newTrackPos = Audiee.Display.px2sec(ui.position.left);
                            }

                            newStartTime %= length;
                            that.model.set('startTime', (newStartTime % length < 0) ? length - newStartTime : newStartTime);
                            that.model.set('trackPos', newTrackPos);
                        }

                        loop = Math.floor(Audiee.Display.px2sec(ui.size.width) / length);
                        loopRemainder = Audiee.Display.px2sec(ui.size.width) % length;

                        // console.log('loop: ' + loop, 'loopRemainder: '+ loopRemainder);
                        
                        if((loopRemainder - that.model.get('endTime')) > 0) // FIXME: not always accurate
                            loop += 1;

                        that.model.set('loop', loop);

                        /*console.log(
                            'startTime: ' + that.model.get('startTime'), 
                            'endTime: ' + that.model.get('endTime'),
                            'length: ' + that.model.get('length'),
                            'loop: ' + that.model.get('loop')
                        );*/
                    },
                    stop: function() {
                        // console.log('message');
                        that.soundwaveRender();
                    } // usefull here?
                });
            
            // change clip name left offset if needed
            this.scrollChange();

            return this;
        },

        remove: function() {
            $(this.el).remove();
        },

        soundwaveRender: function() {
            this.clipDisplay.render(this._clipWidth());  
        },

        updatePosition: function(e) {
            var offsetLeft = Audiee.Display.px2sec(e.target.offsetLeft);
            this.model.set('trackPos', offsetLeft);
        },

        scrollChange: function(e, ui) {
            var scrollLeft = Audiee.Views.Editor.scrollLeftOffset(),
                left = Audiee.Display.px2sec(scrollLeft),
                trackPos = (typeof ui !== 'undefined') ? Audiee.Display.px2sec(ui.position.left) : this.model.get('trackPos'),
                width = this._clipWidth(),
                offset = left - trackPos;

            if (left > trackPos && left < (trackPos + width)) {
                $(this.editableName.el).css('padding-left', Audiee.Display.sec2px(offset))
                    .find('.name-content').text('...' + this.model.get('name'));
            } else {
                $(this.editableName.el).css('padding-left', 0)
                    .find('.name-content').text(this.model.get('name'));
            }
        },

        _clipWidth: function() {
            return Audiee.Display.sec2px(
                this.model.get('endTime') 
              - this.model.get('startTime') 
              + this.model.get('loop')
              * this.model.get('buffer').duration
            );
        }
    });
});