// ts-node generateQRCode.ts

import Node from "../schema/node";
import { getFloorById, getNodesWithinBoundingBox } from "../api"

const fs = require('fs');
const QRCode = require('qrcode');

interface QRCodeData {
    id: string,
    name: string
    x: number,
    y: number,
    floorId: string,
    orientation?: number,
}

const generateQRCode = async (floorId: string) => {
    const dir = `../assets/qrcodes/${floorId}`;
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir, { recursive: true });

    const floor = (await getFloorById(floorId)).data;
    const boxCoordinates = `${floor.startX},${floor.startY},${floor.startX + floor.mapWidth},${floor.startY + floor.mapHeight}`
    const nodes = (await getNodesWithinBoundingBox(floorId, boxCoordinates, true)).data;

    nodes.forEach((node: Node) => {
        if (!node.coordinates || !node.name)
            return;
        const qrCodeJson: QRCodeData = {
            id: node._id,
            name: node.name,
            x: node.coordinates[0],
            y: node.coordinates[1],
            floorId: node.floorId,
        }
        const jsonString = JSON.stringify(qrCodeJson);
        QRCode.toFile(`${dir}/${qrCodeJson.id}.png`, jsonString, {
            errorCorrectionLevel: 'H'
        }, (err: any) => {
            if (err)
                console.error(err);
        });
    })
}

generateQRCode('G')
