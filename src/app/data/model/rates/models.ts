import {Default} from "../models";

class Rate extends Default {
    name: string;
    EventTypeRates: number[];
    EventsRates: number[];
    percentage: number;
    days: any;
    months: any;
    useInterval?: boolean = false;
    active?: boolean = false;
    startDate: Date;
    endDate: Date;
    startTime: Date;
    endTime: Date;
}

export {
    Rate
}