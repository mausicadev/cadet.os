document.addEventListener("DOMContentLoaded", () => {
    const width = 1000; 
    const height = 1000; 
    const cornerRadius = 3; 
    const glowIntensity = 1; 
  
    
    const segments = [
      { start: 38, end: 48 },
      { start: 114, end: 124 },
      { start: 233, end: 243 },
      { start: 309, end: 319.5 },
    ];
  
    
    const toRadians = (deg) => (deg * Math.PI) / 180;
  
    
    const svg = d3
      .select("#c17")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);
  
    
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
  
    
    const drawSegments = (outerRadius, innerRadius, segmentColor) => {
      const midpointRadius = (outerRadius + innerRadius) / 2; 
  
      segments.forEach(({ start, end }) => {
        const startAngle = toRadians(start);
        const endAngle = toRadians(end);
  
        
        const arc = d3
          .arc()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius)
          .startAngle(startAngle)
          .endAngle(endAngle)
          .cornerRadius(cornerRadius);
  
        
        svg
          .append("path")
          .attr("d", arc)
          .attr("fill", segmentColor)
          .attr("filter", "url(#glow2)"); 
  
        
        const endX = midpointRadius * Math.cos(endAngle - Math.PI / 2);
        const endY = midpointRadius * Math.sin(endAngle - Math.PI / 2);
  
        const startX = midpointRadius * Math.cos(startAngle - Math.PI / 2);
        const startY = midpointRadius * Math.sin(startAngle - Math.PI / 2);
  
        
        svg
          .append("circle")
          .attr("cx", endX)
          .attr("cy", endY)
          .attr("r", 3) 
          .attr("fill", "var(--theme-secondary)")
          .attr("filter", "url(#glow2)");
  
        svg
          .append("circle")
          .attr("cx", startX)
          .attr("cy", startY)
          .attr("r", 3) 
          .attr("fill", "var(--theme-secondary)")
          .attr("filter", "url(#glow2)");
      });
    };
  
    
    drawSegments(228, 226, "var(--theme-secondary)"); 
    drawSegments(218, 216, "var(--theme-secondary)"); 
  });
  