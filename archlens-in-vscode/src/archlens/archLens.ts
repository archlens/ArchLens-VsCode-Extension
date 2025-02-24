import { spawn } from 'child_process';
import * as file from '../filesystem/fileoperations';
import * as archlensConfig from './config';
import * as vs from 'vscode';
import { arch } from 'os';

export async function getGraphJson(graphPath: vs.Uri, archLensConfigPath: vs.Uri, extensionPath: vs.Uri): Promise<string> {
    const workspaceRootPath = vs.workspace.workspaceFolders?.[0]?.uri;

    await archlensConfig.syncArchLensConfig(workspaceRootPath!, archLensConfigPath);

    const archLensPath = vs.Uri.joinPath(extensionPath, '..', 'ArchLens').fsPath
    const pythonPath = '.venv/bin/python'
    const scriptPath = './src/cli_interface.py'

    await new Promise<void>((resolve, reject) => {
        const archLensProcess = spawn(pythonPath, [scriptPath, 'jsonfile'], {
            cwd: archLensPath
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