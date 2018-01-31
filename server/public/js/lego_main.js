/*
GLOBAL VARIABLES
*/

var canvas = 0;
var context = 0;
var canvas_overlay = 0;
var context_overlay = 0;
var canvas_background = 0;
var context_background = 0;
var current_layer = 1;
var current_layer_div;
var mode = 0;

var layers_colors = ["red", "blue", "green"];

var layout;

var currentPiece = 0;

var rotatePiece = 0;

window.onload = function(){
    var validate_open_project = document.getElementById('validate_open_project');
    current_layer_div = document.getElementById('current_layer');
    validate_open_project.onclick=function(){
	layer_buttons();
	blockSelectButtons();
	modeSelectButton();
	window.addEventListener('click', legoClick, false);
    }
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
		
    display_layout();
    if(placedPieces.length>0){
        for(var i=0;i<placedPieces.length;i++){
	    rotatePiece=1;
	    currentPiece = pieces.map(function(x) {return x.type; }).indexOf(placedPieces[i].type);
            pos={x: placedPieces[i].posx+5, y: placedPieces[i].posy+5};
            placeLegoGraph(pos);
        }
    }

}

function display_layout(){
	var radius = canvas.height/(layout.height*8);
	var centerY = 0;
	var centerX = 0;
	
	context_background.fillStyle = "gray";
	context_background.fillRect(0, 0, canvas.width, canvas.height);
	
	for( i = 0; i < layout.height; i++){
		centerY = canvas.height/(layout.height*2)+i*(canvas.height/layout.height);
		for( j = 0; j < layout.width; j++){
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
	context_overlay.fillRect(params.posx, params.posy, (canvas.width/layout.width)*params.sizex, (canvas.height/layout.height)*params.sizey);
}

function mouse_hover_remove(x, y){
	for(i=0;i<placedPieces.length;i++){
		piece=placedPieces[i];
		if(piece.posx<x && piece.posx+(piece.sizex*(canvas.width/layout.width))>x && piece.posy<y && piece.posy+(piece.sizey*(canvas.height/layout.height))>y && piece.posz==current_layer){
			context_overlay.fillStyle = "#000000";
			context_overlay.fillRect(piece.posx, piece.posy, (canvas.width/layout.width)*piece.sizex, (canvas.height/layout.height)*piece.sizey);
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


function getBlockParams(posx, posy){
    posy = Math.trunc(posy*(layout.height/canvas.height));
    posx = Math.trunc(posx*(layout.width/canvas.width));
    var sizex;
    var sizey;
    switch(rotatePiece){
    case 0:
	posy = posy-pieces[currentPiece].size_y + 1;
	sizex = pieces[currentPiece].size_x;
	sizey = pieces[currentPiece].size_y;
	break;
    case 1:
	sizex = pieces[currentPiece].size_y;
	sizey = pieces[currentPiece].size_x;
	break;
    case 2:
	posx = posx-pieces[currentPiece].size_x + 1;
	sizex = pieces[currentPiece].size_x;
	sizey = pieces[currentPiece].size_y;
	break;
    case 3:
	posy = posy-pieces[currentPiece].size_x + 1;
	posx = posx-pieces[currentPiece].size_y + 1;
	sizex = pieces[currentPiece].size_y;
	sizey = pieces[currentPiece].size_x;
	break;
    default:
	break;
    }
    posx = posx*(canvas.width/layout.width);
    posy = posy*(canvas.height/layout.height);
    if(posx>(canvas.width-(canvas.width/layout.width)*sizex)){
	posx = posx-canvas.width/layout.width;
    }
    else if(posx<0){
	posx = posx+canvas.width/layout.width;
    }
    if(posy>(canvas.height-(canvas.height/layout.height)*sizey)){
	posy = posy-canvas.height/layout.height;
    }
    else if(posy<0){
	posy = posy+canvas.height/layout.height;
    }
    return({posx: posx, posy: posy, posz: current_layer, sizex: sizex, sizey: sizey, type: pieces[currentPiece].type});
}

/*
MOUSE CLICK HANDLING
*/

function legoClick(e){
    if(edit==1){
	evt = e || window.event;
	if ("buttons" in evt) {
            if(evt.buttons == 1){
		if(mode==0){
		    ret=checkPiece(e);
		    if(ret==1){
			var pos = getMousePos(e);
			placeLegoGraph(pos);
			addPiece(pos);
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
		    var pos = getMousePos(e);
		    placeLegoGraph(pos);
		    addPiece(pos);
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
}


function checkPiece(e){
	var pos = getMousePos(e);
	if(pos.x<canvas.width && pos.x>0 && pos.y<canvas.height && pos.y>0){
		if(current_layer==1){return 1;}
		for(i=0;i<placedPieces.length;i++){
			piece=placedPieces[i];
			if(piece.posx<pos.x && piece.posx+(piece.sizex*(canvas.width/layout.width))>pos.x && piece.posy<pos.y && piece.posy+(piece.sizey*(canvas.height/layout.height))>pos.y && piece.posz==current_layer-1){
				return 1;
			}
		}
		return 2;
	}	
	return 0;
}

function placeLegoGraph(pos){
	if(pos.x<canvas.width && pos.x>0 && pos.y<canvas.height && pos.y>0){
		params = getBlockParams(pos.x, pos.y)
		layers_context[current_layer-1].fillStyle = layers_colors[current_layer-1];
		posy = Math.trunc(pos.y*(layout.height/canvas.height))*(canvas.height/layout.height);
		posx = Math.trunc(pos.x*(layout.width/canvas.width))*(canvas.width/layout.width);
		layers_context[current_layer-1].fillRect(params.posx, params.posy, (canvas.width/layout.width)*params.sizex, (canvas.height/layout.height)*params.sizey);
	}
}

function addPiece(pos){
	if(pos.x<canvas.width && pos.x>0 && pos.y<canvas.height && pos.y>0){
		placedPieces.push(getBlockParams(pos.x, pos.y));
	}
}

function removePiece(e){
	var pos = getMousePos(e);
	for(i=0;i<placedPieces.length;i++){
		piece=placedPieces[i];
		if(piece.posx<pos.x && piece.posx+(piece.sizex*(canvas.width/layout.width))>pos.x && piece.posy<pos.y && piece.posy+(piece.sizey*(canvas.height/layout.height))>pos.y && piece.posz==current_layer){
			layers_context[piece.posz-1].clearRect(piece.posx, piece.posy, (canvas.width/layout.width)*piece.sizex, (canvas.height/layout.height)*piece.sizey);
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
		if(current_layer<nb_layers){
		    current_layer++;
		    current_layer_div.innerHTML=current_layer;
		}
		else{
			alert("There are only "+nb_layers+" layers");
		}
	}

	layer_down.onclick = function(){
		if(current_layer>1){
			current_layer--;
			current_layer_div.innerHTML=current_layer;
		}
		else{
			alert("You can't go below layer 1");
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
