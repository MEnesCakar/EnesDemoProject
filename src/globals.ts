import * as PIXI from "pixi.js";

// to easily pass everything I need in tasks
const globals = {} as {
  fpsCounter: PIXI.Text;
  menuButton: PIXI.Sprite;
  sceneWidth: typeof window.innerWidth;
  sceneHeight: typeof window.innerHeight;
  pixiApp: PIXI.Application;
  pixiScene: PIXI.Container;
  resizeEvent: Event;
};

export default globals;
