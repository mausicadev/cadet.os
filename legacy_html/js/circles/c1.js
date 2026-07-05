document.addEventListener("DOMContentLoaded", () => {
    const width = 1000;
    const height = 1000;
    const outerRadius = 240; // Radius of the circle
    const innerRadius = outerRadius - 38; // Inner radius to add background
    const segmentWidth = 15; // Thickness of each segment
    const cornerRadius = 2; // Rounded corners for segments
    const padAngle = 0.05; // Spacing between segments
    // Colors
    const backgroundColor = "rgba(0, 0, 0, 0)"; // Cyan, semi-transparent
    const borderColor = "#5ca9aa"; // Bright cyan for borders
    const segmentColors = ["rgba(21, 63, 68, 0.4)"]; // Teal for segments
    const numSegments = 24; // Number of segments
    const segmentAngle = (2 * Math.PI) / numSegments; // Angle for each segment
  
    // Append SVG
    const svg = d3
      .select("#c1")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);
  
    svg
      .append("circle")
      .attr("r", innerRadius)
      .attr("fill", backgroundColor);
  
    // Create segments
    for (let i = 0; i < numSegments; i++) {
      svg
        .append("path")
        .attr(
          "d",
          d3
            .arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
            .startAngle(i * segmentAngle)
            .endAngle((i + 1) * segmentAngle - padAngle)
            .cornerRadius(cornerRadius)
        )
        .attr("fill", segmentColors[i % segmentColors.length])
        .attr("stroke", borderColor)
        .attr("stroke-width", 2);
    }
  });
  