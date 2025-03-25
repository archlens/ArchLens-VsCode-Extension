// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { WebviewHTMLTemplate } from './views/webviewHTMLTemplate';
import * as graph_util from "./graph/graphGeneration";
import { showTreeView } from './views/FileTreeView';
import * as archlens from './archlens/archLens';
import * as path from './filesystem/pathResolver';
import {Graph} from "./graph/graph";
import * as filesystem from "./filesystem/fileoperations";
import { File } from "./graph/graphJson"

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "archlens-in-vscode" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

    context.subscriptions.push(
        vscode.commands.registerCommand('archlens-in-vscode.openFile', (file: File) => {
            const uri = vscode.Uri.file(file.path);
            vscode.window.showTextDocument(uri);
        })
    );

	context.subscriptions.push(
        vscode.commands.registerCommand('archlens-in-vscode.openGraphView', async () => {
            const panel = vscode.window.createWebviewPanel(
                'GraphView',
                'Graph-view',
                vscode.ViewColumn.Two,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true,
                    localResourceRoots: [
                        vscode.Uri.joinPath(context.extensionUri, "..", "webview"),
                        vscode.Uri.joinPath(context.extensionUri, "..", "webview", "scripts"),
                        vscode.Uri.joinPath(context.extensionUri, "..", "webview", "styles"),
                        vscode.Uri.joinPath(context.extensionUri, "..", "webview", "node_modules")
                      ]
                }
            );

            panel.webview.html = WebviewHTMLTemplate(panel.webview, context.extensionUri);


            let g : Graph | undefined = undefined;
            let view = "";
            let diffView = false;

            // Handle messages from the webview
            panel.webview.onDidReceiveMessage(
                async message => {
                switch (message.command) {
                    case 'edge_clicked':
                        const edge = g!.getEdgeFromID(message.edgeID);
                        showTreeView(context, edge!);
                        break;
                    case 'get_view':
                        view = message.view;
                        diffView = message.diffView;

                        g = await updateGraph(view, context, panel, diffView, message.reload);
                        break;
                    case 'get_views':
                        getViews(panel);
                        break;
                }
                },
                undefined,
                context.subscriptions
            );  

            
            let saveEventHandler = vscode.workspace.onDidSaveTextDocument(async (_) => {
                g = await updateGraph(view, context, panel, diffView, true);
            });

            let deleteFileEventHandler = vscode.workspace.onDidDeleteFiles(async (_) => {
                g = await updateGraph(view, context, panel, diffView, true);
            });
          
            context.subscriptions.push(saveEventHandler, deleteFileEventHandler);

            panel.onDidDispose(() => {
                saveEventHandler.dispose();
                deleteFileEventHandler.dispose();
            });
        })
    );

}

async function getViews(panel : vscode.WebviewPanel) {
    let config = JSON.parse(await filesystem.readJSON(path.ArchLensConfig));

    let viewsMap = config.views;
    let views : Array<string> = []

    // projectname-viewname.json
    for(let [viewName, view] of Object.entries(viewsMap)) {
        views.push(viewName);
    }
    
    panel.webview.postMessage({ command: "update_views",
        views: views
    })
}

async function updateGraph(
    view : string, 
    context : vscode.ExtensionContext, 
    panel : vscode.WebviewPanel, 
    diffView = false, 
    reload: boolean = false
) : Promise<Graph> {
    vscode.window.showInformationMessage("Reloading graph...");
    
    let config = JSON.parse(await filesystem.readJSON(path.ArchLensConfig));
    let project = config.name;
    let saveLocation = config.saveLocation ?? "./diagrams";

    let graph = graph_util.buildGraph(await archlens.getGraphJson(
            path.GraphJson(
                view, 
                diffView,
                project, 
                saveLocation
            ), 
            context.extensionUri,
            diffView,
            reload
        )
    );

    panel.webview.postMessage({ command: "update_graph",
        graph: graph.toList(),
        view: view
    })

    vscode.window.showInformationMessage("Graph reloaded!", );

    return graph;
}

export function deactivate() {}
