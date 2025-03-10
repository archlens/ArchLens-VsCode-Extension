import { ModuleMap, File, Module } from "./graphJson";
import { Graph, GraphModule, GraphFile} from './graph';


export function buildGraph(json :string) : Graph {
    const moduleMap : ModuleMap = JSON.parse(json);
    const graph = new Graph();

    for (let [name, module] of Object.entries(moduleMap.modules)) {
        let parsedModule = new GraphModule (module.name, module.full_name, module.path);

        for (let [fileName, file] of Object.entries(module.files as Record<string, File>)) {
            let parsedFile = new GraphFile(file.name, file.path, parsedModule);

            parsedModule.files.add(parsedFile);
            graph.setFile(parsedFile);
        }

        graph.setModule(parsedModule);
    }

    for (let [name, module] of Object.entries(moduleMap.modules)) {
        for (let [fileName, file] of Object.entries(module.files as Record<string, File>)) {
            for (let edge of file.edge_to) {

                let fromFile = graph.getFile(file.path);
                let toFile = graph.getFile(edge)

                if(fromFile == undefined || toFile == undefined) {
                    continue;
                }

                fromFile.edge_to.add(toFile);
            }
        }
    }

    return graph;
}