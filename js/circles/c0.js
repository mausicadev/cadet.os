document.addEventListener("DOMContentLoaded", async () => { 
    const svgContainer = document.getElementById("c0");
    const canvasSize = 1000; // Size of the canvas (outer SVG)
    const innerSize = 230;   // Size of the middle.svg

    // Create the main SVG canvas
    const canvas = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    canvas.setAttribute("width", canvasSize);
    canvas.setAttribute("height", canvasSize);
    canvas.setAttribute("viewBox", `0 0 ${canvasSize} ${canvasSize}`);
    svgContainer.appendChild(canvas);

    // Define a glow effect filter
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
    filter.setAttribute("id", "glow1");

    const feGaussianBlur = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
    feGaussianBlur.setAttribute("stdDeviation", "1"); // Amount of blur
    feGaussianBlur.setAttribute("result", "coloredBlur");

    const feMerge = document.createElementNS("http://www.w3.org/2000/svg", "feMerge");

    const feMergeNode1 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
    feMergeNode1.setAttribute("in", "coloredBlur");

    const feMergeNode2 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
    feMergeNode2.setAttribute("in", "SourceGraphic");

    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);

    filter.appendChild(feGaussianBlur);
    filter.appendChild(feMerge);
    defs.appendChild(filter);
    canvas.appendChild(defs);

    // Load the middle.svg
    const svgPath = "assets/svg/middle.svg";
    try {
        const response = await fetch(svgPath);
        if (!response.ok) throw new Error(`Error loading SVG: ${response.status}`);

        const svgContent = await response.text();
        const parser = new DOMParser();
        const middleSVG = parser.parseFromString(svgContent, "image/svg+xml").documentElement;

        // Set size of middle.svg
        middleSVG.setAttribute("width", innerSize);
        middleSVG.setAttribute("height", innerSize);

        // Center the middle.svg in the canvas
        middleSVG.setAttribute("x", (canvasSize - innerSize) / 2);
        middleSVG.setAttribute("y", (canvasSize - innerSize) / 2);

        // Apply the glow effect
        middleSVG.setAttribute("filter", "url(#glow1");

        // Append middle.svg to the main canvas
        canvas.appendChild(middleSVG);
    } catch (error) {
        console.error("Failed to load or manipulate middle.svg:", error);
    }
});
