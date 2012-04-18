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
            'click #m-addtrack'     : 'addTrack',
            'click #m-removetrack'  : 'removeTrack',
            'click #m-fullscreen'   : 'toggleFullscreen',
            'click #m-zoomin'   : 'zoomIn',
            'click #m-zoomout'  : 'zoomOut',
            'click #m-zoomzero' : 'zoomZero',
            'click #m-copy'     : 'copy',
            'click #m-cut'      : 'cut',
            'click #m-paste'    : 'paste',
            'click #m-delete'   : 'delete'
            
        },

        initialize: function() {
            _.bindAll(this, 'render', '_fileSelected', '_fileLoaded', 'handleKey');
            $(document).on('keyup', this.handleKey);
            this.enableHotkeys();
            this.el.bind('Audiee:fileLoaded', this._fileLoaded);
            this.render();
        },

        render: function() {
            $(this.el).html(this.template());
        },

        handleKey: function(e) {
            if (!this.hotkeysEnabled)
               return; 

            switch(e.which) {
                case 46:   // delete key, shift + delete
                    if (e.ctrlKey)
                        $('#m-removetrack').trigger('click');
                    else
                        $('#m-delete').trigger('click');
                    break;
                case 78:   // n key
                    $('#m-addtrack').trigger('click');
                    break;
                case 107:  // + key
                case 191: 
                    $('#m-zoomin').trigger('click');
                    break;
                case 109:  // - key
                case 187:
                    $('#m-zoomout').trigger('click');
                    break;
                case 48:   // 0 key
                case 96:
                    $('#m-zoomzero').trigger('click');
                    break;
                case 67:   // c key 
                    $('#m-copy').trigger('click');
                    break;
                case 88:   // x key 
                    $('#m-cut').trigger('click');
                    break;
                case 86:   // v key
                    $('#m-paste').trigger('click');
                    break;
                case 70:   // f key
                    $('#m-fullscreen').trigger('click');
            }
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

        removeTrack: function() {
            var $track = Audiee.Views.Editor.getActiveTrack();
            if (typeof $track !== 'undefined')
                Audiee.Collections.Tracks.remove($track.data('cid'));
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

        _fileLoaded: function(e, audioBuffer, file) {
            e.stopPropagation();
            // hide the new track modal if it's still shown
            $('#newTrackModal').modal('hide');
            
            // create new Track model and add it to the Tracks collection
            var name = 'Track ' + Audiee.Collections.Tracks.getIndexCount();
                track = new TrackM({buffer: audioBuffer, file: file, name: name});
            Audiee.Collections.Tracks.add(track);
        },

        zoomIn: function() {
            Audiee.Display.zoomIn();
            Audiee.Views.Tracks.trigger('Audiee:zoomChange');
            Audiee.Views.Timeline.trigger('Audiee:zoomChange');
        },

        zoomOut: function() {
            Audiee.Display.zoomOut();
            Audiee.Views.Tracks.trigger('Audiee:zoomChange');
            Audiee.Views.Timeline.trigger('Audiee:zoomChange');
        },

        zoomZero: function() {
            Audiee.Display.zoomZero();
            Audiee.Views.Tracks.trigger('Audiee:zoomChange');
            Audiee.Views.Timeline.trigger('Audiee:zoomChange');
        },

        toggleFullscreen: function() {
            var $html = $('html');

            if ($html.hasClass('fullscreen')) 
                document.webkitCancelFullScreen();
            else
                $html[0].webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            
            $html.toggleClass('fullscreen');
        },

        copy: function() {
            Audiee.Views.Editor.setClipboard();
        },

        cut: function() {
            Audiee.Views.Editor.setClipboard();
            this.delete();
        },

        paste: function() {
            Audiee.Views.Editor.pasteClipboard();
        },

        delete: function() {
            Audiee.Views.Editor.deleteSelection();
        },

        enableHotkeys: function() {
            console.log('Enabling hotkeys');
            this.hotkeysEnabled = true;
        },

        disableHotkeys: function() {
            console.log('Disabling hotkeys');
            this.hotkeysEnabled = false;
        }
    });
});