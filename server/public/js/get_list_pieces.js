//Fonction pour creer une nouvelle piece
function piecesConstructor(type, color, sizex, sizey){
    this.type=type;
    this.color=color;
    this.sizex=sizex;
    this.sizey=sizey;
}

window.addEventListener("load",function(){
    load_pieces();
}, false);

//Envoie la requete pour recuperer les pieces et remplit la liste des pieces possibles grace au constructeur plus haut.
function load_pieces(){
    edit=0;
    info('Chargement des pièces');
    var xhr = new XMLHttpRequest();
    xhr.open("GET", '/pieces', true);
    xhr.onload = function () {
	var get_pieces = JSON.parse(xhr.responseText);
	var blockselect = document.getElementById('blockselect');
	if (xhr.readyState == 4 && xhr.status == "200") {
	    console.table(get_pieces);
	    var i=0;
	    for (piece in get_pieces)
	    {
		pieces.push(new piecesConstructor(get_pieces[piece].type, get_pieces[piece].color, get_pieces[piece].sizex, get_pieces[piece].sizey));
		blockselect.innerHTML += '<option value="'+i+'">'+get_pieces[piece].sizex+'x'+get_pieces[piece].sizey+'</option>';
		i++;
	    }
	} else {
	    console.error(pieces);
	}
    }	
    xhr.send();

    info('');	
    edit=1;
}
