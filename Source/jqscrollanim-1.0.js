/**
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU Lesser General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Definition of the jQuery plugin "jqScrollAnim", which allows to define animations that
 * modify CSS properties depending of the scroll's position.
 * 
 * @version 1.0
 * @author Jose F. Maldonado
 */
(function( $ ) {
    /**
     * jqScrollAnim - allows to define animations that modify CSS properties depending of the scroll's position
     * 
     * The 'options' parameter allows to specify when the animations are going to start and end and which CSS properties
     * are going to be modified. It uses the properties 'rep_s', 'rep_e', 'rew_s', 'rew_e', 'stake', 'animation' 
     * and 'animations'.
     * 
     * The properties 'rep_s' and 'rep_e' allows to define when the animations are going to start and end;
     * while the properties 'rew_s' and 'rew_e', if defined, allow to indicate when the animation is going to be rewinded.
     * 
     * The property 'stake' allows to define another element's position as reference for start and end the animations, instead
     * of using the position of the element which is being animanted.
     * 
     * The properties 'animation' and 'animations' allows to defines which CSS properties are going to be modified. 
     * The property 'animation', if defined, must be an object with the properties 'type', 'property', 'start', 'end',
     * 'unit' and 'action'; while 'animations' must be an array of objects, with the same properties previously detailed.  
     * 
     * @class jqScrollAnim
     * @memberOf jQuery.fn
     * 
     * @param {Object} options An object, with the properties 'rep_s', 'rep_e', 'rew_s', 'rew_e', 'stake', 'animation' and 'animations'.
     * @returns {Object} A jQuery object (in order to support chaining).
     */
    $.fn.jqScrollAnim = function(options) {
        // --- Set default values --- //
        var settings = $.extend({
            rep_s: 0,
            rep_e: 200,
            rew_s: null,
            rew_e: null,
            animations: [],
            stake: null,
            last_progress: null
            }, options );

        if(settings.animation !== undefined && settings.animation !== null) {
            settings.animations.push(settings.animation);
            settings.animation = null;
        }

        if(settings.stake !== null) {
            settings.stake = $(settings.stake);
        }

        for(var i=0; i<settings.animations.length; i++) {
            // Ensure that all fields are defined.
            var anim = $.extend({
                type: null,
                property: null,
                start: null,
                end: null,
                unit: '',
                action: null
                }, settings.animations[i]);
            
            // Set type-related default values.
            if(anim.type === 'integer') {
                if(anim.unit === '' || anim.unit === null) anim.unit = 'px';
            }
            if(anim.type === 'fade') {
                anim.type = 'number';
                anim.property = 'opacity';
                if(anim.start === null) anim.start = 0.0;
                if(anim.end === null) anim.end = 1.0;
            }
            if(anim.type === 'move' || anim.type === 'move-left' || anim.type === 'move-right') {
                if(anim.type === 'move-left') anim.start = 'out-left';
                if(anim.type === 'move-right') anim.start = 'out-right';
                if(anim.property === null) anim.property = 'left';
                if(anim.unit === '' || anim.unit === null) anim.unit = 'px';
                anim.type = 'integer';
            }
            
            settings.animations[i] = anim;
        }

        // --- Save initial CSS values --- //
        return this.each(function() {
            // Get the target.
            var target = $(this);
           
            // Save position values.
            $.data(target, 'position', target.position());
            $.data(target, 'offset', target.offset());       

            // Save animation-related property values.
            for(var i=0; i<settings.animations.length; i++) {
                var anim = settings.animations[i];
                if(anim.property !== null) {
                    var val = target.css(anim.property);                  
                    if(anim.type === 'integer') val = parseInt(val, 10);
                    if(anim.type === 'number') val = parseFloat(val);
                    if(anim.type === 'color') val = parseColor(val);
                    $.data(target, 'css-' + anim.property, val); 
                }
                
                settings.animations[i] = anim;
            }
            
            // Define event listeners.
            var handler = function() { onActiveAreaChanged(target); };
            $(document).scroll(handler);
            $(window).resize(handler);
            
            // Initialize.
            handler();
        });
                
        // --- Private functions --- //
        
        /**
         * Animates an element, according to his position and to the active area.
         * 
         * @param {jQuery} target The element to animate.
         */
        function onActiveAreaChanged(target) {
            // Get the active area and the reference point.
            var progress = 0.0;
            var area = getActiveArea();
            var ref = settings.stake === null? target.offset().top : settings.stake.offset().top;
            
            // Compare the position of the reference point with the reproduction/rewind points in order to calculate the progress.
            var p0 = getPointPosition(settings.rep_s, area);
            var p1 = getPointPosition(settings.rep_e, area);
            if(ref < p0) {
                if(ref > p1) {
                    progress = 1.0 - (ref - p1)/(p0-p1);
                } else {
                    progress = 1.0;
                    if(settings.rew_s !== null && settings.rew_e !== null) {
                        var p2 = getPointPosition(settings.rew_s, area);
                        var p3 = getPointPosition(settings.rew_e, area);
                        if(ref < p2) {
                            if(ref > p3) {
                                progress = (ref - p3)/(p2-p3);
                            } else {
                                progress = 0.0;
                            }
                        }
                    }
                }
            }
            
            // Verify if the progress has changed.
            if(progress !== settings.last_progress)
            {
                // Execute animations.
                for(var a=0; a<settings.animations.length; a++) {
                    // Get animation.
                    var anim = settings.animations[a];

                    // Define start and end values.
                    var startVal = anim.start !== null? anim.start : $.data(target, 'css-' + anim.property);
                    var endVal = anim.end !== null? anim.end : $.data(target, 'css-' + anim.property);

                    // Verifty animation's type.
                    if(anim.type === 'custom') {
                        anim.action(target, settings, progress);
                    } 
                    else if(anim.type === 'number') {
                        target.css(anim.property, (startVal*(1.0 - progress) + endVal*progress) + '' + anim.unit);                       
                    } 
                    else if(anim.type === 'integer') {
                        if(endVal !== 'out-left' && endVal !== 'out-right' && startVal !== 'out-left' && startVal !== 'out-right') {
                            target.css(anim.property, parseInt(startVal*(1.0 - progress) + endVal*progress, 10) + '' + anim.unit);
                        } else {
                            // Calculate new position in absolute coordinates.
                            var start = $.data(target, 'offset').left;
                            var end = start;
                            if(endVal === 'out-left') end = -target.outerWidth();
                            if(endVal === 'out-right') end = $(window).width();
                            if(startVal === 'out-left') start = -target.outerWidth();
                            if(startVal === 'out-right') start = $(window).width();
                            var newPosAbs = start*(1.0 - progress) + end*progress;

                            // Verify which CSS property must be used ('left' or 'right').
                            if(anim.property === 'left') {
                                var newPosRel = newPosAbs - ($.data(target, 'offset').left - $.data(target, 'css-left'));
                                target.css('left', parseInt(newPosRel,10) + '' + anim.unit);
                            } else {
                                var newPosRel = ($.data(target, 'offset').left + $.data(target, 'css-right')) - newPosAbs;
                                target.css('right', parseInt(newPosRel,10) + '' + anim.unit);
                            }
                        }
                    }                    
                    else if(anim.type === 'color') {                     
                        var red = parseInt(startVal[0]*(1.0 - progress) + endVal[0]*progress, 10);
                        var green = parseInt(startVal[1]*(1.0 - progress) + endVal[1]*progress, 10);
                        var blue = parseInt(startVal[2]*(1.0 - progress) + endVal[2]*progress, 10);
                        target.css(anim.property, 'rgb('+red+','+green+','+blue+')');
                    }
                    else if(anim.type === 'sequence') {
                        var select = parseInt(progress * (anim.end.length-1));
                        target.css(anim.property, anim.end[select]);
                    }
                }

                // Update last progress.
                settings.last_progress = progress;
            }
        }
        
        /**
         * Calculates the absolute position of a reproduction/rewind point.
         * 
         * @param {number} point A point value.
         * @param {object} area The current active area.
         * @returns {number} The point's position.
         */
        function getPointPosition(point, area) {
            // Verify if the point has been defined as an offset or as an percentage.
            if((point>0 && point<1) || (point>-1 && point<0)) {
                point = parseInt(point*(area.y_max - area.y_min), 10);
            }
            
            return point >= 0? area.y_max - point : area.y_min - point;
        }
        
        /**
         * Calculates the area which is currently being displayed by the browser.
         * 
         * @returns {Object} An object with the properties 'x_min', 'y_min', 'x_max' and 'y_max'.
         */
        function getActiveArea() {
            var res = {x_min:0, y_min:0, x_max:0, y_max:0};
            
            res.y_min = $(document).scrollTop();
            res.x_min = $(document).scrollLeft();
            res.y_max = res.y_min + $(window).height();
            res.x_max = res.x_min + $(window).width();
            
            return res;
        }
        
        /**
         * Converts a string, representing a CSS color, into a numeric array with his RGB values.
         * 
         * @param {string} color A string representing a CSS color.
         * @returns {Array} An array with RGB values.
         */
        function parseColor(color) {
            var res = [255, 255, 255, 0];
            color = color.replace(/\s\s*/g,''); // Remove all spaces
            
            // Checks for 6 digit hex and converts string to integer
            var match = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/.exec(color);
            if (match) {
                res = [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)];
            } else {
                // Checks for 3 digit hex and converts string to integer
                match = /^#([\da-fA-F])([\da-fA-F])([\da-fA-F])/.exec(color);
                if(match) {
                    res = [parseInt(match[1], 16) * 17, parseInt(match[2], 16) * 17, parseInt(match[3], 16) * 17];
                } else {
                    // Checks for rgba.
                    match = /^rgba\(([\d]+),([\d]+),([\d]+),([\d]+|[\d]*.[\d]+)\)/.exec(color);
                    if(match) {
                        res = [parseInt(match[1],10), parseInt(match[2],10), parseInt(match[3],10), parseInt(match[4],10)];
                    } else {
                        // Checks for rgba.
                        match = /^rgb\(([\d]+),([\d]+),([\d]+)\)/.exec(color);
                        if(match) { 
                            res = [parseInt(match[1],10), parseInt(match[2],10), parseInt(match[3],10)];
                        }
                    }
                }
            }
            
            return res;
            }
    };
}( jQuery ));


