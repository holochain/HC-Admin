import { UpdateInfo } from "builder-util-runtime";
import { Logger, ResolvedUpdateFileInfo } from "./main";
/** @private **/
export declare class DownloadedUpdateHelper {
    readonly cacheDir: string;
    private _file;
    private _packageFile;
    private versionInfo;
    private fileInfo;
    constructor(cacheDir: string);
    readonly file: string | null;
    readonly packageFile: string | null;
    validateDownloadedPath(updateFile: string, versionInfo: UpdateInfo, fileInfo: ResolvedUpdateFileInfo, logger: Logger): Promise<string | null>;
    setDownloadedFile(downloadedFile: string, packageFile: string | null, versionInfo: UpdateInfo, fileInfo: ResolvedUpdateFileInfo): void;
    cacheUpdateInfo(updateFileName: string): Promise<void>;
    clear(): Promise<void>;
    private cleanCacheDir;
    private getValidCachedUpdateFile;
}
