export class ImageData {
    image?: string;
    mime?: string;
    url?: string;
    imageSetId?: number;

    // TODO Use it everywhere instead of hardcoded code
    public static getFullData(image: ImageData): string {
        return 'data:' + image.mime + ';base64,' + image.image;
    }
}