import { AllPublishOptions } from "builder-util-runtime";
import "source-map-support/register";
import { DownloadUpdateOptions } from "./AppUpdater";
import { BaseUpdater } from "./BaseUpdater";
import { UpdateCheckResult } from "./main";
export declare class AppImageUpdater extends BaseUpdater {
    constructor(options?: AllPublishOptions | null, app?: any);
    checkForUpdatesAndNotify(): Promise<UpdateCheckResult | null>;
    /*** @private */
    protected doDownloadUpdate(downloadUpdateOptions: DownloadUpdateOptions): Promise<Array<string>>;
    protected doInstall(installerPath: string, isSilent: boolean, isRunAfter: boolean): Promise<boolean>;
}
