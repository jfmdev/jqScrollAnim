jqScrollAnim
============

_Trigger animations with the vertical scroll_

**jqScrollAnim** is a jQuery plugin that allows to define animations whose reproduction depends on the position of the vertical scroll. 

This plugin was inspired by the site [SlaveryFootpring.org](http://slaveryfootprint.org/), whose content appear and disappear as response for the vertical scroll movement.

Demos
-----

Sample: http://jfmdev.github.io/jqScrollAnim/demos.html

How to use
----------

**Step 1:** Add references to the files of _jQuery_ and _jqScrollAnim_ in the header section of the HTML document.

``` html
    <script type="text/javascript" src="jquery-1.11.1.min.js"></script>
    <script type="text/javascript" src="jqscrollanim.js"></script>
```

**Step 2:** Select the element (or elements) that you want to animate, and invoke the method _jqScrollAnim()_.

``` javascript
    jQuery(document).ready(function() {
        jQuery("#some_element").jqScrollAnim({
			rep: {start: 0, end: 200},
			animation: {type:'fade'}		
		});
    });
```

[Live demo](http://jsfiddle.net/jfmdev/qcrc0La2/1/)

Tutorial
--------

### Triggers

While standard animations are triggered by time, the animations in jqScrollAnim are triggered by the vertical scroll's position, 
so the animations are reproduced when the vertical scroll is being moved.	

#### Reproduction

When creating an animation with jqScrollAnim, the parameter _rep_, whose main properties are _start_ and _end_, 
allow to define when the animation must start and when it must finish.

Every time that the vertical scroll is moved, the plugin calculates the distances (in pixels) between the animated elements and the screen's margins. 
So when the distance of an element is equal to _rep.start_ the animation starts to reproduce, and when the distance is equal to _rep.end_ the animations ends.

For example, in the code:

``` javascript
    jQuery(document).ready(function() {
        jQuery("#some_element").jqScrollAnim({
			rep: {start: 0, end: 200},
			animation: {type:'fade'}		
		});
    });
```

[Live demo](http://jsfiddle.net/jfmdev/qcrc0La2/1/)

The element is going to be invisible until the distance between him and the lower margin is 0, 
from that point the element is going to become less transparent until the distance is equal to 200, when is going to become opaque.
So if the distance is 100, the element is going to be 50% transparent, and if the distance is 150, the element is going to be 25% transparent.

#### Margins

By default, the distances are always calculated between the bottom of the screen and the upper side of the element
(since normally, in a website, one must scroll down to continue).
However, this can be changed by using the _ref_ property, whose possible values are:
 * "upper-bottom": the distance is calculated between the bottom of the screen and the upper side of the element.
 * "base-bottom": the distance is calculated between the bottom of the screen and the lower side of the element.
 * "upper-top": the distance is calculated between the top side of the screen and the upper side of the element.
 * "base-top": the distance is calculated between the top side of the screen and the lower side of the element.

For example:

``` javascript
    jQuery(document).ready(function() {
        jQuery("#some_element").jqScrollAnim({
			rep: {start: 0, end: 200, ref:'top-bottom'},
			animation: {type:'fade'}		
		});
        jQuery("#another_element").jqScrollAnim({
			rep: {start: 0, end: 200, ref:'base-bottom'},
			animation: {type:'fade'}		
		});
    });
```

[Live demo](http://jsfiddle.net/jfmdev/crttnest/2/)

Keep in mind that when using "upper-top" and "base-top", the values for _start_ and _end_ normally are going to be negative, 
otherwise the animation is going to start playing after the element has started to be outside the visible region.

For example:

``` javascript
    jQuery(document).ready(function() {
        jQuery("#some_element").jqScrollAnim({
			rep: {start: -200, end: 0, ref:'upper-top'},
			animation: {type:'fade'}		
		});
    });
```

[Live demo](http://jsfiddle.net/jfmdev/97ehhg04/2/)


#### Relative distances

Since different visitors normally have different screen resolutions, you can also define the triggers by using percentage values.
This is done by setting the property _unit_ (whose default value is "px") to "%".

So, in the following example:

``` javascript
    jQuery(document).ready(function() {
        jQuery("#some_element").jqScrollAnim({
			rep: {start: 0.25, end: 0.5, unit: "%"},
			animation: {type:'fade'}		
		});
    });
```

[Live demo](http://jsfiddle.net/jfmdev/6c83oxpe/1/)

The element is going to be invisible until the distance between him and lower margin is equal to a quarter of the screen size,
and is going to become opaque when the distance is equal to half  the screen size.

#### Rewind 

After reproducing the animation, it is also possible to define a trigger to 'rewind' the animation.
This is done by using the parameter _rew_, which has the same properties than _rep_ but with the difference that his default value
for _ref_ is "base-bottom" (instead of "top-upper").

For example:

``` javascript
    jQuery(document).ready(function() {
        jQuery("#some_element").jqScrollAnim({
			rep: {start: 50, end: 250},
			rew: {start: -250, end: -50},
			animation: {type:'fade'}		
		});
    });
```

[Live demo](http://jsfiddle.net/jfmdev/sLjx3nz5/1/)

In this case, the element is going to be invisible until the distance between his top side and the bottom of the screen is 50,
then is going to become more opaque until the distance is 250,
after that is going to be fully opaque until the distance between the element's bottom and the top side of the screen is 250,
when is going to become less opaque until the distance is 50, 
and after that is going to become invisible again.

### Animations

The effect of an animation is defined by the _animation_ parameter, an object that accept the properties _type_,
_property_, _start_, _end_, _unit_ and _action_.

The _type_ property is the only property that is mandatory, since it defines the type of data that is going to be processed during the animation.
It can hold the values: 'integer', 'number', 'color', 'fade', 'move-left', 'move-right' and 'custom'.

The value of _property_ indicates which CSS property is going to be modified by the animation;
the properties _start_ and _end_ define the initial and final values of the CSS property;
while _unit_ indicates which unit must be used (such as '%', 'px' or 'pt').

Finally, the _action_ property is only used when _type_ has the value 'custom'.

#### Basics types

The main animation types are "integer", "number", "color" and "sequence", which indicates that kind of data is hold by the CSS property that is modified by the animation.
When using these types, the property _property_ is required, as well as either _start_ or _end_ (at least one of them must be defined).
And depending of the CSS property used, the property _unit_ may be required also.

Note that if the values _start_ or _end_ are not defined, by default they are going to be initialized with the initial value of the animated element.
An exception to this is the type "sequence", in which _start_ is never used and _end_ must always be defined.

Example:

``` javascript
    jQuery(document).ready(function() {
        // Animation for 'element_1'.
		jQuery("#element_1").jqScrollAnim({
			rep:  {start: 0, end: 200},
			animation: {type:'number', property:'opacity', start:0}		
		});
		
		// Animation for 'element_2'.
        jQuery("#element_2").jqScrollAnim({
			rep:  {start: 0, end: 200},
			animation: {type:'integer', property:'font-size', end:20, unit:'pt'}		
		});
		
		// Animation for 'element_3'.
        jQuery("#element_3").jqScrollAnim({
			rep:  {start: 0, end: 200},
			animation: {type:'color', property:'background-color', start:[255,0,0], end:[0,255,0]}		
		});
		
		// Animation for 'element_4'.
		jQuery("#element_4").jqScrollAnim({
			rep:  {start: 0, end: 200},
			animation: {type:'sequence', property:'background-color', end:['white', 'red', 'green', 'blue']}
		});
    });
```

[Live demo](http://jsfiddle.net/jfmdev/wq1cnbg3/2/)

In this example, the first animation has the type "number" and is going to change the opacity of the element from 0 to the current opacity value (normally 1). 
Since the CSS property "opacity" has no unit, the _unit_ property is not required.

The second animation has the type "integer" and is going to change the font size from his current size to 20.
The _unit_ property was defined since, in CSS, the "font-size" property requires an unit.

The third animation has the type "color" and is going to change the background color from red to green. 
When using the type "color", the property _unit_ is never used.

The fourth animation has the type "sequence" and is going to change sequentially the background color four times.
When using the type "sequence", the property _start_ is never used and the property _end_ must always be defined as an array of string values.

#### Synonym types
	
The types "fade", "move-left" and "move-out" are, in fact, synonyms for the basic types but that have different default values for the other properties.

The type "fade" is a synonym for "number" that defines that the default value for _property_ is "opacity", for _start_ is 0 and for _end_ is 1. 
As consequence, `{type: 'fade'}` is equivalent to `{type: 'integer', property: 'opacity', start:0, end:1}`

[Live demo](http://jsfiddle.net/jfmdev/k9gwm6k0/1/)

The types "move-left" and "move-right" are synonyms for "integer" that defines that the default value for _property_ is "left", for _unit_ is "px" 
and for _end_ is "out-left" or "out-right" (these two are special values that are mapped, respectively, to the element width or to the windows width). 
As consequence, `{type: 'move-left'}` is equivalent to `{type: 'integer', property:'left', end:'out-left'}`
and  `{type: 'move-right'}` is equivalent to `{type: 'integer', property:'left', end:'out-right'}`

[Live demo](http://jsfiddle.net/jfmdev/7efj6acz/1/)

In a side note, when doing movement animations, do not forget that, in most cases, 
the animation is not going to work unless the element has defined the CSS property "position".

#### Custom

In case that some particular effect can not be obtained by using any of the previous types, the type "custom" can be used.
When using this type, the property "action" must be filled with a function which is going to be invoked every time that the vertical scroll is moved.

``` javascript
    jQuery(document).ready(function() {
        jQuery("#some_element").jqScrollAnim({
			rep: {start: 0, end: 200},
			animation: {
				type: 'custom',
				action: function(target, settings, progress) {
						target.css('padding', parseInt(progress*20 ,10) + 'px');
                    }
				}
		});
    });
```

[Live demo](http://jsfiddle.net/jfmdev/wr0wfL6a/1/)

The action's function receives three parameters:
 
*  _target_ is a jQuery object for the element which must be modified.
*  _settings_ contains the value of the triggers (_rep_ and _rew_).
*  _progress_ is a number between 0 and 1 indicating the progress of the animation.

### Advanced animations

#### Vertical movements

One limitation of using the position of the element (that must be animated) to calculate the distance to the margins, 
is that the element can not be moved up or down, since that would cause unexpected results when calculating again the distance to the margins. 

The solution to this is to use an "stake", i.e. to use the position of another element (that is not going to be moved) to calculate the distances.
This can be done by using the _stake_ property, which holds a CSS selector that identifies the motionless element.

``` javascript
    jQuery(document).ready(function() {
        jQuery("#some_element").jqScrollAnim({
			rep: {start: 0, end: 200},
			animation: {type: 'integer', property:'top', end:0, start:350},
			stake: "#another_element"
		});
    });
```

[Live demo](http://jsfiddle.net/jfmdev/rvqdpuz8/1/)

#### Synchronized animations

The _stake_ property can also be used for do synchronized animations, i.e. to animate simultaneously several element that are at different positions.

``` javascript
    jQuery(document).ready(function() {
        jQuery("#some_element").jqScrollAnim({
			rep: {start: 0, end: 200},
			animation: {type: 'integer', property:'width', end:10, start:100},
			stake: "#stake_element"
		});
		
        jQuery("#another_element").jqScrollAnim({
			rep: {start: 0, end: 200},
			animation: {type: 'integer', property:'width', end:10, start:100},
			stake: "#stake_element"
		});
    });
```

[Live demo](http://jsfiddle.net/jfmdev/dyenv73m/1/)

#### Sequential animations

In order to do sequential animations, you can add several animations to the same element (or to different elements with the same stake) 
and configure their trigger points to be consecutive.

``` javascript
    jQuery(document).ready(function() {
        jQuery("#some_element").jqScrollAnim({
			rep: {start: 0, end: 200},
			animation: {type: 'color', property:'background-color', end:[128,128,255]}
		});
		
        jQuery("#some_element").jqScrollAnim({
			rep: {start: 200, end: 400},
			animation: {type: 'color', property:'background-color', start:[128,128,255], end:[128,255,128]}
		});
    });
```

[Live demo](http://jsfiddle.net/jfmdev/c8pwoh2p/1/)

#### Concurrent animations

In order to define several animations that acts at the same time over the same element, 
you can individually define each of these animations and use the same trigger points,
but a more efficient way would be to use the _animations_ property, which accepts an array, instead of _animation_.

``` javascript
    jQuery(document).ready(function() {
        jQuery("#some_element").jqScrollAnim({
			rep: {start: 0, end: 400},
			animations: [
				{type: 'color', property:'background-color', end:[128,0,0]},
				{type: 'integer', property:'font-size', end:20, unit:'pt'},
				{type: 'integer', property:'border', end:5, unit:'px'}
			]
		});
    });
```

[Live demo](http://jsfiddle.net/jfmdev/qvncbh83/1/)
