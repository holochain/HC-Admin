import { AllPublishOptions, PublishConfiguration } from "builder-util-runtime";
import { AppUpdater } from "./AppUpdater";
import { BintrayProvider } from "./providers/BintrayProvider";
import { GenericProvider } from "./providers/GenericProvider";
import { GitHubProvider } from "./providers/GitHubProvider";
import { PrivateGitHubProvider } from "./providers/PrivateGitHubProvider";
export declare function isUrlProbablySupportMultiRangeRequests(url: string): boolean;
export declare function createClient(data: PublishConfiguration | AllPublishOptions, updater: AppUpdater): GenericProvider | BintrayProvider | GitHubProvider | PrivateGitHubProvider;
