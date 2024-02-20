export default interface Edge {
    _id: string;
    floorId: string;
    fromNodeId: string;
    toNodeId: string;
    weightType: 'nodeDistance' | 'max' | 'number';
    weight?: number;
    fromNodeCoordinates: [number, number];
    toNodeCoordinates: [number, number];
}