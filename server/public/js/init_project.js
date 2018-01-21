const block_size=30;
var projects_list;

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}

window.addEventListener("load",function(){
    var validate_open_project = document.getElementById('validate_open_project');
    var open_project = document.getElementById('open_project');
    var start_overlay = document.getElementById('start_overlay');
    var create_project = document.getElementById('create_project');
    var existing_project = document.getElementById('existing_project');
    
    projects_list=load_projects_list();

    validate_open_project.addEventListener("click", start_project, false);
    
},false);

function checkNumber(mode, value){
	if(Number.isNaN(value)){
		alert('not an integer');
		return false;
	}
	if((mode==0 && value>20) || (mode==1 && value>5)){
		return false;
	}
	return true;
}

function start_project(){
		var valid=1;
		if(create_project.checked==true){
			size_x=document.getElementById('size_x').value;
			size_y=document.getElementById('size_y').value;
			nb_layers=document.getElementById('size_z').value;
			new_project_name=document.getElementById('new_project_name').value;
			if(checkNumber(0, size_x)==false || checkNumber(0, size_y)==false || checkNumber(1, nb_layers)==false){
				valid=0;
				var error=document.getElementById('error');
				error.innerHTML="Paramètres invalides";
			}
		}
		else if(existing_project.checked==true){
			info("Open existing project");
			
		}
		else{
			valid=0;
		}
		if(valid==1){
			open_project.remove();
			start_overlay.remove();
			var user_canvas = document.getElementById('user_canvas');
			for(var i=0;i<nb_layers;i++){
				user_canvas.innerHTML+='<canvas id="layer_'+i+'" width="'+size_x*block_size+'" height="'+size_y*block_size+'">\n</canvas>\n';
			}
			for(var i=0;i<nb_layers;i++){
				var id = "layer_" + i;
				layers_canvas.push(document.getElementById(id));
				layers_context.push(layers_canvas[i].getContext('2d'));
			}
			canvas = document.getElementById('layout_canvas');
			canvas_overlay = document.getElementById('overlay');
			canvas_background = document.getElementById('background');
			canvas.width=size_x*block_size;
			canvas.height=size_y*block_size;
			canvas_overlay.width=size_x*block_size;
			canvas_overlay.height=size_y*block_size;
			canvas_background.width=size_x*block_size;
			canvas_background.height=size_y*block_size;
		    document.title=new_project_name;
		    edit=1;
		}
}

function load_projects_list(){
    info('Chargement des projets');

    var projects;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url+'/project', true);
    xhr.onload = function() {
	projects = JSON.parse(xhr.responseText);
	var projectselect = document.getElementById("projectselect");
	if (xhr.readyState ==4 && xhr.status == "200"){
	    console.table(projects);
	    for (item in projects){
		projectselect.innerHTML += '<option value="'+projects[item].project_id+'">'+projects[item].project_name+'</option>';
	    }
	}
	else{
	    console.error(projects);
	}
    }

    xhr.send();
    return projects;
}
