var infos;

window.addEventListener("load",function(){
    infos = document.getElementById('infos');    
}, false);

//Fonction info : permet d'afficher des informations a l'utilisateur dans le cadre en haut a droite
function info(text){
    infos.innerHTML = text;
}

//Fonction hasDuplicates : renvoie 1 si un tableau contient des doublons et 0 sinon
function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}
