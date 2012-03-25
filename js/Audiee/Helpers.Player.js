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
        
        Player.prototype.createNode = function(buffer) {
            var node = this.context.createBufferSource(),
                onsuccess = function(audioBuffer) {
                    node.buffer = audioBuffer;
                    
                };


            node.buffer = buffer;
        };

        Player.prototype.loadFile = function(file, el) {
            var reader = new FileReader,
                that   = this;
            
            if (!file.type.match('audio.mp3') && !file.type.match('audio.wav')) {
                throw('Unsupported file format!');
            }
            
            reader.onloadend = function(e) {
                if (e.target.readyState == FileReader.DONE) { // DONE == 2
                    $('.progress').children().width('100%');
                    
                    var onsuccess = function(audioBuffer) {
                        $(el).trigger('Audiee:fileLoaded', [audioBuffer, file]);    
                    },
                    onerror = function() {
                        console.log('Error while loading file ' + file.name);
                    };

                    that.context.decodeAudioData(e.target.result, onsuccess, onerror);
                }
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