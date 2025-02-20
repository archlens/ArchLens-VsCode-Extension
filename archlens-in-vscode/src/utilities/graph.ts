interface Graph {
    modules: {
        name: string
        files: string[]
    }[]
    files: {
        name: string
        module: string
        edge_to: string[]
    }[]
}

class GraphFile {
    constructor (
        public name : string,
        public edge_to : Set<GraphFile>,
        public module : GraphModule | undefined
    ) {}
}

class GraphModule {

    constructor (
        public name : string,
        public files : Set<GraphFile>
    ) {}
}

export function buildGraph(json :string) : Set<GraphModule>{
    const graph : Graph = JSON.parse(json)
    let modules = graph.modules;
    let files = graph.files;

    let parsedModules = new Map<string, GraphModule>();

    let parsedFiles = new Map<string, GraphFile>();

    let _filenameToEdges = new Map<String, string[]>();

    for (let f of files){
        let parsedFile = new GraphFile (f.name, new Set, undefined);
        parsedFiles.set(f.name, parsedFile);
        _filenameToEdges.set(f.name, f.edge_to);
    }

    for (let f of files){
        let k = f.name;
        let v = parsedFiles.get(k);
        for(let edge of _filenameToEdges.get(k)!) {
            v!.edge_to.add(parsedFiles.get(edge)!);
        }
        
        
    }

    for (let m of modules){
        let parsedModule = new GraphModule (m.name, new Set);
        for (let f of m.files) {
            parsedModule.files.add(parsedFiles.get(f)!);
            parsedFiles.get(f)!.module = parsedModule;
        }

        parsedModules.set(m.name, parsedModule);
    }

    let graphSet = new Set<GraphModule>;

    for (let m of modules) {
        graphSet.add(parsedModules.get(m.name)!)
    }

    return graphSet
}

export function makeElementsList(g : Set<GraphModule>){
    let elements = Array.from(g).map<object>((m, i, elements) => { return { data: { id: m.name, label: m.name, type: 'Module' }}});

    let edges = new Map;

    for(let m of g) {
        for (let from of m.files){
            for( let to of from.edge_to){
                if (from.module != to.module){
                    let data = null;
                    if(edges.has(from.module!.name+to.module!.name)){
                        data = edges.get(from.module!.name+to.module!.name);
                        data.data.label++;
                    } else {
                        data = { data: {id: (from.module!.name+to.module!.name), source: m.name, target: to.module!.name, label:1}};
                    }
                    edges.set(from.module!.name+to.module!.name, data);
                }
            }
        }
    }

    for (let [key, data] of edges){
        elements.push(data);
    }

    return elements;
}