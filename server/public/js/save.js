window.addEventListener("load",function(){
    saveModel();
}, false);

function saveModel()
{
    var save_model = document.getElementById("save_model");
    save_model.onclick = function(){
	edit=0;
	alert('Sauvegarde en cours');
	var url = "http://192.168.1.97:3000/tasks";

	var json = JSON.stringify(placedPieces);
	console.log(json)
	
	var xhr = new XMLHttpRequest();
	xhr.open("PUT", url+'/1', true);
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
