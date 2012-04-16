1)  Maximal <canvas> size: 8192x8192, width bigger than ~30000px (100px height)
    is not rendered. Bigger causes page to crash (Aw Snap...).
    
    Solution: Split clip display to more canvases (e.g. 5000x100) -- [solved]
        ad 1) it's not accurate (end of clip is out of canvas -- with bigger zoom is bigger the crop)... [solved]

    Split track display to more canvases. [solved]

2) Big audio files in memory causes the tab to crash (Aw Snap...). [unsolved]

3) Resizing clip to the left (at left track border) causes 'negative overflow' of the startTime. [unsolved] (but can live with hahah)

4) Resizing clip to the left causes rendering problems near to the right clip border. [solved] 

5) Track controls + name -- left offset change is not smooth during the horizontal scrolling (#editor-view). [unsolved]
    
    Possible solution: position fixed at left=0 and vertical offset counted by 
    javascript + topOffset when scrolling vertically.

        ad 1) Fixed position for track-info wrapper elements doesn't work because of top and bottom overflow over the editor-view element.

    Another possible solution: separate wrapper element for track controls (out of the editor-view) with height same as editor-view, scrolling with the editor-view.