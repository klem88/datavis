var userdocid = [];
var userdata = [];
var books = {};
var distmat = {};
var urlimg = 'http://static.cyberlibris.fr/books_upload/300pix/';

BookshelfMgr.initialize({
	base_endpoint: 'http://www.lilliadvis.io/bookshelfmgr'
});

d3.select('#submit').on('click', function(){
	var username = d3.select('#username').node().value;
	var pwd = d3.select('#password').node().value;
	
	if (username != '' & pwd != ''){
		BookshelfMgr.login(username, pwd, function(){
		console.log(BookshelfMgr.isAuthenticated())
		
		BookshelfMgr.allbooks(function(userdata){ 
			userdata.items.map(function(d){ userdocid.push(d.docid); })
			console.log(userdata);
			d3.select('#inputfields').style('visibility', 'hidden');
			d3.select('.clicMe').style('visibility', 'visible');

			runable();
		});
		});
	} else {alert('Username and Password are needed')};
});

function runable(){
	//BiblioVox
	var dataset = "data1.json";

	var width = '100%';
	var height = '100%';

	var iteration = 0;
	var nbcoverstoshowthefirsttime = 8;
	var millisecondsbetween2shuffles = 3000;
	var nbiterationsbeforeallcovers = 8;
	var idle = 0;

	var transitionButtonDurationMs = 1500;
	var transitionButtonScaleTo = 1.1;
	var transitionButtonScaleFrom = 0.6;
	var transitionButtonOpacityTo = 0.3;
	var transitionButtonEase = d3.easeBounceOut;//d3.easePolyOut;//d3.easeExpOut;
	var transitionButtonEaseBack = d3.easeBounceIn;//d3.easePolyIn;//d3.easeExpIn;
	var transitionButtonEaseFinalOut = d3.easePolyOut;//d3.easeExpOut;
	var transitionButtonEaseFinalIn = d3.easePolyIn;//d3.easeExpIn;

	//ScholarVox
	//var textdansleboutonfinal = 'Explorer votre bibliothèque dans ScholarVox...';
	//BiblioVox
	var textdansleboutonfinal = 'Explorer votre bibliothèque ...';

	// SET THE RETURN BUTTON
	d3
		.select('#return')
		.on('click', function(){ window.open('/homepage', '_self'); });

	// SET THE TIMEOUT
	d3.interval(function(){ 
		idle += 1;
		console.log(idle);
		if (idle >= 36) window.open('/welcome', '_self');
	}, 5000);

	svg = d3
		.select('.rightSide')	
		.append('svg')
		.attr('class', 'svgtreemap')
		.attr('width', width)
		.attr('height', height)
		.on('mousemove scroll touchstart touchmove', function(){ idle = 0 });	

	svg
		.append('g')
		.attr('id', 'svgcovers');

	svg
		.append('g')
		.attr('id', 'svgchildren');

	svg
		.append('g')
		.attr('id', 'svgparent');

	var color = d3
		.scaleOrdinal()
		.domain([0,1,2,3,4,5,6,7,8,9])
	// ScholarVox
	//	.range(['#c8e3f8', '#FF0000', '#00AA50', '#000090', '#FFFF00', '#FF8000', '#FF00FF', '#8000FF', '#905000', '#777777']);
	// BiblioVox
		.range(['#c8e3f8', '#FF0000', '#00AA50', '#000090', '#FFFF00', '#FF8000', '#FF00FF', '#8000FF', '#905000', '#777777']);

	var treemap = d3
		.treemap()
		.tile(d3.treemapSquarify.ratio(1))
		.size([parseInt(d3.select('.svgtreemap').style('width'), 10), parseInt(d3.select('.svgtreemap').style('height'), 10)])
		.padding(1)
		.round(true);



	d3.json(dataset, function(data){
		
		data.docid.map(function(d, i){
			books[d] = data.coverimg[i];
			distmat[d] = data.simdocid[i];
		});

		userdocid.map(function(d){
			var parentdocid = String(d);
			for (var i = 0; i <= 9; i++) {
				userdata.push({
					'classe1docid' : parentdocid,
					'classe1cover' : books[parentdocid],
					'classe1dicethemeid' : parentdocid,
					'classe2docid' : distmat[parentdocid][i],
					'classe2cover' : books[distmat[parentdocid][i]],
					'classe2dicethemeid': distmat[parentdocid][i]
				});
			};
		});

		// The dataset is shuffled only ONCE
		//data = d3.shuffle(data);
		function datainitialisation() {
			datatodisplay = d3.shuffle(userdata).slice(0, iteration * nbcoverstoshowthefirsttime) //Math.pow(iteration, 2)

			initdata = d3
				.nest()
				.key(function(u){ return u.classe1docid + '|' + u.classe1cover + '|' + u.classe1dicethemeid; })
				//.key(function(u){ return u.classe1title + '|' + u.classe1cover + '|' + u.classe1dicethemeid })
				//.key(function(u){ return u.classe2dicethemeid; })
				.key(function(u){ return u.classe2docid + '|' + u.classe2cover + '|' + u.classe2dicethemeid }) //  + '|' + u.classe1cover
				.rollup(function(u){ return d3.sum(u, function(e){ return 1; }) })
				.entries((iteration == 0) ? userdata : datatodisplay);
			
			root = d3
				.hierarchy({values: initdata}, function(d) { return d.values; })
				.sum(function(d) { return d.value; })
				.sort(function(a, b) { return d3.descending(a.value, b.value); });
			
			treemap(root);
		}

		var allcovers = [];
		userdata.map(function(d){ allcovers.push(d.classe1cover); allcovers.push(d.classe2cover); });

		//SET THE PATTERNS
		d3
			.select('#svgcovers')
			.selectAll('pattern')
			//.data(root.descendants().filter(function(d){ return d.depth == 2; }))
			.data(allcovers)
			.enter()
			.append('pattern')
			//.attr('id', function(d){ return d.data.key.split("|")[1]; })
			.attr('id', function(d){ return d; })
			.attr("width", 1)
			.attr("height", 1)
			.attr('patternContentUnits', 'objectBoundingBox')
			.append('image')
			//.attr("xlink:href", function(d){ return d.data.key.split("|")[1]; })
			.attr("xlink:href", function(d){ return urlimg + d; })
			.attr("width", 1)
			.attr("height", 1)
			.attr("x", 0)
			.attr("y", 0)
			.attr("preserveAspectRatio", "xMinYMin slice");

		//SET THE PARENTS
		function printparent(dataparent){
			/*dataparent.map(function(d){
				d3
					.select('#dicetheme' + d.data.key)
					.select('strong')
					.text(Math.round(d.value / d.parent.value * 100) + '%');
			})*/

			var parentdata = d3
				.select("#svgparent")
				.selectAll(".parent")
				.data(dataparent, function(e){ return e.data.key});

			parentdata
				.enter()
				.append("rect")
				.attr("class", "parent")
				.attr('fill', function(d){ return 'url(#' + d.data.key.split("|")[1] + ')' })
				//.attr('fill', function(d){ return color(d.data.key.split("|")[0]); })
				.attr('opacity', 1 )
				.merge(parentdata)
				.attr("x", function(d) {return (d.x0); })
				.attr("y", function(d) { return (d.y0); })
				.attr("width", function(d) { return (d.x1 - d.x0); })
				.attr("height", function(d) { return (d.y1 - d.y0); });
			
		};

		//SET THE CHILDREN
		function printchildren(){
			d3
				.selectAll('.parent')
				.remove();

			// JOIN new data with old elements
			var childrendata = d3
				.select("#svgchildren")
				.selectAll(".children")
				.data(root.leaves(), function(e){ return e.data.key; });

			// EXIT old elements not present in new data.
			childrendata.exit()
				.transition()
				.duration(1000)
				.ease(d3.easeCubicInOut)
				.attr('opacity', 0)
				.attr("x", function(d) {return (parseInt(d3.select('.svgtreemap').style('width'), 10) / 2) - ((d.x1 - d.x0) / 2); })
				.attr("y", function(d) { return (parseInt(d3.select('.svgtreemap').style('height'), 10) / 2) - ((d.y1 - d.y0) / 2); })
				.remove();
			// UPDATE old elements present in new data.
			childrendata
				.attr('opacity', 1)
				.transition()
				//.delay(function(d, i) { return i * 500; })
				.duration((nbcoverstoshowthefirsttime == userdata.length) ? 3000 : 1000)
				.ease(d3.easeCubicInOut)
				.attr("width", function(d) { return (d.x1 - d.x0); })
				.attr("height", function(d) { return (d.y1 - d.y0); })
				.attr("x", function(d) {return (d.x0); })
				.attr("y", function(d) { return (d.y0); });

			// ENTER new elements present in new data.
			childrendata
				.enter()
				.append("rect")
				.attr("class", "children")
				.on('click', function(d){ console.log(d.data.key); })
				.attr('fill', function(d){ return 'url(#' + d.data.key.split("|")[1] + ')' })
				.attr("x", function(d) {return parseInt(d3.select('.svgtreemap').style('width'), 10) / 2; })
				.attr("y", function(d) { return parseInt(d3.select('.svgtreemap').style('height'), 10) / 2; })
				.attr('opacity', 0)
				.transition()
				.delay(function(d, i) { var volume = (nbcoverstoshowthefirsttime == userdata.length) ? 10000 : 1000; return (i + 1) * (Math.random() * volume / (i + 1)); }) //Math.min( , 2900 )
				.duration(750)
				.ease(d3.easeCubicInOut)
				.attr('opacity', 1)
				.attr("width", function(d) { return (d.x1 - d.x0); })
				.attr("height", function(d) { return (d.y1 - d.y0); })
				.attr("x", function(d) {return (d.x0); })
				.attr("y", function(d) { return (d.y0); });
		};

		$(window)
			.on('resize', function(){ 
				treemap.size([parseInt(d3.select('.svgtreemap').style('width'), 10), parseInt(d3.select('.svgtreemap').style('height'), 10)]);
				treemap(root);
				(iteration == 0) ? printparent(root.descendants().filter(function(e){ return e.depth == 1; })) : printchildren();
			});

		d3
			.select('.clicMe')
			.on('click', function(){ 
				iteration += 1; 
				datainitialisation();
				printchildren();
				
				d3
					.selectAll('.clicMe, .clicMeContent')
					.style('pointer-events', 'none')
					.style('transition', 'null')
					.transition()
					.ease(transitionButtonEase)
					.duration(transitionButtonDurationMs)
					.style('transform', 'scale(' + transitionButtonScaleTo + ')')
					.transition()
					.ease(transitionButtonEaseBack)
					.style('transform', 'scale(' + transitionButtonScaleFrom + ')');
					/*.styleTween('transform', function(){
						return d3.interpolateTransformCss('scale(1, 1)', 'scale(0.5, 0.5)');
						console.log(d3.transform(this));
					});*/
				d3
					.select('.clicMeContent')
					.transition()
					.duration(transitionButtonDurationMs)
					.style('opacity', 0.8)
					.styleTween('background', function(){
						return d3.interpolateRgb('black', 'orange');
					});
					/*
					.ease(d3.easeExpInOut)
					.duration(transitionButtonDurationMs)
					.style('opacity', transitionButtonOpacityTo)
					.transition()
					.style('opacity', 1);*/
				d3
					.select('.clicMeContent h2')
					.style('font-size', '30px')
					.text(+ iteration + ' / ' + nbiterationsbeforeallcovers);
				d3
					.select('.clicMeContent p')
					.text('Calcul en cours');
				/*d3
					.selectAll('.clicMe, .clicMeContent')
					.style('opacity', 1);
	*/
				d3.interval(function() {

					iteration += 1;
					(iteration <= nbiterationsbeforeallcovers) ? null : nbcoverstoshowthefirsttime = userdata.length;
					datainitialisation();
					(iteration <= nbiterationsbeforeallcovers + 1) ? printchildren() : null;
					if (iteration <= nbiterationsbeforeallcovers){
						d3
							.selectAll('.clicMe, .clicMeContent')
							.transition()
							.ease(transitionButtonEase)
							.duration(transitionButtonDurationMs)
							.style('transform', 'scale(' + transitionButtonScaleTo + ')')
							.transition()
							.ease(transitionButtonEaseBack)
							.style('transform', 'scale(' + transitionButtonScaleFrom + ')');
							/*.styleTween('border-radius', function(){
								return d3.interpolateTransformCss('scale(1, 1)', 'scale(0.5, 0.5)');
							});*/
						/*d3
							.select('.clicMeContent')
							.transition()
							.ease(d3.easeExpInOut)
							.duration(transitionButtonDurationMs)
							.style('opacity', transitionButtonOpacityTo)
							.transition()
							.style('opacity', 1);*/
						d3
							.select('.clicMeContent h2')
							.text(+ iteration + ' / ' + nbiterationsbeforeallcovers);
					} else {
						d3
							.selectAll('.clicMe, .clicMeContent')
							.transition()
							.ease(transitionButtonEaseFinalOut)
							.duration(transitionButtonDurationMs)
							.style('transform', 'scale(' + transitionButtonScaleTo + ')')
							.transition()
							.ease(transitionButtonEaseFinalIn)
							.style('transform', 'scale(' + transitionButtonScaleFrom + ')');					
						d3
							.select('.clicMeContent h2')
							.style('font-size', '16px')
							.text(textdansleboutonfinal);
						d3
							.select('.clicMeContent p')
							.text('Cliquez ici!');
						d3
							.select('.clicMeContent')
							.style('background', 'green');
					}
				}, millisecondsbetween2shuffles);
			});

		datainitialisation();
		printparent(root.descendants().filter(function(e){ return e.depth == 1; }));
	});
};