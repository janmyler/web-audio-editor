/**
 * Author: Jan Myler <honza.myler@gmail.com>
 * Filename: editable_name_view.js
 * 
 * View for editing the name titles (e.g. project name, track name etc.).
 */

define([
    'underscore',
    'backbone',
    'text!templates/EditableName.html'
], function(_, Backbone, EditableNameT) {
    // sets the Mustache format delimiter: {{ variable }}
    _.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g
    };

    return Backbone.View.extend({
        // cached template function
        template: _.template(EditableNameT),

        // DOM events listeners
        events: {
            'dblclick .name-content' : 'edit',
            'keyup .name-input'      : 'keyupHandler',
            'blur .name-input'       : 'close',
            'contextmenu .display'   : 'colorChange'
        },

        // listeners to a model's changes
        initialize: function() {
            _.bindAll(this, 'render', 'close');
            this.model.bind('change:name', this.render);
            this.model.bind('change:color', this.render);
            this.render();
        },

        // rendering function
        render: function() {
            $(this.el).html(this.template({name: this.model.get('name')}));
            
            // sets the background color, if the options is enabled
            if (this.options.hasColor)
                $(this.el).css('background-color', this.model.get('color'));

            this.input = this.$('.name-input');
            return this;
        },

        // switches view into 'editing' mode
        edit: function() {
            $(this.el).addClass('editing');
            this.input.focus().select();
        },

        // goes to the close function when 'enter' is pressed
        keyupHandler: function(e) {
            if (e.which == 13) {
                this.model.set({name: this.input.val()});
                $(this.el).removeClass('editing');     
            } else if (e.which == 27) {
                this.close();
            }               
        },

        // closes the 'editing' mode and saves the changes to the model
        close: function() {
            this.input.val(this.model.get('name'));
            $(this.el).removeClass('editing');
        },

        // shows color change dialog when 'RMB' is clicked
        colorChange: function(e) {
            e.preventDefault();     // don't show the context menu
            if (this.options.hasColor && e.which == 3) {
                var newColor = prompt('New color hex code?');
                this.model.set({color: newColor});
            }
            return false;
        }

    });
});