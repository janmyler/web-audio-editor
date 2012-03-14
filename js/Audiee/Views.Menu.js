/**
 * Author: Jan Myler <honza.myler@gmail.com>
 * 
 * View for application menu.
 */

define([
    'underscore',
    'backbone',
    'text!templates/newtrack_modal.html',
    'plugins/modal'
], function(_, Backbone, modalT) {

    var EditorMenu = Backbone.View.extend({
        // parent DOM element
        el: $('#menu-view'),

        // DOM events listeners
        events: {
           'click #add-track'       : 'addTrack',
           'click #delete-tracks'   : 'restartProject'
        },

        // listeners to a model's changes
        initialize: function() {
        
        },

        // adds a new track
        addTrack: function() {
            var tpl = (_.template(modalT))(),
                $tpl = $(tpl);

            // register an event
            $tpl.on('change', '#file-name', this._fileSelected);  
            $tpl.modal();           // show the modal window
        },

        // test
        _fileSelected: function(e) {
            var file = e.target.files[0],
                reader = new FileReader;
            
            if (!file.type.match('audio.mp3') && !file.type.match('audio.wav')) {
                alert('unsupported file format!');
                return false;
            }
            
            reader.onloadend = function(e) {
                $('.progress').children().width('100%');
                setTimeout(function() {
                    $('.modal').modal('hide').remove();
                }, 1000);   // wait a sec and remove the modal                
            };

            reader.onprogress = function(e) {
                if (e.lengthComputable) {
                    $progress = $('.progress');
                    if ($progress.hasClass('hide'))
                        $progress.fadeIn('fast');
                    
                    var loaded = Math.floor(e.loaded / e.total * 100);
                    $progress.children().width(loaded + '%');
                }
            };
            
            reader.readAsArrayBuffer(file);
        },

        // restarts project
        restartProject: function() {

        }        

    });

    return EditorMenu;
});