Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}

window.addEventListener("load",function(){
    validate_open_project = document.getElementById('validate_open_project');
    open_project = document.getElementById('open_project');
    start_overlay = document.getElementById('start_overlay');
    
    validate_open_project.onclick = function(){
	open_project.remove();
	start_overlay.remove();
    }
},false);
