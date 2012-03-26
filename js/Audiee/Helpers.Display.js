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
        }

        Display.prototype.zoomOut = function() {
            this.zoomLevel *= 2;
            Audiee.Views.Tracks.trigger('Audiee:zoomChange');
        };

        Display.prototype.zoomIn = function() {
            this.zoomLevel /= 2;
            Audiee.Views.Tracks.trigger('Audiee:zoomChange');
        };

        Display.prototype.px2sec = function(px) {
            return px * this.zoomLevel / 20;
        };

        Display.prototype.sec2px = function(sec) {
            return sec / this.zoomLevel * 20;
        };

        Display.prototype.drawSound = function(canvas, audioBuffer) {
            var ctx   = canvas.getContext('2d'),
                frame = Math.floor(audioBuffer.length / canvas.width),
                frame5 = Math.floor(audioBuffer.length / canvas.width / 5),
                ch1   = audioBuffer.getChannelData(0),
                ch2   = undefined,
                mid   = canvas.height / 2;  // maximum amplitude height
                val   = 0,
                posX  = 0,
                i     = 0;

            console.log('Display.drawSound()', frame, frame5);

            if (audioBuffer.numberOfChannels > 1)
                ch2 = audioBuffer.getChannelData(1);

            // draws just a channel 1 data (dummy version)
            ctx.beginPath();
            ctx.moveTo(posX, mid);
            // draws the samples
            while(i < audioBuffer.length) {
                val = ch1[i];
                
                if (ch2)
                    val = (val + ch2[i]) / 2;
                
                /*var max = -1;
                for (var j = frame5 - 1; j; j--) {
                    if (max < ch1[i + j])
                        max = ch1[i + j];
                }*/

                i += frame5;
                ctx.lineTo(posX, (val * mid) + mid);
                posX += 0.2;
            }

            ctx.stroke();
        };

        return Display;
    })();
});