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
	    rotatePiece=placedPieces[i].orientation;
	    currentPiece = pieces.map(function(x) {return x.type; }).indexOf(placedPieces[i].type);
            pos={x: placedPieces[i].posx+5, y: placedPieces[i].posy+5};
	    current_layer=placedPieces[i].posz;
	    alert("pos : "+placedPieces[i].posx);
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
			mouse_hover_add(e);
		}
		else if(mode==1){
			mouse_hover_remove(e);
		}
	}
}
window.addEventListener('mousemove', mouse_hover, false);

function mouse_hover_add(e){
	var pos = getMousePos(e);
	context_overlay.fillStyle = "#000000";
	params = getBlockParams(pos.x, pos.y);
	context_overlay.fillRect(params.posx, params.posy, (canvas.width/layout.width)*params.sizex, (canvas.height/layout.height)*params.sizey);
}

function mouse_hover_remove(e){
	var pos = getMousePos(e);
	var params = placedBlockParams(pos.x, pos.y);
	if(params!=0){
		context_overlay.fillStyle = "#000000";
		context_overlay.fillRect(params.posx, params.posy, (canvas.width/layout.width)*params.sizex, (canvas.height/layout.height)*params.sizey);
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

function placedBlockParams(pos_x, pos_y){

	if(placedPieces.length==0){
		return 0;
	}

	console.log("mouse pos : "+pos_x+":"+pos_y);

	var posx;
	var posy;
	var sizex;
	var sizey;

	for(var i=0;i<placedPieces.length;i++){
	piece=placedPieces[i];
	posx = Math.trunc(piece.posx*(layout.width/canvas.width));
	posy = Math.trunc(piece.posy*(layout.height/canvas.height));
	switch(piece.orientation){
	case 0:
	    posx = posx;
            posy = posy;
            sizex = piece.sizex;
            sizey = piece.sizey;
            break;
        case 1:
	    posx = posx;
	    posy = posy+piece.sizey-1;
            sizex = piece.sizey;
            sizey = piece.sizex;
            break;
        case 2:
            posx = posx-piece.sizex + 1;
	    posy = posy;
            sizex = piece.sizex;
            sizey = piece.sizey;
            break;
        case 3:
            posy = posy-piece.sizex + 1;
            posx = posx-piece.sizey + 1;
            sizex = piece.sizey;
            sizey = piece.sizex;
            break;
        default:
            break;
        }

	console.log("pos : "+posx+":"+posy+"size : "+sizex+":"+sizey);

	posx=posx*(canvas.width/layout.width);
	posy=posy*(canvas.height/layout.height);

	if(posx<=pos_x && posx+(sizex*(canvas.width/layout.width))>=pos_x && posy<=pos_y && posy+(sizey*(canvas.height/layout.height))>=pos_y && piece.posz==current_layer){
		return({index : i, posx: posx, posy: posy, sizex: sizex, sizey: sizey, posz: piece.posz});
	}
}

	return 0;
}

function getBlockParams(posx, posy){
    var realposy = Math.trunc(posy*(layout.height/canvas.height));
    var realposx = Math.trunc(posx*(layout.width/canvas.width));
    posx=realposx;
    posy=realposy;
    var sizex;
    var sizey;
    switch(rotatePiece){
    case 0:
	posy = realposy-pieces[currentPiece].sizey + 1;
	sizex = pieces[currentPiece].sizex;
	sizey = pieces[currentPiece].sizey;
	break;
    case 1:
	sizex = pieces[currentPiece].sizey;
	sizey = pieces[currentPiece].sizex;
	break;
    case 2:
	posx = realposx-pieces[currentPiece].sizex + 1;
	sizex = pieces[currentPiece].sizex;
	sizey = pieces[currentPiece].sizey;
	break;
    case 3:
	posy = realposy-pieces[currentPiece].sizex + 1;
	posx = realposx-pieces[currentPiece].sizey + 1;
	sizex = pieces[currentPiece].sizey;
	sizey = pieces[currentPiece].sizex;
	break;
    default:
	break;
    }
    posx = posx*(canvas.width/layout.width);
    posy = posy*(canvas.height/layout.height);
    realposx = realposx*(canvas.width/layout.width);
    realposy = realposy*(canvas.height/layout.height);
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
    return({posx: posx, posy: posy, posz: current_layer, realposx: realposx, realposy: realposy, sizex: sizex, sizey: sizey, type: pieces[currentPiece].type, orientation: rotatePiece});
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
			info("Aucune pièce en-dessous");
		    }
		    else if(ret==3){
			info("Chevauchement de pièces");
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
		    info("Aucune pièce en-dessous");
		}
		else if(ret==3){
		    info("Chevauchement de pièces");
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
    var params = getBlockParams(pos.x, pos.y);
    if(pos.x<canvas.width && pos.x>0 && pos.y<canvas.height && pos.y>0){
	if(current_layer>1){
	    var valid=0;
	    for(i=0;i<placedPieces.length;i++){
		piece=placedPieces[i];
		if(piece.posx<pos.x && piece.posx+(piece.sizex*(canvas.width/layout.width))>pos.x && piece.posy<pos.y && piece.posy+(piece.sizey*(canvas.height/layout.height))>pos.y && piece.posz==current_layer-1){
		    valid=1;
		    break;
		}
	    }
	    if(valid==0){
		return 2;
	    }
	}
	for(i=0;i<placedPieces.length;i++){
	    piece=placedPieces[i];
	    if(params.posx<=piece.posx+(piece.sizex*(canvas.width/layout.width)) && params.posx+params.sizex>=piece.posx && params.posy<=piece.posy+(piece.sizey*(canvas.width/layout.width)) && params.posy+params.sizey>=piece.posy && piece.posz==current_layer){
		return 3;
	    }
	}
	return 1;
    }
    
    return 0;
}

function placeLegoGraph(pos){
	if(pos.x<canvas.width && pos.x>0 && pos.y<canvas.height && pos.y>0){
		params = getBlockParams(pos.x, pos.y)
		layers_context[current_layer-1].fillStyle = layers_colors[current_layer-1];
		console.log("pos : "+params.posx+":"+params.posy+", size : "+params.sizex*(canvas.width/layout.width)+":"+params.sizey*(canvas.height/layout.height));
		layers_context[current_layer-1].fillRect(params.posx, params.posy, (canvas.width/layout.width)*params.sizex, (canvas.height/layout.height)*params.sizey);
	}
}

function addPiece(pos){
	if(pos.x<canvas.width && pos.x>0 && pos.y<canvas.height && pos.y>0){
	    var params = getBlockParams(pos.x, pos.y);
		placedPieces.push({posx: params.realposx, posy: params.realposy, posz: params.posz, sizex: params.sizex, sizey: params.sizey, type: params.type, orientation: params.orientation});
	}
}

function removePiece(e){
	var pos = getMousePos(e);
	var params = placedBlockParams(pos.x, pos.y);
	if(params!=0){
		console.log(params.posz);
		layers_context[params.posz-1].clearRect(params.posx, params.posy, (canvas.width/layout.width)*params.sizex, (canvas.height/layout.height)*params.sizey);
		placedPieces.splice(i, 1);
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
		    layers_context[current_layer-1].globalAlpha=1;
		}
		else{
			alert("There are only "+nb_layers+" layers");
		}
	}

	layer_down.onclick = function(){
		if(current_layer>1){
		    current_layer--;
		    layers_context[current_layer-1].globalAlpha=0.3;
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
