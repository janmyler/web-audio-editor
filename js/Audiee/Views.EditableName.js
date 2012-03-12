/*
 * Author: Jan Myler <honza.myler@gmail.com>
 * Filename: editable_name_view.js
 * 
 * View for editing the name titles (e.g. project name, track name etc.).
 */

define([
    'underscore',
    'backbone',
    'text!templates/name_view.html'
], function(_, Backbone, nameViewTPL) {

    var EditableName = Backbone.View.extend({
        // default parent DOM element (project name)
        el: $('#project-name'),

        // cached template function
        template: _.template(nameViewTPL),

        // DOM events listeners
        events: {
            'dblclick .name-content' : 'edit',
            'keyup .name-input'      : 'keyupHandler',
            'blur .name-input'       : 'close'
        },

        // listeners to a model's changes
        initialize: function() {
            _.bindAll(this, 'render', 'close');
            this.model.bind('change:name', this.render);
        },

        // rendering function
        render: function() {
            console.log('rendering view');
            this.el.html(this.template({name: this.model.get('name')}));
            this.input = this.$('.name-input');
            return this;
        },

        // switch view into 'editing' mode
        edit: function() {
            this.el.addClass('editing');
            this.input.focus().select();
        },

        // go to the close function when 'enter' is pressed
        keyupHandler: function(e) {
            if (e.which == 13) {
                this.model.set({name: this.input.val()});
                this.el.removeClass('editing');     
            } else if (e.which == 27) {
                this.close();
            }   
            
        },

        // close the 'editing' mode and save the changes to the model
        close: function() {
            this.input.val(this.model.get('name'));
            this.el.removeClass('editing');
        }
    });

    return EditableName;
});