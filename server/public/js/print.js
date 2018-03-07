/*
PRINTING
*/

var size_container=10;

window.addEventListener("load",function(){
    startPrinting();
}, false);

function startPrinting()
{
    var print_model = document.getElementById("print");
    var popups = document.getElementById("popups");
    print_model.onclick = function(){
	edit=0;
	var uniquePieces = [];
	var doubles = [];
	var l = placedPieces.length, i;
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
	var popups_content="<div id='print_popup'><h2>Impression</h2><p>Veuillez entrer l'adresse IP de l'imprimante</p><input type='text' id='ip_address_printer'><br/><button id='validate_print'>Valider</button>";
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
	popups_content+="<p id='print_error'></p>";
        popups_content+="</div></div>";
	console.table(uniquePieces);
	popups.innerHTML=popups_content;
	var print_popup=document.getElementById("print_popup");
	var valid=document.getElementById("validate_print");
	valid.addEventListener("click", function(){validate(uniquePieces);}, false);
    }
}

function generatePrintData(pieces_position){
	var ret=[];
	for(let i=0;i<placedPieces.length;i++){
		container_pos = pieces_position[placedPieces[i].container_pos];
		ret.push({posx: placedPieces[i].posx, posy: placedPieces[i].posy, posz: placedPieces[i].posz, container: container_pos});
	}
	return ret;
}

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
                print_popup.remove();
                sendPrintData(pieces_position);
        }

}

function sendPrintData(pieces_position){
    var XHR = new XMLHttpRequest();
    var urlEncodedData = "";
    var urlEncodedDataPairs = [];
    var name;
    var i=0;
    
	var toSend = generatePrintData(pieces_position);
	console.log(toSend);

    // Turn the data object into an array of URL-encoded key/value pairs.
    for(piece in placedPieces) {
	urlEncodedDataPairs.push(encodeURIComponent("piece") + '=' + encodeURIComponent(i));
	urlEncodedDataPairs.push(encodeURIComponent("posX") + '=' + encodeURIComponent(placedPieces[piece].posX));
	urlEncodedDataPairs.push(encodeURIComponent("posY") + '=' + encodeURIComponent(placedPieces[piece].posY));
	urlEncodedDataPairs.push(encodeURIComponent("posZ") + '=' + encodeURIComponent(placedPieces[piece].posZ));
	urlEncodedDataPairs.push(encodeURIComponent("sizeX") + '=' + encodeURIComponent(placedPieces[piece].sizeX));
	urlEncodedDataPairs.push(encodeURIComponent("sizeY") + '=' + encodeURIComponent(placedPieces[piece].sizeY));
	i++;
    }
    
    // Combine the pairs into a single string and replace all %-encoded spaces to 
    // the '+' character; matches the behaviour of browser form submissions.
    urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');

    alert(urlEncodedData);
    
    // Define what happens on successful data submission
    XHR.addEventListener('load', function(event) {
	alert('Yeah! Data sent and response loaded.');
    });
    
    // Define what happens in case of error
    XHR.addEventListener('error', function(event) {
	alert('Oups! Something goes wrong.');
    });
    
    // Set up our request
    XHR.open('POST', 'https://example.com/cors.php');
    
    // Add the required HTTP header for form data POST requests
    XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    
    // Finally, send our data.
    XHR.send(urlEncodedData);

	edit=1;
}
