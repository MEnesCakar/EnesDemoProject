import {
  Container,
  Renderer,
  Sprite,
  Text,
  TextMetrics,
  TextStyle,
  Texture,
} from "pixi.js";
import globals from "./globals";
import gsap from "gsap";

// data types for getting textures with the tags, completely adaptable to any content in this format
const emojiMap = new Map<string, Texture>();
const avatarMap = new Map<string, Texture>();
export let magicWordsCont: Container;

export function MagicWordsStart() {
  magicWordsCont = new Container();
  globals.pixiScene.addChild(magicWordsCont);
  globals.pixiApp.renderer.background.backgroundColor.setValue("black");
  globals.fpsCounter.style.fill = "#ffffff";
  globals.menuButton.tint = "#ffffff";

  // get the data from endpoint
  ReadData(
    "https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords",
  ).then((response) => {
    response
      .json()
      .then(
        (content: {
          avatars: { name: string; url: string }[];
          emojies: { name: string; url: string }[];
          dialogue: { name: string; text: string }[];
        }) => {
          // parse and map the emoji data after data is loaded
          ReadyEmojis(content.emojies).then(async () => {
            // parse and map avatar data after emoji data is loaded
            ReadyAvatars(content.avatars).then(() => {
              // creation of the text messages
              CreateMessages(content.dialogue);
            });
          });
        },
      );
  });
}
// this function creates our dialogue
function CreateMessages(dialogueData: { name: string; text: string }[]) {
  const chatBubbleTexture = Texture.from("./assets/chatBubble.png");
  const messageStyle = new TextStyle({
    fontSize: 20,
    wordWrap: true,
    wordWrapWidth: globals.sceneWidth * 0.5,
  });

  // our message container for the whole ui
  const messageCont = new Container();
  messageCont.position.x = globals.sceneWidth * 0.25;
  magicWordsCont.addChild(messageCont);

  // parametrization, albeit they are not ideal to adjust
  const textWidthPadding = 100;
  const textHeightPadding = globals.sceneHeight * 0.02;

  // this is the array of created message texts, we use this to dynamically place the next message
  const messageArray = [] as EmojiText[];

  // we go from top to bottom and create the dialogue
  dialogueData.forEach((element, i) => {
    // for the mobile chat ui feeling
    gsap.delayedCall(i * 1, () => {
      // avatar is for profile photos, message is the message itself and the messageBox is our chat bubble, ideally these 3 would have their own container

      let message: EmojiText;
      let messageBox: Sprite;

      const avatar = new Sprite(avatarMap.get(element.name));
      // well, this is here, with the all alpha=0 sets, I couldn't figure out how to solve a bug with displayobject sizes, this was my solution
      avatar.alpha = 0;
      avatar.scale.set(
        Math.min(
          (globals.sceneHeight / avatar.texture.orig.height) * 0.1,
          (globals.sceneWidth / avatar.texture.orig.width) * 0.2,
        ),
      );
      // first message owner is always on the right side
      if (element.name == <string>avatarMap.keys().next().value) {
        message = new EmojiText(element.text, messageStyle);
        messageBox = new Sprite(chatBubbleTexture);
        message.alpha = 0;
        messageBox.alpha = 0;
        messageBox.tint = 0xbbaa00;
        messageBox.anchor.set(0, 0);
        avatar.anchor.set(0, 1);
        messageCont.addChild(messageBox);
        messageCont.addChild(avatar);
        // this is the solution of the bug I was referring to, it could be organized further more, most of the things replicate themselves with left and right, yet, time...
        gsap.delayedCall(0.1, () => {
          messageBox.scale.set(
            (message.width + textWidthPadding) / chatBubbleTexture.width,
            (message.height + 20) / chatBubbleTexture.height,
          );
          message.position.x =
            globals.sceneWidth * 0.5 - message.width - textWidthPadding * 0.5;
          messageBox.position.x =
            globals.sceneWidth * 0.5 - message.width - textWidthPadding * 1;
          avatar.position.x =
            globals.sceneWidth * 0.5 - textWidthPadding * 0.25;
          avatar.position.y =
            message.position.y + message.height + textHeightPadding * 0.5;
          avatar.alpha = 1;
          message.alpha = 1;
          messageBox.alpha = 1;
          // for the movement of the chat container
          messageCont.y =
            globals.sceneHeight -
            message.position.y -
            message.height -
            textHeightPadding * 0.5;
        });
      } else {
        // this is the left side code
        message = new EmojiText(element.text, messageStyle);
        messageBox = new Sprite(chatBubbleTexture);
        message.alpha = 0;
        messageBox.alpha = 0;
        avatar.anchor.set(1, 1);
        messageBox.scale.set(-1, 1);
        messageBox.tint = 0xcccccc;
        messageCont.addChild(messageBox);
        messageBox.anchor.set(1, 0);

        gsap.delayedCall(0.1, () => {
          messageBox.scale.set(
            -(message.width + textWidthPadding) / chatBubbleTexture.width,
            (message.height + 20) / chatBubbleTexture.height,
          );
          avatar.alpha = 1;
          avatar.position.x = -textWidthPadding * 0.25;
          avatar.position.y =
            message.position.y + message.height + textHeightPadding * 0.5;
          messageCont.addChild(avatar);

          message.alpha = 1;
          messageBox.alpha = 1;
          messageCont.y =
            globals.sceneHeight -
            message.position.y -
            message.height -
            textHeightPadding * 0.5;
        });
      }
      // To place new message below the last one
      if (i > 0) {
        message.position.y =
          messageArray[i - 1].y +
          messageArray[i - 1].height +
          <number>messageStyle.fontSize * 2;
      } else {
        message.position.y = 0;
      }
      messageBox.position.x = message.x - 50;
      messageBox.position.y = message.y - 10;
      messageCont.addChild(message);
      messageArray.push(message);
    });
  });
}

// reads the data from endpoint
async function ReadData(url: string) {
  const response = await fetch(url);
  return response;
}

// Frankly, the archtiecture is by me but this code is AI generated, always used a loader in my past projects
async function ReadyAvatars(avatarData: { name: string; url: string }[]) {
  const promises = avatarData.map((element) => Texture.fromURL(element.url));

  const textures = await Promise.all(promises);

  avatarData.forEach((element, index) => {
    avatarMap.set(element.name, textures[index]);
  });
}
// loads emojis into a map with textures
async function ReadyEmojis(emojiData: { name: string; url: string }[]) {
  const promises = emojiData.map((element) => Texture.fromURL(element.url));

  const textures = await Promise.all(promises);

  emojiData.forEach((element, index) => {
    emojiMap.set(element.name, textures[index]);
  });
}
// This was an complete experience, took the %50 of my time, I am totally proud of this class
class EmojiText extends Text {
  constructor(text: string, style: TextStyle) {
    super(text, style);
    // we have the emojiDirty variable to extract tags and turn them into emojis
    this.emojiDirty = true;
    this.anchor.set(0, 0);
  }

  emojiDirty = true;

  get text(): string {
    return this._text;
  }
  set text(text: string) {
    this._text = text;
  }

  //this is the reason this class exists
  updateEmojis() {
    let inputString = this.text;
    // this regex extracts the emoji tags
    const regex = /\{([^}]+)\}/;
    let match = inputString.match(regex);
    // I infinite looped myself a bit too much
    let avoidDeath = 0;
    // if there is an emoji tag, we continue, works with multiple emojis per text
    while (match != null && avoidDeath < 100) {
      avoidDeath++;
      match = inputString.match(regex);
      if (match != null && match.index != null) {
        const extractedText = match[1];
        // TextMetrics is kind of amazing, it helped me way too much, we use it to calculate where the text ends, so we can put our emoji there
        const simulatedText = TextMetrics.measureText(
          inputString.slice(0, match.index - 1),
          this.style,
        );
        const emoji = new Sprite(emojiMap.get(extractedText));
        emoji.anchor.set(0.5, 0.5);
        emoji.position.x =
          simulatedText.lineWidths[simulatedText.lineWidths.length - 1] +
          <number>this.style.fontSize * 0.5;
        emoji.position.y =
          (simulatedText.lines.length - 1) * simulatedText.lineHeight * 0.5;
        emoji.position.y =
          simulatedText.height - simulatedText.lineHeight * 0.5;
        emoji.scale.set(
          Math.max(
            (<number>this.style.fontSize / emoji.texture.orig.height) * 0.8,
          ),
        );
        // same bug with the loading unfortunately
        gsap.delayedCall(0.1, () => {
          this.addChild(emoji);
        });
        // since now we put our emoji in place of the "{" character, we can remove the tag, and create an empty space for the emoji
        inputString = inputString.replace(match[0], "  ");
        // I need this, I am not sure why since I am setting the text below
        this.dirty = true;
      }
    }
    inputString = inputString.trimEnd();
    this.text = inputString;
    this.emojiDirty = false;
  }

  render(renderer: Renderer): void {
    if (this.emojiDirty) {
      this.updateEmojis();
    }
    super.render(renderer);
  }
}
