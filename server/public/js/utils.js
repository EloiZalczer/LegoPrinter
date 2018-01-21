var infos;

window.addEventListener("load",function(){
    infos = document.getElementById('infos');    
}, false);


function info(text){
    infos.innerHTML = text;
}
