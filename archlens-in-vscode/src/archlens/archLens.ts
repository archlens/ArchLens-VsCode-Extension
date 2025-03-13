import { spawn } from 'child_process';
import * as file from '../filesystem/fileoperations';
import * as archlensConfig from './config';
import * as vs from 'vscode';
import os from 'os';

export async function getGraphJson(graphPath: vs.Uri, extensionPath: vs.Uri): Promise<string> {
    const workspaceRootPath = vs.workspace.workspaceFolders?.[0]?.uri;

    const archLensConfigPath = vs.Uri.joinPath(workspaceRootPath!, "archlens.json").fsPath;
    const archLensPath = vs.Uri.joinPath(extensionPath, '..', 'ArchLens').fsPath
    const isWindows = process.platform === "win32"
    const pythonPath = isWindows ? '.venv/Scripts/python.exe' : '.venv/bin/python'
    const scriptPath = './src/cli_interface.py'

    await new Promise<void>((resolve, reject) => {
        const archLensProcess = spawn(pythonPath, [scriptPath, 'jsonfile', "--config-path=" + archLensConfigPath], {
            cwd: archLensPath
        });
        
        // Add logging to debug
        console.log('Python Path:', pythonPath);
        console.log('Script Path:', scriptPath);
        console.log('Config Path:', archLensConfigPath);
        console.log('Working Directory:', archLensPath);

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

    const graphJson = await file.readJSON(graphPath);
    return graphJson;
}