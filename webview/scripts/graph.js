const vscode = acquireVsCodeApi();

const viewSelect = document.getElementById('view-selector');

function update_view(view, reload = false) {
    vscode.postMessage({ command: 'get_view', view: view, reload: reload });
    console.log(view);
}

function update_views(views) {
    const view = views[0];

    const viewOptions = views.map(
        element => {
        let option = document.createElement('option')

        option.setAttribute('value', element)
        option.innerHTML = element;

        return option;
    });

    viewSelect.replaceChildren(...viewOptions);

    update_view(view, true);
}

function getLabelLength(node){
    if (node.data('label')) {
        return node.data('label').length
    } else {
        return 0
    }
}

function make_graph(elements){
    const font_height = 15;
    const block_extra_length = 50;
    const font_width = font_height*.61; // Approx
    const border_width = 2;

    const cy = cytoscape({
        container: document.getElementById('graph'),
        elements: elements,
        style: [
            {
                selector: 'node', style: {
                    'background-color': '#F0FFFF',
                    'width': ((node) => {
                        return getLabelLength(node) * font_width + block_extra_length
                    }),
                    'height': 40,
                    'shape': 'polygon',
                    'shape-polygon-points': ((node) => {
                        const label_width = getLabelLength(node) * font_width;
                        const label_ratio = (label_width / (label_width + block_extra_length));
                        const angle_ratio = (10 / (label_width + block_extra_length));
                        return [-1, -1, label_ratio, -1, (label_ratio + angle_ratio), -.1, 1, -.1, 1, 1, -1, 1, -1, -1, -1, -.1, (label_ratio + angle_ratio), -.1, -1, -.1, -1, -1]
                    }), // Yes
                    'color': '#000000',
                    'border-width': border_width, 'border-color': '#000000',
                    'border-cap': 'butt',
                    'label': 'data(label)',
                    'text-halign': 'right', 'text-valign': 'top',
                    'text-margin-x': (node) => {
                        return (getLabelLength(node) * font_width * -1 - block_extra_length + 10)
                    },
                    'text-margin-y': font_height + 1,
                    'font-family': 'monospace',
                    'font-size': font_height

                }
            },
            {
                selector: 'edge', style: {
                    'width': 2, 'line-color': '#000000',
                    'target-arrow-shape': 'triangle-backcurve', 'curve-style': 'bezier',
                    'arrow-scale': 1.50,
                    'label': 'data(label)',
                    'color': '#fff', 'text-valign': 'center',
                    'font-family': 'monospace'
                }
            },

        ],
    });

    const layout = {
        name: "dagre",
    }

    cy.layout(layout).run()

    // Add a click event to edges
    cy.on('tap', 'edge', function(evt) {
        var edge = evt.target;
        vscode.postMessage({command: 'edge_clicked', edgeID: edge.id()});
        
    });
}


window.addEventListener('message', event => {
    const message = event.data;
    switch (message.command){
        case 'update_graph':
            make_graph(message.graph);
            break;
        case 'update_views':
            update_views(message.views);
            break;
    }
});

await vscode.postMessage({command: 'get_views'});

viewSelect.addEventListener('input', (event) => {
    const view = event.target.value;
    update_view(view);
})