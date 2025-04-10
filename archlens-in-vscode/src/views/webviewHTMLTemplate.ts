import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function WebviewHTMLTemplate(webview: vscode.Webview, context: vscode.ExtensionContext): string {
    // Always use the out directory - this is where your extension runs from
    const webviewDir = vscode.Uri.joinPath(context.extensionUri, 'out', 'webview');
    const indexPath = vscode.Uri.joinPath(webviewDir, 'index.html');
    
    // Read the HTML content
    let html = fs.readFileSync(indexPath.fsPath, 'utf8');
    
    // Get the base URI for resources
    const baseUri = webview.asWebviewUri(webviewDir).toString();
    html = html.replace(/\{baseUri\}/g, baseUri);
    
    return html;
}