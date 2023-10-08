/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/
import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function Avatar(props) {
  const { animation, wireframe, interviewOpened } = props;
  const { headFollow, cursorFollow } = useControls({
    headFollow: false,
    cursorFollow: false,
  });
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("models/GBAVATAR-TEMP.gltf");

  // const { animations: typingAnimation } = useFBX("animations/Typing.fbx");
  // const { animations: standingAnimation } = useFBX(
  //   "animations/Standing Idle.fbx"
  // );
  // const { animations: fallingAnimation } = useFBX(
  //   "animations/Falling Idle.fbx"
  // );

  // typingAnimation[0].name = "Typing";
  // standingAnimation[0].name = "Standing";
  // fallingAnimation[0].name = "Falling";

  const { actions } = useAnimations(animations, group);

  useFrame((state) => {
    if (headFollow) {
      group.current.getObjectByName("Head").lookAt(state.camera.position);
    }
    if (cursorFollow) {
      const target = new THREE.Vector3(state.mouse.x, state.mouse.y, 1);
      group.current.getObjectByName("Spine2").lookAt(target);
    }
  });

  useEffect(() => {
    actions[animation]?.reset().fadeIn(0.5).play();
    return () => {
      actions[animation]?.reset().fadeOut(0.5);
    };
  }, [animation]);

  useEffect(() => {
    Object.values(materials).forEach((material) => {
      material.wireframe = wireframe;
    });
  }, [wireframe]);

  useEffect(() => {
    Object.values(materials).forEach((material) => {
      if (material.name === 'Material_007.002') {
        return; // Skip over Material_007.002
      }
      // material.emissive = material.color;
      material.color = new THREE.Color(0, 0, 0);
    });
  }, []);

  // useEffect(() => {
  //   if (materials['Material_007.002']) {
  //     materials['Material_007.002'].color = new THREE.Color(0x000000); // Change to black
  //   }
  // }, [materials]);

  return (
    <group {...props} ref={group} dispose={null}>
      <group name="AuxScene">
        <group name="Scene">
          <group name="Scene_1" />
          <group name="Armature" rotation={[0, 0, 0]} scale={0.01}>
            <primitive object={nodes.mixamorigHips} />
            <skinnedMesh 
              name="Hair002" 
              geometry={nodes.Hair002.geometry} 
              material={materials['Material_007.002']} 
              skeleton={nodes.Hair002.skeleton} 
              castShadow
              receiveShadow
            />
            <skinnedMesh 
              name="remesh_10_combined_Remeshed" 
              geometry={nodes.remesh_10_combined_Remeshed.geometry} 
              material={materials.remesh_10_combined_Bake} 
              skeleton={nodes.remesh_10_combined_Remeshed.skeleton} 
              onPointerOver={() => setHovered(true)}
              onPointerOut={() => setHovered(false)}
              // onClick={() => setIndex((index + 1) % names.length)}
              castShadow 
              receiveShadow
            />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("models/GBAVATAR-TEMP.gltf");