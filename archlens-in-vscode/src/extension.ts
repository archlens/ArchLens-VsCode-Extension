// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getWebviewContent } from './utilities/getWebviewContent';

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
                    vscode.Uri.joinPath(context.extensionUri, "..", "webview", "scripts"
                    )]
                }
            );

            panel.webview.html = getWebviewContent(panel.webview, context.extensionUri);
        })
    );

}

// This method is called when your extension is deactivated
export function deactivate() {}
