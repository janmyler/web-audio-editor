/**
 * Author: Jan Myler <honza.myler@gmail.com>
 * Filename: editable_name_view.js
 * 
 * View for editing the name titles (e.g. project name, track name etc.).
 */

define([
    'underscore',
    'backbone',
    'text!templates/EditableName.html',
    'text!templates/ContextMenu.html'
], function(_, Backbone, EditableNameT, ContextMenuT) {
    // sets the Mustache format delimiter: {{ variable }}
    _.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g
    };

    return Backbone.View.extend({
        // cached template function
        template: _.template(EditableNameT),
        menu: _.template(ContextMenuT),

        // listeners to a model's changes
        initialize: function() {
            _.bindAll(this, 'render', 'close', 'edit', 'contextMenu', 'keyupHandler');
            this.model.bind('change:name', this.render);
            this.model.bind('change:color', this.render);

            // register mouse events
            $(this.el)
                .on('dblclick', '.name-content', this.edit)
                .on('keyup', '.name-input', this.keyupHandler)
                .on('blur', '.name-input', this.close)
                .on('contextmenu', '.display', this.contextMenu);

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

        // shows context menu change dialog when 'RMB' is clicked
        contextMenu: function(e) {
            e.preventDefault();     // don't show the context menu
            if (this.options.hasColor && e.which == 3) {
                $('body').append(this.menu);
                var $cm = $('ul.context-menu'),
                    that = this;

                $cm.find('span.cm-color').each(function() {
                    $(this).css('background', $(this).data('color'));
                });

                $cm.css({
                    top: e.clientY + 'px',
                    left: e.clientX + 'px'
                });
                
                $(document).on('click', function(e) {
                    $cm.remove();
                });

                $cm.on('click', '#cm-rename', function() {
                    that.edit();
                });

                $cm.on('click', '#cm-remove', function() {
                    that.model.destroy();
                });

                $cm.on('click', '.cm-color', function(e) {
                    console.log(that.model);
                    that.model.set('color', e.target.dataset.color);
                });

            }
            return false;
        }

    });
});