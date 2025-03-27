import * as cp from 'child_process';
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

    const pythonExt = vs.extensions.getExtension('ms-python.python');

    if(!pythonExt) {
        vs.window.showErrorMessage("Could not find Python Extension")
    }

    const pythonApi = pythonExt!.exports;
    const interpreter = await pythonApi.settings.getExecutionDetails();
    const pythonPath = interpreter.execCommand?.[0];

    const diffViewModifier = diffView ? "diff-" : "";

    const command = [
        'archlens',
        `render-${diffViewModifier}json`,
        "--config-path=" + path.ArchLensConfig.fsPath
    ]

    cp.execFile(pythonPath, command, { env: interpreter.getExecutionDetails }, (err, stdout, stderr) => {
        if (err) {
            vs.window.showErrorMessage(`Error running archlens: ${stderr}`);
            console.error(err);
        } else {
            vs.window.showInformationMessage(`Archlens output: ${stdout}`);
        }
    })
}