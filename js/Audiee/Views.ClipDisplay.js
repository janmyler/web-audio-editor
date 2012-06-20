/**
 * View for sound visualisation of a single audio clip
 *
 * @file        Views.ClipDisplay.js
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
        className: 'clip-display',

        template: _.template(
            '<canvas width="{{ width }}" height="{{ height }}">' +
                'Your browser does not support HTML5 canvas.' +
            '</canvas>'
        ),

        initialize: function() {
            _.bindAll(this, 'render', 'getLastCanvas');
        },

        render: function(totalWidth) {    
            // calculate width and height
            var clipWidth = totalWidth,
                maxWidth  = 20000,
                width     = 0,
                height    = 100,
                offset    = Audiee.Display.sec2px(this.model.get('startTime'));
                $el       = $(this.el);

            $el.empty();

            do {                
                if (clipWidth > maxWidth) 
                    width = maxWidth;
                else 
                    width = clipWidth;  

                $el.append(this.template({
                    width: width,
                    height: height
                }));

                Audiee.Display.drawSound(
                    this.getLastCanvas(), 
                    this.model.get('buffer'),
                    totalWidth,
                    offset
                );

                clipWidth -= maxWidth;
                offset += maxWidth;
            } while (clipWidth > 0);

            return this;
        },

        getLastCanvas: function() {
            return $(this.el).find('canvas').last()[0];
        }
    });
});