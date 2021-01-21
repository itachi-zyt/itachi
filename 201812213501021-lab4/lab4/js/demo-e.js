"use strict";
const { vec3, vec4, mat4 } = glMatrix; //定义常量（省略glMatrix）
var canvas;
var gl;
var kind; //图形种类
var cirkind; //圆内种类
var points=[]; 
var colors=[];
var cirpoints = []; //圆的点
var circolors = []; 
//triangle
var Tran_triangle = []; //三角形
//square
var Tran_square = []; //正方形
//cube
var Tran_cube = []; //立方体
//
var Tran_circle=[]; //圆
//
var TranLoc; //鼠标的位置
//------------------------------
var theta = [0,0,0]; //三轴
var thetaLoc; 

var translate=[]; //圆运动的速率
var direction=[]; //圆运动的方向

var scale = 0; //三角形的大小
var scaleLoc; 
//------------------------------
var num; //圆的边数
var rgbHex = []; //传递圆的颜色
function clearAll(){
	Tran_triangle = [];
	Tran_square = [];
	Tran_cube = [];
	Tran_circle=[];
}
		
 function init(){
	canvas = document.getElementById("canvas");
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) {alert("WebGL isn't available");}
	kind=0;
	cirkind=0;
	makeTriangle();
	makeSquare();
	makeCube();
	//
	samepart();
	//
	canvas.addEventListener("mousedown", function(event){
		var rect = canvas.getBoundingClientRect(); //读取画布全部信息
		var cx = event.clientX - rect.left; //
		var cy = event.clientY - rect.top; // 
		var t = glMatrix.vec3.fromValues(2 * cx / canvas.width - 1,2 * (canvas.height - cy) / canvas.height - 1,0); //得到鼠标位置
		if(kind==0)Tran_triangle.push(t);
		else if(kind==1)Tran_square.push(t);
		else if(kind==2)Tran_cube.push(t);
		else if(kind==3){
			Tran_circle.push(t);direction.push([1.0,1.0,1.0]);
			translate.push([1.0/60.0,1.0/60.0,1.0/60.0]);makeCircle();
		}
	});
	render();
}
function samepart(){	
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(0.0, 0.0, 0.0, 0.0);
	
	gl.enable(gl.DEPTH_TEST);
	
	var program = initShaders(gl, "v-shader", "f-shader");
	gl.useProgram(program);
	
	TranLoc = gl.getUniformLocation(program, "tran");
	scaleLoc = gl.getUniformLocation( program, "scale" );
	thetaLoc = gl.getUniformLocation( program, "theta");

	
	var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points.concat(cirpoints)), gl.STATIC_DRAW);
	
	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);
	
	var cBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors.concat(circolors)), gl.STATIC_DRAW);
	
	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);
}
window.onload = init;
function render(){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	scale+=1.0/60.0;
	theta[0]+=1.0/60.0;
	theta[1]+=1.0/60.0;
	theta[2]+=1.0/60.0;
	
	renderTriangle();
	renderSquare();
	renderCube();
	renderCircle();
	requestAnimFrame(render);
}
function renderTriangle(){
	for(var i=0;i<Tran_triangle.length;i++){
		gl.uniform1f( scaleLoc, scale ); 
		gl.uniform3fv(thetaLoc,[0,0,0]);

		gl.uniform3fv(TranLoc, Tran_triangle[i]);
		gl.drawArrays( gl.TRIANGLES, 0, 3);
	}
}
function renderSquare(){
	for(var i=0;i<Tran_square.length;i++){
		gl.uniform1f( scaleLoc, 0);
		gl.uniform3fv(thetaLoc, [0,0,theta[2]]);

		gl.uniform3fv(TranLoc, Tran_square[i]);
		gl.drawArrays( gl.TRIANGLE_STRIP, 3, 4);
	}
}
function renderCube(){
	for(var i=0;i<Tran_cube.length;i++){
		gl.uniform1f( scaleLoc, 0);
		gl.uniform3fv(thetaLoc, theta);

		gl.uniform3fv(TranLoc, Tran_cube[i]);
		gl.drawArrays( gl.TRIANGLES, 7, 36);
	}
}
function renderCircle(){
	for(var i=0;i<Tran_circle.length;i++){
		gl.uniform1f( scaleLoc, 0);
		gl.uniform3fv(thetaLoc, [0,0,0]);
		for(var j=0;j<3;j++){
			Tran_circle[i][j]+=direction[i][j]*Math.sin(translate[i][j])/4;
			if(Tran_circle[i][j]>1)direction[i][j]=-direction[i][j];
			else if(Tran_circle[i][j]<-1)direction[i][j]=-direction[i][j];
		}
		
		gl.uniform3fv(TranLoc, Tran_circle[i]);
		gl.drawArrays( gl.TRIANGLE_FAN, 43, num);
	}
}

function makeTriangle(){
	points.push( 0.0000,  0.18856, 0.0 );
	points.push(-0.1633, -0.09428, 0.0 );
	points.push( 0.1633, -0.09428, 0.0 );
	for(var i=0;i<3;i++)colors.push( 1.0 , 0.0, 1.0 , 1.0 );
}
function makeSquare(){
	points.push( 0.0,  0.4,  0.0 );
	points.push(-0.4,  0.0,  0.0 );
	points.push( 0.4,  0.0,  0.0 );
	points.push( 0.0 ,-0.4,  0.0 );
	for(var i=0;i<4;i++)colors.push( 0.0 , 0.0 , 1.0 , 1.0 );
}
function makeCube(){
	var vert1 = vec4.fromValues( -0.3, -0.3,  0.3,  2.0 );
	var vert2 = vec4.fromValues( -0.3,  0.3,  0.3,  2.0 );
	var vert3 = vec4.fromValues(  0.3,  0.3,  0.3,  2.0 );
	var vert4 = vec4.fromValues(  0.3, -0.3,  0.3,  2.0 );
	var vert5 = vec4.fromValues( -0.3, -0.3, -0.3,  2.0 );
	var vert6 = vec4.fromValues( -0.3,  0.3, -0.3,  2.0 );
	var vert7 = vec4.fromValues(  0.3,  0.3, -0.3,  2.0 );
	var vert8 = vec4.fromValues(  0.3, -0.3, -0.3,  2.0 );

	var vertices = [
		vert1, vert2, vert3, vert4, vert5, vert6, vert7, vert8 
	];

	var vcol1 = vec4.fromValues( 1.0, 0.0, 0.0, 1.0 );
	var vcol2 = vec4.fromValues( 1.0, 0.0, 0.0, 1.0 );
	var vcol3 = vec4.fromValues( 1.0, 1.0, 1.0, 1.0 );
	var vcol4 = vec4.fromValues( 1.0, 1.0, 1.0, 1.0 );
	var vcol5 = vec4.fromValues( 1.0, 0.0, 1.0, 1.0 );
	var vcol6 = vec4.fromValues( 1.0, 0.0, 1.0, 1.0 );
	var vcol7 = vec4.fromValues( 1.0, 1.0, 1.0, 1.0 );
	var vcol8 = vec4.fromValues( 1.0, 1.0, 1.0, 1.0 );

	var vertexColors = [
		vcol1, vcol2, vcol3, vcol4, vcol5, vcol6, vcol7, vcol8
	];

	var faces = [
		1, 0, 3, 1, 3, 2, //正
		2, 3, 7, 2, 7, 6, //右
		3, 0, 4, 3, 4, 7, //底
		6, 5, 1, 6, 1, 2, //顶
		4, 5, 6, 4, 6, 7, //背
		5, 4, 0, 5, 0, 1  //左
	];

	for( var i = 0; i < faces.length; i++ ){
		points.push( vertices[faces[i]][0], vertices[faces[i]][1], vertices[faces[i]][2] );

		colors.push( vertexColors[Math.floor(i/6)][0], vertexColors[Math.floor(i/6)][1], vertexColors[Math.floor(i/6)][2], vertexColors[Math.floor(i/6)][3]  );
	}
}

function makeCircle(){
	num = document.getElementById("circle_shape").value;
	cirpoints = [];
	circolors = [];
	var angle = 0; 
	var stepAngle = 360/num * (Math.PI/180);
	for(var i=0; i<=num; i++){
		cirpoints.push( 0.3 * Math.cos(angle),0.3 * Math.sin(angle),0);
		circolors.push( 0.0 , 0.0 , 0.0 , 1.0 );
		angle += stepAngle;
	}
	samepart();		
}