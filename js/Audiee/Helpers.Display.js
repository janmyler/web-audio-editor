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
            return px * this.zoomLevel;
        };

        Display.prototype.sec2px = function(sec) {
            return sec / this.zoomLevel;
        };

        return Display;
    })();
});