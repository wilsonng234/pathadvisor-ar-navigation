import React from 'react';
import { Viro3DObject, ViroAmbientLight, ViroOmniLight } from '@viro-community/react-viro';

export default function arrow({
  x_cor,
  y_cor,
  direction,
}: {
  x_cor: number;
  y_cor: number;
  direction: number;
}) {
  return (
    <>
      <ViroAmbientLight color="#ffffff" intensity={200} />
      {/* <Viro3DObject
        source={require('../../../res/direction_arrow.glb')}
        type="GLB"
        position={[x_cor, 0, y_cor]}
        rotation={[0, direction == 0 ? 90 : direction == 1 ? 180 : 0, 0]}
        scale={[0.1, 0.1, 0.1]}
      /> */}
      <Viro3DObject
        source={require('../../../res/direction_arrow.glb')}
        type="GLB"
        position={[x_cor, 0, y_cor]}
        rotation={[direction == 0 ? 0 : direction == 1 ? -90 : 90, direction == 0 ? 90 : 0, 0]}
        scale={[0.05, 0.05, 0.05]}
      />
    </>
  )
}
