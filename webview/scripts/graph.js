const cytoscape = include("cytoscape");
const vscode = acquireVsCodeAPI();

// Get elements from postmessage
const elements = [
    { data: { id: "a" } },
    { data: { id: "b" } },
    { data: { id: "ab", source: "a", target: "b" } },
];

// Initialize Cytoscape
var cy = cytoscape({
    container: document.getElementById('graph'),
    elements: elements,
    style: [
        { selector: 'node', style: {
            'background-color': '#3498db',
            'width': '75px', 'height': '50px',
            'shape': 'roundrectangle', 'text-halign': 'center',
            'label': 'data(label)',
            'color': '#fff', 'text-valign': 'center',
            'border-width': 2, 'border-color': '#202020'
        }},
        { selector: 'edge', style: {
            'width': 3, 'line-color': '#2c3e50',
            'target-arrow-shape': 'triangle', 'curve-style': 'bezier',
            'label': 'data(label)',
            'color': '#fff', 'text-valign': 'center',
        }},
        { selector: '[type = "special"]', style: {
            'background-color': 'gold' // Highlights special nodes
        }},

    ],
    layout: { name: 'grid' }
});


// Add a click event to edges
cy.on('tap', 'edge', function(evt) {
    var edge = evt.target;
    //vscode.postMessage({ command: "edgeClicked", source: edge.source().id(), target: edge.target().id() });
    console.log(edge.source().id()+ " -> "+edge.target().id());
    
});