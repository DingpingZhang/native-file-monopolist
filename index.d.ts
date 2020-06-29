export declare interface FileMonopolist {
  filePath: string;
  monopolized: boolean;
  monopolize(): number;
  dispose(): boolean;
}
