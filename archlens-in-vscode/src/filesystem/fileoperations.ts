import * as vscode from 'vscode';

export async function readFileAsJSON(path: string): Promise<string> {
    const fileUri = vscode.Uri.parse(path);

    try {
        const uri = vscode.Uri.parse(path);
        const uint8Array = await vscode.workspace.fs.readFile(uri);
        return new TextDecoder().decode(uint8Array);
    } catch (error) {
        throw vscode.FileSystemError.FileNotFound(fileUri);
    }
}