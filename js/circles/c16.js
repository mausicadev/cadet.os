document.addEventListener("DOMContentLoaded", () => {
  const width = 1000; // Canvas width
  const height = 1000; // Canvas height
  const outerRadius = 267; // Outer radius of the circle
  const innerRadius = outerRadius - 2; // Inner radius of the circle
  const segmentColor = "#265152"; // Color for the segments
  const cornerRadius = 1; // Corner radius for rounding

  // Segment configuration (start angle, end angle in degrees)
  const segments = [
    { start: 69, end: 89, capAt: "end" }, // Add cap at the start
    { start: 91, end: 111, capAt: "start" },   // Add cap at the end
    { start: 249, end: 269, capAt: "end" }, 
    { start: 271, end: 291, capAt: "start" },
  ];

  // Convert degrees to radians for D3
  const toRadians = (deg) => (deg * Math.PI) / 180;

  // Create the SVG canvas
  const svg = d3
    .select("#c16")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  // Draw each segment and add caps if necessary
  segments.forEach(({ start, end, capAt }) => {
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

    // Append the segment arc to the SVG
    svg
      .append("path")
      .attr("d", arc)
      .attr("fill", segmentColor);

    // Add cap at the start if specified
    if (capAt === "start") {
      const capArc = d3
        .arc()
        .innerRadius(innerRadius) // Slightly smaller inner radius for the cap
        .outerRadius(outerRadius + 9) // Slightly larger outer radius for the cap
        .startAngle(startAngle)
        .endAngle(startAngle + 0.006); // A small arc for the cap

      svg
        .append("path")
        .attr("d", capArc)
        .attr("fill", segmentColor);
    }

    // Add cap at the end if specified
    if (capAt === "end") {
      const capArc = d3
        .arc()
        .innerRadius(innerRadius) // Slightly smaller inner radius for the cap
        .outerRadius(outerRadius + 9) // Slightly larger outer radius for the cap
        .startAngle(endAngle - 0.006) // A small arc for the cap
        .endAngle(endAngle);

      svg
        .append("path")
        .attr("d", capArc)
        .attr("fill", segmentColor);
    }
  });
});
