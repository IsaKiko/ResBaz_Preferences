
var screenWidth = $(window).width(),
	mobileScreen = (screenWidth > 400 ? false : true);

var margin = {left: 50, top: 10, right: 50, bottom: 10},
	width = Math.min(screenWidth, 800) - margin.left - margin.right,
	height = (mobileScreen ? 300 : Math.min(screenWidth, 800)*5/6) - margin.top - margin.bottom;
			
var svg2 = d3.select("#chart2").append("svg")
			.attr("width", (width + margin.left + margin.right))
			.attr("height", (height + margin.top + margin.bottom));
			
var wrapper2 = svg2.append("g").attr("class", "chordWrapper2")
			.attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");;
			
var outerRadius = Math.min(width, height) / 2  - (mobileScreen ? 80 : 100),
	innerRadius = outerRadius * 0.95,
	pullOutSize = (mobileScreen? 20 : 50),
	opacityDefault = 0.75, //default opacity of chords
	opacityLow = 0.02; //hover opacity of those chords not hovered over
	
////////////////////////////////////////////////////////////
////////////////////////// Data ////////////////////////////
////////////////////////////////////////////////////////////

var Names = ["Acquisition and cleaning", "D3",  "NLTK",  "Matlab",  "Python",  "R", "Mapping", "Inventor", "3D Slicer", "", "Acquisition and cleaning", "D3",  "NLTK",  "Matlab",  "Python",  "R", "Mapping", "Inventor", "3D Slicer",""];
var Colour = ["#1f78b4", "#6a3d9a", "#8dd3c7", "#fdbf6f","#ff7f00","#e31a1c","#cacaca","#b2df8a","#fb9a99", "","#1f78b4", "#6a3d9a", "#8dd3c7", "#fdbf6f","#ff7f00","#e31a1c","#cacaca","#b2df8a","#fb9a99", ""];


var respondents = 95, //Total number of respondents (i.e. the number that makes up the total group)
	emptyPerc = 0.4, //What % of the circle should become empty
	emptyStroke = Math.round(respondents*emptyPerc); 
var matrix = [
[0,0,0,0,0,0,0,0,0,0,0.275862068965517,0.158730158730159,0.320000000000000,0.188888888888889,0.141791044776119,0.180412371134021,0.148148148148148,0.166666666666667,0.115384615384615,0],
[0,0,0,0,0,0,0,0,0,0,0.172413793103448,0.0634920634920635,0.160000000000000,0.0555555555555556,0.0895522388059701,0.108247422680412,0.333333333333333,0.200000000000000,0.230769230769231,0],
[0,0,0,0,0,0,0,0,0,0,0.0689655172413793,0.126984126984127,0.120000000000000,0,0.0597014925373134,0.0206185567010309,0.0740740740740741,0.0333333333333333,0,0],
[0,0,0,0,0,0,0,0,0,0,0.120689655172414,0.0317460317460317,0.0400000000000000,0.0666666666666667,0.119402985074627,0.195876288659794,0.0370370370370370,0.166666666666667,0.115384615384615,0],
[0,0,0,0,0,0,0,0,0,0,0.103448275862069,0.111111111111111,0.240000000000000,0.300000000000000,0.0820895522388060,0.335051546391753,0.0370370370370370,0,0.115384615384615,0],
[0,0,0,0,0,0,0,0,0,0,0.0862068965517241,0.206349206349206,0.0400000000000000,0.255555555555556,0.388059701492537,0.0927835051546392,0.111111111111111,0.0666666666666667,0.0769230769230769,0],
[0,0,0,0,0,0,0,0,0,0,0.155172413793103,0.142857142857143,0.0400000000000000,0,0.0298507462686567,0.0257731958762887,0.148148148148148,0,0.0384615384615385,0],
[0,0,0,0,0,0,0,0,0,0,0,0.126984126984127,0,0.0888888888888889,0.0447761194029851,0.00515463917525773,0.111111111111111,0.166666666666667,0.192307692307692,0],
[0,0,0,0,0,0,0,0,0,0,0.0172413793103448,0.0317460317460317,0.0400000000000000,0.0444444444444444,0.0447761194029851,0.0360824742268041,0,0.200000000000000,0.115384615384615,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
[0.275862068965517,0.172413793103448,0.0689655172413793,0.120689655172414,0.103448275862069,0.0862068965517241,0.155172413793103,0,0.0172413793103448,0,0,0,0,0,0,0,0,0,0,0],
[0.158730158730159,0.0634920634920635,0.126984126984127,0.0317460317460317,0.111111111111111,0.206349206349206,0.142857142857143,0.126984126984127,0.0317460317460317,0,0,0,0,0,0,0,0,0,0,0],
[0.320000000000000,0.160000000000000,0.120000000000000,0.0400000000000000,0.240000000000000,0.0400000000000000,0.0400000000000000,0,0.0400000000000000,0,0,0,0,0,0,0,0,0,0,0],
[0.188888888888889,0.0555555555555556,0,0.0666666666666667,0.300000000000000,0.255555555555556,0,0.0888888888888889,0.0444444444444444,0,0,0,0,0,0,0,0,0,0,0],
[0.141791044776119,0.0895522388059701,0.0597014925373134,0.119402985074627,0.0820895522388060,0.388059701492537,0.0298507462686567,0.0447761194029851,0.0447761194029851,0,0,0,0,0,0,0,0,0,0,0],
[0.180412371134021,0.108247422680412,0.0206185567010309,0.195876288659794,0.335051546391753,0.0927835051546392,0.0257731958762887,0.00515463917525773,0.0360824742268041,0,0,0,0,0,0,0,0,0,0,0],
[0.148148148148148,0.333333333333333,0.0740740740740741,0.0370370370370370,0.0370370370370370,0.111111111111111,0.148148148148148,0.111111111111111,0,0,0,0,0,0,0,0,0,0,0,0],
[0.166666666666667,0.200000000000000,0.0333333333333333,0.166666666666667,0,0.0666666666666667,0,0.166666666666667,0.200000000000000,0,0,0,0,0,0,0,0,0,0,0],
[0.115384615384615,0.230769230769231,0,0.115384615384615,0.115384615384615,0.0769230769230769,0.0384615384615385,0.192307692307692,0.115384615384615,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0],
];
//Calculate how far the Chord Diagram needs to be rotated clockwise to make the dummy
//invisible chord center vertically
var offset = (2 * Math.PI) * (emptyStroke/(respondents + emptyStroke))/4;

//Custom sort function of the chords to keep them in the original order
function customSort(a,b) {
	return 1;
};

//Custom sort function of the chords to keep them in the original order
var chord = customChordLayout() //d3.layout.chord()//Custom sort function of the chords to keep them in the original order
	.padding(.02)
	.sortChords(d3.descending) //which chord should be shown on top when chords cross. Now the biggest chord is at the bottom
	.matrix(matrix);
	
var arc2 = d3.svg.arc()
	.innerRadius(innerRadius)
	.outerRadius(outerRadius)
	.startAngle(startAngle) //startAngle and endAngle now include the offset in degrees
	.endAngle(endAngle);

var path = stretchedChord()
	.radius(innerRadius)
	.startAngle(startAngle)
	.endAngle(endAngle);

////////////////////////////////////////////////////////////
//////////////////// Draw outer Arcs ///////////////////////
////////////////////////////////////////////////////////////

var g = wrapper2.selectAll("g.group")
	.data(chord.groups)
	.enter().append("g")
	.attr("class", "group")
	.on("mouseover", fade(opacityLow))
	.on("mouseout", fade(opacityDefault));

g.append("path")
	.style("stroke", function(d,i) { return (Names[i] === "" ? "none" : "#000000"); })
	.style("fill", function(d,i) { return (Colour[i] === "" ? "none" : Colour[i]); })
	.style("pointer-events", function(d,i) { return (Names[i] === "" ? "none" : "auto"); })
	.attr("d", arc)
	.attr("transform", function(d, i) { //Pull the two slices apart
				d.pullOutSize = pullOutSize * ( d.startAngle + 0.001 > Math.PI ? -1 : 1);
				return "translate(" + d.pullOutSize + ',' + 0 + ")";
	});


////////////////////////////////////////////////////////////
////////////////////// Append Names ////////////////////////
////////////////////////////////////////////////////////////

//The text also needs to be displaced in the horizontal directions
//And also rotated with the offset in the clockwise direction
g.append("text")
	.each(function(d) { d.angle = ((d.startAngle + d.endAngle) / 2) + offset;})
	.attr("dy", ".35em")
	.attr("class", "titles")
	.attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
	.attr("transform", function(d,i) { 
		var c = arc2.centroid(d);
		return "translate(" + (c[0] + d.pullOutSize) + "," + c[1] + ")"
		+ "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
		+ "translate(" + 55 + ",0)"
		+ (d.angle > Math.PI ? "rotate(180)" : "")
	})
  .text(function(d,i) { return Names[i]; })
  .call(wrapChord, 100);

////////////////////////////////////////////////////////////
//////////////////// Draw inner chords /////////////////////
////////////////////////////////////////////////////////////
 
var chords = wrapper2.selectAll("path.chord")
	.data(chord.chords)
	.enter().append("path")
	.attr("class", "chord")
	.style("stroke", "none")
	.style("fill", function(d) {return Colour[d.source.index]})
	.style("opacity", function(d) { return (Names[d.source.index] === "" ? 0 : opacityDefault); }) //Make the dummy strokes have a zero opacity (invisible)
	.style("pointer-events", function(d,i) { return (Names[d.source.index] === "" ? "none" : "auto"); }) //Remove pointer events from dummy strokes
	.attr("d", path)
	.on("mouseover", fadeOnChord)
	.on("mouseout", fade(opacityDefault));	

////////////////////////////////////////////////////////////
///////////////////////// Tooltip //////////////////////////
////////////////////////////////////////////////////////////

//Arcs
// g.append("title")	
// 	.text(function(d, i) {return Math.round(d.value) + " people in " + Names[i];});
	
// //Chords
// chords.append("title")
// 	.text(function(d) {
// 		return [Math.round(d.source.value), " people from ", Names[d.target.index], " to ", Names[d.source.index]].join(""); 
// 	});
	
////////////////////////////////////////////////////////////
////////////////// Extra Functions /////////////////////////
////////////////////////////////////////////////////////////

//Include the offset in de start and end angle to rotate the Chord diagram clockwise
function startAngle(d) { return d.startAngle + offset; }
function endAngle(d) { return d.endAngle + offset; }

// Returns an event handler for fading a given chord group
function fade(opacity) {
  return function(d, i) {
	wrapper2.selectAll("path.chord")
		.filter(function(d) { return d.source.index != i && d.target.index != i && Names[d.source.index] != ""; })
		.transition()
		.style("opacity", opacity);
  };
}//fade

// Fade function when hovering over chord
function fadeOnChord(d) {
	var chosen = d;
	wrapper2.selectAll("path.chord")
		.transition()
		.style("opacity", function(d) {
			if (d.source.index == chosen.source.index && d.target.index == chosen.target.index) {
				return opacityDefault;
			} else { 
				return opacityLow; 
			}//else
		});
}//fadeOnChord

//Taken from http://bl.ocks.org/mbostock/7555321
//Wraps SVG text
function wrapChord(text, width) {
  text.each(function() {
	var text = d3.select(this),
		words = text.text().split(/\s+/).reverse(),
		word,
		line = [],
		lineNumber = 0,
		lineHeight = 1.1, // ems
		y = 0,
		x = 0,
		dy = parseFloat(text.attr("dy")),
		tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em").attr("fill","WhiteSmoke");

	while (word = words.pop()) {
	  line.push(word);
	  tspan.text(line.join(" "));
	  if (tspan.node().getComputedTextLength() > width) {
		line.pop();
		tspan.text(line.join(" "));
		line = [word];
		tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word).attr("fill","WhiteSmoke");
	  }
	}
  });
}//wrapChord