import * as vscode from 'vscode';
import * as fs from 'fs';

export function WebviewHTMLTemplate(webview: vscode.Webview, extensionUri: vscode.Uri): string {
    const indexPath = vscode.Uri.joinPath(extensionUri, '..' ,'webview','index.html');

    let html = fs.readFileSync(indexPath.fsPath, 'utf8');

    // Replace placeholders with actual URIs
    html = html.replace("{baseUri}", webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, '..' ,'webview')).toString());

    return html;
}
