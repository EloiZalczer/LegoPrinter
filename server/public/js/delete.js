/*
PRINTING
*/

var size_container=10;

window.addEventListener("load",function(){
    deleteModel();
}, false);

function deleteModel()
{
    var delete_model = document.getElementById("delete_model");
    var popups = document.getElementById("popups");
    delete_model.onclick = function(){
	edit=0;
	var popups_content = "<div id='delete_popup'><h2>Suppression</h2><p>Voulez-vous vraiment supprimer le projet : "+project_name+" ?</p><button id='delete_no'>Non</button><button id='delete_yes'>Oui</button></div>";
	popups.innerHTML=popups_content;
	var delete_popup=document.getElementById("delete_popup");
	var yes=document.getElementById("delete_yes");
	var no=document.getElementById("delete_no");
	yes.addEventListener("click", deleteProject, false);
	no.addEventListener("click", function(){delete_popup.remove();edit=1;}, false);
    }
}

function deleteProject(){
    var xhr = new XMLHttpRequest();
    
    // Define what happens on successful data submission
    xhr.addEventListener('load', function(event) {
	var ret = JSON.parse(xhr.responseText);
	if(xhr.readyState == 4 && xhr.status == "200"){
	    info("Projet supprimé");
	    console.log(ret);
	    location.reload();
	}
	else{
	    info('Erreur lors de la suppression du projet');
	    console.error(ret);
	}
    });
    
    // Define what happens in case of error
    xhr.addEventListener('error', function(event) {
	info('Erreur lors de la suppression du projet');
    });
    
    // Set up our request
    xhr.open('DELETE', '/project/'+project_id, true);
    
    // Add the required HTTP header for form data POST requests
    xhr.setRequestHeader('Content-Type', 'application/json');
  
    // Finally, send our data.
    xhr.send();
}
