/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.13 public/models/GB-Studio-LVL-1.glb 
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function StudioLVL1(props) {
  const { nodes, materials } = useGLTF('models//GB-Studio-LVL-1.glb')
  return (
    <group {...props} dispose={null}>
      <group />
    </group>
  )
}

useGLTF.preload('models/GB-Studio-LVL-1.glb')
