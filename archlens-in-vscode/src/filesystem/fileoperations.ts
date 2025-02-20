import * as fs from 'fs';
import { FileSystemError } from 'vscode';


function readFileAsJSON(path: string): string {

    if(!fs.existsSync(path)) {
        throw new FileSystemError(`Could not find file: ${path}`);
    }

    const fileContent = fs.readFileSync(path, 'utf-8');

    return fileContent;
}