document.addEventListener("DOMContentLoaded", () => { 
  const width = 1000;
  const height = 1000;
  const outerRadius = 350;
  const innerRadius = outerRadius - 20;
  const segmentColor = "var(--theme-primary)";
  const gapAngle = 0.17; 

  const segmentSizes = [55]; 
  const segmentSizesRadians = segmentSizes.map((deg) => (deg * Math.PI) / 180);

  const startingAngleDeg = 25; 
  const startingAngleRad = (startingAngleDeg * Math.PI) / 180; 

  const svg = d3
    .select("#c11")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  let currentAngle = startingAngleRad; 
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
      .attr("fill", segmentColor).attr("fill-opacity", 0.9);

    currentAngle = endAngle + gapAngle / 2;
  });
});
