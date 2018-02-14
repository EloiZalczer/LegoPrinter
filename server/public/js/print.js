/*
PRINTING
*/

window.addEventListener("load",function(){
    startPrinting();
}, false);

function startPrinting()
{
    var print_model = document.getElementById("print");
    var popups = document.getElementById("popups");
    print_model.onclick = function(){
	edit=0;
	popups.innerHTML+="<div id='print_popup'><h2>Impression</h2><p>Veuillez entrer l'adresse IP de l'imprimante</p><input type='text' id='ip_address_printer'><br/><button id='validate_print'>Valider</button></div>";
	var uniquePieces = new Set();
	var l = placedPieces.length, i;
	for(i=0; i<l; i++) {
		var piece = [placedPieces[i].sizex, placedPieces[i].sizey, placedPieces[i].color];
		console.log(uniquePieces.has(piece));
		if(!uniquePieces.has(piece))uniquePieces.add(piece);
	}
	console.table(uniquePieces);
	var valid=document.getElementById("validate_print");
	var print_popup=document.getElementById("print_popup");
	valid.onclick=function(){
	    print_popup.remove();
	    sendPrintData();
	}

	edit=1;
    }
}

function sendPrintData(){
    var XHR = new XMLHttpRequest();
    var urlEncodedData = "";
    var urlEncodedDataPairs = [];
    var name;
    var i=0;
    
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
}


