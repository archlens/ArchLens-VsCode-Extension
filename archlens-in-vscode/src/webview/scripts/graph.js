const vscode = acquireVsCodeApi();

const viewButtonsWrapper = document.getElementById('view-buttons');
const diffViewCheckBox = document.getElementById('diff-view-checkbox');
const infoBox = document.getElementById("infoBox");
const infoBoxText = document.getElementById("infoBoxText");

let diffView = false;
let current_view = undefined;
let views = [];
let viewButtons = [];

function update_view(view, diffView = false, reload = false) {
    vscode.postMessage({ command: 'get_view', view: view, diffView: diffView, reload: reload })
}

function update_views(newViews) {
    views = newViews;

    if(current_view === undefined || !(views.includes(current_view))) {
        current_view = views[0];
    }

    viewButtons = views.map(view => {
        let viewButton = document.createElement('button');

        viewButton.addEventListener('click', () => {
            viewButtons.forEach(button => {
                button.classList.remove('active')
            });

            viewButton.classList.add('active');

            current_view = view;

            update_view(view, diffView);
        });

        viewButton.innerHTML = view;
        viewButton.classList.add('view-button');

        if(view === current_view) {
            viewButton.classList.add('active');
        }

        return viewButton;
    });

    viewButtonsWrapper.replaceChildren(...viewButtons);

    update_view(current_view, diffView, true);
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
            {
                
                selector: "edge[label]",
                style: {
                    "label": "data(label)",
                    "z-index": "",
                    "text-margin-x": "0px",
                    "text-margin-y": "0px"
                }
            },
            {
                selector: '.DELETED',
                style: {
                    'background-color': '#f00',
                    'line-color': '#f00'
                }
            },
            {
                selector: '.CREATED',
                style: {
                    'background-color': '#0f0',
                    'line-color': '#0f0'
                }
            },
            {
                selector: 'edge:selected',
                style: {
                    'line-color': 'yellow',
                    'target-arrow-color': 'yellow'
                }
            }
        ],
    });

    const layout = {
        name: "dagre",
        rankDir: 'TB',     
        nodeSep: 50,       
        rankSep: 60,       
        edgeSep: 80,       
        spacingFactor: 1.5,
    }

    cy.layout(layout).run()

    cy.on('tap', 'edge', function(evt) {
        var edge = evt.target;
        vscode.postMessage({command: 'edge_clicked', edgeID: edge.id()});
    });

    function updateLabelStyles(zoom) {
        if (zoom < 1.2) {
            cy.style()
                .selector('edge[label]')
                .style({
                    'font-size': Math.max(font_height, font_height / zoom * 0.5)
                })
                .update();
        }
    }

    cy.on('zoom', function() {
        updateLabelStyles(cy.zoom());
    });

    updateLabelStyles(cy.zoom());

    cy.center();
}


window.addEventListener('message', event => {
    const message = event.data;
    switch (message.command){
        case 'update_graph':
            disableViewButtons(true);
            make_graph(message.graph);
            break;
        case 'update_views':
            update_views(message.views);
            break;
        case 'updating_graph':
            disableViewButtons(true);
            showInfoBox('Updating graph... This might take a while');
            break;
        case 'graph_updated':
            disableViewButtons(false);
            showInfoBox('Graph updated.', true);
            break;
    }
});

diffViewCheckBox.addEventListener('change', (event) => {
    diffView = event.target.checked;

    update_view(current_view, diffView, true)
});

// INFOBOX

let timer = null;

function showInfoBox(message, autoclose = false) {
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }

    infoBoxText.innerHTML = message;
    infoBox.classList.add("show");

    if (autoclose) {
        timer = setTimeout(() => {
            closeInfoBox();
            timer = null;
        }, 5000);
    }
}

function closeInfoBox() {
    infoBox.classList.remove("show");
}

function disableViewButtons(disable) {
    viewButtons.forEach(button => {
        button.disabled = disable;
    });

    diffViewCheckBox.disabled = disable;
}

document.getElementById("closeInfoBox").addEventListener("click", function() {closeInfoBox();});

await vscode.postMessage({command: 'get_views'});