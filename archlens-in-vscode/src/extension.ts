// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getWebviewContent } from './utilities/getWebviewContent';
import * as graph_util from "./utilities/graph";

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
        vscode.commands.registerCommand('archlens-in-vscode.openGraphView', () => {
            const panel = vscode.window.createWebviewPanel(
                'GraphView',
                'Graph-view',
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, "..", "webview"),
                                         vscode.Uri.joinPath(context.extensionUri, "..", "webview", "scripts")
                                        ]
                }
            );

            panel.webview.html = getWebviewContent(panel.webview, context.extensionUri);

            // Handle messages from the webview
            panel.webview.onDidReceiveMessage(
                message => {
                switch (message.command) {
                    case 'edge_clicked':
                        vscode.window.showInformationMessage(message.text);
                        return;
                    case 'get_graph':
                        panel.webview.postMessage({ command: "update_graph",
                            graph:  graph_util.makeElementsList(g)
                        })
                        return;
                }
                },
                undefined,
                context.subscriptions
            );

            let g = graph_util.buildGraph('{"modules": [{"name": "core", "files": ["bt_file.py", "bt_graph.py", "bt_module.py", "__init__.py"]}, {"name": "plantuml", "files": ["fetch_git.py", "plantuml_file_creator.py", "__init__.py"]}, {"name": "plantumlv2", "files": ["pu_entities.py", "pu_manager.py", "utils.py", "__init__.py"]}, {"name": "utils", "files": ["config_manager_singleton.py", "functions.py", "path_manager_singleton.py", "__init__.py"]}], "files": [{"name": "cli_interface.py", "edge_to": ["path_manager_singleton.py", "config_manager_singleton.py", "pu_manager.py", "bt_graph.py", "fetch_git.py"]}, {"name": "main.py", "edge_to": []}, {"name": "__init__.py", "edge_to": []}, {"name": "bt_file.py", "edge_to": ["bt_module.py"]}, {"name": "bt_graph.py", "edge_to": ["bt_file.py", "bt_module.py"]}, {"name": "bt_module.py", "edge_to": ["bt_file.py"]}, {"name": "__init__.py", "edge_to": []}, {"name": "fetch_git.py", "edge_to": []}, {"name": "plantuml_file_creator.py", "edge_to": ["bt_module.py", "path_manager_singleton.py", "config_manager_singleton.py"]}, {"name": "__init__.py", "edge_to": []}, {"name": "pu_entities.py", "edge_to": ["bt_module.py", "utils.py", "config_manager_singleton.py"]}, {"name": "pu_manager.py", "edge_to": ["bt_graph.py", "pu_entities.py", "utils.py"]}, {"name": "utils.py", "edge_to": ["bt_module.py", "path_manager_singleton.py"]}, {"name": "__init__.py", "edge_to": []}, {"name": "config_manager_singleton.py", "edge_to": []}, {"name": "functions.py", "edge_to": ["bt_graph.py"]}, {"name": "path_manager_singleton.py", "edge_to": []}, {"name": "__init__.py", "edge_to": []}]}')            
        })
    );

}

// This method is called when your extension is deactivated
export function deactivate() {}
