/**
 * View for a collection of audio clips
 *
 * @file        Views.Clips.js
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
    'Audiee/Views.Clip'
], function($, _, Backbone, ClipV) {
    
    return Backbone.View.extend({
        initialize: function() {
            _.bindAll(this, 'render', 'addAll', 'addOne');
            this.collection.bind('add', this.addOne);
        },

        render: function() {
            this.addAll();
            return this;
        },

        addAll: function() {
            this.collection.each(this.addOne);
        },

        addOne: function(model) {
            var view = new ClipV({model: model});
            $(this.el).append(view.render().el);
            model.bind('remove', view.remove);
        }
    });
});