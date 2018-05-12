/*
PRINTING
*/

var size_container=10;

window.addEventListener("load",function(){
    startPrinting();
}, false);


//Ouvre la fenetre popup pour rentrer l'adresse IP de l'imprimante et renseigner la position des pieces dans le reservoir, puis lance l'impression si l'utilisateur valide et que les conditions sont remplies.
function startPrinting()
{
    var print_model = document.getElementById("print");
    var popups = document.getElementById("popups");
    print_model.onclick = function(){
	edit=0;
	var uniquePieces = [];
	var doubles = [];
	var l = placedPieces.length, i;

	var popups_content="<div id='print_popup'><h2>Impression</h2><p>Veuillez entrer l'adresse IP de l'imprimante</p><input type='text' id='ip_address_printer'><br/><button id='cancel_print'>Annuler</button>";
	
	if(l==0){
	    popups_content+="<p>Aucune piece a imprimer</p>";
	}
	else{
	    popups_content+="<button id='validate_print'>Valider</button>";
	
	    for(i=0; i<l; i++) {
		var piece = JSON.stringify([placedPieces[i].sizex, placedPieces[i].sizey, placedPieces[i].color]);
		console.log(doubles.indexOf(piece));
		var pos;
		pos=doubles.indexOf(piece);
		if(pos<0){
		    uniquePieces.push(placedPieces[i]);
		    pos=doubles.push(piece)-1;
		}
		placedPieces[i]["container_pos"]=pos;
	    }
	    
            popups_content+="<div id='pieces_position'>"
	    for(i=0;i<uniquePieces.length;i++){
		var colorname = colors.filter(function(o){return o.color_code == uniquePieces[i].color;})[0].color_name;
		popups_content+=uniquePieces[i].sizex+"x"+uniquePieces[i].sizey+", "+colorname;
		popups_content+="<select id='"+i+"'>";
		for(let j=1;j<=size_container;j++){
		    popups_content+="<option value='"+j+"'>"+j+"</option>";
		}	
		popups_content+="</select><br/>";
	    }
	    popups_content+="</div>";
	}
	popups_content+="<p id='print_error'></p>";
        popups_content+="</div>";
	console.table(uniquePieces);
	popups.innerHTML=popups_content;
	var print_popup=document.getElementById("print_popup");
	var valid=document.getElementById("validate_print");
	var cancel=document.getElementById("cancel_print");
	valid.addEventListener("click", function(){validate(uniquePieces);}, false);
	cancel.addEventListener("click", function(){print_popup.remove();edit=1;}, false);
    }
}

//Genere les donnees a envoyer au serveur d'imoression
function generatePrintData(pieces_position){
    var ret=[];
    for(let i=0;i<placedPieces.length;i++){
	container_pos = pieces_position[placedPieces[i].container_pos];
	ret.push({posx: placedPieces[i].posx, posy: placedPieces[i].posy, posz: placedPieces[i].posz, container: container_pos});
    }
    return ret;
}

//Verifie que les informations entrees par l'utilisateur sont valides et lance l'impression.
function validate(uniquePieces){
    alert("ok");
    var pieces_position = [];
    for(i=0;i<uniquePieces.length;i++){
        var e = document.getElementById(i);
        pieces_position.push(e.options[e.selectedIndex].value);
    }
    console.log(pieces_position);
    if(hasDuplicates(pieces_position)){
        document.getElementById("print_error").innerHTML = "Veuillez utiliser un index different pour chaque piece";
	//print_popup.insertAdjacentHTML('beforeend', "<p>Veuillez utiliser un index different pour chaque piece</p>");
    }
    else{
	var ip_addr = document.getElementById("ip_address_printer").value;
        print_popup.remove();
	edit=1;
        sendPrintData(pieces_position, ip_addr);
    }   
}

//Envoie la requete au serveur d'impression pour lancer l'impression.
function sendPrintData(pieces_position, ip_addr){
    var XHR = new XMLHttpRequest();
    var name;
    var i=0;
    
    var toSend = JSON.stringify(generatePrintData(pieces_position));
    console.log("toSend : "+toSend);
    
    // Define what happens on successful data submission
    XHR.addEventListener('load', function(event) {
	var ret = JSON.parse(XHR.responseText);
	if(XHR.readyState == 4 && XHR.status == "200"){
	    info("Impression lancée");
	    console.log(ret);
	}
	else{
	    info(ret);
	    console.error(ret);
	}
    });
    
    // Define what happens in case of error
    XHR.addEventListener('error', function(event) {
	info("Erreur lors de l'envoi de la requête");
    });
    
    // Set up our request
    XHR.open('POST', "http://"+ip_addr);
    
    // Add the required HTTP header for form data POST requests
    XHR.setRequestHeader('Content-Type', 'application/json');
    
    // Finally, send our data.
    XHR.send(toSend);
}
