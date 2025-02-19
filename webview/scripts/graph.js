import cytoscape from "../node_modules/cytoscape/dist/cytoscape.esm.mjs";
const vscode = acquireVsCodeApi();

function make_graph(elements){
    const font_height = 15;
    const block_extra_length = 50;
    const font_width = font_height*.61; // Approx
    const border_width = 2;

    var cy = cytoscape({
        container: document.getElementById('graph'),
        elements: elements,
        style: [
            { selector: 'node', style: {
                'background-color': '#F0FFFF',
                'width': ((node) => {return (node.data('label').length)*font_width+block_extra_length}), 
                'height': 40,
                'shape': 'polygon',
                'shape-polygon-points': ((node) => {const label_width = node.data('label').length*font_width; const label_ratio = (label_width/(label_width+block_extra_length)); const angle_ratio = (10/(label_width+block_extra_length)); return [-1,-1, label_ratio,-1, (label_ratio+angle_ratio),-.1, -1,-.1, 1,-.1, 1,1, -1,1]}), // Yes
                'color': '#000000', 
                'border-width': border_width, 'border-color': '#000000',
                'label': 'data(label)',
                'text-halign': 'right', 'text-valign': 'top',
                'text-margin-x': (node) => {return ((node.data('label').length)*font_width*-1 - block_extra_length + 10)},
                'text-margin-y': font_height+2,
                'font-family': 'monospace',
                'font-size': font_height

            }},
            { selector: 'edge', style: {
                'width': 2, 'line-color': '#000000',
                'target-arrow-shape': 'triangle-backcurve', 'curve-style': 'bezier',
                'arrow-scale': 1.50,
                'label': 'data(label)',
                'color': '#fff', 'text-valign': 'center',
                'font-family': 'monospace'
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

vscode.postMessage({command: 'get_graph'});
