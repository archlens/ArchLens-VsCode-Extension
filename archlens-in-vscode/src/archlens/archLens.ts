import { spawn } from 'child_process';
import * as file from '../filesystem/fileoperations';
import * as archlensConfig from './config';
import * as vs from 'vscode';

export async function getGraphJson(graphPath: vs.Uri, archLensConfigPath: vs.Uri): Promise<string> {
    const workspaceRootPath = vs.workspace.workspaceFolders?.[0]?.uri;

    await archlensConfig.syncArchLensConfig(workspaceRootPath!, archLensConfigPath);

    const graphJson = await file.readJSON(graphPath);
    return graphJson;
}