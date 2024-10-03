// Build the metadata panel
function buildMetadata(sampleID) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
     // get the metadata field
     let metadata = data.metadata;

     // Filter the metadata for the object with the desired sample number
     let filteredData = metadata.filter(sample => sample.id == sampleID);
     let result = filteredData[0];
 
     // Use d3 to select the panel with id of `#sample-metadata`
     let panel = d3.select("#sample-metadata");
  
     // Use `.html("") to clear any existing metadata
     panel.html("");
 
     // Inside a loop, you will need to use d3 to append new
     // tags for each key-value in the filtered metadata.
     Object.entries(result).forEach(([key, value]) => {
       panel.append('li').text(`${key}: ${value}`);
      
      });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const filteredData = samples.filter(sampleBubble => sampleBubble.id == sample);
    const result = filteredData[0];

    // Get the otu_ids, otu_labels, and sample_values
    let ids = result.otu_ids;
    let labels = result.otu_labels;
    let values = result.sample_values;

    // Build a Bubble Chart
    var trace1 = [{
      x: ids,
      y: values,
      text: labels,
      mode: 'markers',
      marker: {
        color: ids,
        size: values
      }
    }];

    var layout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,

    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', trace1, layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    var data = [{
      type: 'bar',
      x: values.slice(0,10),
      y: ids.slice(0,10).map(ids =>"OTU "+ids),
      text: labels.slice(0,10),
      orientation: 'h'
      }];
    
      var layout = {
        title: 'Top 10 Bacteria Cultures Found',
        showlegend: false,
  
      };

    // Render the Bar Chart
    Plotly.newPlot('bar', data, layout);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

  // Get the names field
  let names = data.names;

  // Use d3 to select the dropdown with id of `#selDataset`
  let dropdownMenu = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  // Hint: Inside a loop, you will need to use d3 to append a new
  // option for each sample name.
  names.forEach(name => {

    dropdownMenu.append('option')
    .attr('value', 'newOption')
    .text(name)
    .property("value", name);
    
  });

  // Get the first sample from the list
  let first = names[0];

  // Build charts and metadata panel with the first sample
  buildMetadata(first)
  buildCharts(first)

});
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample)
  buildCharts(newSample)
}

// Initialize the dashboard
init();
