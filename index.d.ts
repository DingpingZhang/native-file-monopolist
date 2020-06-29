export declare interface FileMonopolist {
  readonly filePath: string;
  readonly monopolized: boolean;
  monopolize(): number;
  dispose(): boolean;
}
