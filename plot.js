// Initializes the page with a default key value
function init() {


  data = [{
    x: [1, 2, 3, 4, 5],
    y: [1, 2, 3, 4, 5]
  }];

  var chart = d3.selectAll("#plot").node();

  Plotly.newPlot("plot", data);
}

// This function is called when a dropdown menu item is selected
function updatePlotly(dataset) {

  var chart = d3.selectAll("#plot").node();

  // Initialize x and y arrays
  var x = [];
  var y = [];

  console.log(dataset);

  switch(dataset) {
    case "940":
      message = "dataset1";
      x = [1, 2, 3, 4, 5];
      y = [1, 2, 4, 8, 16];
      break;
    case "941":
      message = "dataset2";
      x = [10, 20, 30, 40, 50];
      y = [1, 10, 100, 1000, 10000];
      break;
    case "942":
      message = "dataset3";
      x = [100, 200, 300, 400, 500];
      y = [10, 100, 50, 10, 0];
      break;
    default:
      x = [1, 2, 3, 4, 5];
      y = [1, 2, 3, 4, 5];
      message = "Default";
  }

  // Note the extra brackets around 'x' and 'y'
  Plotly.restyle(chart, "x", [x]);
  Plotly.restyle(chart, "y", [y]);
}

	// create the drop down menu of cities
	//var selector = d3.select("body")
	//	.append("select")
	//	.attr("id", "cityselector")
	//	.selectAll("option")
	//	.data(data)
	//	.enter().append("option")
	//	.text(function(d) { return d.city; })
	//	.attr("value", function (d, i) {
	//		return i;
	//	});
function readJson(){
  d3.json("data/samples.json").then((data) => {
    return data;
  });
}

function buildPlot() {
  // Use D3 to select the dropdown menu
  var dropdownMenu = d3.select("#selId");

  //read the json file
  d3.json("data/samples.json").then((data) => {
    const idList = data.names,
        select = document.getElementById('idList');
    console.log(idList);
    //for( id in idList ) {
    //    select.add( new Option( selId[id] ) );
    //};
    idList.forEach((item) => {
      dropdownMenu.append("option").text(item).property("value", item)
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = idList[0];
    console.log(firstSample);
  });
    //init();

    // Assign the value of the dropdown menu option to a variable
    //var dataset = dropdownMenu.node().value;

    // Call updatePlotly() when a change takes place to the DOM
    //d3.selectAll("body").on("change", updatePlotly(dataset));
  //});
}
buildPlot();
