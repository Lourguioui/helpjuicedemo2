export class CompareUtils {

    private static compare(a: any, b: any): 1 | 0 | -1 {
        return a < b ? -1 : (a > b ? 1 : 0);
    }

    public static compareString(a: any, b: any): 1 | 0 | -1 {
        return this.compare(a, b);
    }

    public static compareNumbers(a: number, b: number): 1 | 0 | -1 {
        return this.compare(a, b);
    }

    public static compareDates(a: Date, b: Date) {
        return this.compare(a, b);
    }

    public static compareTimeSlots(a: string, b: string): 1 | 0 | -1 {
        const left = +(a.substr(0, 2)) * 60 + +(a.substr(2, 4));
        const right = +(b.substr(0, 2)) * 60 + +(b.substr(2, 4));
        return this.compare(left, right);
    }
}
