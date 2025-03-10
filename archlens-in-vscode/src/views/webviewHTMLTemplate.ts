import * as vscode from 'vscode';
import * as fs from 'fs';
import { basename } from 'path';

export function WebviewHTMLTemplate(webview: vscode.Webview, extensionUri: vscode.Uri): string {
    const indexPath = vscode.Uri.joinPath(extensionUri, '..' ,'webview','index.html');

    let html = fs.readFileSync(indexPath.fsPath, 'utf8');

    const baseUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, '..' ,'webview')).toString();
    
    html = html.replace(/\{baseUri\}/g, baseUri);

    return html;
}
