import {spawn} from 'child_process';
import * as file from '../filesystem/fileoperations';
import * as vs from 'vscode';
import * as path from '../filesystem/pathResolver';

export async function getGraphJson(graphPath: vs.Uri, extensionPath: vs.Uri): Promise<string> {
    await spawnArchLens(extensionPath)

    return await file.readJSON(graphPath);
}

async function spawnArchLens(extensionPath : vs.Uri): Promise<void> {
    return new Promise((resolve, reject) => {
        const archLensProcess = spawn(path.Python, [
            path.ArchLensScript,
            'jsonfile',
            "--config-path=" + path.ArchLensConfig.fsPath
        ], {
            cwd: path.ArchLens(extensionPath).fsPath
        });

        // Consider adding stderr and stdout handlers to see error messages
        archLensProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        archLensProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
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