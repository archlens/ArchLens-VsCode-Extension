import * as path from '../filesystem/pathResolver';
import * as vs from 'vscode';
import * as fs from 'fs';
import * as cp from 'child_process';

export async function getInterpreter() : Promise<any> {
    const pythonExt = vs.extensions.getExtension('ms-python.python');

    if(!pythonExt) {
        vs.window.showErrorMessage("Could not find Python Extension")
    }

    const pythonApi = pythonExt!.exports;
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
