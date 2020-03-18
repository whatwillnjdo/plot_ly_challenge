function buildPlot() {

  //read the json file
  d3.json("data/samples.json").then((data) => {
    var idList = data.names;
    console.log(idList);

    var select = d3.select('body')
                .append('select')
  	            .attr('class','select')
                .on('change',onchange)

    var options = select.selectAll('option')
	              .data(idList)
                .enter()
	              .append('option')
		            .text(function (d) { return d; });

    function onchange() {
	     selectValue = d3.select('select').property('value')
	      d3.select('body')
    };

    // Use the first sample from the list to build the initial plots
    const firstSample = idList[0];
    console.log(firstSample);
  });
}
buildPlot();
