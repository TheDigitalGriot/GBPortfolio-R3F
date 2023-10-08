import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export const Studio = (props) => {
    const { studioOpened, setStudioOpened } = props;
    return (
        <>
            <button
            onClick={() => setStudioOpened(!studioOpened)}
            className="z-20 fixed top-40 right-12 p-3 bg-indigo-600 w-auto inline-block h-auto rounded-md text-white font-bold"
            >
                <span>Studio</span>
            </button>
            {/* <div
                className={`z-10 fixed top-0 right-0 bottom-0 bg-white transition-all overflow-hidden flex flex-col
            ${studioOpened ? "w-full md:w-80" : "w-0"}`}
            >
                <div className="flex-1 flex items-start justify-center flex-col gap-6 p-8">
                    <span>STUDIO SECTION</span>
                </div>
            </div> */}
        </>
        
        
    );
}