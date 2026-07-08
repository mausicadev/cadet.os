document.addEventListener("DOMContentLoaded", () => {
    const width = 1000; 
    const height = 1000; 
    const outerRadius = 276; 
    const innerRadius = outerRadius - 6; 
    const segmentColor = "transparent"; 
    const progressColors = ["var(--theme-primary)", "var(--theme-secondary)", "var(--theme-secondary)", "var(--theme-primary)"]; 
    const cornerRadius = 1; 
    const animationDuration = 1000; 

    
    const segments = [
        { start: 71, end: 88, capAt: "end" },
        { start: 92, end: 109, capAt: "start" },
        { start: 251, end: 268, capAt: "end" },
        { start: 272, end: 289, capAt: "start" },
    ];

    
    const progressValues = [50, 50, 50, 50];

    
    const toRadians = (deg) => (deg * Math.PI) / 180;

    
    const svg = d3
        .select("#c18")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    
    segments.forEach(({ start, end }, index) => {
        const startAngle = toRadians(start);
        const endAngle = toRadians(end);

        const arc = d3
            .arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
            .startAngle(startAngle)
            .endAngle(endAngle)
            .cornerRadius(cornerRadius);

        svg.append("path")
            .attr("d", arc)
            .attr("fill", segmentColor)
            .attr("class", `segment-${index}`);
    });

    
    const drawProgressBar = (segmentIndex, progress) => {
        const { start, end, capAt } = segments[segmentIndex];
        const totalAngle = end - start;
        let progressAngle;

        if (capAt === "start") {
            progressAngle = start + (totalAngle * progress) / 100;
        } else {
            progressAngle = end - (totalAngle * progress) / 100;
        }

        const startAngle = capAt === "start" ? toRadians(start) : toRadians(progressAngle);
        const endAngle = capAt === "start" ? toRadians(progressAngle) : toRadians(end);

        const progressArc = d3
            .arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
            .startAngle(startAngle)
            .endAngle(endAngle)
            .cornerRadius(cornerRadius);

        svg.selectAll(`.progress-segment-${segmentIndex}`).remove();

        svg.append("path")
            .attr("d", progressArc)
            .attr("class", `progress-segment-${segmentIndex}`)
            .attr("fill", progressColors[segmentIndex % progressColors.length]);
    };

    
    const animateProgress = () => {
        const newProgressValues = progressValues.map(() => Math.random() * 100);

        d3.transition()
            .duration(animationDuration)
            .ease(d3.easeSinInOut)
            .tween("progress", () => {
                const interpolates = progressValues.map((current, index) =>
                    d3.interpolate(current, newProgressValues[index])
                );
                return (t) => {
                    interpolates.forEach((interpolate, index) => {
                        progressValues[index] = interpolate(t);
                        drawProgressBar(index, progressValues[index]);
                    });
                };
            })
            .on("end", () => {
                setTimeout(animateProgress, Math.random() * 1000);
            });
    };

    
    animateProgress();
});
