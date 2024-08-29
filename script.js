const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

// Undo and Redo functionality
// let savedCanvasStates = [];
// let undoStack = [];
// let redoStack = [];
// document.getElementById('undoBtn').addEventListener('click', () => {
//     if (savedCanvasStates.length > 0) {
//         redoStack.push(savedCanvasStates.pop());
//         if (savedCanvasStates.length > 0) {
//             ctx.putImageData(savedCanvasStates[savedCanvasStates.length - 1], 0, 0);
//         } else {
//             ctx.clearRect(0, 0, canvas.width, canvas.height);
//         }
//     }
// });

// document.getElementById('redoBtn').addEventListener('click', () => {
//     if (redoStack.length > 0) {
//         const redoState = redoStack.pop();
//         savedCanvasStates.push(redoState);
//         ctx.putImageData(redoState, 0, 0);
//     }
// });
// function saveCanvasState() {
//     savedCanvasStates.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
// }

// State variables
let drawing = false;
let tool = 'pen';
let color = '#000000';
let lineWidth = 2;
let fontSize = 16;
let font = 'Arial';
let textColor = '#000000';
let startX, startY;
let scaleFactor = 1;
const scaleIncrement = 0.1;
const maxScale = 3;
const minScale = 0.5;
let isViewMode = false;
let isTextMode = false;
let currentText = '';
let textX, textY;
let currentContent = null; // Store current canvas content

// Toolbar elements (assuming they are defined)
const penBtn = document.getElementById('pen');
const eraserBtn = document.getElementById('eraser');
const lineBtn = document.getElementById('line');
const rectBtn = document.getElementById('rect');
const circleBtn = document.getElementById('circle');
const arrowBtn = document.getElementById('arrow');
const colorPicker = document.getElementById('colorPicker');
const lineThickness = document.getElementById('lineThickness');
const clearBtn = document.getElementById('clear');
const bgColorBtn = document.getElementById('bgColor');
const addStickyNoteBtn = document.getElementById('addStickyNote');
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
const toggleLockBtn = document.getElementById('toggleLock');
const themeToggleBtn = document.getElementById('themeToggle');
const downloadBtn = document.getElementById('download');
const textBtn = document.getElementById('text');
const textOptions = document.getElementById('textOptions');
const textColorPicker = document.getElementById('textColorPicker');
const fontSelect = document.getElementById('fontSelect');
const fontSizeInput = document.getElementById('fontSize');

// Tool selection event listeners
penBtn.addEventListener('click', () => tool = 'pen');
eraserBtn.addEventListener('click', () => tool = 'eraser');
lineBtn.addEventListener('click', () => tool = 'line');
rectBtn.addEventListener('click', () => tool = 'rect');
circleBtn.addEventListener('click', () => tool = 'circle');
arrowBtn.addEventListener('click', () => tool = 'arrow');

// Change color and line thickness
colorPicker.addEventListener('input', (e) => color = e.target.value);
lineThickness.addEventListener('input', (e) => lineWidth = e.target.value);

// Clear canvas
clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentContent = null; // Reset current content
});

// Change background color
bgColorBtn.addEventListener('click', () => canvas.style.backgroundColor = color);

// Add Sticky Note button
addStickyNoteBtn.addEventListener('click', addStickyNote);

// Event listeners for zoom buttons
// zoomInBtn.addEventListener('click', zoomIn);
// zoomOutBtn.addEventListener('click', zoomOut);

// Event listener for Lock and View mode
toggleLockBtn.addEventListener('click', toggleLockMode);

// Event listener for theme toggle
themeToggleBtn.addEventListener('click', toggleTheme);

// Event listener for download button
downloadBtn.addEventListener('click', showDownloadOptions);

// Event listener for text button
textBtn.addEventListener('click', () => {
    isTextMode = !isTextMode;
    textOptions.style.display = isTextMode ? 'block' : 'none';
    canvas.style.cursor = isTextMode ? 'text' : 'crosshair';
});

// Functions for drawing
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('click', placeText);

function startDrawing(e) {
    if (isViewMode || isTextMode) return; // Prevent drawing if in view mode or text mode
    drawing = true;
    [startX, startY] = [e.offsetX / scaleFactor, e.offsetY / scaleFactor];
    saveCurrentContent(); // Save current canvas content before drawing
    if (tool === 'pen' || tool === 'eraser') {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
    }
}

function stopDrawing() {
    if (isViewMode || isTextMode) return; // Prevent ending drawing path if in view mode or text mode
    drawing = false;
    ctx.closePath();
}

function draw(e) {
    if (!drawing || isViewMode || isTextMode) return; // Prevent drawing if not active or in view mode or text mode
    const [x, y] = [e.offsetX / scaleFactor, e.offsetY / scaleFactor];

    restoreContent(); // Restore canvas content before drawing new shape

    if (tool === 'pen') {
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineTo(x, y);
        ctx.stroke();
    } else if (tool === 'eraser') {
        ctx.clearRect(x, y, lineWidth, lineWidth);
    } else if (tool === 'line') {
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(x, y);
        ctx.stroke();
    } else if (tool === 'rect') {
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.strokeRect(startX, startY, x - startX, y - startY);
    } else if (tool === 'circle') {
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.arc(startX, startY, Math.sqrt((x - startX) ** 2 + (y - startY) ** 2), 0, 2 * Math.PI);
        ctx.stroke();
    } else if (tool === 'arrow') {
        drawArrow(startX, startY, x, y);
    }
}