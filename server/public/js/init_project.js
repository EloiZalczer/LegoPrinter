const block_size=30;
var projects_list;

//Prototype pour supprimer un element du DOM
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}

window.addEventListener("load",function(){
    var validate_open_project = document.getElementById('validate_open_project');
    var open_project = document.getElementById('open_project');
    var start_overlay = document.getElementById('start_overlay');
    var create_project = document.getElementById('create_project');
    var existing_project = document.getElementById('existing_project');
    load_colors();
    projects_list=load_projects_list();

    validate_open_project.addEventListener("click", start_project, false);
    
},false);

//Permet de verifier si la valeur entree est bien un entier compris dans les limites imposees pour les dimensions du projet
function checkNumber(mode, value){
	if(Number.isNaN(value)){
		info("Veuillez entrer un entier");
		return false;
	}
	if((mode==0 && value>20) || (mode==1 && value>5)){
		return false;
	}
	return true;
}

//Appelle les fonctions necessaires en fonction du choix de l'utilisateur : nouveau projet ou projet existant.
function start_project(){
    if(create_project.checked==true){	
	info("Nouveau projet");
	create_new_project();
    }
    else if(existing_project.checked==true){
	info("Ouverture d'un projet existant");
	var projectselect = document.getElementById('projectselect');
	var project_to_open = projectselect.options[projectselect.selectedIndex].value;
	open_existing_project(project_to_open);
    }
}

//Envoie la requete pour charger la liste des projets et remplit le champ select
function load_projects_list(){
    info('Chargement des projets');

    var xhr = new XMLHttpRequest();
    xhr.open("GET", '/project', true);
    xhr.onload = function() {
	projects_list = JSON.parse(xhr.responseText);
	var projectselect = document.getElementById("projectselect");
	if (xhr.readyState == 4 && xhr.status == "200"){
	    console.table(projects_list);
	    for (item in projects_list){
		projectselect.innerHTML += '<option value="'+item+'">'+projects_list[item].project_name+'</option>';
	    }
	}
	else{
	    console.error(projects);
	}
	return 0;
    }

    xhr.send();
}

//Envoie la requete pour recuperer la liste des couleurs et remplit le champ select
function load_colors(){
    info('Chargement des couleurs');

    var xhr = new XMLHttpRequest();
    xhr.open("GET", '/colors', true);
    xhr.onload = function() {
        colors = JSON.parse(xhr.responseText);
        var colorsselect = document.getElementById("colorsselect");
        if (xhr.readyState == 4 && xhr.status == "200"){
            console.table(colors);
            for (item in colors){
                colorsselect.innerHTML += '<option value="'+colors[item].color_code+'">'+colors[item].color_name+'</option>';
            }
        }
        else{
            console.error(projects);
        }
        return 0;
    }

    xhr.send();
}

//Envoie la requete pour recuperer les donnees d'un projet existant. Les pieces placees sont inserees simplement dans placedPieces grace au format JSON. Les differents parametres du projet sont egalement recuperes, puis l'editeur est lance
function open_existing_project(project_to_open){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", '/project/'+projects_list[project_to_open].project_id, true);
    console.log(project_to_open);
    xhr.onload = function(){
	var pieces = JSON.parse(xhr.responseText);
	if (xhr.readyState == 4 && xhr.status == "200") {
	    console.table(pieces);
	    placedPieces = pieces;
	    nb_layers = projects_list[project_to_open].sizez;
	    sizex = projects_list[project_to_open].sizex;
	    sizey = projects_list[project_to_open].sizey;
	    project_id = projects_list[project_to_open].project_id;
	    project_name = projects_list[project_to_open].project_name;
	    start_editor();
	}
	else {
	    console.error(pieces);
	}
    }
    
    xhr.send();
}

//Supprime l'overlay et initialise l'editeur pour permettre a l'utilisateur de travailler sur le canvas.
function start_editor(){
    open_project.remove();
    start_overlay.remove();
    var user_canvas = document.getElementById('user_canvas');
    for(var i=0;i<nb_layers;i++){
	user_canvas.innerHTML+='<canvas id="layer_'+i+'" width="'+sizex*block_size+'" height="'+sizey*block_size+'">\n</canvas>\n';
    }
    for(var i=0;i<nb_layers;i++){
	var id = "layer_" + i;
	layers_canvas.push(document.getElementById(id));
	layers_context.push(layers_canvas[i].getContext('2d'));
	if(i>=1){
	    layers_canvas[i].style.opacity=0.3;
	}
    }
    canvas = document.getElementById('layout_canvas');
    canvas_overlay = document.getElementById('overlay');
    canvas_background = document.getElementById('background');
    canvas.width=sizex*block_size;
    canvas.height=sizey*block_size;
    canvas_overlay.width=sizex*block_size;
    canvas_overlay.height=sizey*block_size;
    canvas_background.width=sizex*block_size;
    canvas_background.height=sizey*block_size;
    document.title=project_name;
    edit=1;
    layout = {height: sizey, width: sizex, layers: nb_layers}
    load_canvas();
    return 0;
}

//Recupere les parametres d'un nouveau projet et envoie la requete pour la creation
function create_new_project(){

    sizex=document.getElementById('sizex').value;
    sizey=document.getElementById('sizey').value;
    nb_layers=document.getElementById('sizez').value;
    project_name=document.getElementById('new_project_name').value;
    if(checkNumber(0, sizex)==false || checkNumber(0, sizey)==false || checkNumber(1, nb_layers)==false){
	valid=0;
	var error=document.getElementById('error');
	error.innerHTML="Paramètres invalides";
	return 0;
    }
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", '/project', true);

    var new_project_data={project_name: project_name, sizex: sizex, sizey: sizey, sizez: nb_layers};

    var json = JSON.stringify(new_project_data);
    console.log(json);
    
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    
    xhr.onload = function(){
	var project = JSON.parse(xhr.responseText);
	if (xhr.readyState == 4 && xhr.status == "201") {
	    project_id = project.results.project_id;
	    start_editor();
	}
	else {
	    console.error(project);
	}
    }
    
    xhr.send(json);
}
