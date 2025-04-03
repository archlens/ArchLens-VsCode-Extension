import * as path from '../filesystem/pathResolver';
import * as vs from 'vscode';
import * as fs from 'fs';
import * as cp from 'child_process';
import { isVenv } from '../filesystem/fileoperations';
import { create } from 'domain';

export async function getInterpreter() : Promise<any> {
    const pythonExt = vs.extensions.getExtension('ms-python.python');

    if(!pythonExt) {
        vs.window.showErrorMessage("Could not find Python Extension")
    }

    const pythonApi = pythonExt!.exports;
    if (!await isVenv((await pythonApi.settings.getExecutionDetails()).execCommand?.[0])) {
        await createVenv(pythonApi);
    }

    return await pythonApi.settings.getExecutionDetails();
}

export async function getArchlensPath(interpreter : any) : Promise<string> {
    const pythonPath = interpreter.execCommand?.[0];
    const archlensPath = path.toArchlensPath(pythonPath)
    if ( !fs.existsSync(archlensPath)) {
        await installArchlens(pythonPath, interpreter);
    }
    return path.toArchlensPath(pythonPath);
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
            cp.execFile(pythonPath, command, { env: interpreter.getExecutionDetails }, (err, stdout, stderr) => {
                if (err) {
                    vs.window.showErrorMessage(`Error installing Archlens: ${stderr}`);
                    console.error(err);
                } else {
                    vs.window.showInformationMessage(`Archlens installed: ${stdout}`);
                }
            })
        }
    })
}

async function createVenv(pythonApi : any) : Promise<void> {
    vs.window.showInformationMessage("Current active environment is not a Virtual Environment...", "Change to Venv", "Create Venv", "Cancel").then(async (value) => {
        if(value === "Change to Venv") {
            vs.commands.executeCommand('python.setInterpreter')
        } else if (value === "Create Venv") {
            await pythonApi.environments.createEnvironment()
        }
    })
}
