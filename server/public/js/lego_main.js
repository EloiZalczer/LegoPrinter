/*
GLOBAL VARIABLES
*/

var nb_layers;
var size_x;
var size_y;
var project_name;
var layers_canvas = new Array;
var layers_context = new Array;
var edit=0;
var placedPieces = new Array;
var project_id;
var pieces = new Array();
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

//Au chargement de la page, on lance toutes les fonctions principales du programme.
//Si on n'attend pas le window.onload, elles n'auront pas acces au DOM et planteront

window.onload = function(){
    var validate_open_project = document.getElementById('validate_open_project');
    current_layer_div = document.getElementById('current_layer');
    validate_open_project.onclick=function(){
	layer_buttons();
	//blockSelectButtons();
	modeSelectButton();
	window.addEventListener('click', legoClick, false);
    }
}

//On charge les canvas et les context depuis le DOM, puis on ajoute les pieces deja existantes dans le projet
//Les canvas/context d'edition sont recuperes dans les tableaux layers_canvas/layers_context

function load_canvas()

{
	
    canvas = document.getElementById('layout_canvas');

        if(!canvas)

        {

            console.error("Impossible de récupérer le canvas");

            return;

        }


    context = canvas.getContext('2d');

        if(!context)

        {

            console.error("Impossible de récupérer le context du canvas");

            return;

        }
		
	canvas_overlay = document.getElementById('overlay');

        if(!canvas_overlay)

        {

            console.error("Impossible de récupérer le canvas");

            return;

        }


    context_overlay = canvas_overlay.getContext('2d');

        if(!context_overlay)

        {

            console.error("Impossible de récupérer le context du canvas");

            return;

        }
		
	context_overlay.globalAlpha = 0.4;
		
	canvas_background = document.getElementById('background');

        if(!canvas_background)

        {

            console.error("Impossible de récupérer le canvas");

            return;

        }


    context_background = canvas_background.getContext('2d');

        if(!context_background)

        {

            console.error("Impossible de récupérer le context du canvas");

            return;

        }
		
    display_layout();
    if(placedPieces.length>0){
        for(var i=0;i<placedPieces.length;i++){
	    rotatePiece=placedPieces[i].orientation;
	    currentPiece = pieces.map(function(x) {return x.type; }).indexOf(placedPieces[i].type);
            pos={x: placedPieces[i].posx+5, y: placedPieces[i].posy+5};
	    current_layer=placedPieces[i].posz;
	    var color = placedPieces[i].color;
            placeLegoGraph(pos, color);
        }
    }
    current_layer=1;

}

//On affiche le layout de l'editeur sur le calque layout

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

//Gestion des mouvements de la souris : en fonction du mode, on appelle mouse_hover_add ou mouse_hover_remove

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

//Gestion des mouvements de la souris en mode placement : on affiche la position de la piece sur le calque overlay.
//Les parametres de la piece sont obtenus a partir de la fonction getBlockParams

function mouse_hover_add(e){
	var pos = getMousePos(e);
	context_overlay.fillStyle = "#000000";
	params = getBlockParams(pos.x, pos.y);
	context_overlay.fillRect(params.posx, params.posy, (canvas.width/layout.width)*params.sizex, (canvas.height/layout.height)*params.sizey);
}

//Gestion des mouvements de la souris en mode suppression : si la souris est sur une piece, on la recouvre sur le calque overlay
//Les parametres de la piece sous la souris sont obtenus avec la fonction placedBlockParams

function mouse_hover_remove(e){
	var pos = getMousePos(e);
	var params = placedBlockParams(pos.x, pos.y);
	if(params!=0){
		context_overlay.fillStyle = "#000000";
		context_overlay.fillRect(params.posx, params.posy, (canvas.width/layout.width)*params.sizex, (canvas.height/layout.height)*params.sizey);
	}
}

//On recupere la position de la souris sur la canvas

function  getMousePos(evt) {
  var rect = canvas.getBoundingClientRect(), // abs. size of element
      scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
      scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

  return {
    x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
    y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
  }
}

//Fonction piecePosition : en fonction des donnees en entree, renvoie les parametres de la piece actuelle en fonction de l'orientation
//Parametres : orientation (rotatePiece), position de la souris en x et en y, taille de la piece en x et en y
//(depuis le tableau pieces) 

//TODO : vraiment utile de retourner orientation ?

function piecePosition(orientation, posx, posy, sizex, sizey){
	
	var ret={sizex: 0, sizey: 0, posx: 0, posy: 0};
	switch(orientation){
	case 0:
            ret.sizex = sizex;
            ret.sizey = sizey;
	    ret.posx = posx;
	    ret.posy = posy-sizey+1;
            break;
        case 1:
	    ret.posx = posx;
            ret.posy = posy;
            ret.sizex = sizey;
            ret.sizey = sizex;
            break;
        case 2:
            ret.posx = posx-sizex + 1;
	    ret.posy = posy;
            ret.sizex = sizex;
            ret.sizey = sizey;
            break;
        case 3:
            ret.posy = posy-sizex + 1;
            ret.posx = posx-sizey + 1;
            ret.sizex = sizey;
            ret.sizey = sizex;
            break;
        default:
            break;
        }
	//console.log(ret+" avec o : "+orientation+" pos : "+posx+":"+posy+" size : "+sizex+":"+sizey);
	return ret;

}

//Fonction placedBlockParams : pour une position donnee en entree, renvoie les parametres d'une eventuelle piece en-dessous ou 0 sinon
//Parametres : position de la souris en x et en y.
//Si piece trouvee : renvoie l'indice de la piece concernee dans le tableau, sa position en x, y, z et sa taille en x et y
//Sinon retourne 0
//La fonction utilise piecePosition pour recuperer les parametres
//ATTENTION : la position dans piecePosition est reduite (divisee par la taille d'une case) et arrondie.
//La position renvoyee correspond a la position reelle de la piece

function placedBlockParams(pos_x, pos_y){

	if(placedPieces.length==0){
		return 0;
	}

	//console.log("mouse pos : "+pos_x+":"+pos_y);

	var posx;
	var posy;

	for(var i=0;i<placedPieces.length;i++){
	piece=placedPieces[i];
	var divw = (layout.width/canvas.width);
	var divh = (layout.height/canvas.height);
	posx = Math.trunc(piece.posx*divw);
	posy = Math.trunc(piece.posy*divh);
	if(posx>pos_x*divw+3 || posx<pos_x*divw-3 || posy>pos_y*divh+3 || posy<pos_y*divh-3 || piece.posz != current_layer){
	    continue;
	}
	var position = piecePosition(piece.orientation, posx, posy, piece.sizex, piece.sizey);

	posx=position.posx;
	posy=position.posy;
	var sizex=position.sizex;
	var sizey=position.sizey;

	//console.log("pos : "+posx+":"+posy+"size : "+sizex+":"+sizey);

	posx=posx*(canvas.width/layout.width);
	posy=posy*(canvas.height/layout.height);

	if(posx<=pos_x && posx+(sizex*(canvas.width/layout.width))>=pos_x && posy<=pos_y && posy+(sizey*(canvas.height/layout.height))>=pos_y){
		return({index : i, posx: posx, posy: posy, sizex: sizex, sizey: sizey, posz: piece.posz});
	}
}

	return 0;
}

//Fonction getBlockParams : pour une position de la souris donnee, renvoie les parametres du bloc place
//Parametres : position de la souris en x et en y
//Retourne la position du bloc en x, y, z, sa position reelle en x et y, sa taille en x et y, son type et son orientation.
//La position reelle realpos correspond a la position du clic tandis que la position pos correspond a la position du coin
//superieur gauche de la piece permettant de faire l'affichage
//Comme placedBlockParams, cette fonction fait appel a piecePosition et travaille en position reduite.
//Si l'utilisateur est trop proche du bord du canvas, on ramene l'affichage dans le canvas 

function getBlockParams(posx, posy){
    var realposy = Math.trunc(posy);
    var realposx = Math.trunc(posx);
    //console.log("pos : "+posx+":"+posy);
    posx=Math.trunc(realposx*(layout.width/canvas.width));
    posy=Math.trunc(realposy*(layout.height/canvas.height));
    var sizex;
    var sizey;
    //console.log("npos : "+posx+":"+posy);
    var position = piecePosition(rotatePiece, posx, posy, pieces[currentPiece].sizex, pieces[currentPiece].sizey);

    //console.log(position);

    posx=position.posx;
    posy=position.posy;
    sizex=position.sizex;
    sizey=position.sizey;

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
    return({posx: posx, posy: posy, posz: current_layer, realposx: realposx, realposy: realposy, sizex: sizex, sizey: sizey, type: pieces[currentPiece].type, orientation: rotatePiece});
}

/*
MOUSE CLICK HANDLING
*/

//Gestion du clic utilisateur. Cette fonction est principalement longue car elle est compatible avec des navigateurs plus anciens.
//En fonction du mode, les fonctions addPiece ou removePiece sont appelees. La fonction checkPiece est appelee pour verifier si le placement
//de piece est possible. Deux erreurs sont alors gerees : chevauchement de pieces (code 3) et aucune piece en-dessous (code 2)

function legoClick(e){
    if(edit==1){
	evt = e || window.event;
	if ("buttons" in evt) {
            if(evt.buttons == 1){
		if(mode==0){
		    ret=checkPiece(e);
		    if(ret==1){
		 	var color = document.getElementById("colorsselect").value;
			var pos = getMousePos(e);
			placeLegoGraph(pos, color);
			addPiece(pos, color);
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
		    var color = document.getElementById("colorsselect").value;
		    var pos = getMousePos(e);
		    placeLegoGraph(pos, color);
		    addPiece(pos, color);
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

//Verifie que le placement de la piece actuellement selectionnee n'est pas illegal. Les deux regles prises en compte sont :
//    - Obligatoirement une piece en-dessous de la piece actuelle si placee sur un calque > 1
//    - Pas de chevauchement de pieces

function checkPiece(e){
    var pos = getMousePos(e);
    var params = getBlockParams(pos.x, pos.y);
    if(pos.x<canvas.width && pos.x>0 && pos.y<canvas.height && pos.y>0){
	if(current_layer>1){
	    var valid=0;
	    for(i=0;i<placedPieces.length;i++){
		piece=placedPieces[i];
		if(piece.posz==current_layer-1 && piece.posx==params.posx && piece.posy==params.posy){
		    valid=1;
		    break;
		}
	    }
	    if(valid==0){return 2;}
	}
	for(i=0;i<placedPieces.length;i++){
	    piece=placedPieces[i];
	    if(piece.posz==current_layer && piece.posx==params.posx && piece.posy==params.posy){
		return 3;
	    }
	}
	return 1;
    }
    
    return 0;
}

//Affiche un bloc a la position donnee en parametres, en faisant appel a getBlockParams pour obtenir les parametres du bloc

function placeLegoGraph(pos, color){
	if(pos.x<canvas.width && pos.x>0 && pos.y<canvas.height && pos.y>0){
		params = getBlockParams(pos.x, pos.y);
		layers_context[current_layer-1].fillStyle = "#"+color;
		//console.log("pos : "+params.posx+":"+params.posy+", size : "+params.sizex*(canvas.width/layout.width)+":"+params.sizey*(canvas.height/layout.height));
		layers_context[current_layer-1].fillRect(params.posx, params.posy, (canvas.width/layout.width)*params.sizex, (canvas.height/layout.height)*params.sizey);
	}
}

//Ajoute une nouvelle piece dans la structure de donnees placedPieces pour sauvegarde

function addPiece(pos, color){
	if(pos.x<canvas.width && pos.x>0 && pos.y<canvas.height && pos.y>0){
	    var params = getBlockParams(pos.x, pos.y);
		placedPieces.push({posx: params.posx, posy: params.posy, posz: params.posz, sizex: pieces[currentPiece].sizex, sizey: pieces[currentPiece].sizey, type: params.type, orientation: params.orientation, color: color});
	}
}

//Supprime une piece de la structure de donnees et l'efface graphiquement

function removePiece(e){
	var pos = getMousePos(e);
	var params = placedBlockParams(pos.x, pos.y);
	if(params!=0){
		//console.log(params.posz);
		layers_context[params.posz-1].clearRect(params.posx, params.posy, (canvas.width/layout.width)*params.sizex, (canvas.height/layout.height)*params.sizey);
		placedPieces.splice(params.index, 1);
	}
}


/*
BUTTON HANDLING
*/

//Gestion des boutons pour changer de calque actuel. Lors du changement de calque, on verifie que le nouveau calque n'est pas illegal
//(compris entre 1 et nb_layers). En cas d'erreur, un message est affiche a l'utilisateur.

function layer_buttons()
{
	layer_up = document.getElementById('layer_up');
	layer_down = document.getElementById('layer_down');

	layer_up.onclick = function(){
		if(current_layer<nb_layers){
		    current_layer++;
		    layers_canvas[current_layer-1].style.opacity=1;
		    current_layer_div.innerHTML=current_layer;
		}
		else{
			info("Il y a seulement "+nb_layers+" calques");
		}
	}

	layer_down.onclick = function(){
		if(current_layer>1){
		    layers_canvas[current_layer-1].style.opacity=0.3;
		    current_layer--;
		    current_layer_div.innerHTML=current_layer;
		}
		else{
			info("Impossible d'aller en-dessous du calque 1");
		}
	}
}

/*
BLOCK SELECTION
*/

//Selection du type de piece a placer. Code commente car on ne gere plus que les pieces 1x1.

/*function blockSelectButtons()
{
	validateBlock = document.getElementById('validateBlock');
	blockSelection = document.getElementById('blockselect');
	
	validateBlock.onclick = function(){
		currentPiece = blockSelection.options[blockSelection.selectedIndex].value;
		//alert(currentPiece);
	}
}*/

/*
MODE SELECTION
*/

//Gestion de la selection du mode (0 : placer ou 1 : supprimer).

function modeSelectButton()
{
	validateMode = document.getElementById('validateMode');
	modeSelection = document.getElementById('modeselect');
	
	validateMode.onclick = function(){
		mode = modeSelection.options[modeSelection.selectedIndex].value;
		//alert(mode);
	}
}

/*
RIGHT CLICK HANDLING
*/

//Gestion de la rotation des pieces avec le clic droit. La fonction mouse_hover est appelee dans le processus pour mettre à jour l'affichage sans que l'utilisateur n'ait besoin de bouger. On utilise la fonction preventDefault pour empêcher l'ouverture d'un menu contextuel.

window.addEventListener('contextmenu', function(e) {
	var pos = getMousePos(e);
	if(pos.x<canvas.width && pos.x>0 && pos.y<canvas.height && pos.y>0){
		e.preventDefault();
		rotatePiece = (rotatePiece + 1)%4;
		mouse_hover(e);
		return false;
	}
}, false);