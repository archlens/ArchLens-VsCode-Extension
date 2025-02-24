import * as file from '../filesystem/fileoperations';
import * as vs from 'vscode';

export async function syncArchLensConfig(workspaceRoot: vs.Uri, internalArchLensConfigPath: vs.Uri): Promise<string> {
    let archLensConfig = await getArchLensConfig(workspaceRoot);
    let rootFolder = archLensConfig['rootFolder']

    archLensConfig['rootFolder'] = vs.Uri.joinPath(workspaceRoot, rootFolder).toString();

    return archLensConfig.toString();
}

async function getArchLensConfig(workspaceRoot: vs.Uri) {
    const archlensConfigPath = vs.Uri.joinPath(workspaceRoot, 'archlens.json')
    const fileContents = await file.readJSON(archlensConfigPath);
    const archlensConfigJson = JSON.parse(fileContents);

    return archlensConfigJson;
}