document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('circleCanvas');
    const ctx = canvas.getContext('2d');

    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 350;

    
    ctx.strokeStyle = "cyan";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    
    function drawText(text, xOffset, yOffset, color = "white", font = "18px Arial") {
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.textAlign = "left"; 
        const xPosition = centerX + radius + xOffset;
        const yBase = centerY + yOffset;

        
        const lines = text.split("\n");
        lines.forEach((line, index) => {
            ctx.fillText(line, xPosition, yBase + index * 24); 
        });
    }

    
    drawText("HUMIDITY: 74%", 20, -50);
    drawText("FEELS LIKE: 12°C", 20, 0);
    drawText("WIND: 3KM/H", 20, 50);
    drawText("TONIGHT: CLEAR\nTOMORROW: SUNNY", 20, 120);
});
