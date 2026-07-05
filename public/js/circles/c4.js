document.addEventListener("DOMContentLoaded", () => {
    const width = 1000, height = 1000;
    const innerOuterRadius = 270, outerInnerRadius = 280;
    const lineLengthExtension = 2.2, lineLengthReduction = 2.2;
    const segmentColor = "#265152", lineColor = "rgb(104, 255, 240)";
    const gapAngle = 0.05, inclinationAngle = 0.06;
    const startAngleOffset1 = 1.517, startAngleOffset2 = 1.567, endAngleFactor = 0.357;
    const glowIntensity = 1; // Glow intensity for connectors
  
    const innerSegmentSizes = [133, 133];
    const outerSegmentSizes = [41, 41];
  
    const innerSegmentSizesRadians = innerSegmentSizes.map(deg => (deg * Math.PI) / 180);
    const outerSegmentSizesRadians = outerSegmentSizes.map(deg => (deg * Math.PI) / 180);
  
    const svg = d3.select("#c4")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);
  
    const polarToCartesian = (radius, angle) => ({
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
    });
  
    // Define the glow filter for connectors
    const defs = svg.append("defs");
    const filter = defs
        .append("filter")
        .attr("id", "glow")
        .attr("x", "-50%")
        .attr("y", "-50%")
        .attr("width", "200%")
        .attr("height", "200%");
  
    filter.append("feGaussianBlur")
        .attr("in", "SourceGraphic")
        .attr("stdDeviation", glowIntensity);
  
    filter.append("feMerge")
        .selectAll("feMergeNode")
        .data(["SourceGraphic", "SourceGraphic"])
        .enter()
        .append("feMergeNode")
        .attr("in", d => d);
  
    innerSegmentSizesRadians.forEach((segmentAngle, index) => {
        const startAngle = index === 0 ? 0 : Math.PI;
        const endAngle = startAngle + segmentAngle;
  
        const arc = d3.arc()
            .innerRadius(innerOuterRadius - 2)
            .outerRadius(innerOuterRadius)
            .startAngle(startAngle)
            .endAngle(endAngle);
  
        svg.append("path").attr("d", arc).attr("fill", segmentColor);
    });
  
    outerSegmentSizesRadians.forEach((segmentAngle, index) => {
        const startAngle = index === 0
            ? innerSegmentSizesRadians[0] + gapAngle
            : innerSegmentSizesRadians[0] + Math.PI + gapAngle;
        const endAngle = startAngle + segmentAngle;
  
        const arc = d3.arc()
            .innerRadius(outerInnerRadius)
            .outerRadius(outerInnerRadius + 2)
            .startAngle(startAngle)
            .endAngle(endAngle);
  
        svg.append("path").attr("d", arc).attr("fill", segmentColor);
    });
  
    innerSegmentSizesRadians.forEach((segmentAngle, index) => {
        const startAngle = index === 0
            ? innerSegmentSizesRadians[0] + gapAngle + startAngleOffset1
            : innerSegmentSizesRadians[0] + Math.PI + startAngleOffset2;
        const endAngle = startAngle + segmentAngle * endAngleFactor;
  
        const pointsToConnect = [
            { angle: startAngle },
            { angle: endAngle },
        ];
  
        pointsToConnect.forEach(({ angle }, pointIndex) => {
            const innerPoint = polarToCartesian(innerOuterRadius - lineLengthReduction, angle);
            const inclinedOuterAngle = angle + (pointIndex === 0 ? inclinationAngle : -inclinationAngle);
            const extendedOuterPoint = polarToCartesian(outerInnerRadius + lineLengthExtension, inclinedOuterAngle);
  
            svg.append("line")
                .attr("x1", innerPoint.x)
                .attr("y1", innerPoint.y)
                .attr("x2", extendedOuterPoint.x)
                .attr("y2", extendedOuterPoint.y)
                .attr("stroke", lineColor)
                .attr("stroke-width", 3)
                .attr("filter", "url(#glow)"); // Apply the glow filter
        });
    });
  });
  