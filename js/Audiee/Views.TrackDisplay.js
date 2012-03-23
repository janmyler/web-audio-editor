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
            _.bindAll(this, 'render');
            this.render();
        },

        render: function() {
            console.log('Display.render()');
            // calculate width and height
            var width = this.model.get('length'),    // TODO: change ratio? 1px == 1sec
                height = 100;

            $(this.el).html(this.template({
                width: width,
                height: height
            })).width(width);
            return this;
        }
    });
});