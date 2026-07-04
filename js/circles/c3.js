document.addEventListener("DOMContentLoaded", () => {
  const width = 1000;
  const height = 1000;
  const outerRadius = 350;
  const innerRadius = outerRadius - 3;
  const segmentColor = "rgb(104, 255, 240)";
  const capLength = 20;
  const capOffset = 10;
  const capColor = "rgb(104, 255, 240)";
  const gapAngle = 0.17;

  const segmentSizes = [130, 100, 30, 30, 30, 30];
  const segmentSizesRadians = segmentSizes.map((deg) => (deg * Math.PI) / 180);

  const svg = d3
    .select("#c3")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  let currentAngle = 0;
  segmentSizesRadians.forEach((segmentAngle, index) => {
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

    if (index === 1) {
      const startCapAngle = startAngle - 1.570;
      const startCapX1 = (outerRadius - capOffset) * Math.cos(startCapAngle);
      const startCapY1 = (outerRadius - capOffset) * Math.sin(startCapAngle);
      const startCapX2 = (outerRadius + capLength - capOffset) * Math.cos(startCapAngle);
      const startCapY2 = (outerRadius + capLength - capOffset) * Math.sin(startCapAngle);
    
      svg
        .append("line")
        .attr("x1", startCapX1)
        .attr("y1", startCapY1)
        .attr("x2", startCapX2)
        .attr("y2", startCapY2)
        .attr("stroke", capColor)
        .attr("stroke-width", 3);

      const oppositeCapAngle = startAngle + 2.445; 
      const oppositeCapX1 = (outerRadius - 20) * Math.cos(oppositeCapAngle);
      const oppositeCapY1 = (outerRadius - 20) * Math.sin(oppositeCapAngle);
      const oppositeCapX2 = (outerRadius + capLength - 21) * Math.cos(oppositeCapAngle);
      const oppositeCapY2 = (outerRadius + capLength - 21) * Math.sin(oppositeCapAngle);

      svg
        .append("line")
        .attr("x1", oppositeCapX1)
        .attr("y1", oppositeCapY1)
        .attr("x2", oppositeCapX2)
        .attr("y2", oppositeCapY2)
        .attr("stroke", capColor)
        .attr("stroke-width", 4);
    }

    if (index === 0) {
      const capAngle = endAngle - 1.570;
      const endCapX1 = (outerRadius - capOffset) * Math.cos(capAngle);
      const endCapY1 = (outerRadius - capOffset) * Math.sin(capAngle);
      const endCapX2 = (outerRadius + capLength - capOffset) * Math.cos(capAngle);
      const endCapY2 = (outerRadius + capLength - capOffset) * Math.sin(capAngle);

      svg
        .append("line")
        .attr("x1", endCapX1)
        .attr("y1", endCapY1)
        .attr("x2", endCapX2)
        .attr("y2", endCapY2)
        .attr("stroke", capColor)
        .attr("stroke-width", 3);
    }
    currentAngle = endAngle + gapAngle / 2;
  });
});
