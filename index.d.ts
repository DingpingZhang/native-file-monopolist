// Type definitions for native-file-monopolist
// Project: native-file-monopolist
// Definitions by: Dingping Zhang

/**
 * Represents the holder of a handle to the specified file.
 *
 * @remarks
 * The class can only be used fot Windows OS.
 * It does this by calling win32 Api (`CreateFile` and `CloseHandle`)
 */
export declare class FileMonopolist {
  /**
   * Initializes an instance of @see FileMonopolist by the specified file path.
   *
   * @param filePath The specified file path.
   */
  constructor(filePath: string);

  /**
   * Gets the file path held by this monopolist.
   */
  readonly filePath: string;

  /**
   * Gets a boolean value indicates the file held by this monopolist is monopolized.
   */
  readonly monopolized: boolean;

  /**
   * Opens a file handle (by `CreateFile`) exclusively and holds it
   * so that other applications cannot access the file.
   *
   * @returns If the number `0` is returned for successful execution,
   * the other non-zero value is [Win32 Error Code](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-erref/18d8fbe8-a967-4f1c-ae50-99ca8e491d2d).
   */
  monopolize(): number;

  /**
   * Releases the current file handle (by `CloseHandle`).
   *
   * @returns A boolean value indicates whether the operation was successful.
   */
  dispose(): boolean;
}
