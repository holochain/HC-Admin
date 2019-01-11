/// <reference types="node" />
import { GithubOptions, HttpExecutor, UpdateInfo } from "builder-util-runtime";
import { OutgoingHttpHeaders, RequestOptions } from "http";
import { AppUpdater } from "../AppUpdater";
import { URL } from "url";
import { BaseGitHubProvider } from "./GitHubProvider";
import { ResolvedUpdateFileInfo } from "../main";
export interface PrivateGitHubUpdateInfo extends UpdateInfo {
    assets: Array<Asset>;
}
export declare class PrivateGitHubProvider extends BaseGitHubProvider<PrivateGitHubUpdateInfo> {
    private readonly updater;
    private readonly token;
    constructor(options: GithubOptions, updater: AppUpdater, token: string, executor: HttpExecutor<any>);
    protected createRequestOptions(url: URL, headers?: OutgoingHttpHeaders | null): RequestOptions;
    getLatestVersion(): Promise<PrivateGitHubUpdateInfo>;
    readonly fileExtraDownloadHeaders: OutgoingHttpHeaders | null;
    private configureHeaders;
    private getLatestVersionInfo;
    private readonly basePath;
    resolveFiles(updateInfo: PrivateGitHubUpdateInfo): Array<ResolvedUpdateFileInfo>;
}
export interface Asset {
    name: string;
    url: string;
}
