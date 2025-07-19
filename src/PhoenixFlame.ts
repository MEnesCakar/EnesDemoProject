import { Container, Texture, Ticker } from "pixi.js";
import { AdvancedBloomFilter } from "@pixi/filter-advanced-bloom";
import globals from "./globals";
import { Emitter, upgradeConfig } from "@pixi/particle-emitter";

export let phoenixFlameCont: Container;
// this was an interesting challange, I took it as I am not allowed to use spritesheets or shaders, filter aside
export function PhoenixFlameStart() {
  phoenixFlameCont = new Container();
  globals.pixiScene.addChild(phoenixFlameCont);
  globals.pixiApp.renderer.background.backgroundColor.value = "#000000";
  globals.fpsCounter.style.fill = "#ffffff";
  globals.menuButton.tint = "#ffffff";

  const particleContainer = new Container();
  // I used a filter for few blooms, though I don't think it changes much, I wouldn't use it on production as it creates fps spikes
  particleContainer.filters = [
    new AdvancedBloomFilter({
      bloomScale: 1,
      threshold: 0,
      blur: 5,
      quality: 20,
      brightness: 2,
    }),
  ];
  phoenixFlameCont.addChild(particleContainer);
  particleContainer.x = globals.sceneWidth * 0.5;
  particleContainer.y = globals.sceneHeight;
  // I created a 1 big(5) 1 medium(3) and 1 small(2) emitters to fine control my limit of 10 sprites
  //I also used a particle library, while 10 is doable with by hand, I liked the editor of this one, though I didn't find it very customizable, at least the old version.
  const mediumEmitter = new Emitter(
    particleContainer,
    upgradeConfig(
      {
        alpha: {
          start: 1,
          end: 0.2,
        },
        scale: {
          start: 1.2,
          end: 0.2,
          minimumScaleMultiplier: 1,
        },
        color: {
          start: "#ffe866",
          end: "#ff4747",
        },
        speed: {
          start: 500,
          end: 200,
          minimumSpeedMultiplier: 1,
        },
        acceleration: {
          x: 0,
          y: 0,
        },
        maxSpeed: 0,
        startRotation: {
          min: 230,
          max: 310,
        },
        noRotation: false,
        rotationSpeed: {
          min: 180,
          max: 200,
        },
        lifetime: {
          min: 0.5,
          max: 0.7,
        },
        blendMode: "add",
        frequency: 0.1,
        emitterLifetime: -1,
        maxParticles: 3,
        pos: {
          x: 0,
          y: 0,
        },
        addAtBack: false,
        spawnType: "rect",
        spawnRect: {
          x: -50,
          y: 0,
          w: 100,
          h: 0,
        },
      },
      Texture.from("./assets/fire.png"),
    ),
  );
  const bigEmitter = new Emitter(
    particleContainer,
    upgradeConfig(
      {
        alpha: {
          start: 1,

          end: 0.2,
        },
        scale: {
          start: 0.2,
          end: 1.5,
          minimumScaleMultiplier: 1,
        },
        color: {
          start: "#ffe866",
          end: "#ff4747",
        },
        speed: {
          start: 10,
          end: 300,
          minimumSpeedMultiplier: 1,
        },
        acceleration: {
          x: 0,
          y: 0,
        },
        maxSpeed: 0,
        startRotation: {
          min: 230,
          max: 310,
        },
        noRotation: false,
        rotationSpeed: {
          min: -30,
          max: 30,
        },
        lifetime: {
          min: 0.8,
          max: 1,
        },
        blendMode: "normal",
        frequency: 0.2,
        emitterLifetime: -1,
        maxParticles: 5,
        pos: {
          x: 0,
          y: 0,
        },
        addAtBack: true,
        spawnType: "rect",
        spawnRect: {
          x: -50,
          y: 0,
          w: 100,
          h: 0,
        },
      },
      Texture.from("./assets/fire.png"),
    ),
  );
  const smallEmitter = new Emitter(
    particleContainer,
    upgradeConfig(
      {
        alpha: {
          start: 1,
          end: 0.2,
        },
        scale: {
          start: 0.3,
          end: 0.2,
          minimumScaleMultiplier: 1,
        },
        color: {
          start: "#ffe866",
          end: "#ff4747",
        },
        speed: {
          start: 1,
          end: 1000,
          minimumSpeedMultiplier: 1,
        },
        acceleration: {
          x: 0,
          y: 0,
        },
        maxSpeed: 0,
        startRotation: {
          min: 210,
          max: 290,
        },
        noRotation: false,
        rotationSpeed: {
          min: -90,
          max: 90,
        },
        lifetime: {
          min: 0.2,
          max: 0.4,
        },
        blendMode: "add",
        frequency: 0.1,
        emitterLifetime: -1,
        maxParticles: 2,
        pos: {
          x: 0,
          y: 0,
        },
        addAtBack: true,
        spawnType: "rect",
        spawnRect: {
          x: -50,
          y: 0,
          w: 100,
          h: 0,
        },
      },
      Texture.from("./assets/fire.png"),
    ),
  );

  //resize event, so the only not resizable task is MagicWords, which I didn't even attempt since with text it would take an longer implementation.
  window.addEventListener("elementResize", () => {
    if (particleContainer.destroyed) return;

    particleContainer.position.x = globals.sceneWidth * 0.5;
    particleContainer.position.y = globals.sceneHeight * 1;
    particleContainer.scale.set(
      Math.min(
        (globals.sceneWidth / 200) * 0.3,
        (globals.sceneHeight / 200) * 0.5,
      ),
    );
  });

  const update = (delta: number) => {
    mediumEmitter.update(delta * 0.0125);
    bigEmitter.update(delta * 0.0125);
    smallEmitter.update(delta * 0.0125);
  };
  Ticker.shared.add(update);
  window.dispatchEvent(globals.resizeEvent);
}
