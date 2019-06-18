// @TODO: YOUR CODE HERE!

console.log("Howdy!")
// Create an a space for the chart
var svgWidth = 960;
var svgHeight = 500;

// Add margins that are needed within the space for the chart
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

//Create a new space for the chart taking into account the margins
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart and shift the latter by left and top margins
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

//Create a chart group that has the appropriate space for chart (with margins)
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data from an external CSV file
d3.csv("/assets/data/data.csv").then(function(healthData) {
    console.log("Okay!")
         
    // Step 1: Format/Parse the data as numbers
    //==================================
    healthData.forEach(function(data) {
      console.log(data)
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });
      console.log("Max of Healthcare: " + d3.max(healthData, d => d.healthcare))
      //console.log("Extent of Healthcare is: "+ d3.extent(healthData, d => d.healthcare))
      console.log("Max of Poverty is: " + d3.max(healthData, d => d.poverty))
      //console.log("Another max of Healthcare: " + d3.max(d3.values(healthData, d => d.healthcare))) 
      
      // Step 2: Create scale functions
      // ==============================
      var xLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, d => d.healthcare)])
        .range([0, width]);
  
      var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, d => d.poverty)])
        .range([height, 0]);
  
      // Step 3: Create axis functions
      // ==============================
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);
  
      // Step 4: Append Axes to the chart
      // ==============================
      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
  
      chartGroup.append("g")
        .call(leftAxis);
  
      // Step 5: Create Circles
      // ==============================
      var circlesGroup = chartGroup.selectAll("circle")
      .data(healthData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.healthcare))
      .attr("cy", d => yLinearScale(d.poverty))
      .attr("r", "15")
      .attr("fill", "blue")
      .attr("opacity", ".5");
  
    console.log(circlesGroup)



    //   Step 6: Add labels to Scatterplot points
    //   ==============================
      var pointLabels = chartGroup.selectAll(null)
        .data(healthData)
        .enter()
        .append("text");

      pointLabels.attr("x", function(d) {
            return xLinearScale(d.healthcare);
        })
        .attr("y", function(d) {
            return yLinearScale(d.poverty);
        })
        .text(function(d) {
            return d.abbr;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("text-anchor", "middle")
        .attr("fill", "white");

      // Step 7: Initialize tool tip
      // ==============================
      var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
          return (`${d.abbr}<br>Percent Lacking Healthcare: ${d.healthcare}<br>Percent in Poverty: ${d.poverty}`);
        });
  
      // Step 7: Create tooltip in the chart
      // ==============================
      chartGroup.call(toolTip);
  
      // Step 8: Create event listeners to display and hide the tooltip
      // ==============================
      circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
      })
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });
  
      // Create axes labels
      chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Percent population in Poverty");
  
      chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Percent population without Healthcare");
      

      
    });
    
  