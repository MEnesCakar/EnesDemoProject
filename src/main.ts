import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import globals from "./globals";
import { aceOfShadowsCont, AceOfShadowsStart } from "./AceOfShadows";
import { magicWordsCont, MagicWordsStart } from "./MagicWords";
import { phoenixFlameCont, PhoenixFlameStart } from "./PhoenixFlame";

// This project was a lot of work for me since I only worked with PIXI few times and all of them was with internal tools and functions, which I can't use anymore, we were doing our projects with Phaser usually.
// the project template was from PIXI template, I had to change few things but the project was completely fresh, I didn't use any assets from my other projects also, every asset is adjusted for this project.

// you can click the thumbnails to see each project

init();

async function init() {
  // gsap initilization, I use for better time events and animations
  gsap.registerPlugin(PixiPlugin);
  PixiPlugin.registerPIXI(PIXI);

  // PIXI initilization
  globals.sceneWidth = window.innerWidth;
  globals.sceneHeight = window.innerHeight;

  const app = new PIXI.Application<HTMLCanvasElement>({
    width: globals.sceneWidth,
    height: globals.sceneHeight,
    backgroundColor: "orange",
  });
  app.renderer.resize(globals.sceneWidth, globals.sceneHeight);
  document.body.appendChild(app.view);
  // to remove scroll bars
  app.view.style.display = "block";
  app.stage.sortableChildren = true;
  globals.pixiScene = app.stage;
  globals.pixiApp = app;

  // Custom Resize event to ensure order
  const resizeEvent = new Event("elementResize");
  globals.resizeEvent = resizeEvent;

  // Resize listener for responsive design
  window.addEventListener("resize", () => {
    globals.sceneWidth = window.innerWidth;
    globals.sceneHeight = window.innerHeight;
    window.dispatchEvent(resizeEvent);
    app.renderer.resize(globals.sceneWidth, globals.sceneHeight);
  });

  // Making sure it works, in some cases it is fired too early

  // FPS Counter, updates every 10 frame, shows the average, so it is less distracting
  const style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 48,
    fill: "#ffffff",
    lineJoin: "round",
  });
  const fpsCounter = new PIXI.Text("60", style);
  fpsCounter.zIndex = 100;
  let lastFPSValues: number[] = [app.ticker.FPS];

  globals.fpsCounter = fpsCounter;
  globals.pixiScene.addChild(fpsCounter);

  // Main code loop
  app.ticker.add(() => {
    if (lastFPSValues.length < 10) {
      lastFPSValues.push(app.ticker.FPS);
    } else {
      lastFPSValues = [];
      lastFPSValues.push(app.ticker.FPS);
      let sumFPS: number = 0;
      for (let i = 0; i < lastFPSValues.length; i++) {
        sumFPS = sumFPS + lastFPSValues[i];
      }
      const avgFPS: number = sumFPS / lastFPSValues.length;

      fpsCounter.text = avgFPS.toLocaleString("de-DE", {
        maximumFractionDigits: 0,
      });
    }
  });
  start();
}

function start() {
  createMenu();
}

function createMenu() {
  // we use menuButton to go back to menu and it is only visible while we are on the menu
  const menuButton = PIXI.Sprite.from("./assets/homeIcon.png");
  globals.menuButton = menuButton;
  menuButton.eventMode = "static";
  globals.pixiScene.addChild(menuButton);
  menuButton.anchor.set(1, 0);
  menuButton.position.x = globals.sceneWidth * 1 - 20;
  menuButton.position.y = 20;
  menuButton.scale.set(
    (Math.min(globals.sceneHeight, globals.sceneWidth) / 512) * 0.05,
  );

  menuButton.on("pointerdown", () => {
    if (aceOfShadowsCont) aceOfShadowsCont.destroy();
    if (phoenixFlameCont) phoenixFlameCont.destroy();
    if (magicWordsCont) magicWordsCont.destroy();

    globals.pixiApp.renderer.background.backgroundColor.setValue("orange");
    menuContainer.visible = true;
    menuButton.visible = false;
  });

  // container to easily hide everything
  const menuContainer = new PIXI.Container();
  globals.pixiScene.addChild(menuContainer);
  const headerStyle = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 64,
    align: "center",
    stroke: "#000000",
    strokeThickness: 8,
    dropShadowAngle: 45,
    dropShadow: true,
    dropShadowBlur: 10,
    wordWrap: true,
    wordWrapWidth: globals.sceneWidth,
    fill: "#ffffff",
    lineJoin: "round",
  });
  const header = new PIXI.Text("SOFTGAMES Assignment Project", headerStyle);
  header.anchor.set(0.5, 0);
  header.position.x = 0.5 * globals.sceneWidth;
  header.position.y = 100;
  menuContainer.addChild(header);

  // screenshots of tasks as a button
  const AceOfShadows = PIXI.Sprite.from("./assets/AceOfShadows.png");
  AceOfShadows.position.x = globals.sceneWidth * 0.25;
  AceOfShadows.position.y = globals.sceneHeight * 0.7;
  AceOfShadows.anchor.set(0.5);
  AceOfShadows.eventMode = "static";
  menuContainer.addChild(AceOfShadows);

  AceOfShadows.on("pointerdown", () => {
    menuContainer.visible = false;
    AceOfShadowsStart();
    menuButton.visible = true;
  });

  const MagicWords = PIXI.Sprite.from("./assets/MagicWords.png");
  MagicWords.position.x = globals.sceneWidth * 0.5;
  MagicWords.position.y = globals.sceneHeight * 0.7;
  MagicWords.anchor.set(0.5);
  MagicWords.eventMode = "static";
  menuContainer.addChild(MagicWords);

  MagicWords.on("pointerdown", () => {
    menuContainer.visible = false;
    MagicWordsStart();
    menuButton.visible = true;
  });

  const PhoenixFlame = PIXI.Sprite.from("./assets/PhoenixFlame.png");
  PhoenixFlame.position.x = globals.sceneWidth * 0.75;
  PhoenixFlame.position.y = globals.sceneHeight * 0.7;
  PhoenixFlame.anchor.set(0.5);
  PhoenixFlame.eventMode = "static";
  menuContainer.addChild(PhoenixFlame);
  PhoenixFlame.on("pointerdown", () => {
    menuContainer.visible = false;
    PhoenixFlameStart();
    menuButton.visible = true;
  });

  // Resizable and aspect ratio dependant menu
  window.addEventListener("elementResize", () => {
    menuButton.position.x = globals.sceneWidth * 1 - 20;
    menuButton.position.y = 20;
    menuButton.scale.set(
      (Math.min(globals.sceneHeight, globals.sceneWidth) / 512) * 0.05,
    );

    header.position.x = globals.sceneWidth * 0.5;
    header.position.y = globals.sceneHeight * 0.1;
    header.style.wordWrapWidth = globals.sceneWidth * 0.5;

    if (globals.sceneHeight < globals.sceneWidth * 1.2) {
      AceOfShadows.position.x = globals.sceneWidth * 0.25;
      AceOfShadows.position.y = globals.sceneHeight * 0.7;
      MagicWords.position.x = globals.sceneWidth * 0.5;
      MagicWords.position.y = globals.sceneHeight * 0.7;
      PhoenixFlame.position.x = globals.sceneWidth * 0.75;
      PhoenixFlame.position.y = globals.sceneHeight * 0.7;

      AceOfShadows.scale.set((globals.sceneWidth / 200) * 0.2);
      MagicWords.scale.set((globals.sceneWidth / 200) * 0.2);
      PhoenixFlame.scale.set((globals.sceneWidth / 200) * 0.2);
    } else {
      header.position.y = globals.sceneHeight * 0.05;
      AceOfShadows.position.x = globals.sceneWidth * 0.35;
      AceOfShadows.position.y = globals.sceneHeight * 0.45;
      MagicWords.position.x = globals.sceneWidth * 0.5;
      MagicWords.position.y = globals.sceneHeight * 0.65;
      PhoenixFlame.position.x = globals.sceneWidth * 0.65;
      PhoenixFlame.position.y = globals.sceneHeight * 0.85;

      AceOfShadows.scale.set((globals.sceneHeight / 200) * 0.15);
      MagicWords.scale.set((globals.sceneHeight / 200) * 0.15);
      PhoenixFlame.scale.set((globals.sceneHeight / 200) * 0.15);
    }
  });
}
