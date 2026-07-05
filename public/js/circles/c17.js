document.addEventListener("DOMContentLoaded", () => {
    const width = 1000; // Canvas width
    const height = 1000; // Canvas height
    const cornerRadius = 3; // Corner radius for rounding
    const glowIntensity = 1; // Glow intensity
  
    // Segment configuration (start angle, end angle in degrees)
    const segments = [
      { start: 38, end: 48 },
      { start: 114, end: 124 },
      { start: 233, end: 243 },
      { start: 309, end: 319.5 },
    ];
  
    // Convert degrees to radians for D3
    const toRadians = (deg) => (deg * Math.PI) / 180;
  
    // Create the SVG canvas
    const svg = d3
      .select("#c17")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);
  
    // Define the glow filter
    const defs = svg.append("defs");
  
    const filter = defs
      .append("filter")
      .attr("id", "glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");
  
    filter
      .append("feGaussianBlur")
      .attr("in", "SourceGraphic")
      .attr("stdDeviation", glowIntensity);
  
    filter
      .append("feMerge")
      .selectAll("feMergeNode")
      .data(["SourceGraphic", "SourceGraphic"])
      .enter()
      .append("feMergeNode")
      .attr("in", (d) => d);
  
    // Function to draw segments
    const drawSegments = (outerRadius, innerRadius, segmentColor) => {
      const midpointRadius = (outerRadius + innerRadius) / 2; // Midpoint radius for connector circles
  
      segments.forEach(({ start, end }) => {
        const startAngle = toRadians(start);
        const endAngle = toRadians(end);
  
        // Arc generator for the segment
        const arc = d3
          .arc()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius)
          .startAngle(startAngle)
          .endAngle(endAngle)
          .cornerRadius(cornerRadius);
  
        // Append the arc to the SVG
        svg
          .append("path")
          .attr("d", arc)
          .attr("fill", segmentColor)
          .attr("filter", "url(#glow2)"); // Apply the glow filter
  
        // Calculate positions for connectors at the midpoint radius
        const endX = midpointRadius * Math.cos(endAngle - Math.PI / 2);
        const endY = midpointRadius * Math.sin(endAngle - Math.PI / 2);
  
        const startX = midpointRadius * Math.cos(startAngle - Math.PI / 2);
        const startY = midpointRadius * Math.sin(startAngle - Math.PI / 2);
  
        // Add connectors at start and end (circles in this case)
        svg
          .append("circle")
          .attr("cx", endX)
          .attr("cy", endY)
          .attr("r", 3) // Radius of the connector
          .attr("fill", "rgb(252, 104, 6)")
          .attr("filter", "url(#glow2)");
  
        svg
          .append("circle")
          .attr("cx", startX)
          .attr("cy", startY)
          .attr("r", 3) // Radius of the connector
          .attr("fill", "rgb(252, 104, 6)")
          .attr("filter", "url(#glow2)");
      });
    };
  
    // Draw the segments for both radii
    drawSegments(228, 226, "rgb(252, 104, 6)"); // Outer set
    drawSegments(218, 216, "rgb(252, 104, 6)"); // Inner set
  });
  