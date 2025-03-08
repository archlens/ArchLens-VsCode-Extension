// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getWebviewContent } from './utilities/getWebviewContent';
import * as graph_util from "./graph/graph";
import { showTreeView } from './utilities/treeView';
import * as archlens from './archlens/archLens';

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
        vscode.commands.registerCommand('archlens-in-vscode.openGraphView', async () => {
            const panel = vscode.window.createWebviewPanel(
                'GraphView',
                'Graph-view',
                vscode.ViewColumn.Two,
                {
                    enableScripts: true,
                    localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, "..", "webview"),
                                         vscode.Uri.joinPath(context.extensionUri, "..", "webview", "scripts")
                                        ]
                }
            );
            
            const internalArchLensConfigPath = vscode.Uri.joinPath(context.extensionUri, "..", "ArchLens", "archlens.json")
            const graphPath = vscode.Uri.joinPath(context.extensionUri, ".." ,"/ArchLens/diagrams/modules.json");

            panel.webview.html = getWebviewContent(panel.webview, context.extensionUri);

            let g : Map<string, any> | undefined = undefined;

            // Handle messages from the webview
            panel.webview.onDidReceiveMessage(
                async message => {
                switch (message.command) {
                    case 'edge_clicked':
                        const files = graph_util.getFilenamesFromEdge(g!, message.source, message.target);
                        showTreeView(context, files);
                        return;
                    case 'get_graph':
                        g = graph_util.buildGraph(await archlens.getGraphJson(graphPath, internalArchLensConfigPath, context.extensionUri));  
                        panel.webview.postMessage({ command: "update_graph",
                            graph:  graph_util.makeElementsList(g)
                        })
                        return;
                }
                },
                undefined,
                context.subscriptions
            );  

            let disposable = vscode.workspace.onDidSaveTextDocument(async (_) => {
                g = graph_util.buildGraph(await archlens.getGraphJson(graphPath, internalArchLensConfigPath, context.extensionUri));  
                panel.webview.postMessage({ command: "update_graph",
                    graph:  graph_util.makeElementsList(g!)
                })
            });
        
            context.subscriptions.push(disposable);

        })
    );

}

// This method is called when your extension is deactivated
export function deactivate() {}
