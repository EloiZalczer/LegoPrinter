var canvas = 0;
var context = 0;
var canvas_overlay = 0;
var context_overlay = 0;
var canvas_background = 0;
var context_background = 0;
var layers_canvas = new Array;
var layers_context = new Array;
var current_layer = 0;
var mode = 0;

var layers_colors = ["red", "blue", "green"];

var layout = {height: 10, width: 10, layers: 3};

var placedPieces = new Array;

var pieces = [{sizeX: 1, sizeY: 1}, {sizeX: 1, sizeY: 2}, {sizeX: 2, sizeY: 2}];

var currentPiece = 0;

var rotatePiece = 0;

window.onload = function(){
	load_canvas();
	layer_buttons();
	blockSelectButtons();
	modeSelectButton();
}

function load_canvas()

{
	
    canvas = document.getElementById('layout_canvas');

        if(!canvas)

        {

            alert("Impossible de récupérer le canvas");

            return;

        }


    context = canvas.getContext('2d');

        if(!context)

        {

            alert("Impossible de récupérer le context du canvas");

            return;

        }
		
	canvas_overlay = document.getElementById('overlay');

        if(!canvas_overlay)

        {

            alert("Impossible de récupérer le canvas");

            return;

        }


    context_overlay = canvas_overlay.getContext('2d');

        if(!context_overlay)

        {

            alert("Impossible de récupérer le context du canvas");

            return;

        }
		
	context_overlay.globalAlpha = 0.4;
		
	canvas_background = document.getElementById('background');

        if(!canvas_background)

        {

            alert("Impossible de récupérer le canvas");

            return;

        }


    context_background = canvas_background.getContext('2d');

        if(!context_background)

        {

            alert("Impossible de récupérer le context du canvas");

            return;

        }


	alert("ok")
    display_layout();
	
	for(i=0;i<layout.layers;i++){
		var id = "layer_" + i;
		alert(id);
		layers_canvas.push(document.getElementById(id));
		alert(layers_canvas[i].height);
		layers_context.push(layers_canvas[i].getContext('2d'));
	}
	
}

function display_layout(){
	var radius = canvas.height/(layout.height*8);
	var centerY = 0;
	var centerX = 0;
	
	context_background.fillStyle = "gray";
	context_background.fillRect(0, 0, canvas.width, canvas.height);
	
	for( i = 0; i < layout.width; i++){
		centerY = canvas.height/(layout.height*2)+i*(canvas.height/layout.height);
		for( j = 0; j < layout.height; j++){
			centerX = canvas.width/(layout.width*2)+j*(canvas.width/layout.width);
			context.beginPath();
			context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
			context.stroke();
			context.closePath();
		}
	}
}


/*
MOUSE MOVEMENT HANDLING
*/


function mouse_hover(e){
	var pos = getMousePos(e);
	context_overlay.clearRect(0, 0, canvas_overlay.width, canvas_overlay.height);
	if(pos.x<canvas.width && pos.x>0 && pos.y<canvas.height && pos.y>0){
		if(mode==0){
			mouse_hover_add(pos.x, pos.y);
		}
		else if(mode==1){
			mouse_hover_remove(pos.x, pos.y);
		}
	}
}
window.addEventListener('mousemove', mouse_hover, false);

function mouse_hover_add(x, y){
	context_overlay.fillStyle = "#000000";
	params = getBlockParams(x, y);
	context_overlay.fillRect(params.posX, params.posY, (canvas.width/layout.width)*params.sizeX, (canvas.height/layout.height)*params.sizeY);
}

function mouse_hover_remove(x, y){
	for(i=0;i<placedPieces.length;i++){
		piece=placedPieces[i];
		if(piece.posX<x && piece.posX+(piece.sizeX*(canvas.width/layout.width))>x && piece.posY<y && piece.posY+(piece.sizeY*(canvas.height/layout.height))>y && piece.posZ==current_layer){
			context_overlay.fillStyle = "#000000";
			context_overlay.fillRect(piece.posX, piece.posY, (canvas.width/layout.width)*piece.sizeX, (canvas.height/layout.height)*piece.sizeY);
			break;
		}
	}
}

function  getMousePos(evt) {
  var rect = canvas.getBoundingClientRect(), // abs. size of element
      scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
      scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

  return {
    x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
    y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
  }
}


function getBlockParams(posX, posY){
	posY = Math.trunc(posY*(layout.height/canvas.height));
	posX = Math.trunc(posX*(layout.width/canvas.width));
	sizeX = 1;
	sizeY = 1;
	switch(rotatePiece){
		case 0:
			posY = posY-pieces[currentPiece].sizeY + 1;
			sizeX = pieces[currentPiece].sizeX;
			sizeY = pieces[currentPiece].sizeY;
			break;
		case 1:
			sizeX = pieces[currentPiece].sizeY;
			sizeY = pieces[currentPiece].sizeX;
			break;
		case 2:
			posX = posX-pieces[currentPiece].sizeX + 1;
			sizeX = pieces[currentPiece].sizeX;
			sizeY = pieces[currentPiece].sizeY;
			break;
		case 3:
			posY = posY-pieces[currentPiece].sizeX + 1;
			posX = posX-pieces[currentPiece].sizeY + 1;
			sizeX = pieces[currentPiece].sizeY;
			sizeY = pieces[currentPiece].sizeX;
			break;
		default:
			break;
	}
	posX = posX*(canvas.width/layout.width);
	posY = posY*(canvas.height/layout.height);
	if(posX>(canvas.width-(canvas.width/layout.width)*sizeX)){
		posX = posX-canvas.width/layout.width;
	}
	else if(posX<0){
		posX = posX+canvas.width/layout.width;
	}
	if(posY>(canvas.height-(canvas.height/layout.height)*sizeY)){
		posY = posY-canvas.height/layout.height;
	}
	else if(posY<0){
		posY = posY+canvas.height/layout.height;
	}
	return({posX: posX, posY: posY, posZ: current_layer, sizeX: sizeX, sizeY: sizeY});
}

/*
MOUSE CLICK HANDLING
*/

function legoClick(e){
    evt = e || window.event;
    if ("buttons" in evt) {
        if(evt.buttons == 1){
	    if(mode==0){
		ret=checkPiece(e);
		if(ret==1){
		    placeLegoGraph(e);
		    addPiece(e);
		}
		else if(ret==2){
		    alert("Impossible de placer une pièce ici : aucune pièce en-dessous");
		}
	    }
	    else if(mode==1){
		removePiece(e);
	    }
	    return 0;
	}
    }
    var button = evt.which || evt.button;
    if(button==1){
	if(mode==0){
	    ret=checkPiece(e);
	    if(ret==1){
		placeLegoGraph(e);
		addPiece(e);
	    }
	    else if(ret==2){
		alert("Impossible de placer une pièce ici : aucune pièce en-dessous");
	    }
	}
	else if(mode==1){
		removePiece(e);
	}
	return 0;
    }
}

function checkPiece(e){
	var pos = getMousePos(e);
	if(pos.x<canvas.width && pos.x>0 && pos.y<canvas.height && pos.y>0){
		if(current_layer==0){return 1;}
		for(i=0;i<placedPieces.length;i++){
			piece=placedPieces[i];
			if(piece.posX<pos.x && piece.posX+(piece.sizeX*(canvas.width/layout.width))>pos.x && piece.posY<pos.y && piece.posY+(piece.sizeY*(canvas.height/layout.height))>pos.y && piece.posZ==current_layer-1){
				return 1;
			}
		}
		return 2;
	}	
	return 0;
}

function placeLegoGraph(e){
	var pos = getMousePos(e);
	if(pos.x<canvas.width && pos.x>0 && pos.y<canvas.height && pos.y>0){
		params = getBlockParams(pos.x, pos.y)
		layers_context[current_layer].fillStyle = layers_colors[current_layer];
		posY = Math.trunc(pos.y*(layout.height/canvas.height))*(canvas.height/layout.height);
		posX = Math.trunc(pos.x*(layout.width/canvas.width))*(canvas.width/layout.width);
		layers_context[current_layer].fillRect(params.posX, params.posY, (canvas.width/layout.width)*params.sizeX, (canvas.height/layout.height)*params.sizeY);
	}
}
window.addEventListener('click', legoClick, false);

function addPiece(e){
	var pos = getMousePos(e);
	if(pos.x<canvas.width && pos.x>0 && pos.y<canvas.height && pos.y>0){
		placedPieces.push(getBlockParams(pos.x, pos.y));
		alert(placedPieces[placedPieces.length-1].posX);
	}
}

function removePiece(e){
	var pos = getMousePos(e);
	for(i=0;i<placedPieces.length;i++){
		piece=placedPieces[i];
		if(piece.posX<pos.x && piece.posX+(piece.sizeX*(canvas.width/layout.width))>pos.x && piece.posY<pos.y && piece.posY+(piece.sizeY*(canvas.height/layout.height))>pos.y && piece.posZ==current_layer){
			layers_context[piece.posZ].clearRect(piece.posX, piece.posY, (canvas.width/layout.width)*piece.sizeX, (canvas.height/layout.height)*piece.sizeY);
			placedPieces.splice(i, 1);
			break;
		}
	}
}


/*
BUTTON HANDLING
*/

function layer_buttons()
{
	layer_up = document.getElementById('layer_up');
	layer_down = document.getElementById('layer_down');

	layer_up.onclick = function(){
		alert("click");
		if(current_layer<2){
			current_layer++;
			alert("You are on layer"+current_layer);
		}
		else{
			alert("There are only 3 layers");
		}
	}

	layer_down.onclick = function(){
		if(current_layer>0){
			current_layer--;
			alert("You are on layer"+current_layer);
		}
		else{
			alert("You can't go below layer 0");
		}
	}
}

/*
BLOCK SELECTION
*/

function blockSelectButtons()
{
	validateBlock = document.getElementById('validateBlock');
	blockSelection = document.getElementById('blockselect');
	
	validateBlock.onclick = function(){
		currentPiece = blockSelection.options[blockSelection.selectedIndex].value;
		alert(currentPiece);
	}
}

/*
MODE SELECTION
*/

function modeSelectButton()
{
	validateMode = document.getElementById('validateMode');
	modeSelection = document.getElementById('modeselect');
	
	validateMode.onclick = function(){
		mode = modeSelection.options[modeSelection.selectedIndex].value;
		alert(mode);
	}
}

/*
RIGHT CLICK HANDLING
*/

window.addEventListener('contextmenu', function(e) {
	var pos = getMousePos(e);
	if(pos.x<canvas.width && pos.x>0 && pos.y<canvas.height && pos.y>0){
		e.preventDefault();
		rotatePiece = (rotatePiece + 1)%4;
		mouse_hover(e);
		return false;
	}
}, false);

