import * as cp from 'child_process';
import * as file from '../filesystem/fileoperations';
import * as vs from 'vscode';
import * as path from '../filesystem/pathResolver';
import * as setup from './setupArchlens';

export async function getGraphJson(graphPath: vs.Uri, extensionPath: vs.Uri, diffView : boolean, reload: boolean): Promise<string> {

    if(reload) {
        await spawnArchLens(diffView);

        console.log("Reloading graph")
    }

    let json = "";

    try {
        json = await file.readJSON(graphPath);
    } catch(error) {
        if (error instanceof vs.FileSystemError) {
            await spawnArchLens(diffView);
            json = await file.readJSON(graphPath)
        }
    }

    return json;
}

async function spawnArchLens(diffView : boolean): Promise<void> {
    const interpreter = await setup.getInterpreter();
    const archlensPath = await setup.getArchlensPath(interpreter);

    const diffViewModifier = diffView ? "diff-" : "";

    const command = [
        `render-${diffViewModifier}json`,
        "--config-path=" + path.ArchLensConfig.fsPath
    ]

    cp.execFile(archlensPath, command, { env: interpreter.getExecutionDetails }, (err, stdout, stderr) => {
        if (err) {
            vs.window.showErrorMessage(`Error running archlens: ${stderr}`);
            console.error(err);
        } else {
            vs.window.showInformationMessage(`Archlens output: ${stdout}`);
        }
    })
}