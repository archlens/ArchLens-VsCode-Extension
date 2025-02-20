import * as vscode from 'vscode';

class TreeDataProvider implements vscode.TreeDataProvider<string> {
    
    constructor(
        private items: string[]
    ){}

    getTreeItem(element: string): vscode.TreeItem {
        return new vscode.TreeItem(element, vscode.TreeItemCollapsibleState.None);
    }

    getChildren(element?: string | undefined): vscode.ProviderResult<string[]> {
        return element ? [] : this.items;
    }    
}


export function showTreeView(context: vscode.ExtensionContext, files : string[]) : void {
    const treeViewProvider = new TreeDataProvider(files);
    const treeView = vscode.window.createTreeView(
        'filesWithDependancyTree',
        {treeDataProvider: treeViewProvider}
    );

    context.subscriptions.push(treeView);
}