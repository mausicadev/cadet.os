document.addEventListener("DOMContentLoaded", () => {
    const width = 1000; // Canvas width
    const height = 1000; // Canvas height
    const outerRadius = 281; // Outer radius of the circle
    const innerRadius = outerRadius - 8; // Inner radius of the circle
    const segmentColor = "rgb(104, 255, 240)"; // Color for the segments
    const cornerRadius = 0; // Corner radius for rounding
    const glowIntensity = 0; // Control the intensity of the glow
  
    // Segment configuration (start angle, end angle in degrees)
    const segments = [
      { start: 28, end: 68 },
      { start: 112, end: 153.5 },
      { start: 206.5, end: 248 },
      { start: 292, end: 333.5 },
    ];
  
    // Convert degrees to radians for D3
    const toRadians = (deg) => (deg * Math.PI) / 180;
  
    // Create the SVG canvas
    const svg = d3
      .select("#c7")
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
  
    // Draw each segment
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
        .cornerRadius(cornerRadius); // Add corner radius
  
      // Append the arc to the SVG
      svg
        .append("path")
        .attr("d", arc)
        .attr("fill", segmentColor)
        .attr("filter", "url(#glow)"); // Apply the glow filter
    });
  });
  