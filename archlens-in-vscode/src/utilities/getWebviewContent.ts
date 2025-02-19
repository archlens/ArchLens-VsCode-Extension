import * as vscode from 'vscode';
import * as fs from 'fs';

export function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri): string {
    const indexPath = vscode.Uri.joinPath(extensionUri, '..' ,'webview','index.html');

    let html = fs.readFileSync(indexPath.fsPath, 'utf8');
    // Replace placeholders with actual URIs

    html = html.replace("{baseUri}", vscode.Uri.joinPath(extensionUri, '..' ,'webview').toString());

    return html;
}
