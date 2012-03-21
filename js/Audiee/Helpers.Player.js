/**
 * Author: Jan Myler <honza.myler@gmail.com>
 * 
 * Audio player object.
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'plugins/modal'
], function($, _, Backbone, AlertT) {
    return (function() {
        function Player() {
            this.context = new webkitAudioContext || new AudioContext;
        }

        Player.prototype.connectBuffer = function(buffer, from, to) {
            if (!buffer)
                return;

            window.node = this.context.createBufferSource(),
                self = this,
                onsuccess = function(audioBuffer) {
                    console.log(audioBuffer);
                    console.log('hello');
                    node.buffer = audioBuffer;
                    node.connect(self.context.destination);
                    //node.noteGrainOn(0, from || 0, (to - from) || audioBuffer.duration);
                    node.noteGrainOn(10, 30, 5);
                    node.noteGrainOn(0, 5, 4);
                };

            this.context.decodeAudioData(buffer, onsuccess);
            return; // FIXME: ??? 
        };
        Player.prototype.connect = function(node) {

        };
        Player.prototype.disconnect = function(node) {

        };
        
        Player.prototype.loadFile = function(file, el) {
            var reader = new FileReader;
            
            if (!file.type.match('audio.mp3') && !file.type.match('audio.wav')) {
                throw('Unsupported file format!');
            }
            
            reader.onloadend = function(e) {
                $('.progress').children().width('100%');
                $(el).trigger('fileLoaded', e.target.result);
                setTimeout(function() {
                    $('#newTrackModal').modal('hide');
                }, 1000);   // wait a sec and remove the modal  
                
            };

            reader.onprogress = function(e) {
                if (e.lengthComputable) {
                    $progress = $('.progress', '#newTrackModal');
                    if ($progress.hasClass('hide'))
                        $progress.fadeIn('fast');
                    
                    // show loading progress
                    var loaded = Math.floor(e.loaded / e.total * 100);
                    $progress.children().width(loaded + '%');
                }
            };
            
            reader.readAsArrayBuffer(file);            
        };

        Player.prototype.play = function() {

        };
        return Player;
    })();
});