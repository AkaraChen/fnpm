/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    '/downloads/point/{period}': {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Gets the downloads per day for a given period for all packages. */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    period: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Registry downloads metadata info */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        'application/json': components['schemas']['RegistryDownloads'];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    '/downloads/point/{period}/{packageName}': {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Gets the downloads per day for a given period for a specific package. */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    period: string;
                    packageName: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Package downloads metadata info */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        'application/json': components['schemas']['PackageDownloads'];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    '/downloads/range/{period}': {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Gets the downloads per day for a given period for all packages. */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    period: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Registry downloads metadata info */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        'application/json': components['schemas']['DailyRegistryDownloads'];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    '/downloads/range/{period}/{packageName}': {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Gets the downloads per day for a given period for a specific package. */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    period: string;
                    packageName: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Package downloads metadata info */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        'application/json': components['schemas']['DailyPackageDownloads'];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    '/versions/{packageName}/last-week': {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Download count for specific versions of a package. It's only available for the previous 7 days.
         *     Note: for scoped packages, the `/` needs to be percent encoded. (`@slack/client` -> `@slack%2Fclient`). */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    packageName: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Package download count for specific versions. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        'application/json': components['schemas']['PackageVersionsDownloadCount'];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** @description Package download count for specific versions. */
        PackageVersionsDownloadCount: {
            /** @description Package name */
            readonly package: string;
            /** @description A map containing the package version as key and the download count as value. */
            downloads: {
                [key: string]: number;
            };
        };
        /** @description Lists the number of downloads for the registry in a given time period. */
        RegistryDownloads: {
            /** @description Total number of downloads */
            readonly downloads: number;
            /**
             * Format: date
             * @description Date of the first day (inclusive)
             */
            readonly start: string;
            /**
             * Format: date
             * @description Date of the last day (inclusive)
             */
            readonly end: string;
        };
        /** @description Lists the number of downloads for a package in a given time period. */
        PackageDownloads: components['schemas']['RegistryDownloads'] & {
            /** @description Package name */
            readonly package: string;
        };
        /** @description Lists the number of downloads in a given day. */
        DownloadsPerDay: {
            readonly downloads: number;
            /** Format: date */
            readonly day: string;
        };
        /** @description Lists the number of downloads for a package for each day in a given time period. */
        DailyRegistryDownloads: {
            /** @description Download counts per day */
            readonly downloads: components['schemas']['DownloadsPerDay'][];
            /**
             * Format: date
             * @description Date of the first day (inclusive)
             */
            readonly start: string;
            /**
             * Format: date
             * @description Date of the last day (inclusive)
             */
            readonly end: string;
        };
        /** @description Lists the number of downloads for a package for each day in a given time period. */
        DailyPackageDownloads: components['schemas']['DailyRegistryDownloads'] & {
            /** @description Package name */
            readonly package: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;
