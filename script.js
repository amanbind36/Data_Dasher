// ft35_048 day_02

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    applyCustomColors();
});

// Update Primary and Background Colors
const primaryColorPicker = document.getElementById('primaryColorPicker');
const bgColorPicker = document.getElementById('bgColorPicker');
const colorPicker = document.getElementById('colorPicker');
const lineThicknessSlider = document.getElementById('lineThickness');
const fontPicker = document.getElementById('fontPicker');

primaryColorPicker.addEventListener('input', (e) => {
    primaryColor = e.target.value;
    applyCustomColors();
});

bgColorPicker.addEventListener('input', (e) => {
    bgColor = e.target.value;
    applyCustomColors();
});

colorPicker.addEventListener('input', (e) => {
    penColor = e.target.value;
});

lineThicknessSlider.addEventListener('input', (e) => {
    lineThickness = e.target.value;
});

fontPicker.addEventListener('input', (e) => {
    font = e.target.value;
});

function applyCustomColors() {
    const isDarkMode = document.body.classList.contains('dark');
    
    // Update CSS variables
    document.body.style.setProperty('--primary-color', isDarkMode ? primaryColor : bgColor);
    document.body.style.setProperty('--bg-color', isDarkMode ? bgColor : primaryColor);
}

// Initialize the custom colors
applyCustomColors();

// Whiteboard Canvas Setup
const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let drawing = false;
let currentTool = 'pen';
let startX, startY;

canvas.addEventListener('mousedown', (e) => {
    if (isLocked) return;
    drawing = true;
    ctx.beginPath();
    startX = e.clientX - canvas.offsetLeft;
    startY = e.clientY - canvas.offsetTop;
    ctx.moveTo(startX, startY);
});

canvas.addEventListener('mouseup', () => {
    if (isLocked) return;
    drawing = false;
    if (currentTool !== 'pen' && currentTool !== 'eraser') {
        drawShape();
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (isLocked || !drawing) return;
    switch (currentTool) {
        case 'pen':
            ctx.lineWidth = lineThickness;
            ctx.strokeStyle = penColor;
            ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
            ctx.stroke();
            break;
        case 'eraser':
            ctx.lineWidth = lineThickness * 5;
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
            ctx.stroke();
            break;
    }
});

// Tool Selection
document.getElementById('penTool').addEventListener('click', () => currentTool = 'pen');
document.getElementById('eraserTool').addEventListener('click', () => currentTool = 'eraser');
document.getElementById('lineTool').addEventListener('click', () => currentTool = 'line');
