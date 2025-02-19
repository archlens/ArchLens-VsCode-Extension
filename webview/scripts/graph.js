import cytoscape from "../node_modules/cytoscape/dist/cytoscape.esm.mjs";
const vscode = acquireVsCodeApi();

function make_graph(elements){
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
        vscode.postMessage({command: 'edge_clicked', text: (edge.source().id()+ " -> "+edge.target().id())});
        
    });
}


window.addEventListener('message', event => {
    const message = event.data;
    switch (message.command){
        case 'update_graph':
            make_graph(message.graph);
    }
});
