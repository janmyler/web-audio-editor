/**
 * View for clips container within a track
 *
 * @file        Views.TrackDisplay.js
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
], function($, _, Backbone) {
    // sets the Mustache format delimiter: {{ variable }}
    _.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g
    };

    return Backbone.View.extend({
        tagName: 'div',
        className: 'track-display',
        wrapperName: 'display-wrapper',
        wrapperClass: '.display-wrapper',
        maxWidth: 20000,        // maximum canvas width

        template: _.template(
            '<canvas width="{{ width }}" height="{{ height }}">' +
                'Your browser does not support HTML5 canvas.' +
            '</canvas>'
        ),

        initialize: function() {
            _.bindAll(this, 
                'render', 
                'renderDisplay', 
                'renderCursor',
                'renderSelection',
                'cursor',
                'selection',
                'contextMenu'
            );
            this.model.bind('Audiee:zoomChange', this.renderDisplay);  

            // register mouse events
            $(this.el)
                .on('contextmenu', this.wrapperClass, this.contextMenu)
                .on('mousedown', this.wrapperClass, this.cursor)
                .on('mouseup', this.wrapperClass, this.selection);
                
            this.render();
        },

        render: function() {
            // calculate width and height
            var $wrapperV = $('<div class="' + this.wrapperName + '">'),
                $el = $(this.el);

            $el.append($wrapperV);
            this.renderDisplay();          

            return this;
        },

        renderDisplay: function() {
            var width = Audiee.Display.sec2px(this.model.get('length')),
                maxWidth = this.maxWidth,
                height = 100,   
                $el = $(this.el),
                $wrapperV = $el.find(this.wrapperClass);

            // remove canvas elements without removing the event listeners
            $el.width(width);
            $wrapperV.children().detach();

            do {
                $wrapperV.append(this.template({
                    width: (width > maxWidth) ? maxWidth : width,
                    height: height
                }));

                width -= maxWidth;
            } while (width > 0);

            this.clearDisplay();
            this.renderCursor();
            this.renderSelection();
        },

        cursor: function(e) {
            // set active class to the selected track
            var $track = $(this.el).parent('.track'),
                $canvasArray = $(this.wrapperClass, this.el).children('canvas');
            
            if (!e.shiftKey) {
                var index = $canvasArray.index($(e.target)),
                    offset = e.offsetX + index * this.maxWidth,
                    position = offset % this.maxWidth;
                
                this.clearDisplay();
                Audiee.Views.Editor.setActiveTrack($track);
                Audiee.Views.Editor.setCursor(Audiee.Display.px2sec(offset));
                Audiee.Views.Editor.unsetMultiSelection();
                this.renderCursor();        
            } else {
                this.selection(e);
            }

            $(this.wrapperClass).on('mousemove', this.selection);        
        },

        renderCursor: function() {
            if (!Audiee.Views.Editor.isActiveTrack()) 
                return;

            var $track = Audiee.Views.Editor.getActiveTrack(),
                $canvasArray = $(this.wrapperClass, $track).children('canvas'),
                position = Audiee.Display.sec2px(Audiee.Views.Editor.getCursor()),
                index = Math.floor(position / this.maxWidth);

            // draw the cursor
            Audiee.Display.drawCursor($canvasArray.eq(index)[0], position % this.maxWidth);
        },

        selection: function(e) {
            if (Audiee.Views.Editor.isMoving())
                return;

            if (e.type === 'mouseup') 
                $(this.wrapperClass).off('mousemove');

            var $track = $(e.target).parents('.track'),
                $canvasArray = $track.find(this.wrapperClass).children('canvas'),   // canvas array within a track display
                selectionTo = e.offsetX + $canvasArray.index($(e.target)) * this.maxWidth;   // total offset in the track display

            if (Audiee.Views.Editor.isSelection()) 
                this.clearDisplay();

            // store the selectionTo value in the editor view 
            if (e.shiftKey) {
                var from = Audiee.Views.Editor.getCursor(),
                    to = Audiee.Views.Editor.getSelectionTo(),
                    middle = Audiee.Display.sec2px(from + (to - from) / 2);
                if (selectionTo >= middle) {
                    Audiee.Views.Editor.setSelectionTo(Audiee.Display.px2sec(selectionTo), true);    
                } else {
                    Audiee.Views.Editor.setSelectionFrom(Audiee.Display.px2sec(selectionTo));    
                }
            } else {
                Audiee.Views.Editor.setSelectionTo(Audiee.Display.px2sec(selectionTo));    
            }

            if (Audiee.Views.Editor.isActiveTrack() && Audiee.Views.Editor.getActiveTrack().data('cid') !== $track.data('cid')) {
                Audiee.Views.Editor.setMultiSelection($track);
            } else {
                Audiee.Views.Editor.unsetMultiSelection();
            }

            this.renderSelection();   
        },

        renderSelection: function() {
            var selectionFrom = Audiee.Display.sec2px(Audiee.Views.Editor.getCursor()),
                selectionTo = Audiee.Display.sec2px(Audiee.Views.Editor.getSelectionTo()),
                indexFrom = Math.floor(selectionFrom / this.maxWidth),
                indexTo = Math.floor(selectionTo / this.maxWidth),
                $tracks = $('.track'),
                that = this,
                from, len, tmp, $canvasArray;

            // if there is a selection (from != to), clear all TrackDisplays and render the selection
            if (!isNaN(selectionFrom) && selectionFrom !== selectionTo) {
                var index1 = $tracks.index(Audiee.Views.Editor.getActiveTrack()),
                    index2 = index1;
                
                if (Audiee.Views.Editor.isMultiSelection()) {
                    index2 = $tracks.index(Audiee.Views.Editor.getMultiSelection());
                    if (index1 > index2) {  // swap indexes if needed
                        tmp = index1;
                        index1 = index2;
                        index2 = tmp;
                    }
                } 

                selectionTo %= this.maxWidth;   
                $tracks.slice(index1, ++index2).each(function() {
                    $canvasArray = $(this).find(that.wrapperClass).children('canvas');
                    from = selectionFrom % that.maxWidth;
                    len = (indexFrom !== indexTo) ? (that.maxWidth - from) : (selectionTo - from);
                    
                    for (var index = indexFrom; index <= indexTo; ++index) {
                        Audiee.Display.drawSelection($canvasArray.eq(index)[0], from, len);
                        from = 0;
                        len = (index != indexTo - 1) ? that.maxWidth : selectionTo;
                    } 
                });                
            }
        },

        clearDisplay: function() {
            var selectionFrom = Audiee.Display.sec2px(Audiee.Views.Editor.getCursor()),
                selectionTo = Audiee.Display.sec2px(Audiee.Views.Editor.getSelectionTo()) + 1,
                indexFrom = Math.floor(selectionFrom / this.maxWidth),
                indexTo = Math.floor(selectionTo / this.maxWidth),
                $tracks = $('.track'),
                that = this,
                from, len, tmp, $canvasArray;

            // if there is a selection (from != to), clear all TrackDisplays and render the selection
            if (!isNaN(selectionFrom)) {
                var index1 = $tracks.index(Audiee.Views.Editor.getActiveTrack()),
                    index2 = index1;
                
                if (Audiee.Views.Editor.isMultiSelection()) {
                    index2 = $tracks.index(Audiee.Views.Editor.getMultiSelection());
                    if (index1 > index2) {  // swap indexes if needed
                        tmp = index1;
                        index1 = index2;
                        index2 = tmp;
                    }
                } 

                selectionTo %= this.maxWidth;   
                $tracks.slice(index1, ++index2).each(function() {
                    $canvasArray = $(this).find(that.wrapperClass).children('canvas');
                    from = selectionFrom % that.maxWidth;
                    len = (indexFrom !== indexTo) ? (that.maxWidth - from) : (selectionTo - from);
                    
                    for (var index = indexFrom; index <= indexTo; ++index) {
                        Audiee.Display.clearDisplay($canvasArray.eq(index)[0], from, len);
                        from = 0;
                        len = (index != indexTo - 1) ? that.maxWidth : selectionTo;
                    } 
                });                
            }
        },

        contextMenu: function(e) {
            e.preventDefault();
        },
    });
});