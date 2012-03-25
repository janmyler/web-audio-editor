/**
 * Author: Jan Myler <honza.myler@gmail.com>
 * 
 * View for sound visualisation of a single audio clip.
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
            _.bindAll(this, 'render');
            this.render();
        },

        render: function() {
            // calculate width and height
            var width = this.model.get('endTime') - this.model.get('startTime'), // TODO: zoom ratio must be involved
                height = 100;

            $(this.el).html(this.template({
                width: width,
                height: height
            }));
            return this;
        }
    });
});