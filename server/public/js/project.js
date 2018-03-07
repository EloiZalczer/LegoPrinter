function Project(){

    //Properties
    this.mode = 0;
    this.model = undefined;
    this.current_color = "000000";
    
    //Methods
    function create_model(sizex, sizey){
	this.model = new Model(sizex, sizey);
    }
}

function Model(sizex, sizey){

    //Properties
    this.layout = {height: sizey, width: sizex, layers: 0}
    this.current_layer = 1;
    this.placedPieces = new Array();
    this.canvas_background = undefined;
    this.canvas_overlay = new undefined;
    this.layers_canvas = new Array();
    this.canvas_layout = undefined;
    
    //Methods
    function add_layer(canvas, context){
	layers_canvas.push(new Canvas(canvas, context, this.layout));
	this.layout.layers++;
    }

    function get_layers(){
	var canvas_layout = document.getElementById('layout_canvas');
	var context_layout = layout_canvas.getContext('2d');

	var canvas_overlay = document.getElementById('overlay');
	var context_overlay = canvas_overlay.getContext('2d');

	var canvas_background = document.getElementById('background');
	var context_background = canvas_background.getContext('2d');

	this.canvas_layout = new Canvas(canvas_layout, context_layout, this.layout);

	this.canvas_background = new Canvas(canvas_background, context_background, this.layout);

	this.canvas_overlay = new Canvas(canvas_overlay, context_overlay, this.layout);
    }
    
    function display_layout(){
	var radius = this.canvas_layout.height/(layout.height*8);
	var centerY = 0;
	var centerX = 0;
	
	context_background.fillStyle = "gray";
	context_background.fillRect(0, 0, this.canvas_layout.width, this.canvas_layout.height);
	
	for( i = 0; i < layout.height; i++){
		centerY = this.canvas_layout.height/(layout.height*2)+i*(this.canvas_layout.height/layout.height);
		for( j = 0; j < layout.width; j++){
			centerX = this.canvas_layout.width/(layout.width*2)+j*(this.canvas_layout.width/layout.width);
			this.canvas_layout.context.beginPath();
			this.canvas_layout.context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
			this.canvas_layout.context.stroke();
			this.canvas_layout.context.closePath();
		}
	}
    }

    function mouse_hover(e){
	this.canvas_overlay.context.clearRect(0, 0, this.canvas_overlay.width, this.canvas_overlay.height);
	if(pos.x<this.canvas_layout.width && pos.x>0 && pos.y<this.canvas_layout.height && pos.y>0){
	    if(mode==0){
		this.mouse_hover_add(e);
	    }
	    else if(mode==1){
		this.mouse_hover_remove(e);
	    }
	}
    }

    function mouse_hover_add(e){
	var pos = getMousePos(e);
	this.canvas_overlay.context.fillStyle = "#000000";
	params = getBlockParams(pos.x, pos.y);
	this.canvas_overlay.context.fillRect(params.posx, params.posy, (this.canvas_layout.width/layout.width)*params.sizex, (this.canvas_layout.height/layout.height)*params.sizey);
    }

    function mouse_hover_remove(e){
	var pos = getMousePos(e);
	var params = placedBlockParams(pos.x, pos.y);
	if(params!=0){
		this.canvas_overlay.context.fillStyle = "#000000";
		this.canvas_overlay.context.fillRect(params.posx, params.posy, (this.canvas_layout.width/layout.width)*params.sizex, (this.canvas_layout.height/layout.height)*params.sizey);
	}
    }

    function getMousePos(e){
	var rect = this.canvas_layout.canvas.getBoundingClientRect(), // abs. size of element
	    scaleX = this.canvas_layout.width / rect.width,    // relationship bitmap vs. element for X
	    scaleY = this.canvas_layout.height / rect.height;  // relationship bitmap vs. element for Y
	
	return {
	    x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
	    y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
	}
    }
    
}

function Canvas(canvas, context, layout){

    //Properties
    this.canvas = canvas;
    this.context = context;
    this.width = canvas.width;
    this.height = canvas.height;

    //Methods
    this
}

function Piece(){
    
}
