import React from 'react';
import { Viro3DObject, ViroAmbientLight } from '@viro-community/react-viro';

interface ARArrowProps {
  x_cor_start: number;
  y_cor_start: number;
  x_cor_dest: number;
  y_cor_dest: number;
}

const ARArrow = ({ x_cor_start, y_cor_start, x_cor_dest, y_cor_dest }: ARArrowProps) => {
  return (
    <>
      <ViroAmbientLight color="#ffffff" intensity={200} />
      <Viro3DObject
        source={require('../../assets/ar/direction_arrow.glb')}
        type="GLB"
        position={[0, -0.04, -0.5]}
        rotation={[90, 0, 0]}
        // rotation={[direction == 0 ? 0 : direction == 1 ? -90 : 90, direction == 0 ? 90 : 0, 0]}
        scale={[0.05, 0.05, 0.05]}
      />
    </>
  )
}

export default ARArrow;
