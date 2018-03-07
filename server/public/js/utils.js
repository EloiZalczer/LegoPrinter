var infos;

window.addEventListener("load",function(){
    infos = document.getElementById('infos');    
}, false);


function info(text){
    infos.innerHTML = text;
}

function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}
