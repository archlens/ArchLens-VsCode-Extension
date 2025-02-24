import * as vs from 'vscode';

export async function readJSON(path: vs.Uri): Promise<string> {
    try {
        const uint8Array = await vs.workspace.fs.readFile(path);
        return new TextDecoder().decode(uint8Array);
    } catch (error) {
        throw vs.FileSystemError.FileNotFound(path.toString());
    }
}

export async function writeJson(path: vs.Uri, content: string): Promise<boolean>{
    
    const jsonContent = JSON.stringify(content);
    const encoder = new TextEncoder();
    const fileContents = encoder.encode(jsonContent);
    
    try {
        await vs.workspace.fs.writeFile(path, fileContents);
    } catch(error) {
        throw vs.FileSystemError.FileNotFound(path);
    }

    return true;
}