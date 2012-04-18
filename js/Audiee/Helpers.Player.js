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
            this.nodes = [];
            this.playing = false;
        }

        Player.prototype.play = function() {
            var that = this,
                currentTime = this.context.currentTime;

            if (this.playing)
                this.stop();


            // kazdej node bude mit loop
            // note off se nastavi na clip.clipLength() --- NEJDE (bere to cas blbe a loopuje to jen tu cast)
            // zmena volume se bude provadet z trackView – bde se volat metoda tady... gainNodes budou v objektu dle track cid
            // smazani gainNode pri odstraneni tracku

            Audiee.Collections.Tracks.each(function(track) {
                track.clips.each(function(clip) {
                    var loop = clip.get('loop'),
                        trackPosition = clip.get('trackPos'),
                        node, offset, duration;                    

                    for (var i = 0; i <= loop; ++i) {
                        node = that.context.createBufferSource();
                        that.nodes.push(node);
                        node.buffer = clip.get('buffer');
                        node.connect(that.context.destination); // bude gainNode pro track
                        
                        // clip offset and duration times
                        if (loop > 0) {
                            if (i === 0) {
                                offset = clip.get('startTime');
                                duration = clip.get('buffer').duration - offset;
                            } else if (i === loop) {
                                offset = 0;
                                duration = clip.get('endTime');
                            } else {
                                offset = 0;
                                duration = clip.get('buffer').duration;
                            }
                        } else {    // loop === 0
                            offset = clip.get('startTime');
                            duration = clip.clipLength();
                        }

                        node.noteGrainOn(
                            currentTime + trackPosition,
                            offset,
                            duration
                        );

                        trackPosition += duration;
                    }
                });
            });

            this.playing = true;
        };

        Player.prototype.stop = function() {
            if (this.playing) {
                for (var i = 0, len = this.nodes.length; i < len; ++i) {
                    this.nodes[i].noteOff(0);
                }

                this.playing = false;
            } else {
                // zrusit prehravani od kurzoru
            }
        };

        /*Player.prototype.connectBuffer = function(buffer, from, to) {
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
                
        Player.prototype.createNode = function(buffer) {
            var node = this.context.createBufferSource(),
                onsuccess = function(audioBuffer) {
                    node.buffer = audioBuffer;
                    
                };


            node.buffer = buffer;
        };*/

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

        return Player;
    })();
});