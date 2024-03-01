export default interface Node {
    _id: string;
    coordinates?: [number, number];
    centerCoordinates?: [number, number];
    floorId: string;
    tagIds?: string[];
    connectorId?: string;
    name?: string;
    keywords?: string[];
    imageUrl?: string;
    panoImageUrl?: string;
    url?: string;
    geoLocs?: {
        type: string;
        coordinates: number[][][][];
    };
    others?: {
        description?: string;
    };
}
