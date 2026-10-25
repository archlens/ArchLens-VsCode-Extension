import * as vscode from 'vscode';
import * as fs from 'fs';

export function WebviewHTMLTemplate(webview: vscode.Webview, context: vscode.ExtensionContext): string {
    // Always use the out directory - this is where your extension runs from
    const webviewDir = vscode.Uri.joinPath(context.extensionUri, 'dist', 'webview');
    const indexPath = vscode.Uri.joinPath(webviewDir, 'index.html');
    
    // Read the HTML content
    let html = fs.readFileSync(indexPath.fsPath, 'utf8');

    return html
       .replaceAll('{baseUri}', webview.asWebviewUri(webviewDir).toString());
}