import * as file from '../filesystem/fileoperations';
import * as vs from 'vscode';

export async function syncArchLensConfig(workspaceRoot: vs.Uri, internalArchLensConfigPath: vs.Uri): Promise<void> {
    let archLensConfig = await getArchLensConfig(workspaceRoot);
    let rootFolder = archLensConfig['rootFolder']

    archLensConfig['rootFolder'] = vs.Uri.joinPath(workspaceRoot, rootFolder).fsPath;
    archLensConfig['_alternative_target_root'] = vs.Uri.joinPath(workspaceRoot).fsPath

    await file.writeJson(internalArchLensConfigPath, archLensConfig);
}

async function getArchLensConfig(workspaceRoot: vs.Uri) {
    const archlensConfigPath = vs.Uri.joinPath(workspaceRoot, 'archlens.json')
    const fileContents = await file.readJSON(archlensConfigPath);
    const archlensConfigJson = JSON.parse(fileContents);

    return archlensConfigJson;
}