import * as vscode from 'vscode';

export const WorkspaceRoot : vscode.Uri = vscode.workspace.workspaceFolders?.[0]?.uri!;

export const ArchLensScript : string = './src/cli_interface.py';

export const ArchLensConfig : vscode.Uri = vscode.Uri.joinPath(WorkspaceRoot, "archlens.json");

export function GraphJson(view : string, diffView : boolean, projectName : string, saveLocation : string) : vscode.Uri {
    let diffViewModifier = diffView ? "diff-" : "";
    let fullViewName = `${projectName}-${diffViewModifier}${view}.json`;

    return vscode.Uri.joinPath(WorkspaceRoot, saveLocation, fullViewName);
}

export function ArchLens(extensionPath : vscode.Uri): vscode.Uri {
    return vscode.Uri.joinPath(extensionPath, '..', 'ArchLens');
}

export function Python(extensionPath: vscode.Uri): vscode.Uri {
    
    const pythonPath = process.platform === "win32" ?
    '.venv/Scripts/python.exe' : '.venv/bin/python';

    const fullPythonPath = vscode.Uri.joinPath(extensionPath, "..", 'ArchLens', pythonPath);

    return fullPythonPath;
}