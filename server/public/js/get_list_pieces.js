var pieces = new Array();

function piecesConstructor(type, color, size_x, size_y){
    this.type=type;
    this.color=color;
    this.size_x=size_x;
    this.size_y=size_y;
}

window.addEventListener("load",function(){
    load_pieces();
}, false);

function load_pieces(
    edit=0;
    infos=document.getElementById('infos');
    infos.innerHTML = 'Chargement des pièces';
    
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url+'/pieces', true);
    xhr.onload = function () {
	var pieces = JSON.parse(xhr.responseText);
	var blockselect = document.getElementById('blockselect');
	if (xhr.readyState == 4 && xhr.status == "200") {
	    console.table(pieces);
	    var i=0;
	    for piece in pieces{
		pieces.push(new piecesConstructor(piece.type, piece.color, piece.size_x, piece.size_y));
		blockselect.innerHTML += 'option value="'+i+'">'+piece.size_x+'x'+piece.size_y+'</option>';
	    }
	} else {
	    console.error(pieces);
	}
    }

    edit=1;
)
