import * as vscode from 'vscode';

export const WorkspaceRoot : vscode.Uri = vscode.workspace.workspaceFolders?.[0]?.uri!;

export const GraphJson : vscode.Uri = vscode.Uri.joinPath(WorkspaceRoot, "./diagrams/modules.json");

export const ArchLensScript : string = './src/cli_interface.py';

export const Python: string = process.platform === "win32" ?
    '.venv/Scripts/python.exe' : '.venv/bin/python';

export const ArchLensConfig : vscode.Uri = vscode.Uri.joinPath(WorkspaceRoot, "archlens.json");

export function ArchLens(extensionPath : vscode.Uri): vscode.Uri {
    return vscode.Uri.joinPath(extensionPath, '..', 'ArchLens');
}