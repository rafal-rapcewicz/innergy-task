import { ServiceType } from './constants';
import { includePredicates, includeRules } from './includePredicates';

export const updateSelectedServices = (
    previouslySelectedServices: ServiceType[] = [],
    action: { type: "Select" | "Deselect"; service: ServiceType }
): ServiceType[] => {
    const { type, service } = action;

    switch (type) {
        case "Select": {
            const alreadySelected = previouslySelectedServices.includes(service);

            if (alreadySelected) return previouslySelectedServices;

            const includeRule = includeRules[service];

            return !includeRule || includeRule(previouslySelectedServices)
                ? previouslySelectedServices.concat(service)
                : previouslySelectedServices;
        }
        case "Deselect": {
            const beforeApplyingIncludeRules = previouslySelectedServices.filter(value => value !== service);

            return beforeApplyingIncludeRules.filter(includePredicates);
        }
        default: return previouslySelectedServices;
    }
};
