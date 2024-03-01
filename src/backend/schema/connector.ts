export default interface Connector {
    _id: string;
    floorIds: string[];
    weight?: number;
    tagIds?: string[];
}
