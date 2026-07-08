const parseRGB = (colorStr, defaultRGB) => {
    if (!colorStr) return defaultRGB;
    let match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    }
    if (colorStr.startsWith("#")) {
      let hex = colorStr.slice(1);
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      if (hex.length === 6) {
        return [
          parseInt(hex.slice(0, 2), 16),
          parseInt(hex.slice(2, 4), 16),
          parseInt(hex.slice(4, 6), 16)
        ];
      }
    }
    return defaultRGB;
  };
let startMorphing = false;
let isInFastSpin = false;
let isIdleRotationActive = true;
let lastTimestamp = 0;
let percentageR = 0;
let percentageB = 0;
let rotationAngle = -100;


const rotateIdle = (timestamp) => {
  if (!isIdleRotationActive || isInFastSpin) return;

  if (lastTimestamp) {
    const deltaTime = timestamp - lastTimestamp;
    rotationAngle += Math.sin(timestamp * 0.005) * 0.5 * deltaTime * 0.05;
    d3.select("#c2").style("transform", `rotate(${rotationAngle}deg)`);
  }

  lastTimestamp = timestamp;
  requestAnimationFrame(rotateIdle);
};

const animate = () => {
  if (percentageB === 100 && percentageR === 100) {
    return;
  }
  if (percentageR < 100) {
    percentageR += 2.5;
  } else if (percentageB < 100) {
    percentageB += 2.5;
  } else if (percentageB > 0) {
    percentageB -= 2.5;
  }

  drawShape(percentageR, percentageB);
  requestAnimationFrame(animate);
};

const fastSpin = () => {
  if (!startMorphing || !isInFastSpin) return;

  rotationAngle += 2;
  if (rotationAngle >= 360) rotationAngle -= 360;

  d3.select("#c2").style("transform", `rotate(${rotationAngle}deg)`);
  requestAnimationFrame(fastSpin);
};

const smoothTransitionBackToIdle = () => {
  let transitionStartTime = null;
  const transitionDuration = 4000;
  const startPercentageR = percentageR;
  const startPercentageB = percentageB;
  const startRotationAngle = ((rotationAngle % 360) + 360) % 360;
  const idleRotationAngle = 0;

  isInFastSpin = false;
  isIdleRotationActive = false;
  startMorphing = false;

  const easeOut = (t) => t * (2 - t);

  const transitionStep = (timestamp) => {
    if (!transitionStartTime) transitionStartTime = timestamp;
    const elapsed = timestamp - transitionStartTime;

    if (elapsed < transitionDuration) {
      const progress = elapsed / transitionDuration;
      const easedProgress = easeOut(progress);

      rotationAngle = startRotationAngle * (1 - easedProgress);
      percentageR = startPercentageR * (1 - easedProgress);
      percentageB = startPercentageB * (1 - easedProgress);

      d3.select("#c2").style("transform", `rotate(${rotationAngle}deg)`);
      drawShape(percentageR, percentageB);

      requestAnimationFrame(transitionStep);
    } else {
      rotationAngle = idleRotationAngle;
      isIdleRotationActive = true;
      startMorphing = false;
      percentageR = 0;
      percentageB = 0;
      drawShape(0, 0);
      rotateIdle(performance.now());
    }
  };

  requestAnimationFrame(transitionStep);
};

document.addEventListener("DOMContentLoaded", () => {
  const width = 1000;
  const height = 1000;
  const numSegments = 25;
  const gapAngle = 0.1;

  const svg = d3
    .select("#c2")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  const defs = svg.append("defs");
  const filter = defs.append("filter")
    .attr("id", "glowInner")
    .attr("filterUnits", "userSpaceOnUse")
    .attr("x", -200)
    .attr("y", -200)
    .attr("width", 400)
    .attr("height", 400);

  filter.append("feGaussianBlur").attr("stdDeviation", 10).attr("result", "coloredBlur");
  filter.append("feFlood").attr("flood-color", "var(--theme-primary)").attr("flood-opacity", 1).attr("result", "glowInner");
  filter.append("feComposite").attr("in", "glowInner").attr("in2", "coloredBlur").attr("operator", "in").attr("result", "glowInner");
  filter.append("feMerge").selectAll("feMergeNode").data(["glowInner", "SourceGraphic"]).enter().append("feMergeNode").attr("in", (d) => d);

  window.drawShape = (pR, pB) => {
    svg.selectAll("*").remove();

    const tiltAngle = 0.14 - (pR / 100) * 0.14;
    const outerRadius = 150 + (pB / 100) * 30;
    const innerRadius = outerRadius - (15 + (pB / 100) * 30);

    const segmentAngle = (2 * Math.PI) / numSegments;
    for (let i = 0; i < numSegments; i++) {
      const startAngle = i * segmentAngle + gapAngle / 2;
      const endAngle = (i + 1) * segmentAngle - gapAngle / 2;

      const x1 = Math.cos(startAngle) * innerRadius;
      const y1 = Math.sin(startAngle) * innerRadius;
      const x2 = Math.cos(startAngle + tiltAngle) * outerRadius;
      const y2 = Math.sin(startAngle + tiltAngle) * outerRadius;
      const x3 = Math.cos(endAngle + tiltAngle) * outerRadius;
      const y3 = Math.sin(endAngle + tiltAngle) * outerRadius;
      const x4 = Math.cos(endAngle) * innerRadius;
      const y4 = Math.sin(endAngle) * innerRadius;

      const computedStyle = getComputedStyle(document.documentElement);
      const themePrimary = computedStyle.getPropertyValue("--theme-primary").trim() || "#68fff0";
      const themeSecondary = computedStyle.getPropertyValue("--theme-secondary").trim() || "rgb(252, 104, 6)";
      const startRGB = parseRGB(themePrimary, [104, 255, 240]);
      const endRGB = parseRGB(themeSecondary, [252, 104, 6]);
      const r = Math.round(startRGB[0] + (endRGB[0] - startRGB[0]) * (pB / 100));
      const g = Math.round(startRGB[1] + (endRGB[1] - startRGB[1]) * (pB / 100));
      const b = Math.round(startRGB[2] + (endRGB[2] - startRGB[2]) * (pB / 100));

      svg.append("polygon")
        .attr("points", `${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}`)
        .attr("fill", `rgb(${r}, ${g}, ${b})`)
        .attr("filter", "url(#glowInner)")
        .attr("stroke-width", pB / 10);
    }
  };

  drawShape(0, 0);
  rotateIdle(performance.now());
});
