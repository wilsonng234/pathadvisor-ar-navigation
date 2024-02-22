export default interface Floor {
    _id: string;
    startX: number;
    startY: number;
    name?: string;
    buildingId: string;
    meterPerPixel: number;
    mapWidth: number;
    mapHeight: number;
    ratio: number;
    defaultX: number;
    defaultY: number;
    defaultLevel: number;
    mobileDefaultLevel: number;
    mobileDefaultX: number;
    mobileDefaultY: number;
    rank: number;
}
