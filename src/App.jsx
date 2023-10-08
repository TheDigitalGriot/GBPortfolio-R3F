import { Scroll, ScrollControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { MotionConfig } from "framer-motion";
import { Leva } from "leva";
import { Suspense, useEffect, useState } from "react";
import { Cursor } from "./components/Cursor";
import { Experience } from "./components/Experience";
import { Interface } from "./components/Interface";
import { LoadingScreen } from "./components/LoadingScreen";
import { Menu } from "./components/Menu";
import { ScrollManager } from "./components/ScrollManager";
import { framerMotionConfig } from "./config";
import { Interview } from "./components/Interview";
import { InterviewExperience } from "./components/InterviewExperience";
import { Studio } from "./components/Studio";
import { StudioExperience } from "./components/StudioExperience";
import { OrbCanvas }  from "./components/OrbCanvas";
import { SpaceDust } from "./components/SpaceDust";

function App() {
  const [section, setSection] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [started, setStarted] = useState(false);
  const [menuOpened, setMenuOpened] = useState(false);
  const [studioOpened, setStudioOpened] = useState(false);
  const [interviewOpened, setInterviewOpened] = useState(false);


  const experienceCamera = { position: [5, 3, 10], fov: 55 }
  const studioCamera = { position: [-2, 3, 10], fov: 30 }
  const interviewCamera = { position: [0, 3, 10], fov: 10 }

  const [cameraView, setCameraView] = useState(experienceCamera);


  useEffect(() => {
    setMenuOpened(false);
  }, [section]);

  useEffect(() => {
    // console.log('CURRENT', currentSection);
  }, [currentSection]);

  // useEffect(() => {
  //   setCameraView(interviewOpened ? interviewCamera : experienceCamera);
  // }, [interviewOpened]);

  useEffect(() => {
    setCameraView(prevCameraView => {
      if (interviewOpened) {
        return interviewCamera;
      } else if (studioOpened) {
        return studioCamera;
      } else {
        return experienceCamera;
      }
    });
    console.log(cameraView)
  }, [studioOpened, interviewOpened]);


  
  // const cameraView = interviewOpened ? experienceCamera : interviewCamera

  return (
    <>
      <LoadingScreen started={started} setStarted={setStarted} />
      <MotionConfig
        transition={{
          ...framerMotionConfig,
        }}
      >
        <Canvas className="app-canvas" shadows camera={cameraView}>
          {/* <color attach="background" args={["#e6e7ff"]} /> */}
          <ScrollControls pages={4} damping={0.1}>
            <ScrollManager section={section} onSectionChange={setSection} />
            <Scroll>
              <Suspense>
                {started && (
                  !interviewOpened &&
                  <Experience 
                    section={section} 
                    setSection={setSection} 
                    menuOpened={menuOpened} 
                    studioOpened={studioOpened} 
                    interviewOpened={interviewOpened} 
                    currentSection={currentSection} 
                    setCurrentSection={setCurrentSection} 
                    cameraView={cameraView}
                  />
                )}
              </Suspense>
            </Scroll>
            <Scroll html>
              {started && !interviewOpened && !studioOpened && <Interface setSection={setSection} />}
            </Scroll>
          </ScrollControls>
          {interviewOpened && <InterviewExperience />}
          {/* {studioOpened && <StudioExperience />} */}
          {/* <SpaceDust count={10000} /> */}
        </Canvas>
        <OrbCanvas style={{ position: "absolute", top: 0, left: 0 }} />
        <Menu
          onSectionChange={setSection}
          menuOpened={menuOpened}
          setMenuOpened={setMenuOpened}
        />
        <Studio 
          studioOpened={studioOpened}
          setStudioOpened={setStudioOpened}
        />
        <Interview 
          interviewOpened={interviewOpened}
          setInterviewOpened={setInterviewOpened}
          setSection={setSection}
        />
        <Cursor />
      </MotionConfig>
      <Leva hidden />
    </>
  );
}

export default App;
