/**
 * Author: Jan Myler <honza.myler@gmail.com>
 * 
 * View for a track controls.
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
        className: 'track-controls',

        template: _.template(
            '<button class="btn">M</button>' +
            '<button class="btn">S</button>'
        ),

        initialize: function() {
            _.bindAll(this, 'render');
            this.render();
        },

        render: function() {
            $(this.el).html(this.template());
            return this;
        }
    });
});