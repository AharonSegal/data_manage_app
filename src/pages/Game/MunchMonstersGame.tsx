/**
 * MunchMonstersGame.tsx — MUNCH MONSTERS: a fully playable Phaser.js food-catching game.
 *
 * Six scenes: TitleScene → CharacterSelectScene → HowToPlayScene →
 *             GameplayScene → LevelCompleteScene / GameOverScene.
 *
 * All visuals are drawn with Phaser Graphics primitives — no external images or
 * sprite sheets. The Phaser game instance is created on mount and destroyed on
 * unmount to prevent memory leaks.
 */

import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

// ─── GAME CONFIG ─────────────────────────────────────────────────────────────
// All tunable game parameters live here — change one place to balance the game.
const CFG = {
  WIDTH:  480,
  HEIGHT: 720,

  // Monster movement
  MONSTER_SPEED_BASE: 310,
  MONSTER_SPEED_MAX:  520,
  MONSTER_SIZE: 72,          // draw size (px)
  CATCH_RADIUS: 40,          // horizontal catch half-width (px)

  // Food falling
  FOOD_SPEED_BASE: 140,
  FOOD_SPEED_MAX:  340,
  FOOD_SIZE: 36,

  // Spawn timing (ms between food drops)
  SPAWN_BASE: 1700,
  SPAWN_MIN:   560,

  // Health meter
  HEALTH_START:    50,
  HEALTHY_GAIN:     9,
  JUNK_DAMAGE:     22,
  TRICKY_GAIN:     13,
  TRICKY_DAMAGE:   24,

  // Score
  SCORE_HEALTHY: 10,
  SCORE_TRICKY:  15,

  // Combo milestones → score multiplier
  COMBO_LEVELS: [
    { at: 3,  mult: 1.5, label: '1.5×' },
    { at: 5,  mult: 2,   label: '2×'   },
    { at: 10, mult: 3,   label: '3×'   },
  ],

  LIVES: 3,

  // Minimum score required to complete each level (index = level-1)
  LEVEL_THRESHOLDS: [120, 290, 510, 780, 1110, 1500, 1950, 2460, 3030, Infinity],
  MAX_LEVELS: 10,
};

// ─── FOOD FACTS ──────────────────────────────────────────────────────────────
const FOOD_FACTS = [
  'Carrots were originally purple, not orange!',
  'Strawberries are the only fruit with seeds on the outside.',
  'Apples float in water because they are 25% air.',
  'Broccoli is man-made — it was bred from wild cabbage over centuries.',
  'Bananas are technically berries, but strawberries are not!',
  'Honey never expires — edible honey was found in 3,000-year-old Egyptian tombs.',
  'A pineapple takes about 2 years to fully grow.',
  'Eating too many carrots can turn your skin slightly orange.',
  'Cucumbers are 96% water.',
  'Ketchup was once sold as medicine in the 1830s.',
  'Cashews are related to poison ivy — the shells contain toxic oils.',
  'Chocolate was once used as currency by the Aztec civilization.',
  'Lemons float in water, but limes sink — due to density differences.',
  'A strawberry has an average of 200 seeds on its surface.',
  'The red pigment in tomatoes (lycopene) is a powerful antioxidant.',
  'Sweet potatoes and regular potatoes are not botanically related.',
  'An avocado is a single-seeded berry by botanical definition.',
  'Watermelons are 92% water and were originally used as canteens.',
  'Bell peppers are technically fruits — so are tomatoes and cucumbers.',
  'Onions make you cry because they release sulfenic acids when cut.',
];

// ─── MONSTER DATA ─────────────────────────────────────────────────────────────
const MONSTERS = [
  { name: 'Chompy',  desc: 'Eats anything!',    col: 0x44cc44, acc: 0x229922 },
  { name: 'Fangsy',  desc: 'Loves the dark!',   col: 0xaa44cc, acc: 0x772299 },
  { name: 'Blobby',  desc: 'One big eye!',       col: 0x3399ff, acc: 0x1166bb },
  { name: 'Spiky',   desc: 'Prickly but fast!',  col: 0xff8833, acc: 0xcc5500 },
  { name: 'Chewy',   desc: 'Ultra chomper!',     col: 0xff4466, acc: 0xcc2244 },
];

// ─── FOOD DATA ────────────────────────────────────────────────────────────────
type FoodCategory = 'healthy' | 'junk' | 'tricky';

interface FoodDef {
  category: FoodCategory;
  label: string;
  col: number;
  shape: string;
}

const FOOD_LIST: FoodDef[] = [
  // Healthy
  { category: 'healthy', label: 'Apple',      col: 0xff2222, shape: 'apple'      },
  { category: 'healthy', label: 'Carrot',     col: 0xff8800, shape: 'carrot'     },
  { category: 'healthy', label: 'Broccoli',   col: 0x22aa33, shape: 'broccoli'   },
  { category: 'healthy', label: 'Orange',     col: 0xff9900, shape: 'orange'     },
  { category: 'healthy', label: 'Banana',     col: 0xffee00, shape: 'banana'     },
  { category: 'healthy', label: 'Strawberry', col: 0xff3355, shape: 'strawberry' },
  // Junk
  { category: 'junk', label: 'Donut',     col: 0xffaacc, shape: 'donut'    },
  { category: 'junk', label: 'Candy',     col: 0xff66aa, shape: 'candy'    },
  { category: 'junk', label: 'Burger',    col: 0xcc7722, shape: 'burger'   },
  { category: 'junk', label: 'Ice Cream', col: 0xeeddff, shape: 'icecream' },
  { category: 'junk', label: 'Chips',     col: 0xffcc44, shape: 'chips'    },
  // Tricky (introduced level 5+)
  { category: 'tricky', label: 'Mystery', col: 0xcc44ff, shape: 'mystery' },
  { category: 'tricky', label: 'Egg',     col: 0xffffff, shape: 'egg'     },
];

// ─── DRAWING HELPERS ──────────────────────────────────────────────────────────
/** Draw a food item into a Graphics object at the given cell size. */
function drawFood(g: Phaser.GameObjects.Graphics, shape: string, col: number, s: number) {
  const h = s / 2;
  g.clear();

  switch (shape) {
    case 'apple': {
      g.fillStyle(col, 1);       g.fillCircle(h, h + 3, h - 3);
      g.fillStyle(0x338833, 1);  g.fillEllipse(h + 5, 7, 10, 6);
      g.fillStyle(0x774422, 1);  g.fillRect(h - 1, 2, 2, 6);
      g.fillStyle(0xffffff, 0.3); g.fillCircle(h - 5, h - 2, 4);
      break;
    }
    case 'carrot': {
      // Body (triangle)
      g.fillStyle(col, 1);
      g.fillTriangle(h, s - 4, h - 10, 14, h + 10, 14);
      // Green top leaves
      g.fillStyle(0x338833, 1);
      for (let i = -1; i <= 1; i++) g.fillEllipse(h + i * 5, 8, 5, 12);
      break;
    }
    case 'broccoli': {
      g.fillStyle(0x116622, 1); g.fillRect(h - 3, h + 2, 6, h - 4);
      g.fillStyle(col, 1);
      // Bumpy crown
      const centers = [{ x: h, y: h - 6 }, { x: h - 9, y: h }, { x: h + 9, y: h }, { x: h - 4, y: h + 5 }, { x: h + 4, y: h + 5 }];
      centers.forEach(c => g.fillCircle(c.x, c.y, 7));
      break;
    }
    case 'orange': {
      g.fillStyle(col, 1); g.fillCircle(h, h, h - 2);
      g.fillStyle(0xdd7700, 1); g.fillCircle(h, h, h - 6);
      g.fillStyle(col, 1);
      // Segment lines
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        g.lineStyle(1, 0xdd7700, 0.6);
        g.lineBetween(h, h, h + Math.cos(a) * (h - 3), h + Math.sin(a) * (h - 3));
      }
      g.fillStyle(0xffffff, 0.25); g.fillCircle(h - 4, h - 4, 4);
      break;
    }
    case 'banana': {
      g.fillStyle(col, 1);
      // Curved shape approximated with a rotated ellipse + triangle wedge
      const pts: { x: number; y: number }[] = [];
      for (let i = 0; i <= 12; i++) {
        const t = i / 12;
        const angle = t * Math.PI;
        pts.push({ x: 6 + Math.cos(angle) * 18 + t * 4, y: h + Math.sin(angle) * 10 - 4 });
      }
      // Close the shape: come back along the inner curve
      for (let i = 12; i >= 0; i--) {
        const t = i / 12;
        const angle = t * Math.PI;
        pts.push({ x: 6 + Math.cos(angle) * 12 + t * 4, y: h + Math.sin(angle) * 6 - 2 });
      }
      g.fillPoints(pts, true);
      g.fillStyle(0xccaa00, 1); g.fillRect(4, h + 4, 6, 5);
      break;
    }
    case 'strawberry': {
      g.fillStyle(col, 1);
      g.fillCircle(h, h, h - 3);
      g.fillTriangle(h - 10, h + 2, h + 10, h + 2, h, s - 2);
      g.fillStyle(0x33aa33, 1); g.fillEllipse(h, 5, 12, 7);
      // Seeds
      g.fillStyle(0xffee88, 1);
      const seedPts = [{ x: h - 5, y: h - 3 }, { x: h + 4, y: h - 5 }, { x: h - 2, y: h + 3 }, { x: h + 6, y: h + 2 }, { x: h, y: h - 9 }];
      seedPts.forEach(p => g.fillRect(p.x, p.y, 2, 2));
      break;
    }
    case 'donut': {
      g.fillStyle(col, 1); g.fillCircle(h, h, h - 2);
      // Glaze drips
      g.fillStyle(0xff99ee, 1);
      [{ x: h - 8, y: 6 }, { x: h + 6, y: 8 }, { x: h - 2, y: 5 }].forEach(p => g.fillEllipse(p.x, p.y + 5, 6, 8));
      // Hole
      g.fillStyle(0x0a0618, 1); g.fillCircle(h, h, 8);
      // Sprinkles
      g.fillStyle(0xffcc00, 1); g.fillRect(h - 10, h - 2, 6, 2);
      g.fillStyle(0x44aaff, 1); g.fillRect(h + 4, h + 3, 6, 2);
      g.fillStyle(0xff4444, 1); g.fillRect(h - 4, h + 8, 5, 2);
      break;
    }
    case 'candy': {
      g.fillStyle(col, 1);
      g.fillCircle(h, 10, 10);
      g.fillRect(h - 5, 10, 10, s - 14);
      g.fillStyle(0xffffff, 0.45);
      g.fillCircle(h - 3, 8, 5);
      g.fillRect(h - 2, 12, 4, s - 17);
      g.fillStyle(0x774422, 1); g.fillRoundedRect(h - 4, s - 8, 8, 6, 2);
      break;
    }
    case 'burger': {
      g.fillStyle(0xcc8822, 1); g.fillEllipse(h, h - 8, s - 4, 16); // top bun
      g.fillStyle(0x44aa22, 1); g.fillRect(6, h - 1, s - 12, 4);    // lettuce
      g.fillStyle(col, 1);      g.fillRect(6, h + 3, s - 12, 7);    // patty
      g.fillStyle(0xeecc55, 1); g.fillEllipse(h, h + 14, s - 6, 10); // bottom bun
      break;
    }
    case 'icecream': {
      g.fillStyle(0xbb8833, 1);
      g.fillTriangle(h, s - 2, h - 12, h + 4, h + 12, h + 4); // cone
      g.fillStyle(col, 1);       g.fillCircle(h, h - 2, 14);  // scoop
      g.fillStyle(0xffaacc, 0.6); g.fillCircle(h - 3, h - 7, 8); // lighter spot
      // Sprinkles
      g.fillStyle(0xff3333, 1); g.fillRect(h - 8, h - 8, 6, 2);
      g.fillStyle(0x44aaff, 1); g.fillRect(h + 2, h - 2, 6, 2);
      break;
    }
    case 'chips': {
      g.fillStyle(0xcc8800, 1); g.fillRoundedRect(3, 3, s - 6, s - 6, 5);
      g.fillStyle(col, 1);
      // 4 chip triangles
      [[10, 8], [22, 8], [10, 22], [22, 22]].forEach(([cx, cy]) =>
        g.fillTriangle(cx, cy, cx - 6, cy + 10, cx + 6, cy + 10)
      );
      break;
    }
    case 'mystery': {
      g.fillStyle(col, 1); g.fillRoundedRect(3, 3, s - 6, s - 6, 7);
      g.fillStyle(0xffffff, 1);
      // Draw ? mark geometrically: top circle + stem
      g.fillCircle(h, h - 5, 8);
      g.fillStyle(col, 1); g.fillCircle(h, h - 5, 4);
      g.fillStyle(0xffffff, 1); g.fillRect(h - 2, h + 1, 4, 7);
      g.fillCircle(h, h + 11, 2);
      break;
    }
    case 'egg': {
      g.fillStyle(col, 1); g.fillEllipse(h, h + 2, s - 8, s);
      g.fillStyle(0xaaaaaa, 0.3);
      // Crack lines
      g.lineStyle(1, 0xcccccc, 0.5);
      g.lineBetween(h - 4, 10, h + 4, 16);
      g.lineBetween(h + 4, 16, h - 2, 22);
      break;
    }
  }
}

/** Draw a monster character into a Graphics object. Size = bounding square side. */
function drawMonster(
  g: Phaser.GameObjects.Graphics,
  idx: number,
  mood: 'happy' | 'neutral' | 'sick',
  size: number,
) {
  const m = MONSTERS[idx];
  const h = size / 2;
  g.clear();

  // Body — rounded blob
  g.fillStyle(m.col, 1);
  g.fillEllipse(h, h + 2, size - 6, size - 4);

  // Per-monster face features
  switch (idx) {
    case 0: { // Chompy — big round eyes
      g.fillStyle(0xffffff, 1); g.fillCircle(h - 11, h - 5, 9); g.fillCircle(h + 11, h - 5, 9);
      g.fillStyle(0x111111, 1); g.fillCircle(h - 10, h - 4, 5); g.fillCircle(h + 12, h - 4, 5);
      g.fillStyle(0x44ff44, 1); g.fillCircle(h - 8,  h - 3, 2); g.fillCircle(h + 14, h - 3, 2);
      break;
    }
    case 1: { // Fangsy — small eyes, visible fangs
      g.fillStyle(0xffffff, 1); g.fillCircle(h - 10, h - 7, 7); g.fillCircle(h + 10, h - 7, 7);
      g.fillStyle(0x330033, 1); g.fillCircle(h - 9,  h - 6, 4); g.fillCircle(h + 11, h - 6, 4);
      g.fillStyle(0xffffff, 1);
      g.fillTriangle(h - 9, h + 5, h - 13, h + 16, h - 5, h + 16);
      g.fillTriangle(h + 9, h + 5, h + 5,  h + 16, h + 13, h + 16);
      break;
    }
    case 2: { // Blobby — one huge central eye
      g.fillStyle(0xffffff, 1); g.fillCircle(h, h - 4, 14);
      g.fillStyle(0x0044cc, 1); g.fillCircle(h + 2, h - 3, 9);
      g.fillStyle(0x001133, 1); g.fillCircle(h + 3, h - 2, 5);
      g.fillStyle(0xffffff, 1); g.fillCircle(h,     h - 6, 2);
      break;
    }
    case 3: { // Spiky — spike hair
      g.fillStyle(m.acc, 1);
      for (let i = 0; i < 5; i++)
        g.fillTriangle(8 + i * 12, 14, 14 + i * 12, 1, 20 + i * 12, 14);
      g.fillStyle(0xffffff, 1); g.fillCircle(h - 10, h - 3, 8); g.fillCircle(h + 10, h - 3, 8);
      g.fillStyle(0x222222, 1); g.fillCircle(h - 9,  h - 2, 4); g.fillCircle(h + 11, h - 2, 4);
      break;
    }
    case 4: { // Chewy — rosy cheeks
      g.fillStyle(0xff8899, 0.5); g.fillCircle(h - 13, h + 3, 9); g.fillCircle(h + 13, h + 3, 9);
      g.fillStyle(0xffffff, 1);  g.fillCircle(h - 10, h - 5, 8); g.fillCircle(h + 10, h - 5, 8);
      g.fillStyle(0x222222, 1);  g.fillCircle(h - 9,  h - 4, 4); g.fillCircle(h + 11, h - 4, 4);
      break;
    }
  }

  // Mouth — changes with mood
  const my = h + 9;
  if (mood === 'happy') {
    g.fillStyle(0x221100, 1);
    g.fillEllipse(h, my + 4, 28, 16);
    g.fillStyle(0xff6688, 1); g.fillEllipse(h, my + 10, 14, 6); // tongue
    g.fillStyle(0xffffff, 1);
    g.fillRect(h - 10, my - 1, 6, 6); // left tooth
    g.fillRect(h + 4,  my - 1, 6, 6); // right tooth
  } else if (mood === 'neutral') {
    g.fillStyle(0x333333, 1); g.fillRoundedRect(h - 11, my + 2, 22, 6, 3);
  } else {
    // Sick — frown + X eyes
    g.fillStyle(0x333333, 1); g.fillEllipse(h, my + 12, 22, 10);
    g.fillStyle(m.col, 1);    g.fillRect(h - 8, my + 9, 16, 5); // hide top of frown ellipse
    g.lineStyle(3, 0x222222, 1);
    g.lineBetween(h - 15, h - 12, h - 5,  h - 2);
    g.lineBetween(h - 15, h - 2,  h - 5,  h - 12);
    g.lineBetween(h + 5,  h - 12, h + 15, h - 2);
    g.lineBetween(h + 5,  h - 2,  h + 15, h - 12);
  }
}

/** Draw a filled star at absolute (sx, sy) on a Graphics object. */
function drawStar(
  g: Phaser.GameObjects.Graphics,
  sx: number,
  sy: number,
  outerR: number,
  innerR: number,
  col: number,
) {
  const pts: { x: number; y: number }[] = [];
  for (let p = 0; p < 5; p++) {
    const outerA = ((p * 72) - 90) * (Math.PI / 180);
    const innerA = outerA + (36 * Math.PI / 180);
    pts.push({ x: sx + Math.cos(outerA) * outerR, y: sy + Math.sin(outerA) * outerR });
    pts.push({ x: sx + Math.cos(innerA) * innerR, y: sy + Math.sin(innerA) * innerR });
  }
  g.fillStyle(col, 1);
  g.fillPoints(pts, true);
}

/** Draw a small heart at (0, 0) in a Graphics object. */
function drawHeart(g: Phaser.GameObjects.Graphics, col: number, size: number) {
  g.clear();
  const h = size / 2;
  g.fillStyle(col, 1);
  g.fillCircle(h - 6,  h - 3, 8);
  g.fillCircle(h + 6,  h - 3, 8);
  g.fillTriangle(h - 14, h + 2, h, h + 15, h + 14, h + 2);
}

// ─── SHARED UTILITIES ────────────────────────────────────────────────────────
/** Add a twinkling starfield to any scene. */
function addStarfield(scene: Phaser.Scene, count = 60) {
  for (let i = 0; i < count; i++) {
    const star = scene.add.graphics();
    star.fillStyle(0xffffff, 1);
    star.fillCircle(0, 0, Phaser.Math.Between(1, 2));
    star.x = Phaser.Math.Between(0, CFG.WIDTH);
    star.y = Phaser.Math.Between(0, CFG.HEIGHT);
    scene.tweens.add({
      targets: star,
      alpha: { from: 0.1, to: 0.85 },
      duration: Phaser.Math.Between(900, 2600),
      yoyo: true, repeat: -1, delay: Phaser.Math.Between(0, 2000),
      ease: 'Sine.easeInOut',
    });
  }
}

/** Burst radial particles at (x, y). */
function spawnParticles(scene: Phaser.Scene, x: number, y: number, col: number, count = 8) {
  for (let i = 0; i < count; i++) {
    const p = scene.add.graphics();
    p.fillStyle(col, 1); p.fillCircle(0, 0, 4);
    p.x = x; p.y = y; p.setDepth(80);
    const angle = (i / count) * Math.PI * 2;
    const dist  = Phaser.Math.Between(55, 115);
    scene.tweens.add({
      targets: p,
      x: x + Math.cos(angle) * dist,
      y: y + Math.sin(angle) * dist,
      alpha: 0, scaleX: 0.3, scaleY: 0.3,
      duration: 430, ease: 'Power2Out',
      onComplete: () => p.destroy(),
    });
  }
}

/** Animate floating score/info text that rises and fades. */
function floatText(scene: Phaser.Scene, x: number, y: number, text: string, col: string) {
  const t = scene.add.text(x, y, text, {
    fontSize: '24px', fontFamily: 'monospace', color: col,
    stroke: '#000000', strokeThickness: 3, fontStyle: 'bold',
  }).setOrigin(0.5).setDepth(90);
  scene.tweens.add({
    targets: t, y: y - 72, alpha: 0,
    duration: 850, ease: 'Power2Out',
    onComplete: () => t.destroy(),
  });
}

/** Create an interactive button container. */
function makeBtn(
  scene: Phaser.Scene,
  x: number, y: number,
  label: string,
  w: number,
  cb: () => void,
  bgCol = 0x5533cc,
): Phaser.GameObjects.Container {
  const bg = scene.add.graphics();
  const drawBg = (c: number) => {
    bg.clear();
    bg.fillStyle(c, 1);        bg.fillRoundedRect(-w / 2, -24, w, 48, 12);
    bg.lineStyle(2, 0xaabbff, 0.8); bg.strokeRoundedRect(-w / 2, -24, w, 48, 12);
  };
  drawBg(bgCol);
  const txt = scene.add.text(0, 0, label, {
    fontSize: '20px', fontFamily: 'monospace', color: '#ffffff',
    stroke: '#000000', strokeThickness: 2,
  }).setOrigin(0.5);
  const btn = scene.add.container(x, y, [bg, txt]);
  btn.setSize(w, 48).setInteractive({ useHandCursor: true });
  btn.on('pointerover',  () => { drawBg(Phaser.Display.Color.ValueToColor(bgCol).brighten(30).color); scene.tweens.add({ targets: btn, scaleX: 1.04, scaleY: 1.04, duration: 80 }); });
  btn.on('pointerout',   () => { drawBg(bgCol); scene.tweens.add({ targets: btn, scaleX: 1, scaleY: 1, duration: 80 }); });
  btn.on('pointerdown',  cb);
  return btn;
}

/** Dark gradient background used in every scene. */
function sceneBg(scene: Phaser.Scene, topCol = 0x0a0618, botCol = 0x1a0a3a) {
  const bg = scene.add.graphics();
  bg.fillGradientStyle(topCol, topCol, botCol, botCol, 1);
  bg.fillRect(0, 0, CFG.WIDTH, CFG.HEIGHT);
}

/** Interpolate level-difficulty parameters from level 1..10. */
function levelData(level: number) {
  const t = (level - 1) / (CFG.MAX_LEVELS - 1);
  return {
    spawnMs:     Math.round(Phaser.Math.Linear(CFG.SPAWN_BASE, CFG.SPAWN_MIN, t)),
    foodSpeed:   Math.round(Phaser.Math.Linear(CFG.FOOD_SPEED_BASE, CFG.FOOD_SPEED_MAX, t)),
    monsterSpd:  Math.round(Phaser.Math.Linear(CFG.MONSTER_SPEED_BASE, CFG.MONSTER_SPEED_MAX, t)),
    junkRatio:   Phaser.Math.Linear(0.18, 0.38, t),
    trickyRatio: level >= 5 ? Phaser.Math.Linear(0, 0.12, t) : 0,
  };
}

// ─── SCENE: Title ─────────────────────────────────────────────────────────────
class TitleScene extends Phaser.Scene {
  constructor() { super({ key: 'TitleScene' }); }

  create() {
    const W = CFG.WIDTH, H = CFG.HEIGHT;
    sceneBg(this);
    addStarfield(this, 65);

    // Title
    this.add.text(W / 2, 88, 'MUNCH', {
      fontSize: '62px', fontFamily: 'monospace', color: '#ffcc00',
      stroke: '#ff6600', strokeThickness: 5, fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add.text(W / 2, 155, 'MONSTERS', {
      fontSize: '44px', fontFamily: 'monospace', color: '#ff66cc',
      stroke: '#880044', strokeThickness: 4, fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add.text(W / 2, 206, 'Catch healthy food · Dodge junk · Beat 10 levels!', {
      fontSize: '13px', fontFamily: 'monospace', color: '#aabbff',
    }).setOrigin(0.5);

    // Three bouncing preview monsters
    [0, 2, 4].forEach((mi, i) => {
      const g = this.add.graphics();
      drawMonster(g, mi, 'happy', 58);
      g.x = W / 2 - 100 + i * 100 - 29;
      g.y = 240;
      this.tweens.add({
        targets: g, y: 240 - 12,
        duration: 900 + i * 180, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
      });
    });

    // Buttons
    const fade = (scene: string) => {
      this.cameras.main.fadeOut(280, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start(scene));
    };
    makeBtn(this, W / 2, 385, '▶  PLAY',        200, () => fade('CharacterSelectScene'));
    makeBtn(this, W / 2, 448, '?  HOW TO PLAY', 200, () => fade('HowToPlayScene'));

    // High score
    const hs = localStorage.getItem('munchMonsters_hs') ?? '0';
    this.add.text(W / 2, 512, `🏆  Best Score: ${hs}`, {
      fontSize: '17px', fontFamily: 'monospace', color: '#ffcc44',
    }).setOrigin(0.5);

    // Floating food decorations at the bottom
    [0, 1, 2, 6, 7, 8].forEach((fi, i) => {
      const fd = FOOD_LIST[fi];
      const g  = this.add.graphics();
      drawFood(g, fd.shape, fd.col, CFG.FOOD_SIZE);
      g.x = Phaser.Math.Between(20, W - 20);
      g.y = Phaser.Math.Between(560, H - 30);
      this.tweens.add({
        targets: g, y: g.y - 28,
        x: g.x + Phaser.Math.Between(-18, 18),
        duration: 1500 + i * 200, yoyo: true, repeat: -1,
        ease: 'Sine.easeInOut', delay: i * 220,
      });
    });

    this.cameras.main.fadeIn(350, 0, 0, 0);
  }
}

// ─── SCENE: Character Select ──────────────────────────────────────────────────
class CharacterSelectScene extends Phaser.Scene {
  private selIdx = 0;
  private cards: Phaser.GameObjects.Container[] = [];

  constructor() { super({ key: 'CharacterSelectScene' }); }

  create() {
    const W = CFG.WIDTH;
    sceneBg(this);
    addStarfield(this, 35);
    this.cards = [];

    this.add.text(W / 2, 52, 'CHOOSE YOUR MONSTER', {
      fontSize: '26px', fontFamily: 'monospace', color: '#ffcc00',
      stroke: '#884400', strokeThickness: 3, fontStyle: 'bold',
    }).setOrigin(0.5);

    const CW = 82, CH = 112;
    const makeCard = (mi: number, x: number, y: number) => {
      const bg  = this.add.graphics();
      const mg  = this.add.graphics();
      drawMonster(mg, mi, 'happy', 54);
      mg.x = -27; mg.y = -CH / 2 + 4;
      const nm = this.add.text(0, CH / 2 - 30, MONSTERS[mi].name, {
        fontSize: '13px', fontFamily: 'monospace', color: '#ffffff', fontStyle: 'bold',
      }).setOrigin(0.5);
      const ds = this.add.text(0, CH / 2 - 14, MONSTERS[mi].desc, {
        fontSize: '10px', fontFamily: 'monospace', color: '#aabbcc',
      }).setOrigin(0.5);
      const c = this.add.container(x, y, [bg, mg, nm, ds]);
      c.setSize(CW, CH).setInteractive({ useHandCursor: true });
      c.on('pointerdown', () => this.select(mi));
      this.cards.push(c);
    };

    // Row 1: monsters 0,1,2 — Row 2: monsters 3,4
    const gapX = CW + 14;
    const r1x = W / 2 - gapX; const r2x = W / 2 - gapX / 2;
    makeCard(0, r1x,        228); makeCard(1, W / 2,        228); makeCard(2, r1x + gapX * 2, 228);
    makeCard(3, r2x,        356); makeCard(4, r2x + gapX,   356);

    makeBtn(this, W / 2, 490, "✓  LET'S GO!", 200, () => {
      this.game.registry.set('selectedMonster', this.selIdx);
      this.cameras.main.fadeOut(280, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('GameplayScene'));
    });

    // Back
    this.add.text(38, 28, '← BACK', {
      fontSize: '15px', fontFamily: 'monospace', color: '#aabbff',
    }).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.scene.start('TitleScene'));

    this.select(0);
    this.cameras.main.fadeIn(280, 0, 0, 0);
  }

  select(idx: number) {
    this.selIdx = idx;
    this.cards.forEach((card, i) => {
      const CW = 82, CH = 112;
      const bg = card.list[0] as Phaser.GameObjects.Graphics;
      bg.clear();
      if (i === idx) {
        bg.fillStyle(0x4433bb, 1); bg.fillRoundedRect(-CW / 2, -CH / 2, CW, CH, 10);
        bg.lineStyle(3, 0xffcc00, 1); bg.strokeRoundedRect(-CW / 2, -CH / 2, CW, CH, 10);
        this.tweens.add({ targets: card, scaleX: 1.08, scaleY: 1.08, duration: 110, ease: 'Back.easeOut' });
      } else {
        bg.fillStyle(0x2a1a4a, 1); bg.fillRoundedRect(-CW / 2, -CH / 2, CW, CH, 10);
        bg.lineStyle(2, 0x5544aa, 0.8); bg.strokeRoundedRect(-CW / 2, -CH / 2, CW, CH, 10);
        this.tweens.add({ targets: card, scaleX: 1, scaleY: 1, duration: 110 });
      }
    });
  }
}

// ─── SCENE: How To Play ───────────────────────────────────────────────────────
class HowToPlayScene extends Phaser.Scene {
  private panelIdx = 0;
  private panels: Phaser.GameObjects.Container[] = [];

  constructor() { super({ key: 'HowToPlayScene' }); }

  create() {
    const W = CFG.WIDTH, H = CFG.HEIGHT;
    sceneBg(this);
    addStarfield(this, 30);
    this.panels = [];

    this.add.text(W / 2, 44, 'HOW TO PLAY', {
      fontSize: '30px', fontFamily: 'monospace', color: '#ffcc00',
      stroke: '#884400', strokeThickness: 3, fontStyle: 'bold',
    }).setOrigin(0.5);

    const mkPanel = (title: string, lines: string[]) => {
      const pbg = this.add.graphics();
      pbg.fillStyle(0x1a0f35, 0.92); pbg.fillRoundedRect(-195, -210, 390, 410, 16);
      pbg.lineStyle(2, 0x7755cc, 0.7); pbg.strokeRoundedRect(-195, -210, 390, 410, 16);
      const tt = this.add.text(0, -180, title, {
        fontSize: '22px', fontFamily: 'monospace', color: '#ffcc44', fontStyle: 'bold',
      }).setOrigin(0.5);
      const items: Phaser.GameObjects.GameObject[] = [pbg, tt];
      lines.forEach((ln, li) => {
        items.push(
          this.add.text(0, -130 + li * 34, ln, {
            fontSize: '14px', fontFamily: 'monospace', color: '#ddeeff',
            wordWrap: { width: 360 }, align: 'center',
          }).setOrigin(0.5),
        );
      });
      const c = this.add.container(W / 2, H / 2 + 28, items).setVisible(false);
      this.panels.push(c);
    };

    mkPanel('🕹️  CONTROLS', [
      '⬅ ➡  Arrow keys  /  A   D  to move',
      '',
      'On mobile:',
      'Tap LEFT half of screen → move left',
      'Tap RIGHT half of screen → move right',
      '',
      'ESC key to pause',
    ]);

    mkPanel('🍎  FOOD RULES', [
      '🟢  Healthy food  →  +health  +score',
      '      Apple, Carrot, Broccoli, Orange…',
      '',
      '🔴  Junk food  →  -health  (avoid!)',
      '      Donut, Candy, Burger, Ice Cream…',
      '',
      '🟣  Mystery food (level 5+)',
      '      50 / 50 — could be great or awful!',
    ]);

    mkPanel('⚡  COMBOS & LIVES', [
      'Catch healthy foods in a row to combo!',
      '',
      '  3 in a row  →  score ×1.5',
      '  5 in a row  →  score ×2',
      '10 in a row  →  score ×3',
      '',
      '❤ ❤ ❤  You start with 3 lives.',
      'Health hits 0 → lose a life & reset.',
    ]);

    this.showPanel(0);

    // Nav arrows
    const prev = this.add.text(55, H - 80, '◀ BACK', {
      fontSize: '18px', fontFamily: 'monospace', color: '#aabbff',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    const next = this.add.text(W - 55, H - 80, 'NEXT ▶', {
      fontSize: '18px', fontFamily: 'monospace', color: '#aabbff',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    prev.on('pointerdown', () => {
      if (this.panelIdx > 0) this.showPanel(this.panelIdx - 1);
      else this.scene.start('TitleScene');
    });
    next.on('pointerdown', () => {
      if (this.panelIdx < this.panels.length - 1) this.showPanel(this.panelIdx + 1);
      else this.scene.start('CharacterSelectScene');
    });

    // Progress dots
    this.panels.forEach((_, i) => {
      const d = this.add.graphics();
      d.setName(`dot_${i}`);
      d.x = W / 2 - (this.panels.length - 1) * 14 + i * 28;
      d.y = H - 108;
      this.refreshDot(d, i, 0);
    });

    this.cameras.main.fadeIn(280, 0, 0, 0);
  }

  showPanel(idx: number) {
    this.panels.forEach((p, i) => p.setVisible(i === idx));
    this.panelIdx = idx;
    for (let i = 0; i < this.panels.length; i++) {
      const d = this.children.getByName(`dot_${i}`) as Phaser.GameObjects.Graphics | null;
      if (d) this.refreshDot(d, i, idx);
    }
  }

  refreshDot(d: Phaser.GameObjects.Graphics, i: number, active: number) {
    d.clear();
    d.fillStyle(i === active ? 0xffcc00 : 0x4433aa, 1);
    d.fillCircle(0, 0, 5);
  }
}

// ─── SCENE: Gameplay ──────────────────────────────────────────────────────────
interface FoodItem {
  g:       Phaser.GameObjects.Graphics;
  foodIdx: number;
  cat:     FoodCategory;
  speedY:  number;
}

class GameplayScene extends Phaser.Scene {
  // Game state
  private score = 0;
  private level = 1;
  private lives = CFG.LIVES;
  private health = CFG.HEALTH_START;
  private combo = 0;
  private comboMult = 1;
  private maxCombo = 0;
  private catchCount = 0;
  private paused = false;

  // Monster
  private monsterX = CFG.WIDTH / 2;
  private monsterY = CFG.HEIGHT - 80;
  private monsterG!: Phaser.GameObjects.Graphics;
  private monsterIdx = 0;
  private monsterMood: 'happy' | 'neutral' | 'sick' = 'neutral';

  // Food
  private foodItems: FoodItem[] = [];
  private spawnTimer!: Phaser.Time.TimerEvent;

  // Input
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private touchLeft  = false;
  private touchRight = false;

  // HUD refs
  private scoreText!:   Phaser.GameObjects.Text;
  private comboText!:   Phaser.GameObjects.Text;
  private healthFill!:  Phaser.GameObjects.Graphics;
  private heartGfx:     Phaser.GameObjects.Graphics[] = [];

  // Level params
  private ld = levelData(1);

  constructor() { super({ key: 'GameplayScene' }); }

  init(data: { level?: number; score?: number; lives?: number; health?: number }) {
    this.score      = data.score  ?? 0;
    this.level      = data.level  ?? 1;
    this.lives      = data.lives  ?? CFG.LIVES;
    this.health     = data.health ?? CFG.HEALTH_START;
    this.combo      = 0;
    this.comboMult  = 1;
    this.maxCombo   = 0;
    this.catchCount = 0;
    this.paused     = false;
    this.foodItems  = [];
    this.touchLeft  = false;
    this.touchRight = false;
    this.heartGfx   = [];
    this.monsterIdx = (this.game.registry.get('selectedMonster') as number) ?? 0;
    this.monsterX   = CFG.WIDTH / 2;
    this.monsterY   = CFG.HEIGHT - 80;
    this.ld         = levelData(this.level);
  }

  create() {
    const W = CFG.WIDTH, H = CFG.HEIGHT;
    sceneBg(this, 0x060412, 0x100826);
    addStarfield(this, 38);

    // Ground
    const gnd = this.add.graphics();
    gnd.fillStyle(0x1a0f35, 1); gnd.fillRect(0, H - 28, W, 28);
    gnd.fillStyle(0x3a2f55, 1); gnd.fillRect(0, H - 30, W, 2);

    // Monster
    this.monsterG = this.add.graphics().setDepth(10);
    this.redrawMonster();

    // HUD
    this.buildHUD(W, H);

    // Keyboard
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keyA    = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD    = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC).on('down', () => this.togglePause());

    // Touch: tap left / right halves
    this.input.on('pointerdown', (ptr: Phaser.Input.Pointer) => {
      if (ptr.x < W / 2) this.touchLeft = true; else this.touchRight = true;
    });
    this.input.on('pointerup',   () => { this.touchLeft = false; this.touchRight = false; });

    // Food spawner
    this.spawnTimer = this.time.addEvent({
      delay: this.ld.spawnMs, callback: this.spawnFood, callbackScope: this, loop: true,
    });

    this.cameras.main.fadeIn(300, 0, 0, 0);
  }

  // ── HUD ──────────────────────────────────────────────────────────────────
  buildHUD(W: number, H: number) {
    // HUD strip
    const hudBg = this.add.graphics().setDepth(20);
    hudBg.fillStyle(0x000000, 0.6); hudBg.fillRect(0, 0, W, 62);

    // Score / level
    this.scoreText = this.add.text(12, 8, 'SCORE: 0', {
      fontSize: '16px', fontFamily: 'monospace', color: '#ffee88', fontStyle: 'bold',
    }).setDepth(21);
    this.add.text(12, 30, `LEVEL ${this.level} / ${CFG.MAX_LEVELS}`, {
      fontSize: '13px', fontFamily: 'monospace', color: '#aabbff',
    }).setDepth(21);

    // Health bar
    this.add.text(W / 2, 8, '❤  HEALTH', {
      fontSize: '11px', fontFamily: 'monospace', color: '#ff8899',
    }).setOrigin(0.5, 0).setDepth(21);
    const hbBg = this.add.graphics().setDepth(21);
    hbBg.fillStyle(0x331122, 1); hbBg.fillRoundedRect(W / 2 - 80, 24, 160, 16, 6);
    hbBg.lineStyle(1, 0x882244, 0.8); hbBg.strokeRoundedRect(W / 2 - 80, 24, 160, 16, 6);
    this.healthFill = this.add.graphics().setDepth(22);
    this.redrawHealth();

    // Lives (hearts)
    for (let i = 0; i < CFG.LIVES; i++) {
      const hg = this.add.graphics().setDepth(21);
      hg.x = W - 26 - i * 28; hg.y = 4;
      drawHeart(hg, 0xff3355, 24);
      this.heartGfx.push(hg);
    }

    // Combo text (hidden initially)
    this.comboText = this.add.text(W / 2, 76, '', {
      fontSize: '22px', fontFamily: 'monospace', color: '#ffcc00',
      stroke: '#884400', strokeThickness: 3, fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(21).setAlpha(0);

    // Bottom level label
    this.add.text(W / 2, H - 12, `Score to next level: ${CFG.LEVEL_THRESHOLDS[this.level - 1]}`, {
      fontSize: '11px', fontFamily: 'monospace', color: '#4433aa',
    }).setOrigin(0.5).setDepth(5);
  }

  redrawHealth() {
    this.healthFill.clear();
    const pct = Phaser.Math.Clamp(this.health, 0, 100) / 100;
    const w   = Math.round(156 * pct);
    if (w < 1) return;
    const col = this.health > 60 ? 0x44ff66 : this.health > 30 ? 0xffcc00 : 0xff3333;
    this.healthFill.fillStyle(col, 1);
    this.healthFill.fillRoundedRect(CFG.WIDTH / 2 - 78, 25, w, 14, 5);
  }

  redrawHearts() {
    this.heartGfx.forEach((hg, i) => drawHeart(hg, i < this.lives ? 0xff3355 : 0x332233, 24));
  }

  redrawMonster() {
    this.monsterG.clear();
    const s = CFG.MONSTER_SIZE;
    drawMonster(this.monsterG, this.monsterIdx, this.monsterMood, s);
    this.monsterG.x = this.monsterX - s / 2;
    this.monsterG.y = this.monsterY - s + 12;
  }

  // ── Food spawning ─────────────────────────────────────────────────────────
  spawnFood() {
    if (this.paused) return;
    const { junkRatio, trickyRatio, foodSpeed } = this.ld;
    const r = Math.random();
    let cat: FoodCategory;
    if      (r < trickyRatio)             cat = 'tricky';
    else if (r < trickyRatio + junkRatio) cat = 'junk';
    else                                  cat = 'healthy';

    const pool     = FOOD_LIST.filter(f => f.category === cat);
    const foodDef  = Phaser.Utils.Array.GetRandom(pool) as FoodDef;
    const foodIdx  = FOOD_LIST.indexOf(foodDef);

    const g = this.add.graphics().setDepth(5);
    drawFood(g, foodDef.shape, foodDef.col, CFG.FOOD_SIZE);
    g.x = Phaser.Math.Between(CFG.FOOD_SIZE, CFG.WIDTH - CFG.FOOD_SIZE);
    g.y = -CFG.FOOD_SIZE;

    this.foodItems.push({ g, foodIdx, cat, speedY: foodSpeed * Phaser.Math.FloatBetween(0.85, 1.25) });
  }

  // ── Catch logic ───────────────────────────────────────────────────────────
  catchFood(item: FoodItem) {
    const cx = item.g.x + CFG.FOOD_SIZE / 2;
    const cy = item.g.y + CFG.FOOD_SIZE / 2;

    if (item.cat === 'healthy') {
      this.combo++;
      if (this.combo > this.maxCombo) this.maxCombo = this.combo;
      this.updateComboMult();
      const pts = Math.round(CFG.SCORE_HEALTHY * this.comboMult);
      this.score += pts;
      this.health  = Math.min(100, this.health + CFG.HEALTHY_GAIN);
      this.catchCount++;
      floatText(this, cx, cy, `+${pts}`, '#44ff88');
      spawnParticles(this, cx, cy, 0x44ff88);
      this.setMood('happy', 600);

    } else if (item.cat === 'junk') {
      this.combo = 0; this.comboMult = 1;
      this.comboText.setAlpha(0);
      this.health -= CFG.JUNK_DAMAGE;
      floatText(this, cx, cy, '💀 JUNK!', '#ff4444');
      spawnParticles(this, cx, cy, 0xff4444, 6);
      this.cameras.main.shake(200, 0.012);
      this.setMood('sick', 700);

    } else { // tricky
      if (Math.random() < 0.5) {
        const pts = Math.round(CFG.SCORE_TRICKY * this.comboMult);
        this.score  += pts;
        this.health  = Math.min(100, this.health + CFG.TRICKY_GAIN);
        floatText(this, cx, cy, `⭐ +${pts}`, '#cc66ff');
        spawnParticles(this, cx, cy, 0xcc66ff);
        this.setMood('happy', 600);
      } else {
        this.health -= CFG.TRICKY_DAMAGE;
        floatText(this, cx, cy, '😵 TRICKY!', '#ff88cc');
        spawnParticles(this, cx, cy, 0xff88cc, 6);
        this.cameras.main.shake(150, 0.008);
        this.setMood('sick', 700);
      }
    }

    this.health = Math.max(0, this.health);
    this.redrawHealth();
    this.scoreText.setText(`SCORE: ${this.score}`);
    this.checkHealth();
    this.checkLevelAdvance();
  }

  setMood(mood: 'happy' | 'neutral' | 'sick', resetMs: number) {
    this.monsterMood = mood;
    this.time.delayedCall(resetMs, () => {
      this.monsterMood = this.health > 60 ? 'happy' : this.health > 30 ? 'neutral' : 'sick';
    });
  }

  updateComboMult() {
    this.comboMult = 1;
    for (const cl of CFG.COMBO_LEVELS) {
      if (this.combo >= cl.at) this.comboMult = cl.mult;
    }
    if (this.combo >= CFG.COMBO_LEVELS[0].at) {
      this.comboText.setText(`${this.comboMult}× COMBO! (${this.combo})`).setAlpha(1);
      this.tweens.add({ targets: this.comboText, scaleX: 1.18, scaleY: 1.18, duration: 90, yoyo: true });
    }
  }

  checkHealth() {
    if (this.health > 0) return;
    this.lives--;
    this.health = CFG.HEALTH_START;
    this.redrawHearts();
    this.cameras.main.flash(280, 220, 30, 30);
    if (this.lives <= 0) this.endGame(false);
  }

  checkLevelAdvance() {
    const threshold = CFG.LEVEL_THRESHOLDS[this.level - 1];
    if (this.score < threshold) return;
    this.spawnTimer.remove();
    this.foodItems.forEach(f => f.g.destroy());
    this.foodItems = [];
    const isWin = this.level >= CFG.MAX_LEVELS;
    this.time.delayedCall(350, () => {
      if (isWin) this.endGame(true);
      else this.scene.start('LevelCompleteScene', {
        score: this.score, level: this.level,
        lives: this.lives, health: this.health, maxCombo: this.maxCombo,
      });
    });
  }

  endGame(win: boolean) {
    this.scene.start('GameOverScene', {
      win, score: this.score, level: this.level,
      maxCombo: this.maxCombo, caught: this.catchCount,
    });
  }

  togglePause() {
    this.paused = !this.paused;
    if (this.paused) {
      this.spawnTimer.paused = true;
      this.add.text(CFG.WIDTH / 2, CFG.HEIGHT / 2, 'PAUSED\n\nPress ESC to resume', {
        fontSize: '28px', fontFamily: 'monospace', color: '#ffffff',
        stroke: '#000000', strokeThickness: 3, align: 'center',
      }).setOrigin(0.5).setDepth(50).setName('pauseOverlay');
    } else {
      this.spawnTimer.paused = false;
      this.children.getByName('pauseOverlay')?.destroy();
    }
  }

  // ── Main loop ─────────────────────────────────────────────────────────────
  update(_time: number, delta: number) {
    if (this.paused) return;

    // Move monster
    const goL = this.cursors.left.isDown  || this.keyA.isDown || this.touchLeft;
    const goR = this.cursors.right.isDown || this.keyD.isDown || this.touchRight;
    if (goL) this.monsterX -= (this.ld.monsterSpd * delta) / 1000;
    if (goR) this.monsterX += (this.ld.monsterSpd * delta) / 1000;
    this.monsterX = Phaser.Math.Clamp(this.monsterX, 38, CFG.WIDTH - 38);
    this.redrawMonster();

    // Update food
    const catchHalf = CFG.CATCH_RADIUS;
    this.foodItems = this.foodItems.filter(item => {
      item.g.y += (item.speedY * delta) / 1000;
      const cx  = item.g.x + CFG.FOOD_SIZE / 2;
      const cy  = item.g.y + CFG.FOOD_SIZE / 2;
      const dx  = Math.abs(cx - this.monsterX);
      const dy  = cy - this.monsterY;
      if (dy > -22 && dy < 32 && dx < catchHalf) {
        this.catchFood(item);
        item.g.destroy();
        return false;
      }
      if (item.g.y > CFG.HEIGHT + 50) { item.g.destroy(); return false; }
      return true;
    });
  }
}

// ─── SCENE: Level Complete ─────────────────────────────────────────────────
class LevelCompleteScene extends Phaser.Scene {
  constructor() { super({ key: 'LevelCompleteScene' }); }

  create(data: { score: number; level: number; lives: number; health: number; maxCombo: number }) {
    const W = CFG.WIDTH;
    const { score, level, lives, health, maxCombo } = data;

    sceneBg(this, 0x081a10, 0x0a1830);
    addStarfield(this, 50);

    // Celebration burst
    for (let i = 0; i < 28; i++) {
      const cols = [0xffcc00, 0xff66cc, 0x66ffcc, 0xffaa33];
      spawnParticles(this, Phaser.Math.Between(50, W - 50), Phaser.Math.Between(80, 280), cols[i % 4], 1);
    }

    this.add.text(W / 2, 56, '★  LEVEL COMPLETE!  ★', {
      fontSize: '28px', fontFamily: 'monospace', color: '#ffcc00',
      stroke: '#884400', strokeThickness: 3, fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add.text(W / 2, 96, `Level ${level} cleared!`, {
      fontSize: '18px', fontFamily: 'monospace', color: '#aaddff',
    }).setOrigin(0.5);

    // Star rating
    const stars = health > 70 ? 3 : health > 40 ? 2 : 1;
    const sg = this.add.graphics();
    for (let i = 0; i < 3; i++) {
      const sx = W / 2 - 58 + i * 58;
      const sy = 155;
      const filled = i < stars;
      drawStar(sg, sx, sy, 22, 9, filled ? 0xffcc00 : 0x332211);
      if (filled) {
        this.tweens.add({
          targets: sg, scaleX: 1.1, scaleY: 1.1, duration: 650 + i * 120,
          yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
        });
      }
    }

    // Stats
    this.add.text(W / 2, 205, `SCORE: ${score}`, {
      fontSize: '24px', fontFamily: 'monospace', color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add.text(W / 2, 236, `Best combo: ${maxCombo}×   Health left: ${health}%`, {
      fontSize: '14px', fontFamily: 'monospace', color: '#ccaaff',
    }).setOrigin(0.5);

    // Food fact panel
    const fact   = FOOD_FACTS[Math.floor(Math.random() * FOOD_FACTS.length)];
    const fpanel = this.add.graphics();
    fpanel.fillStyle(0x1a2040, 0.92); fpanel.fillRoundedRect(20, 268, W - 40, 88, 10);
    fpanel.lineStyle(1, 0x5566aa, 0.6); fpanel.strokeRoundedRect(20, 268, W - 40, 88, 10);
    this.add.text(W / 2, 284, '💡  DID YOU KNOW?', {
      fontSize: '13px', fontFamily: 'monospace', color: '#ffcc44',
    }).setOrigin(0.5);
    this.add.text(W / 2, 312, fact, {
      fontSize: '12px', fontFamily: 'monospace', color: '#ddeeff',
      wordWrap: { width: W - 60 }, align: 'center',
    }).setOrigin(0.5);

    // Buttons
    makeBtn(this, W / 2, 415, '▶▶  NEXT LEVEL', 220, () => {
      this.cameras.main.fadeOut(280, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('GameplayScene', {
          score, level: level + 1, lives,
          health: Math.min(100, health + 10), // small bonus HP
        });
      });
    }, 0x228822);
    makeBtn(this, W / 2, 476, '⌂  MAIN MENU', 200, () => this.scene.start('TitleScene'), 0x442255);

    this.cameras.main.fadeIn(380, 0, 0, 0);
  }
}

// ─── SCENE: Game Over ─────────────────────────────────────────────────────────
class GameOverScene extends Phaser.Scene {
  constructor() { super({ key: 'GameOverScene' }); }

  create(data: { win: boolean; score: number; level: number; maxCombo: number; caught: number }) {
    const W = CFG.WIDTH, H = CFG.HEIGHT;
    const { win, score, level, maxCombo, caught } = data;

    sceneBg(this, win ? 0x081a10 : 0x1a0808, win ? 0x0a1830 : 0x1a0a0a);
    addStarfield(this, 50);

    if (win) {
      for (let i = 0; i < 35; i++) {
        const cols = [0xffcc00, 0xff66cc, 0x66ffcc, 0xffaa33, 0x88ffff];
        spawnParticles(this,
          Phaser.Math.Between(0, W),
          Phaser.Math.Between(0, H / 2),
          cols[i % 5], 1,
        );
      }
    }

    this.add.text(W / 2, 78, win ? '🏆  YOU WIN!  🏆' : '💀  GAME OVER  💀', {
      fontSize: '34px', fontFamily: 'monospace',
      color: win ? '#ffcc00' : '#ff4444',
      stroke: win ? '#884400' : '#880000',
      strokeThickness: 4, fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(W / 2, 128,
      win ? 'All 10 levels conquered — amazing!' : `You reached level ${level} — keep training!`,
      { fontSize: '15px', fontFamily: 'monospace', color: win ? '#aaffcc' : '#ff9999' },
    ).setOrigin(0.5);

    // High score logic
    const prevHs = parseInt(localStorage.getItem('munchMonsters_hs') ?? '0', 10);
    const isNew  = score > prevHs;
    if (isNew) localStorage.setItem('munchMonsters_hs', String(score));

    // Stats panel
    const panel = this.add.graphics();
    panel.fillStyle(0x1a1030, 0.95); panel.fillRoundedRect(30, 160, W - 60, 190, 14);
    panel.lineStyle(2, win ? 0x44cc66 : 0xcc4444, 0.7);
    panel.strokeRoundedRect(30, 160, W - 60, 190, 14);

    const rows: [string, string, string][] = [
      ['FINAL SCORE',  `${score}${isNew ? '  ✦ NEW BEST!' : ''}`, isNew ? '#ffcc00' : '#ffffff'],
      ['LEVEL REACHED',`${level} / ${CFG.MAX_LEVELS}`, '#ffffff'],
      ['BEST COMBO',   `${maxCombo}×`,                   '#ccaaff'],
      ['FOOD CAUGHT',  `${caught}`,                      '#88ffaa'],
      ['HIGH SCORE',   `${Math.max(score, prevHs)}`,     '#ffee88'],
    ];
    rows.forEach(([k, v, c], i) => {
      this.add.text(50,      180 + i * 34, k, { fontSize: '14px', fontFamily: 'monospace', color: '#aabbcc' });
      this.add.text(W - 50,  180 + i * 34, v, { fontSize: '14px', fontFamily: 'monospace', color: c, fontStyle: 'bold' }).setOrigin(1, 0);
    });

    makeBtn(this, W / 2, 404, '↺  PLAY AGAIN', 210, () => {
      this.cameras.main.fadeOut(280, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('CharacterSelectScene'));
    }, 0x2244aa);
    makeBtn(this, W / 2, 468, '⌂  MAIN MENU', 200, () => this.scene.start('TitleScene'), 0x442255);

    this.cameras.main.fadeIn(380, 0, 0, 0);
  }
}

// ─── REACT COMPONENT ─────────────────────────────────────────────────────────
interface Props { width?: number; height?: number; }

const MunchMonstersGame = ({ width = CFG.WIDTH, height = CFG.HEIGHT }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef      = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type:   Phaser.AUTO,
      width,
      height,
      parent: containerRef.current,
      backgroundColor: '#060412',
      scene:  [TitleScene, CharacterSelectScene, HowToPlayScene, GameplayScene, LevelCompleteScene, GameOverScene],
      scale: {
        mode:       Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width,
        height,
      },
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [width, height]);

  return (
    <div
      ref={containerRef}
      style={{ width, height, maxWidth: '100%', maxHeight: '100%' }}
      className="rounded-xl overflow-hidden shadow-2xl"
    />
  );
};

export default MunchMonstersGame;
