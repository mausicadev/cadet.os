document.addEventListener("DOMContentLoaded", async () => { 
    const svgContainer = document.getElementById("c0");
    const canvasSize = 1000; 
    const innerSize = 230;   

    
    const canvas = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    canvas.setAttribute("width", canvasSize);
    canvas.setAttribute("height", canvasSize);
    canvas.setAttribute("viewBox", `0 0 ${canvasSize} ${canvasSize}`);
    svgContainer.appendChild(canvas);

    
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
    filter.setAttribute("id", "glow1");

    const feGaussianBlur = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
    feGaussianBlur.setAttribute("stdDeviation", "1"); 
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

    
    const svgPath = "assets/svg/middle.svg";
    try {
        const response = await fetch(svgPath);
        if (!response.ok) throw new Error(`Error loading SVG: ${response.status}`);

        const svgContent = await response.text();
        const parser = new DOMParser();
        const middleSVG = parser.parseFromString(svgContent, "image/svg+xml").documentElement;

        
        middleSVG.setAttribute("width", innerSize);
        middleSVG.setAttribute("height", innerSize);

        
        middleSVG.setAttribute("x", (canvasSize - innerSize) / 2);
        middleSVG.setAttribute("y", (canvasSize - innerSize) / 2);

        
        middleSVG.setAttribute("filter", "url(#glow1");

        
        canvas.appendChild(middleSVG);
    } catch (error) {
        console.error("Failed to load or manipulate middle.svg:", error);
    }
});
