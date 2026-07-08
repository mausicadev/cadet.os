document.addEventListener("DOMContentLoaded", () => {
  const width = 1000; 
  const height = 1000; 
  const outerRadius = 267; 
  const innerRadius = outerRadius - 2; 
  const segmentColor = "var(--theme-primary-bg)"; 
  const cornerRadius = 1; 

  
  const segments = [
    { start: 69, end: 89, capAt: "end" }, 
    { start: 91, end: 111, capAt: "start" },   
    { start: 249, end: 269, capAt: "end" }, 
    { start: 271, end: 291, capAt: "start" },
  ];

  
  const toRadians = (deg) => (deg * Math.PI) / 180;

  
  const svg = d3
    .select("#c16")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  
  segments.forEach(({ start, end, capAt }) => {
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
      .attr("fill", segmentColor);

    
    if (capAt === "start") {
      const capArc = d3
        .arc()
        .innerRadius(innerRadius) 
        .outerRadius(outerRadius + 9) 
        .startAngle(startAngle)
        .endAngle(startAngle + 0.006); 

      svg
        .append("path")
        .attr("d", capArc)
        .attr("fill", segmentColor);
    }

    
    if (capAt === "end") {
      const capArc = d3
        .arc()
        .innerRadius(innerRadius) 
        .outerRadius(outerRadius + 9) 
        .startAngle(endAngle - 0.006) 
        .endAngle(endAngle);

      svg
        .append("path")
        .attr("d", capArc)
        .attr("fill", segmentColor);
    }
  });
});
