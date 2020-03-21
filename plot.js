function populateDemographicInfo(givenSample) {

  // Grab a reference to the dropdown select element
  var demographicInfo = d3.select("#sample-metadata");

  demographicInfo.html("");

  //var filteredDate = tableData.filter(record => record.datetime === inputDateValue);

  var keys = d3.keys(givenSample);
  var values = d3.values(givenSample);

  console.log(keys.length);

  for (var i = 0; i < keys.length; i++) {
    demographicInfo.append("h5").text(`${keys[i]}:${values[i]}`)
  }

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
    console.log(firstSample);
    populateDemographicInfo(firstSample);

  });
}

function optionChanged(newSample) {
	     console.log(newSample);
       //read the json file
       d3.json("data/samples.json").then((sampleNames) => {
         //Get the ID to populate the demographic info
         var filteredMetaData = sampleNames.metadata.filter(record => record.id == newSample);
         populateDemographicInfo(filteredMetaData[0]);

         //Get the OTU names and values filter it and then sort it
         var filteredSample = sampleNames.samples.filter(record => record.id == newSample);
         var sortedByOTUValues = filteredSample.sort((a, b) => b.sample_values - a.sample_values);
         console.log(sortedByOTUValues);
         var otuIds = sortedByOTUValues[0].otu_ids.slice(0, 10).reverse().map(String);
         for (var i = 0; i < otuIds.length; i++) {
           otuIds[i]="OTU "+otuIds[i];
         }
         var otuIdValues = sortedByOTUValues[0].sample_values.slice(0, 10).reverse();
         var otuLabels = sortedByOTUValues[0].otu_labels.slice(0, 10).reverse();

         console.log(otuIds);

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


         // Slice the first 10 objects for plotting
         //slicedOTUData = sortedByOTUValues.slice(0, 10);


       })
    };
buildPlot();
