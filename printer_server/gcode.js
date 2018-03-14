module.exports = {
	generate: generate
};

const pos_reservoir = {x: 100, y: 100, z: 0};

var gcode="";

function generate(data){

	gcode = "G28\n";

	var coord_head = {x: 0, y: 0, z: 0};
	for(let piece in data){

		var reservoir = data[piece].container;
		var posx = data[piece].posx-data[piece].posx%30+15;
		var posy = data[piece].posy-data[piece].posy%30+15;
		var posz = data[piece].posz-data[piece].posz%30+15;

		coord_head.x+=20;
		gcode+="G0 Z20\n";
		gcode+="G0 ";
		
		coord_head.x = pos_reservoir.x-coord_head.x+reservoir*14;
		if(coord_head.x!=0){
			gcode+="X"+coord_head.x;
		}
		coord_head.y = pos_reservoir.y-coord_head.y;
		if(coord_head.y!=0){ 
                        gcode+=" Y"+coord_head.y;
                }

		gcode +="\n";

		coord_head.z = pos_reservoir.z-coord_head.z;
		if(coord_head.z!=0){ 
                        gcode+="G0 Z"+coord_head.z+"\n";
                }

		coord_head.z = 20-coord_head.z;
		if(coord_head.z!=0){
                        gcode+="G0 Z"+coord_head.z+"\n";
                }

		gcode += "G0 ";

		coord_head.x = posx-coord_head.x;
		if(coord_head.x!=0){
                        gcode+="X"+coord_head.x;
                }

		coord_head.y = posy-coord_head.y;
		if(coord_head.y!=0){
                        gcode+=" Y"+coord_head.y+"\n";
                }

		coord_head.z = posz-coord_head.z;
		if(coord_head.z!=0){
                        gcode+="G0 Z"+coord_head.z+"\n";
                }

		coord_head.x = coord_head.x+10;
		gcode+="G0 X10\n";

	}

	console.log(gcode);

}
