import * as json_interfaces from "./graphJson"

export class Graph {
    public title : string;
    public packages : Array<json_interfaces.Package>;
    public edges : Map<string, Edge>;

    constructor(g : json_interfaces.Graph) {
        this.title = g.title;
        this.packages = g.packages;
        this.edges = new Map(g.edges.map(e => [e.fromPackage + "=>" + e.toPackage, new Edge(e)]));
    }

    getEdgeFromID(id : string){
        return this.edges.get(id);
    }

    toList(){
        let elements = this.packages.map<object>((p, i, elements) => { return { data: { id: p.name, label: p.name, type: p.state}}});
        let edges : object[] = [];
        for (let [_, e] of this.edges) {
            edges.push({data: {id: e.id, label: e.label, source: e.fromPackage, target: e.toPackage, type: e.state}});
        }

        return elements.concat(edges);
    }

}

export class Edge {
    public id : string;
    public state : string;
    public fromPackage : string;
    public toPackage : string;
    public label : string;
    public relations : Array<json_interfaces.Relation>;

    constructor(e : json_interfaces.Edge){
        this.id = e.fromPackage + "=>" + e.toPackage;
        this.state = e.state;
        this.fromPackage = e.fromPackage;
        this.toPackage = e.toPackage;
        this.label = e.label;
        this.relations = e.relations;
    }
}
