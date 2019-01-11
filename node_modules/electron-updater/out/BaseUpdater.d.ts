import { AllPublishOptions } from "builder-util-runtime";
import { AppUpdater, DownloadExecutorTask } from "./AppUpdater";
export declare abstract class BaseUpdater extends AppUpdater {
    protected quitAndInstallCalled: boolean;
    private quitHandlerAdded;
    protected constructor(options?: AllPublishOptions | null, app?: any);
    quitAndInstall(isSilent?: boolean, isForceRunAfter?: boolean): Promise<void>;
    protected executeDownload(taskOptions: DownloadExecutorTask): Promise<Array<string>>;
    protected abstract doInstall(installerPath: string, isSilent: boolean, isRunAfter: boolean): Promise<boolean>;
    protected install(isSilent: boolean, isRunAfter: boolean): Promise<boolean>;
    protected addQuitHandler(): void;
}
