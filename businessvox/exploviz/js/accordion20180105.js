var margin = {top: 100, right: 50, bottom: 80, left: 50};
var width = Math.max(960, window.innerWidth - margin.left - margin.right);
var height = Math.max(500, window.innerHeight - margin.top - margin.bottom);

// Distorsion
var distorsion = 0;
var distorsionselectedcovers = 0;
var distorsionfactor = 0.1;

function distorsionin(arraylength){ return d3.interpolateNumber(0, (arraylength * distorsionfactor < 1) ? 0 : arraylength * distorsionfactor) };
function distorsionout(arraylength) { return d3.interpolateNumber((arraylength * distorsionfactor < 1) ? 0 : arraylength * distorsionfactor, 0) };

function mousexin(newmouseposition){ return d3.interpolateNumber(1, newmouseposition) };
function mousexout() { return d3.interpolateNumber(mouseX, 1) };

var mouseX = 0;
var mouseY = 0;
var selectedmouseX = 0;
var canvasheight = 230;
var pictoheight = 80;
var pictoradius = pictoheight / 2;
var goodcoverslength = 0;
var tempcount = 0;
var url = 'http://static.cyberlibris.fr/books_upload/300pix/';

var books = {};
var datacolorassoc = {};
var distmat = {};
var distmatvalues = {};
var selectedsimilardocid = [];
var selectedcovers = [];
var currentbookselected = [];
var erroredcovers = [];

var entrykey = {'pictogourous' : 'entrydocid1', 'pictoother' : 'entrydocid2'};

var picto = d3
	.select('body')
	.append('svg')
	.attr('width', width)
	.attr('height', pictoheight);

var pictopattern = picto
	.append('g')
	.attr('id', 'pictopattern');

pictopattern
	.selectAll('.picto')
	.data(Object.keys(entrykey))
	.enter()
	.append('pattern')
	.attr('class', 'picto')
	.attr('id', function(d){ return d })
	.attr('width', '100%')
	.attr('height', '100%')
	.attr('viewBox', '0 0 1 1')
	.attr('preserveAspectRatio', 'xMidYMid slice')
	.attr('patternContentUnits', 'objectBoundingBox')
	.append('image')
	.attr("xlink:href", function(d){ return 'images/' + d + '.jpg'; })
	.attr("width", 1)
	.attr("height", 1)
	.attr("preserveAspectRatio", "xMidYMid slice");

var pastille = picto
	.selectAll('cirle')
	.data(Object.keys(entrykey))
	.enter()
	.append('circle')
	.attr('cx', function(d, i){ return pictoradius + (i * (2 * pictoradius + 10)) })
	.attr('cy', pictoheight / 2)
	.attr('r', pictoradius)
	.attr('fill', function(d) { return 'url(#' + d + ')'; });

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
	.attr('height', canvasheight)
	.style('left', function(){ return canvas.node().offsetLeft + "px" });

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
	.attr('height', canvasheight)
	.style('left', function(){ return canvasselectedcovers.node().offsetLeft + "px" });

// TOP CANVAS
var context = canvas.node().getContext("2d");
context.strokeStyle = 'rgb(30, 40, 50)';
var hiddencontext = canvashidden.node().getContext("2d");

// BOTTOM CANVAS
var contextofselecetedcovers = canvasselectedcovers.node().getContext("2d");
contextofselecetedcovers.strokeStyle = 'rgb(30, 40, 50)';
var hiddencontextofselecetedcovers = canvasselectedcovershidden.node().getContext("2d");


d3.json('data5.json', function(err, data) {
	console.log(data);
	
	data.books.docid.map(function(d, i){
		var col = generatecolor();
		datacolorassoc[col] = d;
		datacolorassoc[d] = col;
		books[d] = data.books.cover[i];
	});
	
	data.docid.map(function(d, i){
		distmat[d] = data.simdocid[i];
		distmatvalues[d] = data.simvalues[i];
	});
	
	pastille
		.on('click', function(d){
			var entryname = entrykey[d];
			console.log(entryname);

			selectedsimilardocid = data[entrykey[d]];
			distorsion = selectedsimilardocid.length * distorsionfactor;
			mouseX = 0;
			drawprep();
		});

	drawprep();
	//drawhidden();
});

function drawprep(){
	erroredcovers.length = 0;
	tempcount = 0;

	selectedsimilardocid.map(function(d, i){
		var cover = new Image();
		cover.onerror = function(){
			erroredcovers.push(d);
			tempcount += 1;
			(tempcount == selectedsimilardocid.length) ? draw() : null;
		};
		cover.onload = function(){
			tempcount += 1;
			(tempcount == selectedsimilardocid.length) ? draw() : null;
		};
		cover.src = url + books[d];
	});
};

function draw(){
	goodcoverslength = selectedsimilardocid.length - erroredcovers.length;
	selectedsimilardocid
		.filter(function(d){ return !erroredcovers.includes(d); })
		.map(function(d, i){
			var nbook = i;
			var a = fisheye(i * width / goodcoverslength, distorsion, mouseX);
			var b = fisheye((i + 1) * width / goodcoverslength, distorsion, mouseX);
			var picheight = canvasheight;
			
			var cover = new Image();
			
			cover.onerror = function() {
				console.log('error');
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
			};
			cover.src = url + books[d];
		});
};

function drawhidden(){
	selectedsimilardocid
		.filter(function(d){ return !erroredcovers.includes(d); })
		.map(function(d, i){
			var a = fisheye(i * width / goodcoverslength, distorsion, mouseX);
			var b = fisheye((i + 1) * width / goodcoverslength, distorsion, mouseX);
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
			var a = fisheye(i * width / selectedcovers.length, distorsionselectedcovers, selectedmouseX);
			var b = fisheye((i + 1) * width / selectedcovers.length, distorsionselectedcovers, selectedmouseX);
			var picheight = canvasheight;
			
			var cover = new Image();
			
			cover.onerror = function(){
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
		var a = fisheye(i * width / selectedcovers.length, distorsionselectedcovers, selectedmouseX);
		var b = fisheye((i + 1) * width / selectedcovers.length, distorsionselectedcovers, selectedmouseX);
		var picheight = canvasheight;

		hiddencontextofselecetedcovers.beginPath();
		hiddencontextofselecetedcovers.fillStyle = datacolorassoc[d];
		hiddencontextofselecetedcovers.rect(a, 0, b - a, picheight);
		hiddencontextofselecetedcovers.fill();
	});
};

canvas
	.on('touchstart mouseenter', function(){
		if(selectedsimilardocid.length > 0)
		var newmouseX = d3.mouse(this)[0];
		canvas
			.transition()
			.duration(150)
			.ease(d3.easeQuadInOut)
			.tween('', function(){
				return function(t){
					mouseX = mousexin(newmouseX)(t);
					draw();
				}
			});
	})
	.on('touchmove mousemove', function(){
		if(selectedsimilardocid.length > 0)
		mouseX = d3.mouse(this)[0];
		draw();

	})
	.on('mouseleave', function(){
		if(selectedsimilardocid.length > 0)
		canvas
			.transition()
			.duration(750)
			.ease(d3.easeQuadInOut)
			.tween('', function(){
				return function(t){
					mouseX = mousexout()(t);
					draw();
				}
			});
	})
	.on('click', function(){
		if(selectedsimilardocid.length > 0)
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
	});

canvasselectedcovers
	.on('touchstart mouseenter', function(){
		if(selectedcovers.length > 0)
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
		if(selectedcovers.length > 0)
		selectedmouseX = d3.mouse(this)[0];
		drawselectedcovers();
	})
	.on('touchend mouseleave', function(){
		if(selectedcovers.length > 0)
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
		if(selectedcovers.length > 0)
		// RETRIEVE THE CURRENT AUTHOR SELECTION
		drawhiddenselectedcovers();
		selectedmouseX = d3.mouse(this)[0];
		mouseY = d3.mouse(this)[1];
		var col = hiddencontextofselecetedcovers.getImageData(selectedmouseX, mouseY, 1, 1).data;
		var colString = "rgb(" + col[0] + "," + col[1] + ","+ col[2] + ")";
		currentbookselected = datacolorassoc[colString];
		hiddencontextofselecetedcovers.clearRect(0, 0, width, canvasheight);
		//

		// NEW ARRAY OF DOCID
		selectedsimilardocid = distmat[currentbookselected];
		distorsion = selectedsimilardocid.length * distorsionfactor;
		mouseX = 0;
		drawprep();
	})
	.on('dblclick', function(){
		if(selectedcovers.length > 0)
		// RETRIEVE THE CURRENT AUTHOR SELECTION
		drawhiddenselectedcovers();
		selectedmouseX = d3.mouse(this)[0];
		mouseY = d3.mouse(this)[1];
		var col = hiddencontextofselecetedcovers.getImageData(selectedmouseX, mouseY, 1, 1).data;
		var colString = "rgb(" + col[0] + "," + col[1] + ","+ col[2] + ")";

		hiddencontextofselecetedcovers.clearRect(0, 0, width, canvasheight);
		//REMOVE SELECTED BOOK FROM THE SELECTED COVERS ARRAY
		selectedcovers.splice(selectedcovers.indexOf(datacolorassoc[colString]), 1);
		drawselectedcovers();

	});


function fisheye(x, disto, mouseXcoord){
	var left = x < mouseXcoord;

	var min = 0;
	var max = width;

	var offset = left ? mouseXcoord - min : max - mouseXcoord;
	if (offset == 0) offset = max - min;
	return (left ? -1 : 1) * offset * (disto + 1) / (disto + (offset / Math.abs(x - mouseXcoord))) + mouseXcoord;
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
