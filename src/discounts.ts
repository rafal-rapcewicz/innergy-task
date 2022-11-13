import { ServiceType, ServiceYear } from './constants';

export type Discount = {
    services: ServiceType[];
    price: number;
}

/**
 * package of photography + video costs less: $2200 in 2020, $2300 in 2021 and $2500 in 2022
 */
const photographyWithVideoRecordingPackage = (selectedServices: ServiceType[], selectedYear: ServiceYear): Discount => {
    if (!(selectedServices.includes("Photography") && selectedServices.includes("VideoRecording"))) return;

    const getPrice = (): number => {
        switch (selectedYear) {
            case 2020: return 2200;
            case 2021: return 2300;
            case 2022: return 2500;
        }
    }

    return {
        services: ["Photography", "VideoRecording"],
        price: getPrice()
    }
}

/**
 * wedding session (..) in a package with photography during the wedding or with a video recording it costs $300
 */
const weddingSessionWithPhotographyOrVideoRecordingPackage = (selectedServices: ServiceType[]): Discount => {
    if (!(selectedServices.includes("WeddingSession") &&
        (selectedServices.includes("Photography") || selectedServices.includes("VideoRecording")))) return;

    return {
        services: ["WeddingSession"],
        price: 300
    }
}

/**
 * wedding session is free if the client chooses Photography during the wedding in 2022
 */
const weddingSessionWithPhotographyAt2022Package = (selectedServices: ServiceType[], selectedYear: ServiceYear): Discount => {
    if (!(selectedServices.includes("WeddingSession") && selectedServices.includes("Photography")
        && selectedYear === 2022)) return;

    return {
        services: ["WeddingSession"],
        price: 0
    }
}

type GroupedDiscounts = {
    key: string;
    discounts: Discount[];
}

export const getDiscounts = (selectedServices: ServiceType[], selectedYear: ServiceYear): Discount[] =>
    [
        photographyWithVideoRecordingPackage,
        weddingSessionWithPhotographyOrVideoRecordingPackage,
        weddingSessionWithPhotographyAt2022Package
    ]
        .map(packageFn => packageFn(selectedServices, selectedYear))
        .filter(discount => !!discount)
        // Any discounts should never be applied twice - greater discount wins.
        .reduce<GroupedDiscounts[]>((previousValue, currentValue) => {
            const key: string = currentValue.services.sort().join('');
            const match: GroupedDiscounts = previousValue.find(value => value.key === key);

            if (match) {
                match.discounts.push(currentValue);

                return previousValue;
            }

            return previousValue.concat({
                key,
                discounts: [currentValue]
            });
        }, [])
        .map(groupedDiscounts => {
            const [theGreatestDiscount] = groupedDiscounts.discounts.sort((a, b) => a.price - b.price);

            return theGreatestDiscount;
        });
