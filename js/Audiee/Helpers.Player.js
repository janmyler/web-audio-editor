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
            this.gainNodes = {};
            this.playing = false;
        }

        Player.prototype.initTrack = function(cid) {
            if (typeof this.gainNodes[cid] === 'undefined') {
                this.gainNodes[cid] = this.context.createGainNode();
                this.gainNodes[cid].connect(this.context.destination);
            }
        };

        Player.prototype.releaseTrack = function(cid) {
           this.gainNodes[cid].disconnect(this.context.destination);
           delete this.gainNodes[cid];
        };

        Player.prototype.play = function() {
            var that = this,
                currentTime = this.context.currentTime;

            if (this.playing)
                this.stop();

            Audiee.Collections.Tracks.each(function(track) {
                var cid = track.cid,
                    gainNode = that.gainNodes[cid];

                track.clips.each(function(clip) {
                    var loop = clip.get('loop'),
                        trackPosition = clip.get('trackPos'),
                        node, offset, duration, cursor;                  

                    if (Audiee.Views.Editor.isActiveTrack()) {
                        cursor = Audiee.Views.Editor.getCursor();
                        
                        // if (trackPosition <= cursor && trackPosition + clip.clipLength() > cursor)
                    }

                    for (var i = 0; i <= loop; ++i) {
                        node = that.context.createBufferSource();
                        that.nodes.push(node);
                        node.buffer = clip.get('buffer');
                        node.connect(gainNode); // bude gainNode pro track
                        
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
                Audiee.Views.Editor.unsetActiveTrack();
                // zrusit prehravani od kurzoru
            }
        };

        Player.prototype.volumeChange = function(volume, cid) {
            this.gainNodes[cid].gain.value = volume;
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

        return Player;
    })();
});