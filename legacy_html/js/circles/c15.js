document.addEventListener("DOMContentLoaded", () => { 
  const width = 1000;
  const height = 1000;
  const outerRadius = 325;
  const innerRadius = outerRadius - 20;
  const segmentColor = "rgba(104, 255, 240, 0.7)";
  const gapAngle = 0.17; // Gap between segments in radians

  const segmentSizes = [13]; // Segment sizes in degrees
  const segmentSizesRadians = segmentSizes.map((deg) => (deg * Math.PI) / 180);

  const svg = d3
    .select("#c15")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  segmentSizesRadians.forEach((segmentAngle) => {
    // First segment
    const startAngle = gapAngle / 2;
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

    // Opposite segment (diagonal)
    const startAngleOpposite = startAngle + Math.PI; // 180 degrees in radians
    const endAngleOpposite = endAngle + Math.PI;

    const arcOpposite = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(startAngleOpposite)
      .endAngle(endAngleOpposite);

    svg
      .append("path")
      .attr("d", arcOpposite)
      .attr("fill", segmentColor);
  });
});
