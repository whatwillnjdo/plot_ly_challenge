function populateDemographicInfo(givenSample) {

  // Grab a reference to the dropdown select element
  var demographicInfo = d3.select("#sample-metadata");

  demographicInfo.html("");

  var keys = d3.keys(givenSample);
  var values = d3.values(givenSample);

  for (var i = 0; i < keys.length; i++) {
    demographicInfo.append("h6").text(`${keys[i]}:${values[i]}`)
  }
}

//This function will take the sorted data
//will do the necessary data clean up and plot the bar chart
function plotBarChart(sortedData) {

  //Pick the OTU ID take the top 10 order it ascending and convert to a string
  var otuIds = sortedData[0].otu_ids.slice(0, 10).reverse().map(String);
  //Once a string append OTU to the beginning
  for (var i = 0; i < otuIds.length; i++) {
    otuIds[i]="OTU "+otuIds[i];
  }

  //Pick the OTU Values and OTU labels take the top 10 order it ascending
  var otuIdValues = sortedData[0].sample_values.slice(0, 10).reverse();
  var otuLabels = sortedData[0].otu_labels.slice(0, 10).reverse();

  // Trace1 for the horizontal bar chart
  var data = [{
    type: "bar",
    x: otuIdValues,
    y: otuIds,
    text: otuLabels,
    orientation: "h",
    mode: "markers",
    marker: {
      colorscale: "Earth",
      width: 1
    },
  }];

  // Apply the group bar mode to the layout
  var layout = {
    title: "Top 10 OTUs"
  };

  Plotly.newPlot("bar", data, layout);
}

//This function will take the filtered data and plot the bubble chart
function plotBubbleChart(filteredData) {

  var bubbleTrace = {
    x: filteredData[0].otu_ids,
    y: filteredData[0].sample_values,
    text: filteredData[0].otu_labels,
    mode: "markers",
    marker: {
      colorscale: "RdBu",
      size: filteredData[0].sample_values
    }
  };

  var bubbleData = [bubbleTrace];

  var bubbleLayout = {
    title: "OTU Bubble Chart",
    xaxis: { title: "OTU ID"}
  };

  Plotly.newPlot("bubble", bubbleData, bubbleLayout);
}

function buildPlot() {

  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  //read the json file
  d3.json("data/samples.json").then((sampleNames) => {

    var idList = sampleNames.names;

    idList.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames.metadata[0];
    populateDemographicInfo(firstSample);

    //Get the OTU names and values
    var filteredSample = [sampleNames.samples[0]];
    plotBarChart(filteredSample);
    plotBubbleChart(filteredSample);

  });
}

function optionChanged(newSample) {

       //read the json file
       d3.json("data/samples.json").then((sampleNames) => {
         //Get the ID to populate the demographic info
         var filteredMetaData = sampleNames.metadata.filter(record => record.id == newSample);
         populateDemographicInfo(filteredMetaData[0]);

         //console.log(filteredMetaData[0].wfreq);

         //Get the OTU names and values
         var filteredSample = sampleNames.samples.filter(record => record.id == newSample);
         var sortedByOTUValues = filteredSample.sort((a, b) => b.sample_values - a.sample_values);

         plotBarChart(sortedByOTUValues);
         plotBubbleChart(filteredSample);

       })
    };
buildPlot();
