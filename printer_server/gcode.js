module.exports = {
	generate: generate
};

const pos_reservoir = {x: 5.7, y: 135.5, z: 3};
function generate(data){

	var gcode = new Array();
    gcode.push("G28 Y\r\n");
    gcode.push("G28 XZ\r\n");
    gcode.push("G90\r\n");
	//gcode.push("M114\r\n");

	var offset={x: 34, y: 4};
	var coord_head = {x: 0, y: 0, z: 0};
	for(let piece in data){

		console.log("Data : "+data[piece]+" at piece : "+piece+"\r\n");

		var reservoir = data[piece].container-1;
		var posx = (data[piece].posx/30)*16.2+offset.x;
		var posy = (data[piece].posy/30)*16.2+offset.y;
	    var posz = data[piece].posz;

		coord_head.z+=15;
		gcode.push("G0 Z15\r\n");
		var newline="G0 ";
		
		coord_head.x = pos_reservoir.x;
		newline+="X"+coord_head.x;
		coord_head.y = pos_reservoir.y+reservoir*26;
                newline+=" Y"+coord_head.y+"\n\r";

	    gcode.push(newline);

		coord_head.z = pos_reservoir.z; 
                gcode.push("G0 Z"+coord_head.z+"\r\n");

		coord_head.z = 15;
                gcode.push("G0 Z"+coord_head.z+"\r\n");

		newline = "G0 ";

		coord_head.x = posx;
                newline+="X"+coord_head.x;

		coord_head.y = posy;
                newline+=" Y"+coord_head.y+"\r\n";

		gcode.push(newline);

	    coord_head.z = posz;
	    console.log("coord_head.z : "+coord_head.z);
                gcode.push("G0 Z"+coord_head.z+"\r\n");

		coord_head.x = coord_head.x-20;
		gcode.push("G0 X"+coord_head.x+"\r\n");

	}

	console.log(gcode);

	return gcode;
}
