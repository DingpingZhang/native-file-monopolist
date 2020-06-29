export declare class FileMonopolist {
  constructor(filePath: string);
  readonly filePath: string;
  readonly monopolized: boolean;
  monopolize(): number;
  dispose(): boolean;
}
