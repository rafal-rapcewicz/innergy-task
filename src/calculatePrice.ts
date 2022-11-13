import { ServiceType, ServiceYear, servicePricesByYear } from './constants';
import { includePredicates } from './includePredicates';

type Discount = {
    services: ServiceType[];
    price: number;
}

const photographyWithVideoRecordingPackage = (selectedServices: ServiceType[], selectedYear: ServiceYear): Discount => {
    if (!(selectedServices.includes("Photography") && selectedServices.includes("VideoRecording"))) return;

    const getPrice = () => {
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

const weddingSessionWithPhotographyOrVideoRecordingPackage = (selectedServices: ServiceType[]): Discount => {
    if (!(selectedServices.includes("WeddingSession") &&
        (selectedServices.includes("Photography") || selectedServices.includes("VideoRecording")))) return;

    return {
        services: ["WeddingSession"],
        price: 300
    }
}

const weddingSessionWithPhotographyAt2022Package = (selectedServices: ServiceType[], selectedYear: ServiceYear): Discount => {
    if (!(selectedServices.includes("WeddingSession") && selectedServices.includes("Photography")
        && selectedYear === 2022)) return;

    return {
        services: ["WeddingSession"],
        price: 0
    }
}

const getDiscounts = (selectedServices: ServiceType[], selectedYear: ServiceYear): Discount[] => {
    return [
        photographyWithVideoRecordingPackage,
        weddingSessionWithPhotographyOrVideoRecordingPackage,
        weddingSessionWithPhotographyAt2022Package
    ]
        .map(packageFn => packageFn(selectedServices, selectedYear))
        .filter(discount => !!discount)
        // Any discounts should never be applied twice - greater discount wins.
        .reduce<{ key: string; discounts: Discount[] }[]>((previousValue, currentValue) => {
            const key = currentValue.services.sort().join('');
            const match = previousValue.find(value => value.key === key);

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
        })
}

export const calculatePrice = (selectedServices: ServiceType[], selectedYear: ServiceYear) => {
    const servicesToInclude: ServiceType[] = selectedServices.filter(includePredicates);
    const servicePricesInSelectedYear: { [key in ServiceType]: number } = servicePricesByYear[selectedYear];
    const getBasePrice = (services: ServiceType[]) => {
        return Object.keys(servicePricesInSelectedYear)
            .filter((service: ServiceType) => services.includes(service))
            .map((service: ServiceType) => servicePricesInSelectedYear[service])
            .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
    };
    const basePrice = getBasePrice(servicesToInclude);
    const discounts: Discount[] = getDiscounts(servicesToInclude, selectedYear);
    const discountedServices = discounts.reduce<ServiceType[]>((previousValue, currentValue) => previousValue.concat(currentValue.services), []);
    const finalBasePricePart = getBasePrice(servicesToInclude.filter(service => !discountedServices.includes(service)));
    const finalDiscountedPricePart = discounts.map(discount => discount.price)
        .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
    const finalPrice = finalBasePricePart + finalDiscountedPricePart;

    return { basePrice, finalPrice };
}
