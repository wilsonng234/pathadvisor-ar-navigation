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
      <ViroOmniLight
        intensity={300}
        position={[-10, 10, 10]}
        color={"#FFFFFF"}
        attenuationStartDistance={0}
        attenuationEndDistance={20} />
      <ViroOmniLight
        intensity={300}
        position={[10, -10, 10]}
        color={"#FFFFFF"}
        attenuationStartDistance={0}
        attenuationEndDistance={20} />
      <ViroOmniLight
        intensity={300}
        position={[10, -10, 10]}
        color={"#FFFFFF"}
        attenuationStartDistance={0}
        attenuationEndDistance={20} />
      <ViroOmniLight
        intensity={300}
        position={[-10, -10, 10]}
        color={"#FFFFFF"}
        attenuationStartDistance={0}
        attenuationEndDistance={20} />
      <Viro3DObject
        source={require('../../../res/direction_arrow.glb')}
        type="GLB"
        position={[x_cor, 0, y_cor]}
        rotation={[0, direction == 0 ? 90 : direction == 1 ? 180 : 0, 0]}
        scale={[0.1, 0.1, 0.1]}
      />
    </>
  )
}
