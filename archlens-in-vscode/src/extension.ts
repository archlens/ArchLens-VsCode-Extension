// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { WebviewHTMLTemplate } from './views/webviewHTMLTemplate';
import * as graph_util from "./graph/graphGeneration";
import { showTreeView } from './views/FileTreeView';
import * as archlens from './archlens/archLens';
import * as path from './filesystem/pathResolver';
import {Graph} from "./graph/graph";

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
                    localResourceRoots: [
                        vscode.Uri.joinPath(context.extensionUri, "..", "webview"),
                        vscode.Uri.joinPath(context.extensionUri, "..", "webview", "scripts"),
                        vscode.Uri.joinPath(context.extensionUri, "..", "webview", "styles")
                      ]
                }
            );

            panel.webview.html = WebviewHTMLTemplate(panel.webview, context.extensionUri);

            let g : Graph = new Graph();

            // Handle messages from the webview
            panel.webview.onDidReceiveMessage(
                async message => {
                switch (message.command) {
                    case 'edge_clicked':
                        const files = g!.getFilenamesFromEdge(message.source, message.target);
                        showTreeView(context, files);
                        return;
                    case 'get_graph':
                        g = graph_util.buildGraph(await archlens.getGraphJson(path.GraphJson, context.extensionUri));
                        panel.webview.postMessage({ command: "update_graph",
                            graph:  g.toList()                        
                        })
                        return;
                    case 'get_views':
                        let views = { views: [
                            { name: "module.json" }, 
                            { name: "something.json" } 
                            ] 
                        };
                        panel.webview.postMessage({ command: "update_views",
                            views: views
                        })
                }
                },
                undefined,
                context.subscriptions
            );  

            let disposable = vscode.workspace.onDidSaveTextDocument(async (_) => {
                g = graph_util.buildGraph(await archlens.getGraphJson(path.GraphJson, context.extensionUri));

                panel.webview.postMessage({ command: "update_graph",
                    graph:  g!.toList()
                })
            });
        
            context.subscriptions.push(disposable);

        })
    );

}

// This method is called when your extension is deactivated
export function deactivate() {}
