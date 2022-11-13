import { ServiceType } from './constants';

type Rule = (array: ServiceType[]) => boolean;

/**
 * It does not make sense to include the price of the Extra Blu-ray when the client did not choose a video recording. 
 */
const includeBlurayPackageRule: Rule = (services: ServiceType[] = []): boolean =>
    services.includes("VideoRecording");

/**
 * It does not make sense to include the price of handling two-day event when the client did not choose video recording or photography during the wedding.
 */
const includeTwoDayEventRule: Rule = (services: ServiceType[] = []): boolean =>
    services.includes("VideoRecording") || services.includes("Photography");

export const includeRules: {[key: string]: Rule } = {
    'BlurayPackage': includeBlurayPackageRule,
    'TwoDayEvent': includeTwoDayEventRule
};

export const includePredicates = (value: ServiceType, index: number, array: ServiceType[] = []): boolean =>
    includeRules[value]?.(array) ?? true;
