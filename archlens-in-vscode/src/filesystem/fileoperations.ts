import * as vs from 'vscode';
import * as path from 'path';
import * as fs from 'fs';


export async function readJSON(jsonpath: vs.Uri): Promise<string> {
    try {
        const uint8Array = await vs.workspace.fs.readFile(jsonpath);
        return new TextDecoder().decode(uint8Array);
    } catch (error) {
        throw vs.FileSystemError.FileNotFound(jsonpath.toString());
    }
}

export async function writeJson(jsonpath: vs.Uri, content: string): Promise<boolean>{
    
    const jsonContent = JSON.stringify(content);
    const encoder = new TextEncoder();
    const fileContents = encoder.encode(jsonContent);
    
    try {
        await vs.workspace.fs.writeFile(jsonpath, fileContents);
    } catch(error) {
        throw vs.FileSystemError.FileNotFound(jsonpath);
    }

    return true;
}

export async function isVenv(pythonpath: string): Promise<boolean> {
    const venvPath = path.dirname(pythonpath);
    const venvDir = path.join(venvPath, '..','pyvenv.cfg');
    return fs.existsSync(venvDir)          
}
