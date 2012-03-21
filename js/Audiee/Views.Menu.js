/**
 * Author: Jan Myler <honza.myler@gmail.com>
 * 
 * View for application menu.
 */

define([
    'underscore',
    'backbone',
    'text!templates/Menu.html',
    'text!templates/NewtrackModal.html',
    'text!templates/AlertModal.html',
    'Audiee/Models.Track',
    'plugins/modal',
    'plugins/dropdown'
], function(_, Backbone, MenuT, ModalT, AlertT, TrackM) {

    return Backbone.View.extend({
        // parent DOM element
        el: $('#menu-view ul.nav'),

        // cached template function
        template: _.template(MenuT),

        // DOM events listeners
        events: {
            'click #m-addnew': 'addTrack',
        },

        initialize: function() {
            this.render();
            _.bindAll(this, 'render', '_fileSelected', '_fileLoaded');
            this.el.bind('fileLoaded', this._fileLoaded);
        },

        render: function() {
            $(this.el).html(this.template());
        },

        // adds a new track
        addTrack: function() {
            var tpl = (_.template(ModalT))(),
                $tpl = $(tpl);

            // register events and show the modal
            $tpl.on('change', '#file-name', this._fileSelected)
                .on('hide', function() { $tpl.remove() })
                .modal();                   // show the modal window
        },
        
        _fileSelected: function(e) {
            try {
                // try to load the selected audio file
                Audiee.Player.loadFile(e.target.files[0], this.el);
            } catch (e) {
                // on error - show alert modal
                var tpl = (_.template(AlertT))({message: e}),
                    $tpl = $(tpl);

                $tpl.on('hide', function() { $tpl.remove() })
                    .modal();           // show the modal window

                // hide the new track modal
                $('#newTrackModal').modal('hide');
            }
        },

        _fileLoaded: function(e, data) {
            e.stopPropagation();
            
            // create new Track model and add it to the Tracks collection
            var track = new TrackM({buffer: data});
            Audiee.Collections.Tracks.add(track);
        }
    });
});