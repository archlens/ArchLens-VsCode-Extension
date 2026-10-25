export interface Graph {
    title : string,
    packages : Array<Package>,
    edges : Array<Edge>
}

export interface Package {
    name : string,
    state : string,
}

export interface Edge {
    state : string,
    fromPackage : string,
    toPackage : string,
    label : string,
    relations : Array<Relation>
}

export interface Relation {
    from_file : File,
    to_file : File
}

export interface File {
    name : string,
    path : string
}