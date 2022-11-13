import { ServiceType, ServiceYear, servicePricesByYear } from './constants';
import { includePredicates } from './includePredicates';
import { getDiscounts, Discount } from './discounts';
import { sum } from './utils';

export const calculatePrice = (selectedServices: ServiceType[], selectedYear: ServiceYear) => {
    const servicesToInclude: ServiceType[] = selectedServices.filter(includePredicates);
    const servicePricesInSelectedYear: { [key in ServiceType]: number } = servicePricesByYear[selectedYear];
    const getBasePrice = (services: ServiceType[]): number => {
        return sum(Object.keys(servicePricesInSelectedYear)
            .filter((service: ServiceType) => services.includes(service))
            .map((service: ServiceType) => servicePricesInSelectedYear[service]));
    };
    const basePrice: number = getBasePrice(servicesToInclude);
    const discounts: Discount[] = getDiscounts(servicesToInclude, selectedYear);
    const discountedServices = discounts.reduce<ServiceType[]>((previousValue, currentValue) =>
        previousValue.concat(currentValue.services), []);
    const finalBasePricePart: number = getBasePrice(servicesToInclude.filter(service => 
        !discountedServices.includes(service)));
    const finalDiscountedPricePart: number = sum(discounts.map(discount => discount.price));
    const finalPrice: number = finalBasePricePart + finalDiscountedPricePart;

    return { basePrice, finalPrice };
}
