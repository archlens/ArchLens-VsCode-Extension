import { Graph } from "../graph/graph";
import { GraphService } from "./graphService";
import { WebviewService } from "./webviewService";

export class GraphViewService {
    private webviewService: WebviewService;
    private graphService: GraphService;

    constructor(webviewService: WebviewService, graphService: GraphService) {
        this.webviewService = webviewService;
        this.graphService = graphService;
    }

    async updateViews(): Promise<void> {
        const views = await this.graphService.getViews();
    
        this.webviewService.sendMessage({ command: "update_views",
            views: views 
        })
    }
    
    async updateGraph( 
        view: string,
        diffView = false,
        reload: boolean = false
    ): Promise<Graph> {
        this.webviewService.sendMessage({ command: "updating_graph" });
        
        const graph = await this.graphService.getGraph(view, diffView, reload);
    
        this.webviewService.sendMessage({ 
            command: "update_graph",
            graph: graph.toList(),
        });
    
        this.webviewService.sendMessage({ command: "graph_updated" });
    
        return graph;
    }
}