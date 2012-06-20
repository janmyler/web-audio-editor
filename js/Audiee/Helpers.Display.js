/**
 * This helper object provides functions related to drawing waveforms,
 * zoom level, etc.
 *
 * @file        Helpers.Display.js
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
    'plugins/modal'
], function($, _, Backbone, AlertT) {
    return (function() {
        function Display() {
            // 1px * 1*4 = 4.00sec
            // 1px * 1*2 = 2.00sec
            // 1px * 1/1 = 1.00sec
            // 1px * 1/2 = 0.50sec 
            // 1px * 1/4 = 0.25sec
            this.zoomLevel = 1;
            this.scale = 20; 
            this.subpixels = 5;            
            this.playbackCursorFollowing = true;
        }

        Display.prototype.zoomOut = function() {
            if (this.zoomLevel * 1.5 < 60)      // limitation of maximum zoom level
                this.zoomLevel *= 1.5;
        };

        Display.prototype.zoomIn = function() {
            if (this.zoomLevel / 1.5 > 0.005)   // limitation of minimum zoom level
                this.zoomLevel /= 1.5;
        };

        Display.prototype.zoomZero = function() {
            this.zoomLevel = 1;
        };

        Display.prototype.px2sec = function(px) {
            return px * this.zoomLevel / this.scale;
        };

        Display.prototype.sec2px = function(sec) {
            return sec / this.zoomLevel * this.scale;
        };

        // used for timeline ticks rendering
        Display.prototype.getIntervals = function(frame) {
            var mainInterval = Math.ceil(this.px2sec(frame * 100)),
                subInterval;
            
            mainInterval =  mainInterval >  9000 ?   120 :  // 2 minutes
                            mainInterval >  6000 ?    60 :  // 1 minute
                            mainInterval >  3000 ?    30 :  // 30 seconds
                            mainInterval >  1500 ?    20 :  // 20 seconds
                            mainInterval >   800 ?    10 :  // 10 seconds
                            mainInterval >   300 ?     5 :  //  5 seconds
                            mainInterval >   150 ?     2 :  //  2 seconds
                            mainInterval >    60 ?     1 :  //  1 second
                            mainInterval >    30 ?   0.5 :  //  0.500 seconds
                            mainInterval >     5 ?   0.2 :  //  0.200 seconds
                                                     0.1 ;  //  0.100 seconds

            subInterval =   mainInterval ==  120 ? 4 :
                            mainInterval ==   60 ? 4 :
                            mainInterval ==   30 ? 3 :  
                            mainInterval ==   20 ? 4 :
                            mainInterval ==   10 ? 4 :
                            mainInterval ==    5 ? 5 :
                            mainInterval ==    2 ? 4 :
                            mainInterval ==    1 ? 4 :
                            mainInterval ==  0.5 ? 5 :
                            mainInterval ==  0.2 ? 4 :
                                                   5 ;

            return {
                interval : mainInterval,
                subdivision : subInterval
            };
        };

        Display.prototype.getSubinterval = function(frame) {
            // nothing here so far        
        };

        Display.prototype.frameRMS = function(buffer, index, frame) {
            var rms = 0;
            for (var i = 0; i < frame; ++i) {
                rms += buffer[index + i] * buffer[index + i];
            }
            return Math.sqrt(rms / frame);
        };

        Display.prototype.frameMax = function(buffer, index, frame) {
            // nothing here so far
        };

        Display.prototype.clearDisplay = function(canvas, from, to) {
            var ctx = canvas.getContext('2d');
            ctx.clearRect(from || 0, 0, to || canvas.width, canvas.height);
        };

        Display.prototype.drawSound = function(canvas, audioBuffer, totalWidth, offset) {
            var ctx   = canvas.getContext('2d'),
                frame = audioBuffer.length / this.sec2px(audioBuffer.duration) / this.subpixels,
                ch1   = audioBuffer.getChannelData(0),
                ch2   = undefined,
                mid   = canvas.height / 2;  // maximum amplitude height
                val   = 0,
                posX  = 0,
                i     = (offset * frame * this.subpixels) % audioBuffer.length;

            if (audioBuffer.numberOfChannels > 1)
                ch2 = audioBuffer.getChannelData(1);
            
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.moveTo(posX, mid);
            
            // draws just a channel 1 data (dummy version)
            while(posX <= canvas.width) {
                val = ch1[Math.floor(i)];
                // val = this.frameRMS(ch1, Math.floor(i), frame);
                
                // if (ch2)
                //     val = (val + ch2[Math.floor(i)]) / 2;

                i = (i + frame) % audioBuffer.length;

                ctx.lineTo(posX, (val * mid) + mid); // FIXME: plus and minus signs must be switched [+v,-^] to [+^,-v]
                
                // draws splitting lines (start and end of the clip)
                if (i >= 0 && i <= frame) {
                    ctx.globalCompositeOperation = 'destination-over';
                    ctx.fillRect(posX, 0, 1, 10);
                    ctx.fillRect(posX, canvas.height - 10, 1, 10);
                    ctx.globalCompositeOperation = 'source-over';
                }

                posX += 1 / this.subpixels;
            }

            ctx.stroke();
        };

        Display.prototype.drawCursor = function(canvas, position) {
            var ctx = canvas.getContext('2d');
            position += 0.5;
            ctx.strokeStyle = '#ff8000';
            ctx.beginPath();
            ctx.moveTo(position, 0);
            ctx.lineTo(position, canvas.height);
            ctx.stroke();
        };

        Display.prototype.drawSelection = function(canvas, from, length) {
            var ctx = canvas.getContext('2d');
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fillRect(from, 0, length, canvas.height);
        };    

        Display.prototype.showPlaybackPosition = function(position) {
            if (typeof position === 'undefined')
                return;

            var $cursor = $('#playback-position'),
                tracksCount  = Audiee.Collections.Tracks.length,
                trackHeight  = $('.track').height(),
                editorWidth  = Audiee.Views.Editor.el.width(),
                editorScroll = Audiee.Views.Editor.el.scrollLeft();

            Audiee.Views.PlaybackControls.updateTime(this.px2sec(position));
            position += 120;  // track controls width

            $cursor.height(tracksCount * trackHeight)
                   .css('left', position + 'px')
                   .show();

            /* NOTE: Removed due to appearance issues.
            if (this.playbackCursorFollowing && ((position > (editorScroll + editorWidth / 2)) || position < editorScroll)) {
                Audiee.Views.Editor.el.scrollLeft(position - editorWidth / 2);
            }*/
            
            if (this.playbackCursorFollowing && ((position > (editorScroll + editorWidth)) || position < editorScroll)) {
                Audiee.Views.Editor.el.scrollLeft(position - 120);
            }
        };

        Display.prototype.hidePlaybackPosition = function() {
            $('#playback-position').hide();
        };

        return Display;
    })();
});