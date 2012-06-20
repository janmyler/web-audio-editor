/**
 * Collection for audio clips
 *
 * @file        Collections.Clips.js
 * @author      Jan Myler <honza.myler[at]gmail.com>
 * @copyright   Copyright 2012, Jan Myler (http://janmyler.com)
 * @license     MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 */

define([
    'underscore',
    'backbone',
    'Audiee/Models.Clip'
], function(_, Backbone, ClipM) {
	return Backbone.Collection.extend({
		// model reference
		model: ClipM,

        // returns a snapshot of selected area
        getSnapshot: function(from, to) {
            var snapshot = [],
                trackPos, end, offset, startTime, endTime, loop, duration;

            this.each(function(model) {
                trackPos = model.get('trackPos');
                end      = trackPos + model.clipLength();
                
                if (trackPos < to && end > from) {  // clip within the range of selection
                    loop      = model.get('loop');
                    duration  = model.get('buffer').duration;
                    offset    = (trackPos < from) ? 0 : trackPos - from;
                    startTime = model.get('startTime');
                    endTime   = model.get('endTime');

                    if (trackPos < from) {  // clip begins before the selection
                        loop -= Math.floor((startTime + from - trackPos) / duration);
                        startTime = (startTime + from - trackPos) % duration;
                    }

                    if (end > to) {
                        loop += Math.floor((endTime + to - end) / duration);   // right side of the equation results in a negative number (hence +=)
                        endTime = (endTime - (end - to)) % duration;
                        if (endTime < 0)
                            endTime += duration;
                    }

                    snapshot.push({
                        offset:     offset,
                        startTime:  startTime,
                        endTime:    endTime,
                        loop:       loop,
                        name:       model.get('name'),
                        color:      model.get('color'),
                        buffer:     model.get('buffer')
                    });
                }
            });
            
            return snapshot;
        },

        // deletes the selected area
        deleteSelection: function(from, to, except) {
            var that = this,
                deleteRequest = [],
                trackPos, end, startTime, endTime, loop, duration, newLoop, newEndTime, newStartTime;

            this.each(function(model) {
                if (model.cid !== except) {
                    trackPos = model.get('trackPos');
                    end      = trackPos + model.clipLength();
                    
                    if (trackPos < to && end > from) {  // clip within the range of selection
                        loop      = model.get('loop');
                        duration  = model.get('buffer').duration;
                        startTime = model.get('startTime');
                        endTime   = model.get('endTime');

                        if (trackPos < from && end > to) {
                            // clip begins before the selection and ends after the selection (splits the clip)
                            
                            // for the first clip
                            newEndTime = (startTime + from - trackPos) % duration;              
                            newLoop    = loop + Math.floor((endTime + from - end) / duration);    
                            model.set('loop', newLoop);
                            model.set('endTime', newEndTime);

                            // for the second clip
                            newStartTime = (startTime + to - trackPos) % duration;              
                            newLoop      = loop - Math.floor((startTime + to - trackPos) / duration);

                            var clip = new ClipM({
                                name:       model.get('name'),
                                color:      model.get('color'),
                                trackPos:   to,
                                startTime:  newStartTime,
                                loop:       newLoop,
                                endTime:    endTime,
                                buffer:     model.get('buffer')
                            });
                            that.add(clip);   
                        } else if (trackPos >= from && end <= to) {
                            // clip begins and ends within the selection (prepares the clip for a removal)
                            deleteRequest.push(model);
                        } else if (trackPos < from && end <= to) {  
                            // clip begins before the selection and ends within the selection (edits the endTime)
                            newEndTime = (startTime + from - trackPos) % duration;          
                            newLoop    = loop + Math.floor((endTime + from - end) / duration); 
                            model.set('loop', newLoop);
                            model.set('endTime', newEndTime);
                        } else if (trackPos >= from && end > to) {
                            // clip begins within the selection and ends after the selection (edits the startTime)
                            newStartTime = (startTime + to - trackPos) % duration;          
                            newLoop      = loop - Math.floor((startTime + to - trackPos) / duration);
                            model.set('loop', newLoop);
                            model.set('trackPos', to);
                            model.set('startTime', newStartTime);
                        }
                    }
                }
            });
            
            // removes the selected clips
            this.remove(deleteRequest);    
        },

        // inserts the duplicate of a selected clip
        addDuplicate: function(clip) {
            var from = clip.get('trackPos'),
                to   = from + clip.clipLength();
            this.deleteSelection(from, to);
            this.add(clip);
        }
	});
});