
function piecesConstructor(type, color, size_x, size_y){
    this.type=type;
    this.color=color;
    this.size_x=size_x;
    this.size_y=size_y;
}

window.addEventListener("load",function(){
    load_pieces();
}, false);

function load_pieces(){
    edit=0;
    info('Chargement des pièces');
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url+'/pieces', true);
    xhr.onload = function () {
	var get_pieces = JSON.parse(xhr.responseText);
	var blockselect = document.getElementById('blockselect');
	if (xhr.readyState == 4 && xhr.status == "200") {
	    console.table(get_pieces);
	    var i=0;
	    for (piece in get_pieces)
	    {
		pieces.push(new piecesConstructor(get_pieces[piece].type, get_pieces[piece].color, get_pieces[piece].size_x, get_pieces[piece].size_y));
		blockselect.innerHTML += '<option value="'+i+'">'+get_pieces[piece].size_x+'x'+get_pieces[piece].size_y+'</option>';
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
