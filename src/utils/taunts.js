// Taunt messages organized by score brackets
const TAUNTS = {
  // Above 1000 - LEGENDARY (Fear/Respect)
  legendary: [
    "COSMIC KRAKEN! You've devoured galaxies! 🦑",
    "ALPHA PREDATOR! The universe is your hunting ground! 🐅",
    "GALACTIC GORGON! One look, and worlds turn to stone! Medusa was a joke compared to you. 🐍",
    "CELESTIAL BUTCHER! You carve up constellations for fun! 🔪",
    "VOID DRAGON! Your shadow blankets entire systems! 🐉",
    "STAR-EATER! You consume suns like snacks! 🌟",
    "UNIVERSAL BEHEMOTH! Nothing can stand in your way! 🐘",
    "ABYSSAL ANCIENT! You've existed since before time, and your power shows it. 🐙",
    "OMEGA TITAN! The final boss of existence! 💪",
    "COSMIC CONQUEROR! You've claimed every star in sight! 👑",
    "HYPERNOVA HAWK! Swooping in to claim all! 🦅",
    "GALACTIC GODZILLA! Stomping through realities! 🦖",
    "VOID WHALE! Swallowing fleets whole! 🐳",
    "CELESTIAL CENTAUR! A perfect blend of speed and power! 🐎",
    "OMEGA ORCA! The apex hunter of the cosmic oceans! 🐋"
  ],
  // 500-999 - UNSTOPPABLE (Fear)
  unstoppable: [
    "STELLAR SHARK! You tear through the cosmos with ease! 🦈",
    "VOID VIPER! Striking with lethal precision! 🐍",
    "PLANET CRUSHER! Worlds tremble at your approach! 💥",
    "GALACTIC GRIZZLY! A force of nature unleashed! 🐻",
    "COSMIC COBRA! Your fangs drip with stardust! 🐍",
    "NEBULA NOMAD! You roam the void, untouchable! 🌌",
    "ASTEROID ANGLER! Luring lesser beings to their doom! 🎣",
    "ORION OCELOT! Quick, deadly, and elusive! 🐆",
    "SPACE SCORPION! Your sting is legendary! 🦂",
    "UNIVERSAL WOLF! Hunting down every last starship! 🐺",
    "COMET COUGAR! Swift and deadly in the darkness! 🐅",
    "CELESTIAL CRAB! Pinching off the competition! 🦀",
    "VOID SPIDER! Weaving traps of pure destruction! 🕷️",
    "GALACTIC GOBLIN SHARK! A true horror of the deep void! 🦈",
    "ORBITAL OWLBear! A formidable hybrid of fury and wisdom! 🐻🦉"
  ],
  // 200-499 - DANGEROUS (Recognition)
  dangerous: [
    "SPACE HYENA! Cackling as you tear through the ranks! 🐺",
    "VOID VULTURE! Circling above, ready to strike! 🦅",
    "COSMIC CROCODILE! Lying in wait, then snapping shut! 🐊",
    "GALACTIC GORILLA! Powerful and ready to smash! 🦍",
    "STAR SPIDER! Weaving webs of destruction! 🕷️",
    "NEBULA NARWHAL! Piercing through defenses! 🦄",
    "ORBITAL OCTOPUS! Grabbing hold and never letting go! 🐙",
    "ASTEROID APE! Swinging through the chaos! 🐒",
    "UNIVERSAL UNICORN! A rare and dangerous sight! 🦄",
    "CELESTIAL CHEETAH! Blazing fast and deadly accurate! 🐆",
    "COMET CRICKET! Small, but jumps right into the fight! 🦗",
    "VOID WEASEL! Sneaking through defenses!  ferret 🦨",
    "GALACTIC GATOR! Waiting patiently, then striking hard! 🐊",
    "ORBITAL ORANGUTAN! Clever and adaptable in the vacuum! 🦧",
    "SPACE SABLE! Silently stalking your prey! 🐾"
  ],
  // 100-199 - LEARNING (Recognition)
  learning: [
    "SPACE SQUIRREL! Gathering nuts and knowledge! 🐿️",
    "VOID TADPOLE! Growing into something fearsome! 🐸",
    "COSMIC CATERPILLAR! Soon to be a galactic butterfly! 🦋",
    "GALACTIC GOSLING! Still wobbly, but picking up speed! 🦢",
    "STAR SEEDLING! Taking root and starting to sprout! 🌱",
    "NEBULA NEWT! Adapting to the harsh environment! 🦎",
    "ORBITAL OWL! Watching, learning, and planning! 🦉",
    "ASTEROID ANT! Small, but diligently building your empire! 🐜",
    "UNIVERSAL URCHIN! Spiky and full of potential! 🐚",
    "CELESTIAL CHICK! Breaking out of your shell! 🐣",
    "COMET CUB! Roaring softly, but growing stronger! 🐻",
    "VOID WORM! Burrowing through the basics! 🪱",
    "GALACTIC GUINEA PIG! Learning the ropes, carefully! 🐹",
    "ORBITAL OTTER! Playful, but quick to learn the hunt! 🦦",
    "SPACE SEAHORSE! Moving slowly, but steadily improving! 🐠"
  ],
  // 50-99 - MOCKING (Laughing)
  mocking: [
    "PLANETARY PENGUIN! Waddling around, but at least you're not falling! 🐧",
    "MILKY WAY MEATBALL! Round, but not exactly a threat! 🍝",
    "ORION OSTRICH! Sticking your head in the sand, are we? 🦖",
    "VOID VINEGAR! A little sour, not very effective! 🍶",
    "COSMIC CRAB! Sidestepping the action, I see! 🦀",
    "GALACTIC GRASSHOPPER! Leaping about, but not much bite! 🦗",
    "STAR SNAIL! Moving at a leisurely pace, aren't we? 🐌",
    "NEBULA NOODLE! A bit limp, wouldn't you say? 🍜",
    "UNIVERSAL UDON! Soft and easily broken! 🍜",
    "CELESTIAL CHIPMUNK! Chattering away, but where's the action? 🐿️",
    "COMET CUCKOO! Just flying around, making noise! 🐦",
    "VOID VEGGIE! Bland and uninspiring! 🥦",
    "GALACTIC GOLDfish! Swimming in circles, oblivious!  goldfish 🐠",
    "ORBITAL OYSTER! Hard to open, but not worth the effort! 🦪",
    "SPACE SLOTH (on vacation)! Even slower than usual! 🦥"
  ],
  // 20-49 - LAUGHING (Mockery)
  laughing: [
    "SPACE SLOTH! Did you fall asleep at the controls? 🦥",
    "VOID VINEGAR FLY! Buzzing around, but ultimately just a nuisance! 🪰",
    "COSMIC CRUMBLE! You're falling apart at the seams! 🥧",
    "GALACTIC GUMDROP! Sweet, but utterly defenseless! 🍬",
    "STAR-STRUCK SHEEP! Wandering aimlessly in the flock! 🐑",
    "NEBULA NUGGET! Small, insignificant, and easily devoured! 🍗",
    "ORBITAL OATMEAL! Mushy and uninspiring! 🥣",
    "ASTEROID ANCHOVY! A small fish in a very big pond! 🐟",
    "UNIVERSAL URCHIN (cooked)! Easily cracked open! 🐚",
    "CELESTIAL CUCUMBER! Cool, but utterly defenseless! 🥒",
    "COMET CORN! Pop, but no substance! 🌽",
    "VOID WORM (leftover)! You're just bits and pieces now! 🪱",
    "GALACTIC GRASS! Easily mowed down! 🌿",
    "ORBITAL OLIVE! Small, and easily squashed! 🫒",
    "SPACE SPAGHETTI! All tangled up and going nowhere! 🍝"
  ],
  // 10-19 - WEAK (Mockery)
  weak: [
    "WEAK WALRUS! All blubber, no bite! 🦭",
    "PATHETIC PIGEON! Flapping around without purpose! 🕊️",
    "SAD SARDINE! Just waiting to be scooped up! 🐟",
    "HILARIOUS HAMSTER! Running in circles on your little wheel! 🐹",
    "RIDICULOUS RAISIN! Shriveled and insignificant! 🍇",
    "ABSURD ALPACA! Just standing there, looking bewildered! 🦙",
    "COMICAL COD! Easily caught and filleted! 🐟",
    "PREPOSTEROUS PUG! Snorting and struggling! 🐕",
    "OUTRAGEOUS OYSTER! Stuck in your shell! 🦪",
    "LUDICROUS LOBSTER! Easily boiled and eaten! 🦞",
    "COMET CLAM! Shut tight and doing nothing! 🦪",
    "VOID VEAL! A little tender, very helpless! 🥩",
    "GALACTIC GUMMY BEAR! Sweet, but easily torn apart! 🐻",
    "ORBITAL OYSTER (shell only)! Nothing left but the shell! 🦪",
    "SPACE SPONGE! Absorbing damage, but not dealing any! 🧽"
  ],
  // 0-9 - FAILURE (Mockery)
  failure: [
    "FAILURE FLEA! You're an annoying speck, easily squashed! 🕷️",
    "PATHETIC PUMPKIN! Ready to be carved up and discarded! 🎃",
    "SAD SPROUT! You barely even grew! 🌱",
    "HILARIOUS HERRING! Flopping about on dry land! 🐠",
    "RIDICULOUS RADISH! All root, no bite! 🥕",
    "ABSURD ANEMONE! Stuck to one spot, getting nowhere! 🐙",
    "COMICAL CORN NUT! Hard, but ultimately pointless! 🌽",
    "PREPOSTEROUS PEANUT! Small, insignificant, and easily crushed! 🥜",
    "OUTRAGEOUS ONION! Makes everyone cry when they see your score! 🧅",
    "LUDICROUS LIME! So sour, it's a turn-off! 🍋",
    "COMET CANDY FLOSS! Dissolves on impact! 🍭",
    "VOID VINEGAR Eel! Slippery, but offers no resistance! 🐍",
    "GALACTIC GRAVY! Just a messy puddle! 🍲",
    "ORBITAL ONION RING! Easily broken and discarded! 🧅",
    "SPACE SAUSAGE! All filler, no killer! 🌭"
  ]
};

// Function to get a random taunt based on score
const getTauntMessage = (score) => {
  let bracket;
  
  if (score >= 1000) {
    bracket = 'legendary';
  } else if (score >= 500) {
    bracket = 'unstoppable';
  } else if (score >= 200) {
    bracket = 'dangerous';
  } else if (score >= 100) {
    bracket = 'learning';
  } else if (score >= 50) {
    bracket = 'mocking';
  } else if (score >= 20) {
    bracket = 'laughing';
  } else if (score >= 10) {
    bracket = 'weak';
  } else {
    bracket = 'failure';
  }
  
  const taunts = TAUNTS[bracket];
  const randomIndex = Math.floor(Math.random() * taunts.length);
  return taunts[randomIndex];
};

export default getTauntMessage; 