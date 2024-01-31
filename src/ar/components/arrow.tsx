import React from 'react';
import {
  Viro3DObject
} from '@viro-community/react-viro';

export default function arrow({x_cor, y_cor, direction} : {x_cor:number, y_cor:number, direction:number}) {
    return(
        <Viro3DObject
          source={require('../../../res/arrow.obj')}
          type="OBJ"
          position={[x_cor, 0, y_cor]}
          rotation={[0, direction==0?90:direction==1?180:0, 0]}
          scale={[0.0005, 0.0005, 0.0005]}
        />
    )
}
