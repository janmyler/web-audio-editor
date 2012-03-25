/**
 * Author: Jan Myler <honza.myler@gmail.com>
 * 
 * View for the collection of audio clips (each track has its own collection of clips).
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
            console.log('Clips.render()');
            this.addAll();
            return this;
        },

        addAll: function() {
            console.log('Clips.addAll()');
            this.collection.each(this.addOne);
        },

        addOne: function(model) {
            console.log('Clips.addOne()');
            var view = new ClipV({model: model});
            $(this.el).append(view.render().el);
            model.bind('remove', view.remove);  // TODO: ?? w00t?
        }
    });
});