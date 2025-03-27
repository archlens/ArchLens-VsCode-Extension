import {spawn} from 'child_process';
import * as file from '../filesystem/fileoperations';
import * as vs from 'vscode';
import * as path from '../filesystem/pathResolver';

export async function getGraphJson(graphPath: vs.Uri, extensionPath: vs.Uri, diffView : boolean, reload: boolean): Promise<string> {
    
    if(reload) {
        await spawnArchLens(extensionPath, diffView);

        console.log("Reloading graph")
    }

    let json = "";

    try {
        json = await file.readJSON(graphPath);
    } catch(error) {
        if (error instanceof vs.FileSystemError) {
            await spawnArchLens(extensionPath, diffView);
            json = await file.readJSON(graphPath)
        }
    }

    return json;
}

async function spawnArchLens(extensionPath : vs.Uri, diffView : boolean): Promise<void> {
    const diffViewModifier = diffView ? "diff-" : "";

    return new Promise((resolve, reject) => {
        const archLensProcess = spawn(path.Python, [
            path.ArchLensScript,
            `render-${diffViewModifier}json`,
            "--config-path=" + path.ArchLensConfig.fsPath
        ], {
            cwd: path.ArchLens(extensionPath).fsPath
        });

        archLensProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        archLensProcess.on('error', (error) => {
            reject(error);
        });

        archLensProcess.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Python process exited with code ${code}`));
            }
        });
    });
}