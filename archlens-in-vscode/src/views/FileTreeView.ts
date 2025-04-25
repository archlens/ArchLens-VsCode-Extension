import * as vscode from 'vscode';
import { Edge } from '../graph/graph';
import { File, Relation } from '../graph/graphJson';

class TreeDataProvider implements vscode.TreeDataProvider<[File, number]> {

    private files: Map<File, Map<File, number>>

    constructor(edge : Edge){
        this.files = new Map();
        let uniqueFromFiles = new Map<string, File>();
        let uniqueToFiles = new Map<string, File>();

        for (let relation of edge.relations) {
            if (!uniqueFromFiles.has(relation.from_file.path)) {
                uniqueFromFiles.set(relation.from_file.path, relation.from_file)
                this.files.set(relation.from_file, new Map);
            } 
            if (!uniqueToFiles.has(relation.to_file.path)) {
                uniqueToFiles.set(relation.to_file.path, relation.to_file)
            }
            if (!this.files.get(uniqueFromFiles.get(relation.from_file.path)!)!.has(uniqueToFiles.get(relation.to_file.path)!)) {
                this.files.get(uniqueFromFiles.get(relation.from_file.path)!)!.set(uniqueToFiles.get(relation.to_file.path)!, 0);
            }

            let uniqueToFile = uniqueToFiles.get(relation.to_file.path)!;
            let uniqueFromFile = uniqueFromFiles.get(relation.from_file.path)!;

            // Increment the count of the relation between the two files
            this.files.get(uniqueFromFile)!.set(uniqueToFile, this.files.get(uniqueFromFile)!.get(uniqueToFile)!+ 1);
        }
    }

    getTreeItem(element:[File, number]): vscode.TreeItem {
        const hasChildren = this.files.has(element[0]);
        let treeItem =  new vscode.TreeItem(
            element[0].name + " (" + element[1] + ")",
            hasChildren ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None
        );

        treeItem.command = {
            command: 'archlens-in-vscode.openFile',
            title: 'Open File',
            arguments: [element[0]]
        };

        return treeItem;
    }

    getChildren(file?: [File, number]): [File, number][] {
        if (!file) {
            return (Array.from(this.files.keys())).map((f) => {
                let references = 0;
                for (let [_, count] of this.files.get(f)!) {
                    references += count;
                }
                return [f, references] as [File, number];
            });
        }
        else {
            let children = this.files.get(file[0])!;
            return Array.from(children.keys()).map((f) => {
                return [f, children.get(f)!] as [File, number];
            });
        }
    }  
}


export function showTreeView(context: vscode.ExtensionContext, edge : Edge) : void {
    const treeViewProvider = new TreeDataProvider(edge);
    const treeView = vscode.window.createTreeView(
        'filesWithDependencyTree',
        {treeDataProvider: treeViewProvider},
    );

    context.subscriptions.push(treeView);
}