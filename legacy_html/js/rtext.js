document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('circleCanvas');
    const ctx = canvas.getContext('2d');

    // Set circle center and radius
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 350;

    // Draw the main circle
    ctx.strokeStyle = "cyan";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw text in the right-hand side of the circle
    function drawText(text, xOffset, yOffset, color = "white", font = "18px Arial") {
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.textAlign = "left"; // Align to the left
        const xPosition = centerX + radius + xOffset;
        const yBase = centerY + yOffset;

        // Split text into lines if needed
        const lines = text.split("\n");
        lines.forEach((line, index) => {
            ctx.fillText(line, xPosition, yBase + index * 24); // Adjust line height
        });
    }

    // Add text
    drawText("HUMIDITY: 74%", 20, -50);
    drawText("FEELS LIKE: 12°C", 20, 0);
    drawText("WIND: 3KM/H", 20, 50);
    drawText("TONIGHT: CLEAR\nTOMORROW: SUNNY", 20, 120);
});
