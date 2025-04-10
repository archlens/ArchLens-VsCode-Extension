import { ExtensionContext, WebviewPanel, Uri, ViewColumn, window} from "vscode";
import { WebviewHTMLTemplate } from "../views/webviewHTMLTemplate";


export class WebviewService {
    private context: ExtensionContext;
    private panel: WebviewPanel | undefined;
    private messageHandlers: Map<string, (message: any) => Promise<void>>;

    constructor(context: ExtensionContext) {
        this.context = context;
        this.messageHandlers = new Map();
    }

    public registerMessageHandler(command: string, handler: (message: any) => Promise<void>): void {
        if(!this.panel) {
            return;
        }

        this.messageHandlers.set(command, handler);
    }

    public sendMessage(message: any) : void {
        if(!this.panel) {
            return;
        }

        this.panel.webview.postMessage(message);
    }

    public createWebView(): WebviewPanel {
        this.panel = window.createWebviewPanel(
            'GraphView',
            'Graph-view',
            ViewColumn.Two,
            {
              enableScripts: true,
              retainContextWhenHidden: true,
              localResourceRoots: [
                Uri.joinPath(this.context.extensionUri, "out", "webview"),
                Uri.joinPath(this.context.extensionUri, "out", "webview", "scripts"),
                Uri.joinPath(this.context.extensionUri, "out", "webview", "styles"),
              ]
            }
          );
          
          this.panel.webview.html = WebviewHTMLTemplate(this.panel.webview, this.context);
          this.setupMessageHandler();

          return this.panel;
    }

    private setupMessageHandler(): void {
        if (!this.panel) {
            return;
        }
        
        this.panel.webview.onDidReceiveMessage(
          async message => {
            const handler = this.messageHandlers.get(message.command);
            if (handler) {
              await handler(message);
            }
          },
          undefined,
          this.context.subscriptions
        );
    }
}