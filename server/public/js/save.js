window.addEventListener("load",function(){
    saveModel();
}, false);

//Envoie la requete pour sauvegarder le projet en cours
function saveModel()
{
    var save_model = document.getElementById("save_model");
    save_model.onclick = function(){
	edit=0;
	alert('Sauvegarde en cours');
	
	var json = JSON.stringify(placedPieces);
	console.log(json)
	
	var xhr = new XMLHttpRequest();
	xhr.open("PUT", '/project/'+project_id, true);
	xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
	xhr.onload = function () {
	    var users = JSON.parse(xhr.responseText);
	    if (xhr.readyState == 4 && xhr.status == "200") {
		console.table(users);
	    } else {
		console.error(users);
	    }
	}
	xhr.send(json);
	
	edit=1;
    }
}
