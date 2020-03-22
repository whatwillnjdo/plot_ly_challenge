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

function plotGaugeChart(frequency) {
  var data = [
     {
       domain: { x: [0, 1], y: [0, 1] },
       value: frequency,
       title: { text: "Belly Button Washing Frequency" },
       type: "indicator",
       mode: "gauge+number+delta",
       gauge: {
         axis: { range: [1, 9] },
         steps: [
           { range: [0, 1], color: "rgba(255, 255, 255, 0)" },
           { range: [1, 2], color: "rgba(232, 226, 202, .5)" },
           { range: [2, 3], color: "rgba(210, 206, 145, .5)" },
           { range: [3, 4], color: "rgba(202, 209, 95, .5)" },
           { range: [4, 5], color: "rgba(190, 205, 65, .5)" },
           { range: [5, 6], color: "rgba(170, 202, 42, .5)" },
           { range: [6, 7], color: "rgba(130, 174, 35, .5)" },
           { range: [7, 8], color: "rgba(110, 154, 22, .5)" },
           { range: [8, 9], color: "rgba(14, 127, 0, .5)" }
         ]
         }
     }
   ];

  var layout = { margin: { t: 0, b: 0 } };
  Plotly.newPlot('gauge', data, layout);
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
    plotGaugeChart(firstSample.wfreq);

  });
}

function optionChanged(newSample) {

       //read the json file
       d3.json("data/samples.json").then((sampleNames) => {
         //Get the ID to populate the demographic info
         var filteredMetaData = sampleNames.metadata.filter(record => record.id == newSample);
         populateDemographicInfo(filteredMetaData[0]);

         //Get the OTU names and values
         var filteredSample = sampleNames.samples.filter(record => record.id == newSample);
         var sortedByOTUValues = filteredSample.sort((a, b) => b.sample_values - a.sample_values);

         plotBarChart(sortedByOTUValues);
         plotBubbleChart(filteredSample);
         plotGaugeChart(filteredMetaData[0].wfreq);

       })
    };
buildPlot();
