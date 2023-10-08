import { OrbitControls } from "@react-three/drei";
import { Avatar } from "./Avatar";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion-3d";
import { useFrame, useThree } from "@react-three/fiber";

export const InterviewExperience = (props) => {
    const [characterAnimation, setCharacterAnimation] = useState("Idle");
    const { viewport } = useThree();
    const characterGroup = useRef();
    const isMobile = window.innerWidth < 768;
    const interviewScaleRatio = isMobile ? 1.5 : 1.3;
    return (
        <>
            {/* <OrbitControls /> */}
            
            <motion.group
            ref={characterGroup}
            position={[
                -1.5,
                0.5,
                6
            ]}
            rotation={[-0.1, 0.3, -0.1]}
            scale={[interviewScaleRatio, interviewScaleRatio, interviewScaleRatio]}
            >
                <Avatar animation={characterAnimation} />
            </motion.group>
            <ambientLight intensity={1} />
        </>
    )
}