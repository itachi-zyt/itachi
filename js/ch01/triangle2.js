"use strict";

var gl;
var points;

window.onload = function init(){
	var canvas = document.getElementById( "triangle-canvas" );
	gl = WebGLUtils.setupWebGL( canvas );
	if( !gl ){
		alert( "WebGL isn't available" );
	}

	// Four Vertices
	//var vertices = [
		-0.5, -0.5,
		 0.5, -0.5,
		 0.5,  0.5,
		-0.5,  0.5
                       
	];

	// Configure WebGL
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

	// Load shaders and initialize attribute buffers
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

	// Load the data into the GPU
	//var bufferId = gl.createBuffer();
	//gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	//gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );
                   var triangleVertexPositionBuffer=gl.createBuffer();
                   gl.bindBuffer(gl.ARRAY_BUFFER,triangleVertexPositionBuffer);
                   var vertices=
                   [
                       0.0,  1.0,  0.0,
                       -1.0, -1.0,  0.0,
                       1.0,  -1.0,   0.0
                   ];
                   gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices), gl.STATIC_DRAW);
                   triangleVertexPositionBuffer.itemSize=3;
                   triangleVertexPositionBuffer.numSize=3;
                   var squareVertexPositionBuffer=gl.createBuffer();
                   gl.bindBuffer(gl.ARRAY_BUFFER,squareVertexPositionBuffer);
                   vertices=
                   [
                       1.0, 1.0, 0.0,
                       -1.0,1.0, 0.0,
                       1.0, -1.0, 0.0,
                        -1.0, -1.0, 0.0
                   ];
                   gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices), gl.STATIC_DRAW);
                   squareVertexPositionBuffer.itemSize=3;
                   squareVertexPositionBuffer.numtems=4;
                   

	// Associate external shader variables with data buffer
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );
	render();
}

function render(){
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    /*通知WebGL缓冲区中存放的顶点位置信息将被作为三角形各顶点位置信息来使用,
    每个三角形使用三个数据(三维信息)*/
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    //通知WebGL使用我们当前的模型-视图矩阵与投影矩阵
    setMatrixUniforms();
    //绘制三角形
    gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);
gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    /*通知WebGL缓冲区中存放的顶点位置信息将被作为矩形各顶点位置信息来使用,
    每个矩形使用三个数据(三维信息)*/
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    //通知WebGL使用我们当前的模型-视图矩阵与投影矩阵
    setMatrixUniforms();
    //绘制矩形
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);
	//gl.clear( gl.COLOR_BUFFER_BIT );
	//gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
	//gl.drawArrays( gl.TRIANGLES, 0, 4 );
	//gl.drawArrays( gl.TRIANGLE_STRIP, 0, 6 );
}