import {
  Float,
  MeshDistortMaterial,
  MeshWobbleMaterial,
  useScroll
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { animate, useMotionValue } from "framer-motion";
import { motion } from "framer-motion-3d";
import { useEffect, useRef, useState } from "react";
import { framerMotionConfig } from "../config";
import { Avatar } from "./Avatar";
// import { Office } from "./Office";
import { CodingDesk } from "./CodingDesk";
import { StudioFront } from "./StudioFront";
import { StudioBack } from "./StudioBack";
import { Projects } from "./Projects";

export const Experience = (props) => {
  const { menuOpened, studioOpened, interviewOpened, currentSection, setCurrentSection } = props;
  const { viewport } = useThree();
  const data = useScroll();

  const isMobile = window.innerWidth < 768;
  const responsiveRatio = viewport.width / 12;
  const officeScaleRatio = Math.max(0.5, Math.min(0.9 * responsiveRatio, 0.9));

  const [section, setSection] = useState(0);

  const cameraPositionX = useMotionValue();
  const cameraLookAtX = useMotionValue();

  // Main Menu Open
  useEffect(() => {
    animate(cameraPositionX, menuOpened ? -5 : 0, {
      ...framerMotionConfig,
    });
    animate(cameraLookAtX, menuOpened ? 5 : 0, {
      ...framerMotionConfig,
    });
  }, [menuOpened]);

  // Studio Open
  useEffect(() => {
    animate(cameraPositionX, studioOpened ? 5 : 0, {
      ...framerMotionConfig,
    });
    animate(cameraLookAtX, studioOpened ? -5 : 0, {
      ...framerMotionConfig,
    });
  }, [studioOpened]);

  //Interview Open
  useEffect(() => {
    interviewOpened && setCharacterAnimation("BreathingIdle");

    animate(cameraPositionX, interviewOpened ? 2 : 0, {
      ...framerMotionConfig,
    });
    animate(cameraLookAtX, interviewOpened ? -2 : 0, {
      ...framerMotionConfig,
    });

  }, [interviewOpened]);


  const characterContainerAboutRef = useRef();

  const [characterAnimation, setCharacterAnimation] = useState("Typing");
  useEffect(() => {
    setCharacterAnimation("FallingIdle");
    setTimeout(() => {
      setCharacterAnimation(section === 0 ? "Typing" : "Idle");
    }, 600);
  }, [section]);

  const characterGroup = useRef();

  // const {studioPosition, setStudioPosition} = useState("Default");
  const defaultPosition = [
    isMobile ? 0 : 1.5 * officeScaleRatio,
    isMobile ? -viewport.height / 6 : 2,
    3,
  ]

  const studioPosition = [
    -6, //closer to left side of screen
    isMobile ? -viewport.height / 6 : 2,
    5, //closer to camera
  ]

  useFrame((state) => {
    let curSection = Math.floor(data.scroll.current * data.pages);
    setCurrentSection(curSection);

    if (curSection > 3) {
      curSection = 3;
    }

    if (curSection !== section) {
      setSection(curSection);
    }

    state.camera.position.x = cameraPositionX.get();
    state.camera.lookAt(cameraLookAtX.get(), 0, 0);

    // const position = new THREE.Vector3();
    if (section === 0) {
      characterContainerAboutRef.current.getWorldPosition(
        characterGroup.current.position
      );
    }
  });

  const variants = {
    0: {
      scaleX: officeScaleRatio,
      scaleY: officeScaleRatio,
      scaleZ: officeScaleRatio,
    },
    1: {
      y: -viewport.height + 0.5,
      x: isMobile ? 0.3 : 0,
      z: 7,
      rotateX: 0,
      rotateY: isMobile ? -Math.PI / 2 : 0,
      rotateZ: 0,
      scaleX: isMobile ? 1.5 : 1,
      scaleY: isMobile ? 1.5 : 1,
      scaleZ: isMobile ? 1.5 : 1,
    },
    2: {
      x: isMobile ? -1.4 : -2,
      y: -viewport.height * 2 + 0.5,
      z: 0,
      rotateX: 0,
      rotateY: Math.PI / 2,
      rotateZ: 0,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,
    },
    3: {
      y: -viewport.height * 3 + 1,
      x: 0.24,
      z: 8.5,
      rotateX: 0,
      rotateY: -Math.PI / 4,
      rotateZ: 0,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,
    },
    4: {
      y: -viewport.height + 0.5,
      x: isMobile ? 0.3 : 0,
      z: 7,
      rotateX: 0,
      rotateY: 45,
      rotateZ: 0,
      scaleX: isMobile ? 1.5 : 1,
      scaleY: isMobile ? 1.5 : 1,
      scaleZ: isMobile ? 1.5 : 1,
    },
  }

  return (
    <>
      {/* <ambientLight intensity={1} /> */}
      <pointLight position={[5, 20, 25]} />
      {/* AVATAR */}
      <motion.group
        ref={characterGroup}
        rotation={[-3.141592653589793, 1.2053981633974482, 3.141592653589793]}
        scale={[officeScaleRatio, officeScaleRatio, officeScaleRatio]}
        // animate={interviewOpened ? "4" : "" + section}
        animate={"" + section}
        transition={{
          duration: 0.6,
        }}
        variants={variants}
      >
      {/* <motion.group
        ref={characterGroup}
        transition={{
          duration: 0.6,
        }}
        variants={variants}
      > */}
        <Avatar animation={characterAnimation} interviewOpened={interviewOpened} />
      </motion.group>
      {/* <ambientLight intensity={1} /> */}

      {/* OFFICE */}
      {/* <motion.group
        position={[
          isMobile ? 0 : 1.5 * officeScaleRatio,
          isMobile ? -viewport.height / 6 : 2,
          3,
        ]}
        scale={[officeScaleRatio, officeScaleRatio, officeScaleRatio]}
        rotation-y={-Math.PI / 4}
        animate={{
          y: isMobile ? -viewport.height / 6 : 0,
        }}
        transition={{
          duration: 0.8,
        }}
      >
        {!interviewOpened && <Office section={section} />}
        
        <group
          ref={characterContainerAboutRef}
          name="CharacterSpot"
          position={[0.07, 0.16, -0.57]}
          rotation={[-Math.PI, 0.42, -Math.PI]}
        ></group>
      </motion.group> */}

      {/* CODING DESK */}
      <motion.group
        position={[
          // isMobile ? 0 : 1.5 * officeScaleRatio,
          // isMobile ? -viewport.height / 6 : 2,
          // 3,
          0,
          0,
          3
        ]}
        scale={[officeScaleRatio, officeScaleRatio, officeScaleRatio]}
        rotation-y={-Math.PI / 4}
        animate={{
          y: isMobile ? -viewport.height / 6 : 0,
        }}
        transition={{
          duration: 0.8,
        }}
      >
        {!interviewOpened && <CodingDesk section={section} />}
        
        <group
          ref={characterContainerAboutRef}
          name="CharacterSpot"
          position={[0.07, 0.16, -0.57]}
          rotation={[-Math.PI, 0.42, -Math.PI]}
        ></group>
      </motion.group>

      {/* STUDIO FRONT */}
      <motion.group
        position={!studioOpened ? defaultPosition : studioPosition}
        scale={[officeScaleRatio, officeScaleRatio, officeScaleRatio]}
        rotation-y={-Math.PI / 4}
        animate={{
          y: isMobile ? -viewport.height / 6 : 0,
        }}
        transition={{
          duration: 0.8,
        }}
      >
        {!interviewOpened && <StudioFront />}
      </motion.group>

      {/* STUDIO BACK */}
      <motion.group
        position={!studioOpened ? defaultPosition : studioPosition}
        scale={[officeScaleRatio, officeScaleRatio, officeScaleRatio]}
        rotation-y={-Math.PI / 4}
        animate={{
          y: isMobile ? -viewport.height / 6 : 0,
        }}
        transition={{
          duration: 0.8,
        }}
      >
        {studioOpened && <StudioBack />}
        
        <group
          ref={characterContainerAboutRef}
          name="CharacterSpot"
          position={[0.07, 0.16, -0.57]}
          rotation={[-Math.PI, 0.42, -Math.PI]}
        ></group>
      </motion.group>
      {/* STUDIO BACK END */}

      {/* <motion.group
        position={[
          isMobile ? 0 : 1.5 * officeScaleRatio,
          isMobile ? -viewport.height / 6 : 2,
          3,
        ]}
        scale={[officeScaleRatio, officeScaleRatio, officeScaleRatio]}
        rotation-y={-Math.PI / 4}
        animate={{
          y: isMobile ? -viewport.height / 6 : 0,
        }}
        transition={{
          duration: 0.8,
        }}
      >
        <StudioLVL1 />
      </motion.group> */}
      {/* STUDIO */}
      {/* <motion.group
        position={[
          isMobile ? 0 : 1.5 * officeScaleRatio,
          isMobile ? -viewport.height / 6 : 2,
          3,
        ]}
        scale={[officeScaleRatio, officeScaleRatio, officeScaleRatio]}
        rotation-y={-Math.PI / 4}
        animate={{
          y: isMobile ? -viewport.height / 6 : 0,
        }}
        transition={{
          duration: 0.8,
        }}
      >
        <GBStudio />
        
        <group
          ref={characterContainerAboutRef}
          name="CharacterSpot"
          position={[0.07, 0.16, -0.57]}
          rotation={[-Math.PI, 0.42, -Math.PI]}
        ></group>
      </motion.group> */}

      {/* SKILLS */}
      <motion.group
        position={[
          0,
          isMobile ? -viewport.height : -1.5 * officeScaleRatio,
          -10,
        ]}
        animate={{
          z: section === 1 ? 0 : -10,
          y:
            section === 1
              ? -viewport.height
              : isMobile
              ? -viewport.height
              : -1.5 * officeScaleRatio,
        }}
      >
        <directionalLight position={[-5, 3, 5]} intensity={0.4} />
      </motion.group>
      {/* PROJECTS */}
      {!interviewOpened && <Projects />}
    </>
  );
};
