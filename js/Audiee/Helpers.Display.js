/**
 * Author: Jan Myler <honza.myler@gmail.com>
 * 
 * This helper object provides functions related to drawing waveform,
 * zoom level, etc.
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
        }

        Display.prototype.zoomOut = function() {
            this.zoomLevel *= 1.5;
            Audiee.Views.Tracks.trigger('Audiee:zoomChange');
        };

        Display.prototype.zoomIn = function() {
            this.zoomLevel /= 1.5;
            Audiee.Views.Tracks.trigger('Audiee:zoomChange');
        };

        Display.prototype.px2sec = function(px) {
            return px * this.zoomLevel / this.scale;
        };

        Display.prototype.sec2px = function(sec) {
            return sec / this.zoomLevel * this.scale;
        };

        Display.prototype.drawSound = function(canvas, audioBuffer, totalWidth, offset) {
            var ctx   = canvas.getContext('2d'),
                // frame = Math.floor(audioBuffer.length / totalWidth / this.subpixels),
                frame = audioBuffer.length / totalWidth / this.subpixels,
                ch1   = audioBuffer.getChannelData(0),
                ch2   = undefined,
                mid   = canvas.height / 2;  // maximum amplitude height
                val   = 0,
                posX  = 0,
                i     = offset * frame * this.subpixels;

            // console.log('Display.drawSound()');
            // console.log('frame[',frame, '], start:i[', i, ']');
            if (audioBuffer.numberOfChannels > 1)
                ch2 = audioBuffer.getChannelData(1);

            // draws just a channel 1 data (dummy version)
            ctx.beginPath();
            ctx.moveTo(posX, mid);
            // draws the samples
            while(posX <= canvas.width) {
                val = ch1[Math.floor(i)];
                
                if (ch2)
                    val = (val + ch2[Math.floor(i)]) / 2;
                
                /*var max = -1;
                for (var j = frame5 - 1; j; j--) {
                    if (max < ch1[i + j])
                        max = ch1[i + j];
                }*/

                i += frame;
                ctx.lineTo(posX, (val * mid) + mid);
                posX += 1 / this.subpixels;
            }

            // console.log('next expected i [',i ,']');

            ctx.stroke();
        };

        return Display;
    })();
});