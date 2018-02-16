var margin = {top: 100, right: 50, bottom: 80, left: 50};
var width = Math.max(960, window.innerWidth - margin.left - margin.right);
var height = Math.max(500, window.innerHeight - margin.top - margin.bottom);

// Distorsion X
var distorsionX = 0;
var distorsionrangeX = [0, 10];
var distorsioninX = d3.interpolateNumber(distorsionrangeX[0], distorsionrangeX[1]);
var distorsionoutX = d3.interpolateNumber(distorsionrangeX[1], distorsionrangeX[0]);

// Distorsion Y
var distorsionY = 0;
var distorsionrangeY = [0, 50];
var distorsioninY = d3.interpolateNumber(distorsionrangeY[0], distorsionrangeY[1]);
var distorsionoutY = d3.interpolateNumber(distorsionrangeY[1], distorsionrangeY[0]);

var mouseX = 0;
var mouseY = 0;
var canvasYwidth = 150;
var canvasXheight = 300;
var url = 'http://static.cyberlibris.fr/books_upload/136pix/';

var books = {};
var datacolorassoc = {};
var distmat = {};
var selectedsimilardocid = [];

var canvasY = d3
	.select('body')
	.append('div')
	.attr('id', 'divY')
	.append('canvas')
	.attr('id', 'canvasY')
	.attr('width', canvasYwidth)
	.attr('height', height);

var canvashidden = d3
	.select('#divY')
	.append('canvas')
	.attr('id', 'canvashiddenY')
	.attr('width', canvasYwidth)
	.attr('height', height);

var canvasX = d3
	.select('body')
	.append('div')
	.attr('id', 'divX')
	.style('left', canvasYwidth + 'px')
	.append('canvas')
	.attr('id', 'canvasX')
	.attr('width', width)
	.attr('height', canvasXheight);

var contextY = canvasY.node().getContext("2d");
var hiddencontextY = canvashidden.node().getContext("2d");
var contextX = canvasX.node().getContext("2d");

d3.json('data3.json', function(err, data) {
	console.log(data);
	
	data.books.docid.map(function(d, i){
		books[d] = data.books.cover[i];
	});

	entrydocid = data.entrydocid;
	
	data.docid.map(function(d, i){
		distmat[d] = data.simdocid[i];
	});
	
	//DATA
	entrydocid.map(function(d){
		var col = generatecolor();
		datacolorassoc[col] = d;
		datacolorassoc[d] = col;
	});
	drawY();
	//drawhiddenY();
});

function drawX(){
	selectedsimilardocid.map(function(d, i){
		var a = fisheyeX(i * (width - canvasYwidth) / selectedsimilardocid.length);
		var b = fisheyeX((i + 1) * (width - canvasYwidth) / selectedsimilardocid.length);
		var picheight = canvasXheight;
		
		var cover = new Image();
		
		cover.onerror = function() {
			var picheight = picwidth;

			contextY.beginPath();
			contextY.fillStyle = 'black';
			contextY.rect(0, a, picwidth, b - a);
			contextY.fill();
		};
		cover.onabort = function() {console.log("abort")};
		cover.onload = function(){
			var picwidth = picheight * cover.width / cover.height;

			contextX.save();
			contextX.beginPath();
			contextX.rect(a, 0, b - a, picheight);
			contextX.lineWidth = Math.max(3, ((b - a) - picwidth));
			contextX.stroke();
			contextX.clip();
			contextX.drawImage(cover, a - ((picwidth - (b - a)) / 2), 0, picwidth, picheight);
			contextX.restore();
		};
		cover.src = url + books[d];
	});
};


function drawY(){
	entrydocid.map(function(d, i){
		var a = fisheyeY(i * height / entrydocid.length);
		var b = fisheyeY((i + 1) * height / entrydocid.length);
		var picwidth = canvasYwidth;
		
		var cover = new Image();
		
		cover.onerror = function() {
			var picheight = picwidth;

			contextY.beginPath();
			contextY.fillStyle = 'black';
			contextY.rect(0, a, picwidth, b - a);
			contextY.fill();
		};
		cover.onabort = function() {console.log("abort")};
		cover.onload = function(){	
			var picheight = picwidth * cover.height / cover.width;

			contextY.save();
			contextY.beginPath();
			contextY.rect(0, a, picwidth, b - a);
			contextY.lineWidth = Math.max(3, ((b - a) - picheight));
			contextY.stroke();
			contextY.clip();
			contextY.drawImage(cover, 0, a - ((picheight - (b - a)) / 2), picwidth, picheight);
			contextY.restore();
		};
		cover.src = url + books[d];
	});
};

function drawhiddenY(){
	entrydocid.map(function(d, i){
		var a = fisheyeY(i * height / entrydocid.length);
		var b = fisheyeY((i + 1) * height / entrydocid.length);
		var picwidth = canvasYwidth;

		hiddencontextY.beginPath();
		hiddencontextY.fillStyle = datacolorassoc[d];
		hiddencontextY.rect(0, a, picwidth, b - a);
		hiddencontextY.fill();
	});
};

canvasY
	.on('touchstart mouseenter', function(){
		d3
			.transition()
			.duration(500)
			.tween('', function(){
				return function(t){
					distorsionY = distorsioninY(t);
					drawY();
				}
			});
	})
	.on('touchmove mousemove', function(){
		mouseY = d3.mouse(this)[1];
		drawY();

	})
	.on('touchend mouseleave', function(){
		d3
			.transition()
			.duration(500)
			.tween('', function(){
				return function(t){
					distorsionY = distorsionoutY(t);
					drawY();
				}
			});
	})
	.on('click', function(){
		// RETRIEVE THE CURRENT AUTHOR SELECTION
		drawhiddenY();
		mouseX = d3.mouse(this)[0];
		mouseY = d3.mouse(this)[1];
		var col = hiddencontextY.getImageData(mouseX, mouseY, 1, 1).data;
		var colString = "rgb(" + col[0] + "," + col[1] + ","+ col[2] + ")";
		currentbook = datacolorassoc[colString];
		hiddencontextY.clearRect(0, 0, canvasYwidth, height);
		//
		
		d3
			.select('#divX')
			.style('top', function(d){ return mouseY + 'px'; });

		selectedsimilardocid = distmat[currentbook];
		drawX();
	});

canvasX
	.on('touchstart mouseenter', function(){
		d3
			.transition()
			.duration(500)
			.tween('', function(){
				return function(t){
					distorsionX = distorsioninX(t);
					drawX();
				}
			});
	})
	.on('touchmove mousemove', function(){
		mouseX = d3.mouse(this)[0];
		drawX();

	})
	.on('touchend mouseleave', function(){
		d3
			.transition()
			.duration(500)
			.tween('', function(){
				return function(t){
					distorsionX = distorsionoutX(t);
					drawX();
				}
			});
	})
	.on('click', function(){
		// RETRIEVE THE CURRENT AUTHOR SELECTION
		drawhiddenX();
		mouseX = d3.mouse(this)[0];
		mouseY = d3.mouse(this)[1];
		var col = hiddencontextX.getImageData(mouseX, mouseY, 1, 1).data;
		var colString = "rgb(" + col[0] + "," + col[1] + ","+ col[2] + ")";
		currentbook = datacolorassoc[colString];
		hiddencontextX.clearRect(0, 0, width, canvasXheight);
		//
		
		d3
			.select('#divX')
			.style('top', function(d){ return mouseY + 'px'; });

		drawX(distmat[currentbook]);
	});

function fisheyeX(x){
	var left = x < mouseX;

	var min = 0;
	var max = width;

	var offset = left ? mouseX - min : max - mouseX;
	if (offset == 0) offset = max - min;
	return (left ? -1 : 1) * offset * (distorsionX + 1) / (distorsionX + (offset / Math.abs(x - mouseX))) + mouseX;
};

function fisheyeY(x){
	var above = x < mouseY;

	var min = 0;
	var max = height;

	var offset = above ? mouseY - min : max - mouseY;
	if (offset == 0) offset = max - min;
	return (above ? -1 : 1) * offset * (distorsionY + 1) / (distorsionY + (offset / Math.abs(x - mouseY))) + mouseY;
};

//Generates the next color in the sequence, going from 0,0,0 to 255,255,255.
// Source: Yannick Assogba - https://bl.ocks.org/tafsiri/e9016e1b8d36bae56572 
var nextCol = 1;
function generatecolor(){
	var ret = [];
	// via http://stackoverflow.com/a/15804183
	if(nextCol < 16777215){
		ret.push(nextCol & 0xff); // R
		ret.push((nextCol & 0xff00) >> 8); // G 
		ret.push((nextCol & 0xff0000) >> 16); // B

		nextCol += 10; // 100 is exagerated for this example and would ordinarily be 1.
	}
	var col = "rgb(" + ret.join(',') + ")";
	return col;
};
