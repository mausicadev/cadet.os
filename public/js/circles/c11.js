document.addEventListener("DOMContentLoaded", () => { 
  const width = 1000;
  const height = 1000;
  const outerRadius = 350;
  const innerRadius = outerRadius - 20;
  const segmentColor = "rgba(104, 255, 240, 0.9)";
  const gapAngle = 0.17; // Gap between segments in radians

  const segmentSizes = [55]; // Segment sizes in degrees
  const segmentSizesRadians = segmentSizes.map((deg) => (deg * Math.PI) / 180);

  const startingAngleDeg = 25; // Starting position in degrees
  const startingAngleRad = (startingAngleDeg * Math.PI) / 180; // Convert to radians

  const svg = d3
    .select("#c11")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  let currentAngle = startingAngleRad; // Start from the specified angle
  segmentSizesRadians.forEach((segmentAngle) => {
    const startAngle = currentAngle + gapAngle / 2;
    const endAngle = startAngle + segmentAngle - gapAngle;

    const arc = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(startAngle)
      .endAngle(endAngle);

    svg
      .append("path")
      .attr("d", arc)
      .attr("fill", segmentColor);

    currentAngle = endAngle + gapAngle / 2;
  });
});
