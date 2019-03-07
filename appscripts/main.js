/* 
A Demo of using an aiSound with parameters tied to an animated graphical object.
*/

//import sndFactory from 'https://aisound.cloud/aiSounds/fm2.js'
import sndFactory from 'http://localhost:8000/aiSounds/swish.js'

var snd;

sndFactory().then((newsnd) => {
  snd=newsnd; 
  snd.setParam("Position", 0);
  snd.setParam("Gain", .25);    //or// snd.setParamNorm("Gain", 1.000);
});


var flightRate=1; // seconds
var relScreenPos;
var rafID; // for canceling request animation frame...


var initArrowX=0;
var initArrowY=50;
var arrowPosX=initArrowX;
var arrowLength=120;

var myCanvas = document.getElementById("myCanvas");
var context= myCanvas.getContext('2d');

context.canvas.width  = window.innerWidth;
	context.canvas.height = window.innerHeight;

var img = new Image();
img.src = "Resources/arrow_with_bg_clipped_rev_1.png";
img.width=arrowLength;
img.height=25;
img.onload = function(){drawArrow(initArrowX, initArrowY)};

//-------------------------------------------------------------------------
// 's' key to reset arrow
window.addEventListener("keydown", keyDown, true);
function keyDown(e){
 		var keyCode = e.keyCode;
 		switch(keyCode){
 			case 83: // 's' key
 				arrowPosX = initArrowX;
 				drawArrow(arrowPosX, initArrowY);
 				window.cancelAnimationFrame(rafID);

 				snd.release();
		}
}

//-------------------------------------------------------------------------
// Mousedown to "shoot"
window.onmousedown=function(e){
	flightRate = 25*e.clientX/window.innerWidth;
	mvArrow();
	snd.play();
}

//-------------------------------------------------------------------------
// draw the arrow at the new position
var drawArrow = function (posx, posy){
    context.clearRect(0, 0, myCanvas.width, myCanvas.height);
    context.drawImage(img,posx,posy, arrowLength, 25);
}

//-------------------------------------------------------------------------
// Compute new arrow position based on position and flightRate
var mvArrow = function(){
	if (arrowPosX<myCanvas.width-arrowLength){
	   	arrowPosX+=flightRate;

		relScreenPos=arrowPosX/(myCanvas.width-arrowLength);
		
		//------------------------------------------------------------
		snd.setParamNorm("Position", relScreenPos);
		//------------------------------------------------------------

		drawArrow(arrowPosX,initArrowY); 
		rafID = requestAnimationFrame(mvArrow);
	} else{
		snd.release();
	}
}
