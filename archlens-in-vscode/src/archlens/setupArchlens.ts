import * as path from '../filesystem/pathResolver';
import * as vs from 'vscode';
import * as fs from 'fs';
import * as cp from 'child_process';
import { isVenv,  } from '../filesystem/fileoperations';
import { ArchLensConfig } from '../filesystem/pathResolver';
import { create } from 'domain';

async function getPythonApi() : Promise<any> {
    const pythonExt = vs.extensions.getExtension('ms-python.python');
    if (!pythonExt) {
        vs.window.showErrorMessage("Could not find Python Extension")
        return null;
    }

    const pythonApi = pythonExt!.exports;
    return pythonApi;
}

export async function getInterpreter() : Promise<any> {
    const pythonApi = await getPythonApi();
    return await pythonApi.settings.getExecutionDetails();
}

export async function getArchlensPath(interpreter : any) : Promise<string> {
    const pythonPath = interpreter.execCommand?.[0];
    return path.toArchlensPath(pythonPath);
}

export async function checkArchlensConfig() : Promise<boolean> {
    if (!fs.existsSync(ArchLensConfig.fsPath)) {
        vs.window.showInformationMessage("Archlens config not found, would you like to create it?", "Create", "Cancel").then(async (value) => {
            if(value === "Create") {
                const interpreter = await getInterpreter();
                const archlensPath = await getArchlensPath(interpreter);
                const command = [
                    "init",
                    "--config-path=" + ArchLensConfig.fsPath
                ]

                cp.execFileSync(archlensPath, command, { env: interpreter.getExecutionDetails })
            }
            vs.commands.executeCommand('archlens-in-vscode.setupArchLens')
        })
        return false;
    }
    return true;
}

async function installArchlens(pythonPath : string, interpreter : any) : Promise<void> {
    vs.window.showInformationMessage("Archlens not found, would you like to install it?", "Install", "Cancel").then((value) => {
        if(value === "Install") {
            vs.window.showInformationMessage("Installing Archlens...");
            const command = [
                "-m",
                "pip",
                "install",
                "archlens"
            ]
            cp.execFileSync(pythonPath, command, { env: interpreter.getExecutionDetails })
            vs.commands.executeCommand('archlens-in-vscode.setupArchLens')
        }
    })
}

export async function checkVenv() : Promise<boolean> {
    const pythonApi = await getPythonApi();
    if (!await isVenv((await pythonApi.settings.getExecutionDetails()).execCommand?.[0])) {
        await createVenv(pythonApi);
        return false;
    }
    return true;
}

async function createVenv(pythonApi : any) : Promise<void> {
    vs.window.showInformationMessage("Current active environment is not a Virtual Environment...", "Change to Venv", "Create Venv", "Cancel").then(async (value) => {
        if(value === "Change to Venv") {
            await vs.commands.executeCommand('python.setInterpreter')
        } else if (value === "Create Venv") {
            await pythonApi.environments.createEnvironment()
        } else if (value === "Cancel") {
            return;
        }
        vs.commands.executeCommand('archlens-in-vscode.setupArchLens')
    })
}

export async function checkArchlens(interpreter : any) : Promise<boolean> {
    const pythonPath = interpreter.execCommand?.[0];
    const archlensPath = path.toArchlensPath(pythonPath)
    if ( !fs.existsSync(archlensPath)) {
        await installArchlens(pythonPath, interpreter);
        return false;
    }
    return true;
}