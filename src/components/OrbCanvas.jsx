import React, { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { KawaseBlurFilter } from "@pixi/filter-kawase-blur";
import { createNoise2D } from "simplex-noise";
import hsl from "hsl-to-hex";
import { debounce } from "debounce";
import { Orb, ColorPalette } from "./Orb";

export const OrbCanvas = () => {
  const canvasRef = useRef();

  useEffect(() => {
    const app = new PIXI.Application({
      view: canvasRef.current,
      resizeTo: window,
      backgroundAlpha: 0
    });

    app.stage.filters = [new KawaseBlurFilter(30, 10, true)];

    const colorPalette = new ColorPalette();

    const orbs = [];

    for (let i = 0; i < 10; i++) {
      const orb = new Orb(colorPalette.randomColor());
      app.stage.addChild(orb.graphics);

      orbs.push(orb);
    }

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      app.ticker.add(() => {
        orbs.forEach((orb) => {
          orb.update();
          orb.render();
        });
      });
    } else {
      orbs.forEach((orb) => {
        orb.update();
        orb.render();
      });
    }
  }, []);

  return <canvas ref={canvasRef} className="orb-canvas" />;
};