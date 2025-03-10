

export class Graph {

    private modules : Map<string, GraphModule> =    new Map<string, GraphModule>();
    private files : Map<string, GraphFile> = new Map<string, GraphFile>();

    constructor() {
    }

    getModule(name : string) : GraphModule | undefined {
        return this.modules.get(name);
    }

    setModule(module : GraphModule) : void {
        this.modules.set(module.fullName, module);
    }

    getFile(name : string) : GraphFile | undefined {
        return this.files.get(name);
    }

    setFile(file : GraphFile) : void {
        this.files.set(file.path, file);
    }

    getFilenamesFromEdge(source : string, target : string) : Map<string, string[]>{
        let sourceModule = this.getModule(source)!;
        let targetModule = this.getModule(target)!;

        let files = new Map<string, string[]>();

        for (let sourceFile of sourceModule.files){

            const targetEdges = Array.from(sourceFile.edge_to)
                .filter(edge => targetModule.files.has(edge))
                .map(edge => edge.name);

            if (targetEdges.length > 0) {
                files.set(sourceFile.name, targetEdges);
            }
        }

        return files;
    }

    toList(){
        let elements = Array.from(this.modules).map<object>((m, i, elements) => { return { data: { id: m[1].fullName, label: m[1].fullName, type: 'Module' }}});
    
        let edges = new Map;
    
        for (let [name, from] of this.files){
            for( let to of from.edge_to){
                if(from.module == to.module) {
                    continue;
                }

                let label = null;
                let fullEdgeName = from.module!.fullName+to.module!.fullName;

                if(edges.has(fullEdgeName)){
                    label = edges.get(fullEdgeName);
                    label.data.label++;
                } else {
                    label = { data: {id: (fullEdgeName), source: from.module.fullName, target: to.module!.fullName, label:1 }};
                }
                edges.set(fullEdgeName, label);
            }
        }
    
        for (let [key, data] of edges){
            elements.push(data);
        }
    
        return elements;
    }
}

export class GraphFile {

    public edge_to : Set<GraphFile> = new Set<GraphFile>

    constructor (
        public name : string,
        public path : string,
        public module : GraphModule
    ) {}
}

export class GraphModule {

    public files : Set<GraphFile> = new Set<GraphFile>();

    constructor (
        public name : string,
        public fullName : string,
        public path : string,
    ) {}
}