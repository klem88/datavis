var margin = {top: 100, right: 50, bottom: 80, left: 50};
var sidedivwidth = 300;
var width = Math.max(800, window.innerWidth - margin.left - margin.right - sidedivwidth);
var height = Math.max(400, window.innerHeight - margin.top - margin.bottom);

// Distorsion
var distorsion = 0;
var distorsionselectedcovers = 0;
var distorsionkeys = 0;
var distorsionfactor = 0.2;

function distorsionin(arraylength){ return d3.interpolateNumber(0, (arraylength * distorsionfactor < 1) ? 0 : arraylength * distorsionfactor) };
function distorsionout(arraylength) { return d3.interpolateNumber((arraylength * distorsionfactor < 1) ? 0 : arraylength * distorsionfactor, 0) };

function mousexin(newmouseposition){ return d3.interpolateNumber(1, newmouseposition) };
function mousexout() { return d3.interpolateNumber(mouseX, 1) };

var mouseX = 0;
var mouseY = 0;
var keysmouseY = 0;
var selectedmouseX = 0;
var canvasheight = 230;
var keyscanvasheight = 230;
var pictoheight = 80;
var pictoradiussmall = 15;
var pictoradiusbig = 30;
var goodcoverslength = 0;
var tempcount = 0;
var url = 'http://static.cyberlibris.fr/books_upload/300pix/';

var books = {};
var datacolorassoc = {};
var distmat = {};
//var distmatvalues = {};
var entrykeys = {};
var selectedsimilardocid = [];
var selectedcovers = [];
var currentbookselected = [];
var erroredcovers = [];
var clickedlabels = [];

var sidediv = d3
	.select('body')
	.append('div')
	.attr('id', 'sidediv');

var canvaskeys = sidediv
	.append('div')
	.attr('id', 'divcanvaskeys')
	.append('canvas')
	.attr('id', 'canvaskeys')
	.attr('width', width)
	.attr('height', keyscanvasheight)
	.style('left', function(){ return sidedivwidth + "px" });

var canvashiddenkeys = d3
	.select('#divcanvaskeys')
	.append('canvas')
	.attr('id', 'canvashiddenkeys')
	.attr('width', sidedivwidth)
	.attr('height', keyscanvasheight)
	.style('left', function(){ return (sidediv.node().offsetLeft) + "px" });

var maindiv = d3
	.select('body')
	.append('div')
	.attr('id', 'maindiv');
	
var canvas = maindiv
	.append('div')
	.attr('id', 'divcanvas')
	.append('canvas')
	.attr('id', 'canvas')
	.attr('width', width)
	.attr('height', canvasheight)
	.style('left', function(){ return sidedivwidth + "px" });

var canvashidden = d3
	.select('#divcanvas')
	.append('canvas')
	.attr('id', 'canvashidden')
	.attr('width', width)
	.attr('height', canvasheight)
	.style('left', function(){ return (canvas.node().offsetLeft) + "px" });

var canvasselectedcovers = maindiv
	.append('div')
	.attr('id', 'canvasselectedcovers')
	.append('canvas')
	.attr('id', 'canvasselected')
	.attr('width', width)
	.attr('height', canvasheight)
	.style('left', function(){ return sidedivwidth + "px" });

var canvasselectedcovershidden = d3
	.select('#canvasselectedcovers')
	.append('canvas')
	.attr('id', 'canvasselectedhidden')
	.attr('width', width)
	.attr('height', canvasheight)
	.style('left', function(){ return (canvasselectedcovers.node().offsetLeft) + "px" });

// ENTRY KEYS CANVAS
var contextkeys = canvaskeys.node().getContext("2d");
var hiddencontextkeys = canvashiddenkeys.node().getContext("2d");

// TOP CANVAS
var context = canvas.node().getContext("2d");
context.strokeStyle = 'rgb(20, 30, 40)';
var hiddencontext = canvashidden.node().getContext("2d");

// BOTTOM CANVAS
var contextofselecetedcovers = canvasselectedcovers.node().getContext("2d");
contextofselecetedcovers.strokeStyle = 'rgb(20, 30, 40)';
var hiddencontextofselecetedcovers = canvasselectedcovershidden.node().getContext("2d");

// SCALE TEXT SIZE
var textscale = d3
	.scaleLinear()
	.domain([0, canvasheight])
	.range([2, 0.2]);

d3.json('data10.json', function(err, data) {
	//console.log(data);
	
	data.books.docid.map(function(d, i){
		var col = generatecolor();
		datacolorassoc[col] = d;
		datacolorassoc[d] = col;
		books[d] = data.books.coverimg[i];
	});
	
	data.docid.map(function(d, i){
		distmat[d] = data.simdocid[i];
		//distmatvalues[d] = data.simvalues[i];
	});

	data.entrykeysname.map(function(d, i){
		entrykeys[d] = data.entrykeysdocid[i];
		var col = generatecolor();
		datacolorassoc[col] = d;
		datacolorassoc[d] = col;
	});

	drawkeys();
	//drawprep();
	//drawhidden();
});

function drawkeys(){
	contextkeys.clearRect(0, 0 , width, keyscanvasheight);
	Object.keys(entrykeys)
		.map(function(d, i){
			var a = fisheye(i * (keyscanvasheight / Object.keys(entrykeys).length), distorsionkeys, keysmouseY, keyscanvasheight);
			var b = fisheye((i + 1) * (keyscanvasheight / Object.keys(entrykeys).length), distorsionkeys, keysmouseY, keyscanvasheight);
			
			contextkeys.font = (keysmouseY > a & keysmouseY < b) ? ((b - a) / 2) + 'px roboto black, verdana' : ((b - a) / 2) + 'px roboto, verdana';
			contextkeys.fillStyle = (clickedlabels.includes(d)) ? 'rgba(170, 200, 110, 1)' : (keysmouseY > a & keysmouseY < b) ? 'rgba(245, 65, 55, 1)' : 'rgba(256, 256, 256, 1)';
			contextkeys.textAlign = 'left';
			contextkeys.textBaseline = 'middle';
			contextkeys.fillText(d.toUpperCase(), 0, a + ((b - a) / 2));
		});
};

function drawhiddenkeys(){
	Object.keys(entrykeys)
		.map(function(d, i){
			var a = fisheye(i * (keyscanvasheight / Object.keys(entrykeys).length), distorsionkeys, keysmouseY, keyscanvasheight);
			var b = fisheye((i + 1) * (keyscanvasheight / Object.keys(entrykeys).length), distorsionkeys, keysmouseY, keyscanvasheight);

			hiddencontextkeys.beginPath();
			hiddencontextkeys.fillStyle = datacolorassoc[d];
			hiddencontextkeys.rect(0, a, sidedivwidth, b - a);
			hiddencontextkeys.fill();
		});
};

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
			var a = fisheye(i * width / goodcoverslength, distorsion, mouseX, width);
			var b = fisheye((i + 1) * width / goodcoverslength, distorsion, mouseX, width);
			var picheight = canvasheight;
			
			var cover = new Image();
			
			// NO ERROR SHOULD BE TRIGGERED AS THEY WERE REMOVED IN THE PREP STEP
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
			var a = fisheye(i * width / goodcoverslength, distorsion, mouseX, width);
			var b = fisheye((i + 1) * width / goodcoverslength, distorsion, mouseX, width);
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
			var a = fisheye(i * width / selectedcovers.length, distorsionselectedcovers, selectedmouseX, width);
			var b = fisheye((i + 1) * width / selectedcovers.length, distorsionselectedcovers, selectedmouseX, width);
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
		var a = fisheye(i * width / selectedcovers.length, distorsionselectedcovers, selectedmouseX, width);
		var b = fisheye((i + 1) * width / selectedcovers.length, distorsionselectedcovers, selectedmouseX, width);
		var picheight = canvasheight;

		hiddencontextofselecetedcovers.beginPath();
		hiddencontextofselecetedcovers.fillStyle = datacolorassoc[d];
		hiddencontextofselecetedcovers.rect(a, 0, b - a, picheight);
		hiddencontextofselecetedcovers.fill();
	});
};

canvashiddenkeys
	.on('touchstart mouseenter', function(){
		sidediv.style('z-index', 100);
		canvaskeys
			.transition()
			.duration(500)
			.tween('', function(){
				return function(t){
					distorsionkeys = distorsionin(Object.keys(entrykeys).length)(t);
					drawkeys();
				}
			});
	})
	.on('touchmove mousemove', function(){
		keysmouseY = d3.mouse(this)[1];
		drawkeys();
	})
	.on('touchend mouseleave', function(){
		sidediv.style('z-index', null);

		canvaskeys
			.transition()
			.duration(500)
			.tween('', function(){
				return function(t){
					distorsionkeys = distorsionout(Object.keys(entrykeys).length)(t);
					drawkeys();
					if (t == 1) { keysmouseY = 0; drawkeys() };
				};
			});
	})
	.on('click', function(){
		// RETRIEVE THE CURRENT KEY SELECTION
		drawhiddenkeys();
		mouseX = d3.mouse(this)[0];
		mouseY = d3.mouse(this)[1];
		var col = hiddencontextkeys.getImageData(mouseX, mouseY, 1, 1).data;
		var colString = "rgb(" + col[0] + "," + col[1] + ","+ col[2] + ")";

		hiddencontextkeys.clearRect(0, 0, sidedivwidth, keyscanvasheight);
		//
		
		(clickedlabels.includes(datacolorassoc[colString])) ? null : clickedlabels.push(datacolorassoc[colString]);

		// INSERT THE SELECTED KEY DOCIDS INTO THE ARRAY OF SELECTED SIMILAR DOCIDS
		selectedsimilardocid = entrykeys[datacolorassoc[colString]][0];

		distorsion = selectedsimilardocid.length * distorsionfactor;
		mouseX = 0;
		drawprep();
	});

canvas
	.on('touchstart mouseenter', function(){
		if(selectedsimilardocid.length > 0){
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
		}
	})
	.on('touchmove mousemove', function(){
		if(selectedsimilardocid.length > 0){
			mouseX = d3.mouse(this)[0];
			draw();
		}
	})
	.on('mouseleave', function(){
		if(selectedsimilardocid.length > 0){
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
		}

	})
	.on('click', function(){
		if(selectedsimilardocid.length > 0){
			// RETRIEVE THE CURRENT BOOK SELECTION
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
		}
	});

canvasselectedcovers
	.on('touchstart mouseenter', function(){
		if(selectedcovers.length > 0){
			canvasselectedcovers
				.transition()
				.duration(500)
				.tween('', function(){
					return function(t){
						distorsionselectedcovers = distorsionin(selectedcovers.length)(t);
						drawselectedcovers();
					}
				});
		}
	})
	.on('touchmove mousemove', function(){
		if(selectedcovers.length > 0){
			selectedmouseX = d3.mouse(this)[0];
			drawselectedcovers();
		}
	})
	.on('touchend mouseleave', function(){
		if(selectedcovers.length > 0){
			canvasselectedcovers
				.transition()
				.duration(500)
				.tween('', function(){
					return function(t){
						distorsionselectedcovers = distorsionout(selectedcovers.length)(t);
						drawselectedcovers();
					}
				});
		}
	})
	.on('click', function(){
		if(selectedcovers.length > 0){
			// RETRIEVE THE CURRENT BOOK SELECTION
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

			canvas
				.transition()
				.duration(500)
				.tween('', function(){
					return function(t){
						//context.globalAlpha = t;
						context.fillStyle = 'rgba(20, 30, 40, .1)';
						context.fillRect(0, 0, width, canvasheight);
						(t == 1) ? drawprep() : null;
					}
				});
		}
	})
	.on('dblclick', function(){
		if(selectedcovers.length > 0){
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
		}
	});

// CREATE AN ENTRY KEY
d3
	.select('#createkey')
	.on('click', function(){
		
		if (d3.select('#textkey').style('visibility') == 'hidden') {
			d3.select('#textkey').style('visibility', 'visible');
		} else if (d3.select('#textkey').style('visibility') == 'visible') {
			createentrykey();
		}
	})

function createentrykey(){
	if (d3.select('input').node().value != '' & selectedcovers.length > 0){
		var keyname = d3.select('input').node().value;
		d3.select('#textkey').style('visibility', 'hidden');
		d3.select('#createkey').text('+');
		entrykeys[keyname] = [selectedcovers];
		var col = generatecolor();
		datacolorassoc[col] = keyname;
		datacolorassoc[keyname] = col;
		drawkeys();
		selectedcovers = [];
		drawselectedcovers();
	} else {
		d3.select('form').style('visibility', 'hidden');
		alert("Entrez un nom d'étagère ou selectionnez au moins un livre");
	}
};

function fisheye(x, disto, mouseXcoord, max){
	var left = x < mouseXcoord;

	var min = 0;

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
