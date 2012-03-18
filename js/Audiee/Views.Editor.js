/**
 * Author: Jan Myler <honza.myler@gmail.com>
 * 
 * View for main editor panel.
 */

define([
    'underscore',
    'backbone',
], function(_, Backbone) {

    var EditorPanel = Backbone.View.extend({
        // parent DOM element
        el: $('#editor-view'),

        // DOM events listeners
        events: {
           
        },

        // listeners to a model's changes
        initialize: function() {
            _.bindAll(this, 'render', 'changeTitle');
            $(window).on('resize', this.render);
            this.model.bind('change:name', this.changeTitle);

            // rewrite title tag with proper project name value
            $('title').text(this.model.get('name') + ' :: Audiee');
        },

        // render function
        render: function() {
            // resize element height to 100%
            var height = $(window).height() - this.el.position().top
                            - parseInt(this.el.css('margin-top'));
            this.el.height(height);

            return this;
        },

        // update page title when project name is changed
        changeTitle: function() {
            $('title').text(this.model.get('name') + ' :: Audiee');
        },

    });

    return EditorPanel;
});