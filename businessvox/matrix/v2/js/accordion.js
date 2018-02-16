var margin = {top: 100, right: 50, bottom: 80, left: 50};
var width = Math.max(960, window.innerWidth - margin.left - margin.right);
var height = Math.max(500, window.innerHeight - margin.top - margin.bottom);

// Distorsion
var distorsion = 0;
var distorsionselectedcovers = 0;
var distorsionfactor = 0.15;
function distorsionin(arraylength){ return d3.interpolateNumber(0, arraylength * distorsionfactor) };
function distorsionout(arraylength) { return d3.interpolateNumber(arraylength * distorsionfactor, 0) };

var mouseX = 0;
var mouseY = 0;
var canvasheight = 300;
var url = 'http://static.cyberlibris.fr/books_upload/300pix/';

var books = {};
var datacolorassoc = {};
var distmat = {};
var distmatvalues = {};
var selectedsimilardocid = [];
var selectedcovers = [];
var currentbookselected = [];

var canvasselectedcovers = d3
	.select('body')
	.append('div')
	.attr('id', 'canvasselectedcovers')
	.append('canvas')
	.attr('id', 'canvasselected')
	.attr('width', width)
	.attr('height', canvasheight);

var canvasselectedcovershidden = d3
	.select('#canvasselectedcovers')
	.append('canvas')
	.attr('id', 'canvasselectedhidden')
	.attr('width', width)
	.attr('height', canvasheight);

var canvas = d3
	.select('body')
	.append('div')
	.attr('id', 'divcanvas')
	.append('canvas')
	.attr('id', 'canvas')
	.attr('width', width)
	.attr('height', canvasheight);

var canvashidden = d3
	.select('#divcanvas')
	.append('canvas')
	.attr('id', 'canvashidden')
	.attr('width', width)
	.attr('height', canvasheight);

var canvasvalues = d3
	.select('#divcanvas')
	.append('canvas')
	.attr('id', 'canvasvalues')
	.attr('width', width)
	.attr('height', canvasheight);

// TOP CANVAS
var contextofselecetedcovers = canvasselectedcovers.node().getContext("2d");
contextofselecetedcovers.strokeStyle = 'rgb(20, 30, 40)';
var hiddencontextofselecetedcovers = canvasselectedcovershidden.node().getContext("2d");

// BOTTOM CANVAS
var context = canvas.node().getContext("2d");
context.strokeStyle = 'rgb(20, 30, 40)';
var hiddencontext = canvashidden.node().getContext("2d");
var valuescontext = canvasvalues.node().getContext("2d");


d3.json('data4.json', function(err, data) {
	console.log(data);
	
	data.books.docid.map(function(d, i){
		var col = generatecolor();
		datacolorassoc[col] = d;
		datacolorassoc[d] = col;
		books[d] = data.books.cover[i];
	});

	entrydocid = data.entrydocid;
	selectedsimilardocid = data.entrydocid;
	
	data.docid.map(function(d, i){
		distmat[d] = data.simdocid[i];
		distmatvalues[d] = data.simvalues[i];
	});
	console.log(distmatvalues);
	d3
	.select('#title')
	.on('click', function(){
		selectedsimilardocid = entrydocid;
		currentbookselected = [];
		valuescontext.clearRect(0, 0, width, canvasheight);
		draw();
	});

	draw();
	//drawhidden();
});


function draw(){

	selectedsimilardocid.map(function(d, i){
		var nbook = i;
		var a = fisheye(i * width / selectedsimilardocid.length, distorsion);
		var b = fisheye((i + 1) * width / selectedsimilardocid.length, distorsion);
		var picheight = canvasheight;
		
		var cover = new Image();
		
		cover.onerror = function() {
			var picwidth = picheight;

			context.beginPath();
			context.fillStyle = 'rgb(20, 30, 40)';
			context.rect(a, 0, b - a, picheight);
			context.fill();
		};
		cover.onabort = function() {console.log("abort")};
		cover.onload = function(){	
			var picwidth = picheight * cover.width / cover.height;

			context.save();
			context.beginPath();
			context.rect(a, 0, b - a, picheight);
			context.lineWidth = Math.max(3, ((b - a) - picwidth));
			context.stroke();
			context.clip();
			context.drawImage(cover, a - ((picwidth - (b - a)) / 2), 0, picwidth, picheight);
			context.restore();

			if (mouseX > a & mouseX < b & currentbookselected.length != 0) { drawvalues(a, nbook) };
			if (distorsion == 0) { valuescontext.clearRect(0, 0, width, canvasheight) };
		};
		cover.src = url + books[d];
	});
};

function drawhidden(){
	selectedsimilardocid.map(function(d, i){
		var a = fisheye(i * width / selectedsimilardocid.length, distorsion);
		var b = fisheye((i + 1) * width / selectedsimilardocid.length, distorsion);
		var picheight = canvasheight;

		hiddencontext.beginPath();
		hiddencontext.fillStyle = datacolorassoc[d];
		hiddencontext.rect(a, 0, b - a, picheight);
		hiddencontext.fill();
	});
};

function drawselectedcovers(){
	if (selectedcovers.length == 0) { contextofselecetedcovers.clearRect(0, 0, width, canvasheight); }
	else {
		selectedcovers.map(function(d, i){
			var a = fisheye(i * width / selectedcovers.length, distorsionselectedcovers);
			var b = fisheye((i + 1) * width / selectedcovers.length, distorsionselectedcovers);
			var picheight = canvasheight;
			
			var cover = new Image();
			
			cover.onerror = function() {
				var picwidth = picheight;

				contextofselecetedcovers.beginPath();
				contextofselecetedcovers.fillStyle = 'black';
				contextofselecetedcovers.rect(a, 0, b - a, picheight);
				contextofselecetedcovers.fill();
			};
			cover.onabort = function() {console.log("abort")};
			cover.onload = function(){	
				var picwidth = picheight * cover.width / cover.height;

				contextofselecetedcovers.save();
				contextofselecetedcovers.beginPath();
				contextofselecetedcovers.rect(a, 0, b - a, picheight);
				contextofselecetedcovers.lineWidth = Math.max(3, ((b - a) - picwidth));
				contextofselecetedcovers.stroke();
				contextofselecetedcovers.clip();
				contextofselecetedcovers.drawImage(cover, a - ((picwidth - (b - a)) / 2), 0, picwidth, picheight);
				contextofselecetedcovers.restore();
			};
			cover.src = url + books[d];
		});
	};
};

function drawhiddenselectedcovers(){
	selectedcovers.map(function(d, i){
		var a = fisheye(i * width / selectedcovers.length, distorsionselectedcovers);
		var b = fisheye((i + 1) * width / selectedcovers.length, distorsionselectedcovers);
		var picheight = canvasheight;

		hiddencontextofselecetedcovers.beginPath();
		hiddencontextofselecetedcovers.fillStyle = datacolorassoc[d];
		hiddencontextofselecetedcovers.rect(a, 0, b - a, picheight);
		hiddencontextofselecetedcovers.fill();
	});
};

function drawvalues(x, n){
	valuescontext.clearRect(0, 0 , width, canvasheight);
	valuescontext.font = '4em newyorker';
	valuescontext.fillStyle = 'rgba(256, 256, 256, 1)';
	valuescontext.textAlign = 'left';
	valuescontext.fillText(distmatvalues[currentbookselected][n], x + 5, canvasheight - 20);
};

canvasvalues
	.on('touchstart mouseenter', function(){
		canvas
			.transition()
			.duration(500)
			.tween('', function(){
				return function(t){
					distorsion = distorsionin(selectedsimilardocid.length)(t);
					draw();
				}
			});
	})
	.on('touchmove mousemove', function(){
		mouseX = d3.mouse(this)[0];
		draw();

	})
	.on('touchend mouseleave', function(){
		canvas
			.transition()
			.duration(500)
			.tween('', function(){
				return function(t){
					distorsion = distorsionout(selectedsimilardocid.length)(t);
					draw();
				}
			});
	})
	.on('click', function(){
		
		// RETRIEVE THE CURRENT AUTHOR SELECTION
		drawhidden();
		mouseX = d3.mouse(this)[0];
		mouseY = d3.mouse(this)[1];
		var col = hiddencontext.getImageData(mouseX, mouseY, 1, 1).data;
		var colString = "rgb(" + col[0] + "," + col[1] + ","+ col[2] + ")";

		hiddencontext.clearRect(0, 0, width, canvasheight);
		//

		// INSERT THE SELECTED COVER INTO THE ARRAY OF SELECTED COVERS
		selectedcovers.push(datacolorassoc[colString]);
		drawselectedcovers();

		/*// NEW ARRAY OF DOCID
		selectedsimilardocid = distmat[datacolorassoc[colString]];
		draw();*/
	});

canvasselectedcovers
	.on('touchstart mouseenter', function(){
		canvasselectedcovers
			.transition()
			.duration(500)
			.tween('', function(){
				return function(t){
					distorsionselectedcovers = distorsionin(selectedcovers.length)(t);
					drawselectedcovers();
				}
			});
	})
	.on('touchmove mousemove', function(){
		mouseX = d3.mouse(this)[0];
		drawselectedcovers();

	})
	.on('touchend mouseleave', function(){
		canvasselectedcovers
			.transition()
			.duration(500)
			.tween('', function(){
				return function(t){
					distorsionselectedcovers = distorsionout(selectedcovers.length)(t);
					drawselectedcovers();
				}
			});
	})
	.on('click', function(){
		
		// RETRIEVE THE CURRENT AUTHOR SELECTION
		drawhiddenselectedcovers();
		mouseX = d3.mouse(this)[0];
		mouseY = d3.mouse(this)[1];
		var col = hiddencontextofselecetedcovers.getImageData(mouseX, mouseY, 1, 1).data;
		var colString = "rgb(" + col[0] + "," + col[1] + ","+ col[2] + ")";
		currentbookselected = datacolorassoc[colString];
		hiddencontextofselecetedcovers.clearRect(0, 0, width, canvasheight);
		//

		// NEW ARRAY OF DOCID
		selectedsimilardocid = distmat[currentbookselected];
		draw();
	})
	.on('dblclick', function(){
		// RETRIEVE THE CURRENT AUTHOR SELECTION
		drawhiddenselectedcovers();
		mouseX = d3.mouse(this)[0];
		mouseY = d3.mouse(this)[1];
		var col = hiddencontextofselecetedcovers.getImageData(mouseX, mouseY, 1, 1).data;
		var colString = "rgb(" + col[0] + "," + col[1] + ","+ col[2] + ")";

		hiddencontextofselecetedcovers.clearRect(0, 0, width, canvasheight);
		//REMOVE SELECTED BOOK FROM THE SELECTED COVERS ARRAY
		selectedcovers.splice(selectedcovers.indexOf(datacolorassoc[colString]), 1);
		drawselectedcovers();

	});


function fisheye(x, disto){
	var left = x < mouseX;

	var min = 0;
	var max = width;

	var offset = left ? mouseX - min : max - mouseX;
	if (offset == 0) offset = max - min;
	return (left ? -1 : 1) * offset * (disto + 1) / (disto + (offset / Math.abs(x - mouseX))) + mouseX;
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

		nextCol += 1; // 100 is exagerated for this example and would ordinarily be 1.
	}
	var col = "rgb(" + ret.join(',') + ")";
	return col;
};
