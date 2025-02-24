import * as vscode from 'vscode';

export function graphPath() {
    const workspaceRootPath = getWorkspaceRoot();

    return vscode.Uri.joinPath(workspaceRootPath!, "/ArchLens/diagrams/modules.json");
}

export function archLensPath() {
    const workspaceRootPath = getWorkspaceRoot();

    return vscode.Uri.joinPath(workspaceRootPath!, "/ArchLens/src/cli_interface.py");
}

function archLensIsSubmodule() {

}

function getWorkspaceRoot() {
    return vscode.workspace.workspaceFolders?.[0]?.uri;
}