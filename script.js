// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    applyCustomColors();
});

// Lock and View Mode Toggle
let isLocked = false;
const lockViewModeBtn = document.getElementById('lockViewModeBtn');
lockViewModeBtn.addEventListener('click', () => {
    isLocked = !isLocked;
    lockViewModeBtn.innerHTML = isLocked ? '<i class="fas fa-lock"></i>' : '<i class="fas fa-lock-open"></i>';
});

// Default Colors
let primaryColor = '#1A202C';
let bgColor = '#FFFFFF';
let penColor = '#000000';
let lineThickness = 2;
let font = 'Arial';

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

    // Update background color for header
    document.querySelector('header').style.backgroundColor = isDarkMode ? primaryColor : bgColor;
    
    // Update button background colors and text color
    document.querySelectorAll('button').forEach(button => {
        button.style.backgroundColor = isDarkMode ? primaryColor : bgColor;
        button.style.color = isDarkMode ? 'white' : 'black';
    });
    
    // Update whiteboard background color
    document.getElementById('whiteboard').style.backgroundColor = isDarkMode ? bgColor : primaryColor;
    
    // Update sticky note colors
    document.querySelectorAll('#stickyNotesContainer > div').forEach(note => {
        note.style.backgroundColor = isDarkMode ? '#FBD38D' : '#F6E05E';
    });

    // Update text area colors in sticky notes
    document.querySelectorAll('#stickyNotesContainer textarea').forEach(textarea => {
        textarea.style.backgroundColor = isDarkMode ? '#FBD38D' : '#F6E05E';
        textarea.style.color = isDarkMode ? 'black' : 'black';
    });
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

// History for Undo/Redo
let undoStack = [];
let redoStack = [];
let currentPath = [];

function saveState() {
    undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    redoStack = [];
}

function restoreState(stack) {
    if (stack.length > 0) {
        ctx.putImageData(stack.pop(), 0, 0);
    }
}

function drawShape() {
    ctx.lineWidth = lineThickness;
    ctx.strokeStyle = penColor;
    ctx.fillStyle = penColor;
    
    const endX = event.clientX - canvas.offsetLeft;
    const endY = event.clientY - canvas.offsetTop;

    switch (currentTool) {
        case 'line':
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            break;
        case 'rectangle':
            ctx.strokeRect(startX, startY, endX - startX, endY - startY);
            break;
        case 'circle':
            const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
            ctx.beginPath();
            ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
            ctx.stroke();
            break;
        case 'arrow':
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            drawArrowhead(endX, endY);
            break;
        case 'ellipse':
            ctx.beginPath();
            ctx.ellipse((startX + endX) / 2, (startY + endY) / 2, Math.abs(endX - startX) / 2, Math.abs(endY - startY) / 2, 0, 0, 2 * Math.PI);
            ctx.stroke();
            break;
        case 'text':
            ctx.font = `${lineThickness * 10}px ${font}`;
            ctx.fillText(prompt('Enter text:'), startX, startY);
            break;
    }
}

function drawArrowhead(x, y) {
    const angle = Math.atan2(y - startY, x - startX);
    ctx.lineTo(x - 10 * Math.cos(angle - Math.PI / 6), y - 10 * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(x, y);
    ctx.lineTo(x - 10 * Math.cos(angle + Math.PI / 6), y - 10 * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
}

// Event Listeners for Drawing
canvas.addEventListener('mousedown', (e) => {
    if (isLocked) return;
    saveState();
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
document.getElementById('rectangleTool').addEventListener('click', () => currentTool = 'rectangle');
document.getElementById('circleTool').addEventListener('click', () => currentTool = 'circle');
document.getElementById('arrowTool').addEventListener('click', () => currentTool = 'arrow');
document.getElementById('ellipseTool').addEventListener('click', () => currentTool = 'ellipse');
document.getElementById('textTool').addEventListener('click', () => currentTool = 'text');

// Undo and Redo
document.getElementById('undo').addEventListener('click', () => {
    saveState();
    restoreState(undoStack);
});

document.getElementById('redo').addEventListener('click', () => {
    restoreState(redoStack);
});

// Sticky Notes
const stickyNoteTool = document.getElementById('stickyNoteTool');
const stickyNotesContainer = document.getElementById('stickyNotesContainer');

stickyNoteTool.addEventListener('click', () => {
    if (isLocked) return;

    const note = document.createElement('div');
    note.classList.add('p-4', 'rounded', 'shadow', 'cursor-move', 'relative');
    note.innerHTML = `<textarea class="w-full outline-none resize-none"></textarea>`;
    
    note.classList.add(document.body.classList.contains('dark') ? 'bg-yellow-300' : 'bg-yellow-300');
    
    note.style.position = 'absolute';
    note.style.left = `${Math.random() * (window.innerWidth - 200)}px`;
    note.style.top = `${Math.random() * (window.innerHeight - 200)}px`;

    makeDraggable(note);

    stickyNotesContainer.appendChild(note);
});

// Make Sticky Notes Draggable
function makeDraggable(element) {
    element.addEventListener('mousedown', function(event) {
        if (isLocked) return; 

        let shiftX = event.clientX - element.getBoundingClientRect().left;
        let shiftY = event.clientY - element.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            element.style.left = pageX - shiftX + 'px';
            element.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        element.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            element.onmouseup = null;
        };
    });

    element.ondragstart = () => false; // Prevent default drag behavior
}

// Zoom Controls
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
let scale = 1;

function updateZoom() {
    canvas.style.transform = `scale(${scale})`;
    canvas.style.transformOrigin = '0 0';
}

zoomInBtn.addEventListener('click', () => {
    scale += 0.1;
    updateZoom();
});

zoomOutBtn.addEventListener('click', () => {
    scale = Math.max(0.1, scale - 0.1);
    updateZoom();
});

updateZoom();
