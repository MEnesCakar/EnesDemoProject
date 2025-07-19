import { Container, Sprite } from "pixi.js";
import globals from "./globals";
import gsap from "gsap";

export let aceOfShadowsCont: Container;
//I tried also with a particle container, but for this case there wasn't specific gains to it while making it more complicated
export function AceOfShadowsStart() {
  aceOfShadowsCont = new Container();
  globals.pixiScene.addChild(aceOfShadowsCont);
  globals.pixiApp.renderer.background.backgroundColor.setValue("#ffffff");
  globals.fpsCounter.style.fill = "#000000";
  globals.menuButton.tint = "#000000";

  // create the empty deck container which will contain every card
  const deck = new Container();
  aceOfShadowsCont.addChild(deck);

  // this makes the deck responsive
  window.addEventListener("elementResize", () => {
    if (deck.destroyed) return;
    if (deck.children[0] instanceof Sprite) {
      deck.position.x = globals.sceneWidth * 0.5;
      deck.position.y = globals.sceneHeight * 0.5;
      // because I didn't use a loader, I need to hardcode width and height for now
      deck.scale.set(
        Math.min(
          (globals.sceneWidth / 200) * 0.3,
          (globals.sceneHeight / 300) * 0.5,
        ),
      );
    }
  });

  // params for the animation and setup
  const deckSize = 144;
  const heigtForAnim = -250;
  const scaleForAnim = 1.1;
  const deckDistance = 200;
  const positionOffset = 0.3;

  // since we have this specific case in our hands, I set it up in simplest way possible, which is actually not a deck manager but every card knows when to get drawn when they are created. used skewY for replicating a flip
  for (let i = 0; i < deckSize; i++) {
    let card = Sprite.from("./assets/cardback.png");
    card.position.set(deckDistance + -i * positionOffset, -i * positionOffset);
    card.anchor.set(0.5);
    deck.addChild(card);
    gsap.to(card, {
      pixi: {
        x: 0 + i * positionOffset * 0.5,
        y: -i * positionOffset * 0.5 + heigtForAnim,
        skewY: -90,
        scale: scaleForAnim,
      },
      delay: deckSize - i - 1,
      duration: 1,
      ease: "sine.in",

      onComplete: () => {
        card.destroy();
        card = Sprite.from("./assets/card.png");
        card.anchor.set(0.5);
        deck.addChild(card);
        card.skew.y = -Math.PI * 0.5;
        card.position.set(
          +i * positionOffset * 0.5,
          +i * positionOffset * 0.5 + heigtForAnim - positionOffset * deckSize,
        );
        card.scale.set(-scaleForAnim, scaleForAnim);
        gsap.to(card, {
          pixi: {
            x: -deckDistance + i * positionOffset,
            y: +i * positionOffset - positionOffset * deckSize,
            skewY: -180,
            scaleY: 1,
            scaleX: -1,
          },
          duration: 1,
          ease: "sine.out",
        });
      },
    });
  }
  window.dispatchEvent(globals.resizeEvent);
}
