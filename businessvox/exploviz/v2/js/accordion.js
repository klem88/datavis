var datafile = 'data12.json';

var margin = {top: 80, right: 50, bottom: 50, left: 50};
var width = Math.max(400, window.innerWidth - margin.left - margin.right);
var sidedivwidth = width / 4;
width -= sidedivwidth;
var height = Math.max(300, window.innerHeight - margin.top - margin.bottom);

// Distorsion
var distorsion = 0;
var distorsionselectedcovers = 0;
var distorsionkeys1 = 0;
var distorsionkeys2 = 0;
var distorsionfactor = 0.24;

var urldescription = 'http://www.business-vox.com/sapi/info?docid=';
var endurldescription = '&extra=1';

//for tracking
//var colString;
var gtagselectedkey;
var gtagselectedbook;
var gtagrecommendationbook;

function distorsionin(arraylength){ return d3.interpolateNumber(0, (arraylength * distorsionfactor < 1) ? 0 : arraylength * distorsionfactor) };
function distorsionout(arraylength) { return d3.interpolateNumber((arraylength * distorsionfactor < 1) ? 0 : arraylength * distorsionfactor, 0) };

function mousexin(newmouseposition){ return d3.interpolateNumber(1, newmouseposition) };
function mousexout() { return d3.interpolateNumber(mouseX, 1) };

var mouseX = 0;
var mouseY = 0;
var keysmouseY1 = 0;
var keysmouseY2 = 0;
var selectedmouseX = 0;
var canvasheight = height / 2;
var keyscanvasheight1 = 2 * canvasheight;
var keyscanvasheight2 = 0;

var goodcoverslength = 0;
var tempcount = 0;
var url = 'http://static.cyberlibris.fr/books_upload/300pix/';

var books = {};
var datacolorassoc = {};
var distmat = {};
//var distmatvalues = {};
var entrykeys = {};
var entrykeyscat = {};
var selectedsimilardocid = [];
var selectedcovers = [];
var currentbookselected = [];
var erroredcovers = [];
var clickedlabels = [];

var divcanvaskeys1 = d3
	.select('#sidediv')
	.append('div')
	.attr('id', 'divcanvaskeys1');

var canvaskeys1 = divcanvaskeys1
	.append('canvas')
	.attr('id', 'canvaskeys1')
	.attr('width', width + sidedivwidth)
	.attr('height', keyscanvasheight1);

var canvashiddenkeys1 = divcanvaskeys1
	.append('canvas')
	.attr('id', 'canvashiddenkeys1')
	.attr('width', sidedivwidth)
	.attr('height', keyscanvasheight1);

var divcanvaskeys2 = d3
	.select('#sidediv')
	.append('div')
	.attr('id', 'divcanvaskeys2');

var canvaskeys2 = divcanvaskeys2
	.append('canvas')
	.attr('id', 'canvaskeys2')
	.attr('width', width + sidedivwidth)
	.attr('height', keyscanvasheight2);

var canvashiddenkeys2 = divcanvaskeys2
	.append('canvas')
	.attr('id', 'canvashiddenkeys2')
	.attr('width', sidedivwidth)
	.attr('height', keyscanvasheight2);

d3
	.select('#svgsidebarforkeys')
	.attr('width', '10px')
	.attr('height', (keyscanvasheight1 + keyscanvasheight2) + 'px')
	.append('rect')
	.attr('x', 0)
	.attr('y', 0)
	.attr('width', '8px')
	.attr('height', (keyscanvasheight1 + keyscanvasheight2) + 'px')
	.attr('fill', 'red')
	.on('click', function(){ 
		d3.select('#sidediv').style('visibility', 'visible');
		d3.select('#bookinfo').style('visibility', 'hidden');
	});

d3
	.selectAll('#bookinfo')
	.style('width', sidedivwidth + 'px')
	.style('height', (keyscanvasheight1 + keyscanvasheight2) + 'px');
d3
	.selectAll('#tutopart1, #tutopart2')
	.style('left', function(){ return (sidedivwidth + canvashiddenkeys1.node().offsetLeft) + "px" })
	.style('width', width + 'px');
	
var canvas = d3
	.select('#divcanvas')
	.append('canvas')
	.attr('id', 'canvas')
	.attr('width', width)
	.attr('height', canvasheight)
	.style('left', function(){ return (sidedivwidth + canvashiddenkeys1.node().offsetLeft) + "px" });

var canvashidden = d3
	.select('#divcanvas')
	.append('canvas')
	.attr('id', 'canvashidden')
	.attr('width', width)
	.attr('height', canvasheight)
	.style('left', function(){ return (canvas.node().offsetLeft) + "px" });

var canvasselectedcovers = d3
	.select('#canvasselectedcovers')
	.append('canvas')
	.attr('id', 'canvasselected')
	.attr('width', width)
	.attr('height', canvasheight)
	.style('left', function(){ return (sidedivwidth + canvashiddenkeys1.node().offsetLeft) + "px" });

var canvasselectedcovershidden = d3
	.select('#canvasselectedcovers')
	.append('canvas')
	.attr('id', 'canvasselectedhidden')
	.attr('width', width)
	.attr('height', canvasheight)
	.style('left', function(){ return (canvasselectedcovers.node().offsetLeft) + "px" });

// ENTRY KEYS CANVAS
var contextkeys1 = canvaskeys1.node().getContext("2d");
var contextkeys2 = canvaskeys2.node().getContext("2d");

var hiddencontextkeys1 = canvashiddenkeys1.node().getContext("2d");
var hiddencontextkeys2 = canvashiddenkeys2.node().getContext("2d");

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

d3.json(datafile, function(err, data) {
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
		entrykeyscat[d] = 'entryentrykey';
		var col = generatecolor();
		datacolorassoc[col] = d;
		datacolorassoc[d] = col;
	});

	drawkeys();
	//drawprep();
	//drawhidden();
});

function drawkeys(){
	// A FAIRE //
	// SEPARER EN DEUX LA NOTION DE TAILLE DES CLES DENTREE : Object.keys(entrykeys).length //

	// ENTRYKEYS CATEGORY 1
	contextkeys1.clearRect(0, 0 , width + sidedivwidth, keyscanvasheight1);
	Object.keys(entrykeys)
		.filter(function(d){ return entrykeyscat[d] == 'entryentrykey'; })
		.map(function(d, i){
			var a = fisheye(i * (keyscanvasheight1 / Object.keys(entrykeys).length), distorsionkeys1, keysmouseY1, keyscanvasheight1);
			var b = fisheye((i + 1) * (keyscanvasheight1 / Object.keys(entrykeys).length), distorsionkeys1, keysmouseY1, keyscanvasheight1);
			
			//contextkeys1.font = (keysmouseY1 > a & keysmouseY1 < b) ? ((b - a) / 2) + 'px roboto black, verdana' : ((b - a) / 2) + 'px roboto, verdana';
			contextkeys1.font = (keysmouseY1 > a & keysmouseY1 < b) ? ((b - a) / 40) + 'vw roboto black, verdana' : ((b - a) / 40) + 'vw roboto, verdana';
			var width = contextkeys1.measureText(d.toUpperCase()).width + 10;

			contextkeys1.fillStyle = 'rgba(20, 30, 40, 0.7)'//'rgba(256, 256, 256, 0.8)';
			contextkeys1.fillRect(0, a, width, b - a);
	
			contextkeys1.fillStyle = (clickedlabels.includes(d)) ? 'rgba(20, 120, 10, 1)' : (keysmouseY1 > a & keysmouseY1 < b) ? 'rgba(245, 65, 55, 1)' : 'rgba(256, 256, 256, 1)';
			contextkeys1.textAlign = 'left';
			contextkeys1.textBaseline = 'middle';
			contextkeys1.fillText(d.toUpperCase(), 0, a + ((b - a) / 2));
		});

	// ENTRYKEYS CATEGORY 2
	contextkeys2.clearRect(0, 0 , width + sidedivwidth, keyscanvasheight2);
	Object.keys(entrykeys)
		.filter(function(d){ return entrykeyscat[d] == 'userentrykey'; })
		.map(function(d, i){
			var a = fisheye(i * (keyscanvasheight2 / Object.keys(entrykeys).length), distorsionkeys2, keysmouseY2, keyscanvasheight2);
			var b = fisheye((i + 1) * (keyscanvasheight2 / Object.keys(entrykeys).length), distorsionkeys2, keysmouseY2, keyscanvasheight2);
			
			contextkeys2.font = (keysmouseY2 > a & keysmouseY2 < b) ? ((b - a) / 2) + 'px roboto black, verdana' : ((b - a) / 2) + 'px roboto, verdana';
			var width = contextkeys2.measureText(d.toUpperCase()).width + 10;

			contextkeys2.fillStyle = 'rgba(256, 256, 256, 0.8)';
			contextkeys2.fillRect(0, a, width, b - a);
	
			contextkeys2.fillStyle = (clickedlabels.includes(d)) ? 'rgba(20, 120, 10, 1)' : (keysmouseY2 > a & keysmouseY2 < b) ? 'rgba(245, 65, 55, 1)' : 'rgba(20, 30, 40, 1)';
			contextkeys2.textAlign = 'left';
			contextkeys2.textBaseline = 'middle';
			contextkeys2.fillText(d.toUpperCase(), 0, a + ((b - a) / 2));
		});
};

function drawhiddenkeys(){
	// ENTRYKEYS CATEGORY 1
	Object.keys(entrykeys)
		.filter(function(d){ return entrykeyscat[d] == 'entryentrykey'; })
		.map(function(d, i){
			var a = fisheye(i * (keyscanvasheight1 / Object.keys(entrykeys).length), distorsionkeys1, keysmouseY1, keyscanvasheight1);
			var b = fisheye((i + 1) * (keyscanvasheight1 / Object.keys(entrykeys).length), distorsionkeys1, keysmouseY1, keyscanvasheight1);

			hiddencontextkeys1.beginPath();
			hiddencontextkeys1.fillStyle = datacolorassoc[d];
			hiddencontextkeys1.rect(0, a, sidedivwidth, b - a);
			hiddencontextkeys1.fill();
		});
	// ENTRYKEYS CATEGORY 2
	Object.keys(entrykeys)
		.filter(function(d){ return entrykeyscat[d] == 'userentrykey'; })
		.map(function(d, i){
			var a = fisheye(i * (keyscanvasheight2 / Object.keys(entrykeys).length), distorsionkeys2, keysmouseY2, keyscanvasheight2);
			var b = fisheye((i + 1) * (keyscanvasheight2 / Object.keys(entrykeys).length), distorsionkeys2, keysmouseY2, keyscanvasheight2);

			hiddencontextkeys2.beginPath();
			hiddencontextkeys2.fillStyle = datacolorassoc[d];
			hiddencontextkeys2.rect(0, a, sidedivwidth, b - a);
			hiddencontextkeys2.fill();
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
			
			// ON THE FLY DOCID
			//var currentlookingatdocid; //To Put on top of the page
			/*if (mouseX > a & mouseX < b) {
				if(currentlookingatdocid != d){ 
					console.log(d);
				};
				currentlookingatdocid = d;
			};*/
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

canvashiddenkeys1
	.on('touchstart mouseenter', function(){
		d3.select('#sidediv').style('z-index', 100);
		canvaskeys1
			.transition()
			.duration(500)
			.tween('', function(){
				return function(t){
					distorsionkeys1 = distorsionin(Object.keys(entrykeys).length)(t);
					drawkeys();
				}
			});
	})
	.on('touchmove mousemove', function(){
		keysmouseY1 = d3.mouse(this)[1];
		drawkeys();
	})
	.on('touchend mouseleave', function(){
		d3.select('#sidediv').style('z-index', null);

		canvaskeys1
			.transition()
			.duration(500)
			.tween('', function(){
				return function(t){
					distorsionkeys1 = distorsionout(Object.keys(entrykeys).length)(t);
					drawkeys();
					if (t == 1) { keysmouseY1 = 0; drawkeys() };
				};
			});
	})
	.on('click', function(){
		// HIDE THE SECOND PART OF THE TUTO
		d3.select('#tutopart1').style('visibility', 'hidden');
		// RETRIEVE THE CURRENT KEY SELECTION
		drawhiddenkeys();
		mouseX = d3.mouse(this)[0];
		mouseY = d3.mouse(this)[1];
		var col = hiddencontextkeys1.getImageData(mouseX, mouseY, 1, 1).data;
		var colString = "rgb(" + col[0] + "," + col[1] + ","+ col[2] + ")";

		hiddencontextkeys1.clearRect(0, 0, sidedivwidth, keyscanvasheight1);
		hiddencontextkeys2.clearRect(0, 0, sidedivwidth, keyscanvasheight2);
		//

		gtagselectedkey = datacolorassoc[colString]; // for tracking
		dataLayer.push({'event': 'gtagselectedkey'});

		(clickedlabels.includes(datacolorassoc[colString])) ? null : clickedlabels.push(datacolorassoc[colString]);

		// INSERT THE SELECTED KEY DOCIDS INTO THE ARRAY OF SELECTED SIMILAR DOCIDS
		selectedsimilardocid = entrykeys[datacolorassoc[colString]][0];

		distorsion = selectedsimilardocid.length * distorsionfactor;
		mouseX = 0;
		drawprep();
	});

canvashiddenkeys2
	.on('touchstart mouseenter', function(){
		d3.select('#sidediv').style('z-index', 100);
		canvaskeys2
			.transition()
			.duration(500)
			.tween('', function(){
				return function(t){
					distorsionkeys2 = distorsionin(Object.keys(entrykeys).length)(t);
					drawkeys();
				}
			});
	})
	.on('touchmove mousemove', function(){
		keysmouseY2 = d3.mouse(this)[1];
		drawkeys();
	})
	.on('touchend mouseleave', function(){
		d3.select('#sidediv').style('z-index', null);

		canvaskeys2
			.transition()
			.duration(500)
			.tween('', function(){
				return function(t){
					distorsionkeys2 = distorsionout(Object.keys(entrykeys).length)(t);
					drawkeys();
					if (t == 1) { keysmouseY2 = 0; drawkeys() };
				};
			});
	})
	.on('click', function(){
		// RETRIEVE THE CURRENT KEY SELECTION
		drawhiddenkeys();
		mouseX = d3.mouse(this)[0];
		mouseY = d3.mouse(this)[1];
		var col = hiddencontextkeys2.getImageData(mouseX, mouseY, 1, 1).data;
		var colString = "rgb(" + col[0] + "," + col[1] + ","+ col[2] + ")";

		hiddencontextkeys1.clearRect(0, 0, sidedivwidth, keyscanvasheight1);
		hiddencontextkeys2.clearRect(0, 0, sidedivwidth, keyscanvasheight2);
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
			// HIDE THE SECOND PART OF THE TUTO
			d3.select('#tutopart2').style('visibility', 'hidden');
			// RETRIEVE THE CURRENT BOOK SELECTION
			drawhidden();
			mouseX = d3.mouse(this)[0];
			mouseY = d3.mouse(this)[1];
			var col = hiddencontext.getImageData(mouseX, mouseY, 1, 1).data;
			var colString = "rgb(" + col[0] + "," + col[1] + ","+ col[2] + ")";

			hiddencontext.clearRect(0, 0, width, canvasheight);
			//

			gtagselectedbook = datacolorassoc[colString]; // for tracking
			dataLayer.push({'event': 'gtagselectedbook'});

			// INSERT THE SELECTED COVER INTO THE ARRAY OF SELECTED COVERS
			selectedcovers.push(datacolorassoc[colString]);
			drawselectedcovers();

			// UPDATE BOOK INFO
			httpGetAsync(urldescription + datacolorassoc[colString] + endurldescription);
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


			gtagrecommendationbook = currentbookselected; // for tracking
			dataLayer.push({'event': 'gtagrecommendationbook'});

			// NEW ARRAY OF DOCID
			selectedsimilardocid = distmat[currentbookselected];
			distorsion = selectedsimilardocid.length * distorsionfactor;
			mouseX = 0;

			drawprep();

			// UPDATE BOOK INFO
			httpGetAsync(urldescription + datacolorassoc[colString] + endurldescription);

			// TRANSITION CHANGEMENT DE CANVAS (ACCORDEON DU HAUT)
			/*canvas
				.transition()
				.duration(500)
				.tween('', function(){
					return function(t){
						//context.globalAlpha = t;
						context.fillStyle = 'rgba(20, 30, 40, .1)';
						context.fillRect(0, 0, width, canvasheight);
						(t == 1) ? drawprep() : null;
					}
				});*/
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

// INSERT BOOK INFO
function changedescription(objtext){
	//console.log(objtext.result.description);
	d3
		.select('#bookinfo')
		.style('visibility', 'visible')
		.on('touchmove mouseover', function(){
			d3.select(this).style('overflow', 'auto')
		})
		.on('touchend mouseout', function(){
			d3.select(this).style('overflow', 'hidden')
		});
	d3
		.select('#booktitle')
		.text(he.decode(objtext.result.title));
	d3
		.select('#bookdescription')
		.text(he.decode(objtext.result.description));
	d3
		.select('#sidediv')
		.style('visibility', 'hidden');
};

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
		//d3.select('#createkey').text('+');
		entrykeys[keyname] = [selectedcovers];
		entrykeyscat[keyname] = 'userentrykey';
		var col = generatecolor();
		datacolorassoc[col] = keyname;
		datacolorassoc[keyname] = col;
		drawkeys();
		selectedcovers = [];
		drawselectedcovers();
	} else {
		d3.select('#textkey').style('visibility', 'hidden');
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

function httpGetAsync(theUrl)
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() { 
	if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
		changedescription(JSON.parse(xmlHttp.responseText));
	}
	xmlHttp.open("GET", theUrl, true); // true for asynchronous 
	xmlHttp.send(null);
};
