import * as vscode from 'vscode';

function getWorkspaceRoot() {
    return vscode.workspace.workspaceFolders?.[0]?.uri;
}