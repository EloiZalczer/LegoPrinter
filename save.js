window.addEventListener("load",function(){
    saveModel();
}, false);

function saveModel()
{
    var save_model = document.getElementById("save_model");
    save_model.onclick = function(){
	edit=0;
	alert('Sauvegarde en cours');

	//Code de la sauvegarde
	
	edit=1;
    }
}
