export default interface PathNode {
    _id: string;
    distance: number;
    unit: 'METER' | 'MINUTE';
    coordinates: [number, number];
    floorId: string;
    tagIds?: string[];
    connectorId?: string;
    name?: string;
    imageUrl?: string;
    url?: string;
}
