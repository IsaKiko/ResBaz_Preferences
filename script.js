
var screenWidth = $(window).width(),
	mobileScreen = (screenWidth > 400 ? false : true);

var margin = {left: 50, top: 10, right: 50, bottom: 10},
	width = Math.min(screenWidth, 800) - margin.left - margin.right,
	height = (mobileScreen ? 300 : Math.min(screenWidth, 800)*5/6) - margin.top - margin.bottom;
			
var svg = d3.select("#chart").append("svg")
			.attr("width", (width + margin.left + margin.right))
			.attr("height", (height + margin.top + margin.bottom));
			
var wrapper = svg.append("g").attr("class", "chordWrapper")
			.attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");;
			
var outerRadius = Math.min(width, height) / 2  - (mobileScreen ? 80 : 100),
	innerRadius = outerRadius * 0.95,
	pullOutSize = (mobileScreen? 20 : 50),
	opacityDefault = 0.7, //default opacity of chords
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
[0,0,0,0,0,0,0,0,0,0,16,10,8,17,19,35,4,5,3,0],
[0,0,0,0,0,0,0,0,0,0,10,4,4,5,12,21,9,6,6,0],
[0,0,0,0,0,0,0,0,0,0,4,8,3,0,8,4,2,1,0,0],
[0,0,0,0,0,0,0,0,0,0,7,2,1,6,16,38,1,5,3,0],
[0,0,0,0,0,0,0,0,0,0,6,7,6,27,11,65,1,0,3,0],
[0,0,0,0,0,0,0,0,0,0,5,13,1,23,52,18,3,2,2,0],
[0,0,0,0,0,0,0,0,0,0,9,9,1,0,4,5,4,0,1,0],
[0,0,0,0,0,0,0,0,0,0,0,8,0,8,6,1,3,5,5,0],
[0,0,0,0,0,0,0,0,0,0,1,2,1,4,6,7,0,6,3,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,300],
[16,10,4,7,6,5,9,0,1,0,0,0,0,0,0,0,0,0,0,0],
[10,4,8,2,7,13,9,8,2,0,0,0,0,0,0,0,0,0,0,0],
[8,4,3,1,6,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
[17,5,0,6,27,23,0,8,4,0,0,0,0,0,0,0,0,0,0,0],
[19,12,8,16,11,52,4,6,6,0,0,0,0,0,0,0,0,0,0,0],
[35,21,4,38,65,18,5,1,7,0,0,0,0,0,0,0,0,0,0,0],
[4,9,2,1,1,3,4,3,0,0,0,0,0,0,0,0,0,0,0,0],
[5,6,1,5,0,2,0,5,6,0,0,0,0,0,0,0,0,0,0,0],
[3,6,0,3,3,2,1,5,3,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,300,0,0,0,0,0,0,0,0,0,0],
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
	
var arc = d3.svg.arc()
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

var g = wrapper.selectAll("g.group")
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
		var c = arc.centroid(d);
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
 
var chords = wrapper.selectAll("path.chord")
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
g.append("title")	
	.text(function(d, i) {return Math.round(d.value) + " people in " + Names[i];});
	
//Chords
chords.append("title")
	.text(function(d) {
		return [Math.round(d.source.value), " people from ", Names[d.target.index], " to ", Names[d.source.index]].join(""); 
	});
	
////////////////////////////////////////////////////////////
////////////////// Extra Functions /////////////////////////
////////////////////////////////////////////////////////////

//Include the offset in de start and end angle to rotate the Chord diagram clockwise
function startAngle(d) { return d.startAngle + offset; }
function endAngle(d) { return d.endAngle + offset; }

// Returns an event handler for fading a given chord group
function fade(opacity) {
  return function(d, i) {
	wrapper.selectAll("path.chord")
		.filter(function(d) { return d.source.index != i && d.target.index != i && Names[d.source.index] != ""; })
		.transition()
		.style("opacity", opacity);
  };
}//fade

// Fade function when hovering over chord
function fadeOnChord(d) {
	var chosen = d;
	wrapper.selectAll("path.chord")
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
		tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

	while (word = words.pop()) {
	  line.push(word);
	  tspan.text(line.join(" "));
	  if (tspan.node().getComputedTextLength() > width) {
		line.pop();
		tspan.text(line.join(" "));
		line = [word];
		tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
	  }
	}
  });
}//wrapChord