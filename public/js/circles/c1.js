document.addEventListener("DOMContentLoaded", () => {
    const width = 1000;
    const height = 1000;
    const outerRadius = 240; 
    const innerRadius = outerRadius - 38; 
    const segmentWidth = 15; 
    const cornerRadius = 2; 
    const padAngle = 0.05; 
    
    const backgroundColor = "rgba(0, 0, 0, 0)"; 
    const borderColor = "var(--theme-primary)"; 
    const segmentColors = ["var(--theme-primary-bg)"]; 
    const numSegments = 24; 
    const segmentAngle = (2 * Math.PI) / numSegments; 
  
    
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
        .attr("stroke", borderColor).attr("stroke-opacity", 0.7)
        .attr("stroke-width", 2);
    }
  });
  