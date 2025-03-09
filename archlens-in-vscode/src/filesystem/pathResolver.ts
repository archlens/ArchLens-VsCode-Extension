import * as vscode from 'vscode';

export const WorkspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri!;
export const GraphJson = vscode.Uri.joinPath(WorkspaceRoot, "./diagrams/modules.json");