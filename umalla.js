// Generator for Kronkelschrift, by Victor Voermans, 2024-2025.

const codes = [
    ["a","111"],
    ["b","1101"],
    ["c","11001"],
    ["d","1011"],
    ["e","10101"],
    ["f","101001"],
    ["g","10011"],
    ["h","100101"],
    ["i","1001001"],
    ["j","0111"],
    ["k","01101"],
    ["l","011001"],
    ["m","01011"],
    ["n","010101"],
    ["o","0101001"],
    ["p","010011"],
    ["q","0100101"],
    ["r","01001001"],
    ["s","00111"],
    ["t","001101"],
    ["u","0011001"],
    ["v","001011"],
    ["w","0010101"],
    ["x","00101001"],
    ["y","0010011"],
    ["z","00100101"],
    [",","001001001"]
];
    // Each character and its code
const notAllowed = /[^abcdefghijklmnopqrstuvwxyz,]/g;
    // Regular expression that finds every character that is not allowed
let tile = 8;
    // The width and height of a tile, in pixels
let margin = 3 * tile;
    // The margin around the checkerpattern
let lineWidth = .75 * tile;
    // The thickness of the line
let message;
    // The user's text input
let columns;
    // The amount of columns, as given by the user
let rows;
    // The amount of rows, calculated based on the number of columns and the length ot the codified message
let width;
    // The width of the svg canvas
let height;
    // The height of the svg canvas
let lineData;
    // The data that will go into the svg's <path> to draw the line
let backgroundColor;
    // The color of the background, as given by the user
let lineColor;
    // The color of the line, as given by the user
let filename;
    // Used in the download functions

function generate(){
    getColumns();
        // Get the amount of columns based on the user-selected width
    getMessage();
        // Get user's text input
    simplifyMessage();
        // Simplify the message; only lowercase letters (a-z) and underscores are allowed
    updateInput();
        // ...
    codifyMessage();
        // Turn the message into a string of ones and zeroes
    completeMessage();
        // Finish the message off with zeroes, as needed (see howitworks.png). For this we need getColumns()
    calculateRows();
        // Calculate how many we rows we need, based on the number of columns and the length of the codified message
    calculateCanvasSize();
        // Calculate the size of the canvas, in pixels
    setCanvasSize();
        // Give the svg the correct width and height
    setBackgroundSize();
        // Give the background rectangle the same width and height as the svg
    clearLineData();
        // Clear the line data
    addOuterLines();
        // Add the line data for the outer lines (the lines around the edges, see howitworks.png)
    addInnerLines();
        // Add the line data for the inner lines, based on the ones and zeroes of the codified message. For this, x() and y() are used
    setLineData();
        // Feed the line data into the svg's path
    setLineWidth();
        // Set the line's thickness to the value defined above
    setColors();
        // Give the background and line the colors selected by the user
}

function getColumns(){
    columns = 2 * document.getElementById("width").value;
}

function getMessage(){
    message = document.getElementById("input").value;
}

function simplifyMessage(){
    message = message.toLowerCase();
    message = message.replaceAll(notAllowed, "");
}

function updateInput(){
    document.getElementById("input").value = message;
    filename = message;
}

function codifyMessage(){
    for (let i = 0; i < codes.length; i++){
        message = message.replaceAll(codes[i][0], codes[i][1]);
    }
}

function completeMessage(){
    while (message.length % (columns / 2) != 0){
        message += "0";
    }
}

function calculateRows(){
    rows = message.length / (columns / 2);
}

function calculateCanvasSize(){
    width = (2 * margin) + (columns * tile);
    height = (2 * margin) + (rows * tile);
}

function setCanvasSize(){
    document.getElementById("svg").setAttribute("width", width);
    document.getElementById("svg").setAttribute("height", height);
}

function setBackgroundSize(){
    document.getElementById("background").setAttribute("width", width);
    document.getElementById("background").setAttribute("height", height);
}

function clearLineData(){
    lineData = "";
}

function addOuterLines(){
    // Top
    lineData += "M " + margin + " " + margin + " ";
    for (let i = 0; i < columns / 2; i++){
        lineData += "m " + tile + " 0 l " + tile + " 0 ";
    }

    // Left
    lineData += "M " + margin + " " + margin + " ";
    for (let i = 0; i < Math.floor(rows / 2); i++){
        lineData += "m 0 " + tile + " l 0 " + tile + " ";
    }

    // Bottom
    if (rows % 2 == 0){
        lineData += "M " + (margin - tile) + " " + (margin + (rows * tile)) + " ";
    } else {
        lineData += "M " + margin + " " + (margin + (rows * tile)) + " ";
    }
    for (let i = 0; i < columns / 2; i++){
        lineData += "m " + tile + " 0 l " + tile + " 0 ";
    }

    // Right
    lineData += "M " + (margin + (columns * tile)) + " " + (margin - tile) + " ";
    for (let i = 0; i < Math.ceil(rows / 2); i++){
        lineData += "m 0 " + tile + " l 0 " + tile + " ";
    }
}

function addInnerLines(){
    for (let i = 0; i < message.length; i++){
        lineData += "M " + (margin + (x(i) * tile)) + " " + (margin + (y(i) * tile)) + " ";
        if (message[i] == "1"){
            lineData += "l 0 " + tile + " m " + tile + " 0 l 0 " + -tile + " ";
        } else {
            lineData += "l " + tile + " 0 m 0 " + tile + " l " + -tile + " 0 ";
        }
    }
}

function x(i){
    if (i % columns < columns / 2) {
        return 2 * (i % columns);
    } else {
        return 1 + (2 * ((i % columns) - (columns / 2)));
    }
} // Calculates x-coordinate

function y(i){
    return Math.floor(i / (columns / 2));
} // Calculates y-coordinate

function setLineData(){
    document.getElementById("line").setAttribute("d", lineData);
}

function setLineWidth(){
    document.getElementById("line").style.strokeWidth = lineWidth;
}

function setColors(){
    backgroundColor = document.getElementById("backgroundColor").value;
    lineColor = document.getElementById("lineColor").value;
    document.getElementById("background").style.fill = backgroundColor;
    document.getElementById("line").style.stroke = lineColor;
}

function downloadPNG(){
    const svg = document.getElementById("svg");
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);

    const svgBlob = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = svg.width.baseVal.value;
        canvas.height = svg.height.baseVal.value;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const pngUrl = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = filename + ".png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    img.src = url;
} // This function was written by ChatGPT.

function downloadSVG() {
    const svg = document.getElementById("svg");
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);

    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename + ".svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
} // This function was written by ChatGPT.