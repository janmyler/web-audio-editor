/**
 * Audio player object
 *
 * @file        Helpers.Player.js
 * @author      Jan Myler <honza.myler[at]gmail.com>
 * @copyright   Copyright 2012, Jan Myler (http://janmyler.com)
 * @license     MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/AlertModal.html',
    'plugins/modal'
], function($, _, Backbone, AlertT) {
    return (function() {
        function Player() {
            // browser compatibility test
            if (typeof webkitAudioContext === 'undefined' && typeof AudioContext === 'undefined') {
                var tpl = (_.template(AlertT))({
                    message: 'Your browser is not supported yet, try using Google Chrome.'
                });
                $(tpl).modal();   
            } else {
                this.context = new webkitAudioContext || new AudioContext;
            }
            
            this.nodes     = [];
            this.gainNodes = {};
            this.playing   = false;
            this.playbackFrom;
            this.playbackPositionInterval;
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
            
            // starts playback from the beginning
            this.playbackFrom = currentTime;

            // starts playback from the cursor position
            if (Audiee.Views.Editor.isActiveTrack())
                this.playbackFrom -= Audiee.Views.Editor.getCursor();

            // stops previous playback
            if (this.playing)
                this.stop();

            // constructs the audio tree
            Audiee.Collections.Tracks.each(function(track) {
                var cid = track.cid,
                    gainNode = that.gainNodes[cid];

                track.clips.each(function(clip) {
                    var trackPosition = clip.get('trackPos'),
                        startTime     = clip.get('startTime'),
                        endTime       = clip.get('endTime'),
                        loop          = clip.get('loop'),
                        duration      = clip.get('buffer').duration,
                        inClipStart   = false,
                        cursor        = 0,
                        node, offset;

                    if (Audiee.Views.Editor.isActiveTrack()) {
                        cursor = Audiee.Views.Editor.getCursor();

                        if (trackPosition + clip.clipLength() <= cursor)
                            return;     // clip is before the cursor position
                        else if (trackPosition < cursor && trackPosition + clip.clipLength() > cursor) {
                            // virtually splits the clip
                            startTime     = (startTime + cursor - trackPosition) % duration;
                            loop          = loop - Math.floor((clip.get('startTime') + cursor - trackPosition) / duration);
                            trackPosition = cursor;
                            inClipStart   = true;
                        }
                    }

                    for (var i = 0; i <= loop; ++i) {
                        node = that.context.createBufferSource();
                        that.nodes.push(node);
                        node.buffer = clip.get('buffer');
                        node.connect(gainNode);  // connects node to track's gain node
                        
                        // clip offset and duration times
                        if (loop > 0) {
                            if (i === 0) {           // first subclip
                                offset = startTime;
                                duration = duration - offset;
                            } else if (i === loop) { // last subclip
                                offset = 0;
                                duration = endTime;
                            } else {
                                offset = 0;
                                duration = clip.get('buffer').duration;
                            }
                        } else {    // loop === 0
                            offset = startTime;
                            if (inClipStart)
                                duration = endTime - startTime;
                            else
                                duration = clip.clipLength();
                        }

                        // sets the clip's playback start time
                        node.noteGrainOn(
                            currentTime + trackPosition - cursor,
                            offset,
                            duration
                        );

                        trackPosition += duration;
                    }

                });
            });

            this.playing = true;
            this.playbackPositionInterval = setInterval("Audiee.Player.updatePlaybackPosition(Audiee.Player.playbackFrom)", 50); 
        };

        Player.prototype.stop = function() {
            if (this.playing) {
                for (var i = 0, len = this.nodes.length; i < len; ++i) {
                    this.nodes[i].noteOff(0);
                }
                this.playing = false;
            } else {
                Audiee.Views.Editor.unsetActiveTrack();
                Audiee.Views.PlaybackControls.updateTime();
                Audiee.Display.showPlaybackPosition(0);
            }

            if (typeof this.playbackPositionInterval !== 'undefined')
                clearInterval(this.playbackPositionInterval);
            Audiee.Display.hidePlaybackPosition();
        };

        Player.prototype.updatePlaybackPosition = function(startTime) {
            if (this.playing && typeof startTime !== 'undefined') {
                var newTime = this.context.currentTime - startTime;
                
                if (newTime >= Audiee.Collections.Tracks.first().get('length'))
                    $('#stop').trigger('click');
                else
                    Audiee.Display.showPlaybackPosition(Audiee.Display.sec2px(newTime));
            } else {
                Audiee.Display.hidePlaybackPosition();
            }
        }

        Player.prototype.volumeChange = function(volume, cid) {
            this.gainNodes[cid].gain.value = volume;
        };        

        // NOTE: Maybe move to different module... 
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
                        // on error - show alert modal
                        var tpl = (_.template(AlertT))({
                            message: 'Error while loading the file ' + file.name + '.'
                        }),
                        $tpl = $(tpl);

                        $tpl.on('hide', function() { $tpl.remove() })
                        .modal();           // show the modal window

                        // hide the new track modal
                        $('#newTrackModal').modal('hide');
                    };

                    that.context.decodeAudioData(e.target.result, onsuccess, onerror);
                }
            };

            // NOTE: Maybe move to different module... 
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