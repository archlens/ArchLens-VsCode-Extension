import * as vscode from 'vscode';
import { showTreeView } from './views/FileTreeView';
import {Graph} from "./graph/graph";
import { File } from "./graph/graphJson"
import * as setup from './archlens/setupArchlens';
import { WebviewService } from './services/webviewService';
import { GraphService } from './services/graphService';
import { GraphViewService } from './services/graphViewService';

export function activate(context: vscode.ExtensionContext) {

    const webviewService = new WebviewService(context);
    const graphService = new GraphService(context);
    const graphViewservice = new GraphViewService(webviewService, graphService);

    context.subscriptions.push(
        vscode.commands.registerCommand('archlens-in-vscode.openFile', (file: File) => {
            const uri = vscode.Uri.file(file.path);
            vscode.window.showTextDocument(uri, {viewColumn: vscode.ViewColumn.One});
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('archlens-in-vscode.setupArchLens', async () => {
            let venv = await setup.checkVenv();
            if (!venv) return;
            let interpreter = await setup.getInterpreter();
            const archlens = await setup.checkArchlens(interpreter);
            if (!archlens) return;
            let config = await setup.checkArchlensConfig();
            if (!config) return;
            vscode.window.showInformationMessage("Archlens setup complete!")
        }
    ));

	context.subscriptions.push(
        vscode.commands.registerCommand('archlens-in-vscode.openGraphView', async () => {
            
            const panel = webviewService.createWebView();

            let g : Graph | undefined = undefined;
            let view = "";
            let diffView = false;

            webviewService.registerMessageHandler('edge_clicked', async (message) => {
                const edge = g!.getEdgeFromID(message.edgeID);
                showTreeView(context, edge!);
            });

            webviewService.registerMessageHandler('get_view', async (message) => {
                view = message.view;
                diffView = message.diffView;

                g = await graphViewservice.updateGraph(view, diffView, message.reload);
            });

            webviewService.registerMessageHandler('get_views', async (message) => {
                await graphViewservice.getViews(webviewService, graphService);
            });
            
            let saveEventHandler = vscode.workspace.onDidSaveTextDocument(async (_) => {
                g = await graphViewservice.updateGraph(view, diffView, true);
            });

            let deleteFileEventHandler = vscode.workspace.onDidDeleteFiles(async (_) => {
                g = await graphViewservice.updateGraph(view, diffView, true);
            });
          
            context.subscriptions.push(saveEventHandler, deleteFileEventHandler);

            panel.onDidDispose(() => {
                saveEventHandler.dispose();
                deleteFileEventHandler.dispose();
            });
        })
    );
}

export function deactivate() {}
