import type {
  LookupClassification,
  LookupInputMode,
} from "../contracts/lookup.js";

type ClassificationProfile = {
  probableHsCode: string;
  label: string;
  keywords: string[];
  phrases: string[];
  requiredKeywords?: string[];
  excludedKeywords?: string[];
  excludedPhrases?: string[];
  destinationCountries?: string[];
  euPriority: "normalized" | "ambiguous" | "seed-fallback";
};

const seedClassificationProfiles: ClassificationProfile[] = [
  {
    probableHsCode: "8208.30",
    label: "Industrial blades and knives",
    keywords: ["knife", "knives", "blade", "blades", "stainless", "steel"],
    phrases: ["knife blade", "kitchen knife", "cutting blade"],
    excludedKeywords: [
      "cookware",
      "pot",
      "pan",
      "bowl",
      "bowls",
      "mixing",
      "household",
      "kitchenware",
      "tray",
      "trays",
      "serving",
    ],
    euPriority: "normalized",
  },
  {
    probableHsCode: "0901.21",
    label: "Roasted coffee",
    keywords: ["coffee", "beans", "roasted", "ground"],
    phrases: ["roasted coffee", "coffee beans", "ground coffee"],
    requiredKeywords: ["coffee"],
    excludedKeywords: ["mug", "mugs", "cup", "cups", "maker", "makers"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "0901.12",
    label: "Decaffeinated unroasted coffee",
    keywords: ["coffee", "decaffeinated", "unroasted", "green"],
    phrases: [
      "decaffeinated coffee",
      "unroasted decaffeinated coffee",
      "non-roasted decaffeinated coffee",
    ],
    requiredKeywords: ["coffee", "decaffeinated"],
    excludedKeywords: ["roasted"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "0901.22",
    label: "Decaffeinated roasted coffee",
    keywords: ["coffee", "decaffeinated", "roasted", "ground"],
    phrases: [
      "roasted decaffeinated coffee",
      "decaffeinated roasted coffee",
      "decaf roasted coffee",
    ],
    requiredKeywords: ["coffee", "decaffeinated", "roasted"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "0902.10",
    label: "Green tea in immediate packings",
    keywords: ["tea", "green", "packings", "packed", "retail", "immediate", "kg"],
    phrases: [
      "green tea in immediate packings",
      "green tea immediate packings",
      "green tea packings",
    ],
    requiredKeywords: ["green"],
    excludedKeywords: ["black", "fermented"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "0902.30",
    label: "Black tea in immediate packings",
    keywords: ["tea", "black", "fermented", "packings", "packed", "retail", "immediate", "kg"],
    phrases: [
      "black tea in immediate packings",
      "black tea immediate packings",
      "fermented tea in immediate packings",
    ],
    requiredKeywords: ["black"],
    excludedKeywords: ["green"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "0811.90",
    label: "Frozen fruit",
    keywords: ["frozen", "blueberry", "blueberries", "berry", "berries"],
    phrases: ["frozen fruit", "frozen berries", "frozen blueberries"],
    euPriority: "ambiguous",
  },
  {
    probableHsCode: "6109.10",
    label: "Cotton T-shirts",
    keywords: ["t-shirt", "shirt", "tee", "cotton", "apparel", "garment"],
    phrases: ["cotton t-shirt", "cotton tee", "t shirt"],
    requiredKeywords: ["t-shirt", "shirt", "tee"],
    excludedKeywords: [
      "polyester",
      "man-made",
      "synthetic",
      "viscose",
      "rayon",
      "nylon",
      "acrylic",
      "towel",
      "towels",
      "tablecloth",
      "tablecloths",
      "napkin",
      "napkins",
      "placemat",
      "placemats",
      "linen",
      "linens",
      "washcloth",
      "washcloths",
    ],
    euPriority: "normalized",
  },
  {
    probableHsCode: "6109.90",
    label: "T-shirts of other textile materials",
    keywords: [
      "t-shirt",
      "t-shirts",
      "singlet",
      "singlets",
      "vest",
      "vests",
      "polyester",
      "man-made",
      "synthetic",
      "viscose",
      "rayon",
      "nylon",
      "acrylic",
    ],
    phrases: [
      "t-shirts of other textile materials",
      "polyester t-shirt",
      "man-made fibre t-shirt",
    ],
    requiredKeywords: ["t-shirt"],
    excludedKeywords: ["cotton"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "3923.21",
    label: "Plastic sacks and bags",
    keywords: [
      "plastic",
      "polyethylene",
      "bag",
      "bags",
      "sack",
      "sacks",
      "packaging",
      "shipping",
      "pouch",
    ],
    phrases: ["plastic bag", "plastic bags", "polyethylene bag", "shipping bag"],
    requiredKeywords: ["plastic", "polyethylene"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "3924.10",
    label: "Plastic tableware and kitchenware",
    keywords: [
      "plastic",
      "kitchen",
      "tableware",
      "kitchenware",
      "plate",
      "plates",
      "bowl",
      "bowls",
      "tray",
      "trays",
      "serving",
      "utensil",
      "utensils",
    ],
    phrases: [
      "plastic kitchenware",
      "plastic tableware",
      "plastic bowl",
      "plastic serving tray",
    ],
    requiredKeywords: ["plastic"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "3924.90",
    label: "Plastic household articles",
    keywords: [
      "plastic",
      "household",
      "organizer",
      "laundry",
      "basket",
      "caddy",
      "bathroom",
      "storage",
    ],
    phrases: ["plastic laundry basket", "plastic organizer", "plastic storage caddy"],
    requiredKeywords: ["plastic"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "6911.10",
    label: "Porcelain and china tableware",
    keywords: [
      "porcelain",
      "china",
      "dinnerware",
      "plate",
      "plates",
      "bowl",
      "bowls",
      "mug",
      "mugs",
      "cup",
      "cups",
      "serving",
      "saucer",
      "teacup",
      "tableware",
    ],
    phrases: [
      "porcelain plate",
      "china bowl",
      "porcelain dinnerware",
      "porcelain coffee mug",
    ],
    requiredKeywords: ["porcelain", "china"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "6912.00",
    label: "Ceramic tableware and kitchenware",
    keywords: [
      "ceramic",
      "stoneware",
      "earthenware",
      "pottery",
      "dinnerware",
      "tableware",
      "kitchenware",
      "plate",
      "plates",
      "bowl",
      "bowls",
      "mug",
      "mugs",
      "cup",
      "cups",
      "serving",
    ],
    phrases: [
      "ceramic dinnerware",
      "stoneware bowl",
      "ceramic mug",
      "pottery plate",
    ],
    requiredKeywords: ["ceramic", "stoneware", "earthenware", "pottery"],
    excludedKeywords: [
      "porcelain",
      "china",
      "plastic",
      "glass",
      "wood",
      "wooden",
      "melamine",
    ],
    destinationCountries: ["European Union"],
    euPriority: "ambiguous",
  },
  {
    probableHsCode: "4419.90",
    label: "Wooden tableware and kitchenware",
    keywords: [
      "wood",
      "wooden",
      "tableware",
      "kitchenware",
      "serving",
      "tray",
      "bowl",
      "utensil",
      "salad",
      "cutting",
      "board",
    ],
    phrases: [
      "wooden serving tray",
      "wooden salad bowl",
      "wooden kitchenware",
      "wooden tableware",
      "wooden cutting board",
    ],
    requiredKeywords: ["wood", "wooden"],
    excludedKeywords: [
      "chair",
      "stool",
      "seat",
      "cabinet",
      "furniture",
      "ornament",
      "bookshelf",
      "bookshelves",
      "bookcase",
      "bookcases",
      "console",
      "dresser",
      "wardrobe",
      "nightstand",
      "bedside",
      "media",
      "tv",
    ],
    excludedPhrases: [
      "wooden dining table",
      "wooden chair",
      "wooden cabinet",
      "wooden bookshelf",
      "wooden tv stand",
    ],
    euPriority: "normalized",
  },
  {
    probableHsCode: "4419.90",
    label: "Wooden tableware and kitchenware",
    keywords: [
      "wood",
      "wooden",
      "tableware",
      "kitchenware",
      "serving",
      "tray",
      "bowl",
      "utensil",
      "salad",
      "cutting",
      "board",
    ],
    phrases: [
      "wooden serving tray",
      "wooden salad bowl",
      "wooden kitchenware",
      "wooden tableware",
      "wooden cutting board",
    ],
    excludedKeywords: ["chair", "stool", "seat", "cabinet", "furniture", "ornament"],
    excludedPhrases: ["wooden dining table", "wooden chair", "wooden cabinet"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "7013.49",
    label: "Glass drinkware and table glassware",
    keywords: [
      "glass",
      "glasses",
      "tumbler",
      "tumblers",
      "drinkware",
      "drinking",
      "goblet",
      "glassware",
    ],
    phrases: ["glass tumbler", "drinking glasses", "glassware set"],
    requiredKeywords: ["glass", "glasses", "glassware", "drinkware"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "7615.10",
    label: "Aluminium household and kitchen articles",
    keywords: [
      "aluminium",
      "aluminum",
      "kitchen",
      "household",
      "tray",
      "basket",
      "dish",
      "serving",
      "cookware",
      "pan",
    ],
    phrases: [
      "aluminum serving tray",
      "aluminium serving tray",
      "aluminum kitchen basket",
      "aluminium kitchen tray",
    ],
    requiredKeywords: ["aluminium", "aluminum"],
    excludedKeywords: [
      "radiator",
      "radiators",
      "foil",
      "foils",
      "section",
      "sections",
      "bathroom",
      "shower",
      "soap",
      "sanitary",
    ],
    excludedPhrases: ["aluminum radiator", "aluminium radiator", "foil manufacture"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "7615.10",
    label: "Aluminium household and kitchen articles",
    keywords: [
      "aluminium",
      "aluminum",
      "kitchen",
      "household",
      "tray",
      "basket",
      "dish",
      "serving",
      "cookware",
      "pan",
    ],
    phrases: [
      "aluminum serving tray",
      "aluminium serving tray",
      "aluminum kitchen basket",
      "aluminium kitchen tray",
    ],
    excludedKeywords: [
      "radiator",
      "radiators",
      "foil",
      "foils",
      "section",
      "sections",
      "bathroom",
      "shower",
      "soap",
      "sanitary",
    ],
    excludedPhrases: ["aluminum radiator", "aluminium radiator", "foil manufacture"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "7615.20",
    label: "Aluminium sanitary ware",
    keywords: [
      "aluminium",
      "aluminum",
      "sanitary",
      "bathroom",
      "shower",
      "soap",
      "towel",
      "fixture",
    ],
    phrases: ["aluminium shower caddy", "aluminum bathroom fixture", "aluminium soap dish"],
    excludedKeywords: [
      "radiator",
      "radiators",
      "foil",
      "foils",
      "tray",
      "pan",
      "cookware",
      "basket",
      "dish",
    ],
    requiredKeywords: ["aluminium", "aluminum"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "8302.50",
    label: "Metal hooks and brackets",
    keywords: [
      "hook",
      "hooks",
      "bracket",
      "brackets",
      "peg",
      "pegs",
      "wall",
      "hanger",
    ],
    phrases: ["wall hook", "coat hook", "metal bracket"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "8215.99",
    label: "Kitchen utensils and serving tools",
    keywords: [
      "utensil",
      "utensils",
      "tongs",
      "ladle",
      "ladles",
      "spatula",
      "spatulas",
      "turner",
      "turners",
      "skimmer",
      "skimmers",
      "whisk",
      "whisks",
      "serving",
      "kitchen",
      "stainless",
      "steel",
      "metal",
    ],
    phrases: [
      "kitchen utensil",
      "serving tongs",
      "slotted spatula",
      "stainless steel tongs",
      "metal ladle",
    ],
    requiredKeywords: [
      "utensil",
      "utensils",
      "tongs",
      "ladle",
      "ladles",
      "spatula",
      "spatulas",
      "turner",
      "turners",
      "skimmer",
      "skimmers",
      "whisk",
      "whisks",
    ],
    excludedKeywords: [
      "knife",
      "knives",
      "blade",
      "blades",
      "pot",
      "pots",
      "pan",
      "pans",
      "cookware",
      "hook",
      "hooks",
      "bracket",
      "brackets",
    ],
    destinationCountries: ["European Union"],
    euPriority: "ambiguous",
  },
  {
    probableHsCode: "8306.29",
    label: "Metal ornaments and decorative articles",
    keywords: [
      "metal",
      "brass",
      "decorative",
      "ornament",
      "figurine",
      "statuette",
      "candle",
      "holder",
      "decor",
    ],
    phrases: [
      "metal candle holder",
      "brass candle holder",
      "decorative metal figurine",
    ],
    requiredKeywords: ["metal", "brass"],
    excludedKeywords: [
      "hook",
      "hooks",
      "bracket",
      "brackets",
      "fixture",
      "furniture",
      "bookcase",
      "bookcases",
      "bookshelf",
      "bookshelves",
      "shelf",
      "shelves",
      "rack",
      "racks",
      "locker",
    ],
    excludedPhrases: ["metal wall hook", "metal bracket"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "4819.10",
    label: "Corrugated cartons and boxes",
    keywords: [
      "corrugated",
      "carton",
      "cartons",
      "box",
      "boxes",
      "paperboard",
      "shipping",
      "packaging",
    ],
    phrases: ["corrugated box", "corrugated boxes", "shipping carton"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "4819.30",
    label: "Wide sacks and bags",
    keywords: [
      "sack",
      "sacks",
      "bag",
      "bags",
      "base",
      "width",
      "wide",
      "40",
      "cm",
    ],
    phrases: [
      "sacks and bags having a base of a width of 40 cm or more",
      "base width of 40 cm or more",
      "wide sacks and bags",
    ],
    requiredKeywords: ["base", "width"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "4820.10",
    label: "Registers and notebooks",
    keywords: [
      "registers",
      "account",
      "books",
      "notebook",
      "notebooks",
      "order",
      "receipt",
      "letter",
      "pad",
      "pads",
      "paper",
      "paperboard",
    ],
    phrases: [
      "registers account books",
      "note books",
      "letter pads",
      "notebooks",
    ],
    euPriority: "normalized",
  },
  {
    probableHsCode: "6302.60",
    label: "Terry towels and kitchen linen",
    keywords: [
      "towel",
      "towels",
      "terry",
      "bath",
      "dish",
      "kitchen",
      "bathroom",
      "washcloth",
      "washcloths",
      "linen",
    ],
    phrases: ["bath towel", "terry towel", "bath towel set", "dish towel"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "6110.20",
    label: "Cotton jerseys and pullovers",
    keywords: [
      "cotton",
      "jersey",
      "jerseys",
      "pullover",
      "pullovers",
      "sweatshirt",
      "sweatshirts",
      "waistcoat",
      "waistcoats",
      "knitted",
      "crocheted",
    ],
    phrases: [
      "cotton jersey",
      "cotton pullover",
      "cotton sweatshirt",
      "cotton knitwear",
    ],
    requiredKeywords: ["cotton"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "6110.30",
    label: "Man-made fibre jerseys and pullovers",
    keywords: [
      "man-made",
      "fibre",
      "fibres",
      "fiber",
      "fibers",
      "polyester",
      "viscose",
      "rayon",
      "acrylic",
      "nylon",
      "jersey",
      "jerseys",
      "pullover",
      "pullovers",
      "sweatshirt",
      "sweatshirts",
      "waistcoat",
      "waistcoats",
      "knitted",
      "crocheted",
    ],
    phrases: [
      "man-made fibre jersey",
      "polyester pullover",
      "man-made fibre sweatshirt",
    ],
    requiredKeywords: ["man-made"],
    excludedKeywords: ["cotton"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "6115.95",
    label: "Cotton hosiery",
    keywords: [
      "cotton",
      "hosiery",
      "sock",
      "socks",
      "stocking",
      "stockings",
      "knitted",
      "crocheted",
    ],
    phrases: ["cotton hosiery", "cotton socks", "cotton stockings"],
    requiredKeywords: ["cotton"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "6302.10",
    label: "Knitted or crocheted bedlinen",
    keywords: [
      "bedlinen",
      "bed",
      "linen",
      "bedding",
      "sheet",
      "sheets",
      "duvet",
      "cover",
      "pillowcase",
      "quilt",
      "knitted",
      "crocheted",
    ],
    phrases: [
      "bedlinen, knitted or crocheted",
      "knitted bedlinen",
      "crocheted bedlinen",
      "knitted bed linen",
      "crocheted bed linen",
    ],
    requiredKeywords: ["bedlinen"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "6302.21",
    label: "Cotton bedlinen, plain",
    keywords: [
      "cotton",
      "bedlinen",
      "bed",
      "linen",
      "bedding",
      "sheet",
      "sheets",
      "duvet",
      "cover",
      "pillowcase",
      "quilt",
      "plain",
      "unprinted",
      "not",
      "printed",
    ],
    phrases: [
      "cotton bedlinen not printed",
      "cotton bed linen not printed",
      "cotton sheets not printed",
    ],
    requiredKeywords: ["plain", "unprinted", "not printed"],
    excludedKeywords: ["knitted", "crocheted"],
    excludedPhrases: ["printed bedlinen", "printed bed linen", "printed sheets"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "6304.91",
    label: "Cotton furnishing articles",
    keywords: [
      "cotton",
      "furnishing",
      "article",
      "articles",
      "curtain",
      "curtains",
      "blind",
      "blinds",
      "throw",
      "throws",
      "cover",
      "covers",
      "cushion",
      "cushions",
      "runner",
      "runners",
      "drape",
      "drapes",
      "valance",
      "valances",
    ],
    phrases: [
      "cotton furnishing articles",
      "cotton curtain",
      "cotton cushion cover",
      "cotton bedspread",
    ],
    requiredKeywords: ["cotton"],
    excludedKeywords: [
      "tablecloth",
      "tablecloths",
      "napkin",
      "napkins",
      "placemat",
      "placemats",
      "towel",
      "towels",
      "bedlinen",
      "sheet",
      "sheets",
      "pillowcase",
    ],
    euPriority: "normalized",
  },
  {
    probableHsCode: "9401.30",
    label: "Swivel seats with variable height adjustment",
    keywords: [
      "swivel",
      "height",
      "adjustable",
      "adjustment",
      "office",
      "chair",
      "chairs",
      "seat",
      "seats",
    ],
    phrases: [
      "swivel seat with variable height adjustment",
      "swivel office chair",
      "height adjustable chair",
    ],
    requiredKeywords: ["swivel", "height"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "9401.71",
    label: "Upholstered seats with metal frames",
    keywords: [
      "upholstered",
      "metal",
      "frame",
      "frames",
      "seat",
      "seats",
      "chair",
      "chairs",
    ],
    phrases: [
      "upholstered seats with metal frames",
      "upholstered metal frame seat",
      "metal frame upholstered chair",
    ],
    requiredKeywords: ["upholstered", "metal", "frame"],
    excludedKeywords: ["garden", "camping"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "9403.10",
    label: "Metal office furniture",
    keywords: [
      "metal",
      "office",
      "furniture",
      "desk",
      "desks",
      "cabinet",
      "cabinets",
      "workstation",
      "workstations",
      "storage",
    ],
    phrases: [
      "metal office furniture",
      "office desk",
      "metal office desk",
      "metal office cabinet",
    ],
    requiredKeywords: ["metal", "office"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "6302.91",
    label: "Cotton table linen and kitchen linen",
    keywords: [
      "cotton",
      "tablecloth",
      "tablecloths",
      "napkin",
      "napkins",
      "placemat",
      "placemats",
      "table",
      "linen",
      "tea towel",
    ],
    phrases: ["cotton tablecloth", "cotton napkins", "table linen", "cotton placemat"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "7323.93",
    label: "Stainless steel household articles",
    keywords: [
      "stainless",
      "steel",
      "cookware",
      "saucepan",
      "pot",
      "pan",
      "bowl",
      "bowls",
      "mixing",
      "stockpot",
      "household",
    ],
    phrases: [
      "stainless steel cookware",
      "stainless steel pot",
      "stainless steel pan",
      "stainless steel mixing bowl",
    ],
    requiredKeywords: ["stainless", "steel"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "8501.52",
    label: "Electric motors",
    keywords: [
      "motor",
      "rotor",
      "industrial",
      "electric",
      "conveyor",
      "three-phase",
    ],
    phrases: ["electric motor", "industrial motor", "ac motor"],
    euPriority: "ambiguous",
  },
  {
    probableHsCode: "9403.30",
    label: "Wooden office furniture",
    keywords: [
      "office",
      "desk",
      "filing",
      "cabinet",
      "cupboard",
      "wood",
      "wooden",
    ],
    phrases: ["office desk", "wooden office desk", "filing cabinet", "office cabinet"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "9403.20",
    label: "Metal furniture",
    keywords: [
      "metal",
      "steel",
      "shelving",
      "shelf",
      "bookcase",
      "bookcases",
      "bookshelf",
      "bookshelves",
      "rack",
      "racks",
      "locker",
      "cabinet",
      "storage",
      "furniture",
    ],
    phrases: [
      "metal shelving unit",
      "steel shelving",
      "metal storage cabinet",
      "metal bookcase",
    ],
    euPriority: "normalized",
  },
  {
    probableHsCode: "9403.40",
    label: "Wooden kitchen furniture",
    keywords: [
      "kitchen",
      "cabinet",
      "pantry",
      "cupboard",
      "wood",
      "wooden",
      "furniture",
    ],
    phrases: ["kitchen cabinet", "wooden kitchen cabinet", "pantry cabinet"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "9401.61",
    label: "Upholstered seats",
    keywords: [
      "upholstered",
      "chair",
      "armchair",
      "seat",
      "seating",
      "lounge",
      "sofa",
    ],
    phrases: ["upholstered chair", "upholstered armchair", "lounge chair"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "9401.69",
    label: "Non-upholstered seats",
    keywords: [
      "chair",
      "chairs",
      "stool",
      "stools",
      "seat",
      "seating",
      "folding",
      "wooden",
      "rattan",
      "cane",
    ],
    phrases: ["wooden stool", "folding chair", "wooden dining chair"],
    excludedKeywords: ["upholstered", "armchair", "sofa", "lounge", "cushion", "cushioned"],
    excludedPhrases: ["upholstered chair", "lounge chair"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "9403.50",
    label: "Wooden bedroom furniture",
    keywords: [
      "bedroom",
      "dresser",
      "wardrobe",
      "nightstand",
      "bedside",
      "wood",
      "wooden",
      "furniture",
    ],
    phrases: ["bedroom dresser", "wooden dresser", "bedroom furniture"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "9403.60",
    label: "Wooden furniture",
    keywords: [
      "wood",
      "wooden",
      "chair",
      "table",
      "bookshelf",
      "bookshelves",
      "bookcase",
      "bookcases",
      "console",
      "media",
      "tv",
      "stand",
      "shelf",
      "shelves",
      "furniture",
      "shop",
      "dining",
      "living",
    ],
    phrases: [
      "wooden furniture",
      "wooden table",
      "dining room table",
      "wooden bookshelf",
      "wooden tv stand",
      "media console",
    ],
    euPriority: "normalized",
  },
  {
    probableHsCode: "3923.29",
    label: "Polypropylene bags and sacks",
    keywords: [
      "polypropylene",
      "pp",
      "plastic",
      "bag",
      "bags",
      "sack",
      "sacks",
      "packaging",
      "pouch",
    ],
    phrases: ["polypropylene bag", "pp bag", "polypropylene sack"],
    requiredKeywords: ["polypropylene", "pp"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "3923.30",
    label: "Plastic bottles and rigid containers",
    keywords: [
      "plastic",
      "bottle",
      "bottles",
      "flask",
      "flasks",
      "container",
      "containers",
      "water",
      "beverage",
    ],
    phrases: ["plastic bottle", "plastic bottles", "plastic flask", "water bottle"],
    requiredKeywords: ["bottle", "bottles", "flask", "flasks"],
    excludedKeywords: [
      "bag",
      "bags",
      "sack",
      "sacks",
      "bowl",
      "bowls",
      "plate",
      "plates",
      "tableware",
      "kitchenware",
    ],
    euPriority: "normalized",
  },
  {
    probableHsCode: "4819.20",
    label: "Folding paperboard cartons and gift boxes",
    keywords: [
      "folding",
      "carton",
      "cartons",
      "cardboard",
      "paperboard",
      "box",
      "boxes",
      "gift",
      "packaging",
      "retail",
    ],
    phrases: ["folding carton", "cardboard box", "paperboard box", "gift box"],
    requiredKeywords: ["folding", "cardboard", "gift"],
    excludedKeywords: ["corrugated", "plastic", "polyethylene"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "4819.40",
    label: "Paper sacks and bags",
    keywords: [
      "paper",
      "kraft",
      "sack",
      "sacks",
      "bag",
      "bags",
      "grocery",
      "packaging",
    ],
    phrases: ["paper bag", "kraft bag", "paper sack", "kraft sack"],
    requiredKeywords: ["paper", "kraft"],
    excludedKeywords: [
      "plastic",
      "polyethylene",
      "polypropylene",
      "corrugated",
      "cardboard",
      "paperboard",
      "bottle",
      "bottles",
    ],
    euPriority: "normalized",
  },
  {
    probableHsCode: "4823.69",
    label: "Disposable paper table articles",
    keywords: [
      "paper",
      "disposable",
      "napkin",
      "napkins",
      "plate",
      "plates",
      "cup",
      "cups",
      "tissue",
      "serviette",
    ],
    phrases: ["paper napkin", "paper plate", "disposable paper", "paper cup", "paper serviette"],
    requiredKeywords: ["disposable", "napkin", "napkins", "tissue", "serviette"],
    excludedKeywords: [
      "corrugated",
      "box",
      "boxes",
      "bag",
      "bags",
      "packaging",
      "carton",
      "plastic",
    ],
    euPriority: "normalized",
  },
  {
    probableHsCode: "6302.31",
    label: "Cotton bedlinen and printed bed linen",
    keywords: [
      "cotton",
      "bed",
      "bedlinen",
      "bedding",
      "linen",
      "sheet",
      "sheets",
      "duvet",
      "cover",
      "pillowcase",
      "quilt",
    ],
    phrases: ["bed linen", "cotton sheets", "duvet cover", "cotton bedding", "pillowcase set", "bed sheet"],
    requiredKeywords: ["printed"],
    excludedKeywords: [
      "towel",
      "towels",
      "tablecloth",
      "tablecloths",
      "napkin",
      "napkins",
      "placemat",
      "placemats",
      "bath",
      "bathroom",
    ],
    excludedPhrases: ["not printed", "unprinted"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "9403.70",
    label: "Plastic furniture",
    keywords: [
      "plastic",
      "resin",
      "polypropylene",
      "patio",
      "outdoor",
      "chair",
      "chairs",
      "table",
      "furniture",
      "stackable",
      "garden",
    ],
    phrases: [
      "plastic chair",
      "plastic patio chair",
      "outdoor plastic furniture",
      "plastic garden chair",
      "resin chair",
    ],
    requiredKeywords: ["plastic", "resin", "polypropylene"],
    excludedKeywords: [
      "wood",
      "wooden",
      "metal",
      "steel",
      "aluminium",
      "aluminum",
      "fabric",
      "upholstered",
      "bag",
      "bags",
      "bottle",
      "bottles",
      "tableware",
      "kitchenware",
    ],
    euPriority: "normalized",
  },
  {
    probableHsCode: "6307.10",
    label: "Cleaning cloths and shop towels",
    keywords: [
      "cleaning",
      "cloth",
      "cloths",
      "microfiber",
      "microfibre",
      "polishing",
      "polish",
      "dusting",
      "wiping",
      "rag",
      "rags",
      "shop",
      "wipe",
      "wipes",
    ],
    phrases: [
      "cleaning cloth",
      "microfiber cleaning cloth",
      "microfibre cleaning cloth",
      "polishing cloth",
      "shop towel",
    ],
    requiredKeywords: [
      "cleaning",
      "microfiber",
      "microfibre",
      "polishing",
      "dusting",
      "wiping",
      "rag",
      "rags",
      "wipe",
      "wipes",
    ],
    excludedKeywords: [
      "bath",
      "bathroom",
      "tablecloth",
      "tablecloths",
      "napkin",
      "napkins",
      "placemat",
      "placemats",
      "apparel",
      "shirt",
      "towel rack",
    ],
    destinationCountries: ["European Union"],
    euPriority: "ambiguous",
  },
];

export type ResolvedLookupClassification = {
  classification: LookupClassification;
  inputMode: LookupInputMode;
  normalizedHsCode: string;
  normalizedProductDescription: string | null;
  submittedHsCode: string | null;
};

export function normalizeHsCode(value: string) {
  return value.replace(/\s+/g, "").replace(/[^\d.]/g, "");
}

export function canonicalizeHsCode(value: string) {
  return value.replace(/[^\d]/g, "");
}

export function normalizeDescription(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeSearchTerm(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function matchesNormalizedKeyword(
  searchableDescription: string,
  searchableTokens: Set<string>,
  keyword: string,
) {
  const normalizedKeyword = normalizeSearchTerm(keyword);

  if (normalizedKeyword.includes(" ")) {
    return searchableDescription.includes(normalizedKeyword);
  }

  return searchableTokens.has(normalizedKeyword);
}

function getEuPriorityBoost(priority: ClassificationProfile["euPriority"]) {
  if (priority === "normalized") {
    return 1;
  }

  if (priority === "ambiguous") {
    return 0.5;
  }

  return 0;
}

function resolveClassificationFromDescription(
  productDescription: string,
  destinationCountry: string,
): LookupClassification {
  const normalizedDescription = productDescription.toLowerCase();
  const searchableDescription = normalizeSearchTerm(normalizedDescription);
  const searchableTokens = new Set(
    searchableDescription.split(" ").filter(Boolean),
  );
  let bestMatch:
    | {
        profile: ClassificationProfile;
        matchedKeywords: string[];
        matchedPhrases: string[];
        score: number;
      }
    | undefined;

  for (const profile of seedClassificationProfiles) {
    if (
      profile.destinationCountries &&
      !profile.destinationCountries.includes(destinationCountry)
    ) {
      continue;
    }


    const matchedExcludedKeywords = (profile.excludedKeywords || []).filter((keyword) =>
      matchesNormalizedKeyword(searchableDescription, searchableTokens, keyword),
    );
    const matchedExcludedPhrases = (profile.excludedPhrases || []).filter((phrase) =>
      searchableDescription.includes(normalizeSearchTerm(phrase)),
    );

    if (matchedExcludedKeywords.length > 0 || matchedExcludedPhrases.length > 0) {
      continue;
    }

    const matchedRequiredKeywords = (profile.requiredKeywords || []).filter((keyword) =>
      matchesNormalizedKeyword(searchableDescription, searchableTokens, keyword),
    );

    if ((profile.requiredKeywords || []).length > 0 && matchedRequiredKeywords.length === 0) {
      continue;
    }


    const matchedKeywords = profile.keywords.filter((keyword) =>
      matchesNormalizedKeyword(searchableDescription, searchableTokens, keyword),
    );
    const matchedPhrases = profile.phrases.filter((phrase) =>
      searchableDescription.includes(normalizeSearchTerm(phrase)),
    );
    const euPriorityBoost =
      destinationCountry === "European Union"
        ? getEuPriorityBoost(profile.euPriority)
        : 0;
    const baseScore = matchedKeywords.length + matchedPhrases.length * 2;
    const score =
      baseScore > 0 ? baseScore + euPriorityBoost : 0;

    if (!bestMatch || score > bestMatch.score) {
      bestMatch = {
        profile,
        matchedKeywords,
        matchedPhrases,
        score,
      };
      continue;
    }

    if (score === bestMatch.score) {
      const currentPriorityBoost = getEuPriorityBoost(profile.euPriority);
      const bestPriorityBoost = getEuPriorityBoost(bestMatch.profile.euPriority);

      if (currentPriorityBoost > bestPriorityBoost) {
        bestMatch = {
          profile,
          matchedKeywords,
          matchedPhrases,
          score,
        };
      }
    }
  }

  if (!bestMatch || bestMatch.score <= 0) {
    return {
      probableHsCode: "8479.89",
      confidence: "low",
      method: "fallback-seed-classification",
      rationale:
        "No direct keyword match was found, so the app returned a low-confidence seed classification.",
    };
  }

  const bestScore = bestMatch.score;
  const confidence =
    bestScore >= 3 ? "high" : bestScore === 2 ? "medium" : "low";
  const matchedTerms = [
    ...bestMatch.matchedPhrases,
    ...bestMatch.matchedKeywords.filter(
      (keyword) => !bestMatch.matchedPhrases.includes(keyword),
    ),
  ];
  const euCoverageNote =
    destinationCountry === "European Union" &&
    bestMatch.profile.euPriority === "ambiguous"
      ? " Additional product detail will still be required before a verified EU tariff row can be returned."
      : "";

  return {
    probableHsCode: bestMatch.profile.probableHsCode,
    confidence,
    method: "keyword-match",
    rationale: `Matched ${bestMatch.profile.label.toLowerCase()} terms: ${matchedTerms.join(
      ", ",
    )}.${euCoverageNote}`,
  };
}

export function resolveLookupClassification(input: {
  hsCode: string | null;
  productDescription: string | null;
  destinationCountry: string;
}): ResolvedLookupClassification {
  const normalizedProductDescription = input.productDescription
    ? normalizeDescription(input.productDescription)
    : null;

  if (input.hsCode) {
    const normalizedHsCode = normalizeHsCode(input.hsCode);

    return {
      normalizedHsCode,
      normalizedProductDescription,
      submittedHsCode: input.hsCode,
      inputMode: normalizedProductDescription ? "hsCode+description" : "hsCode",
      classification: {
        probableHsCode: normalizedHsCode,
        confidence: "provided",
        method: normalizedProductDescription
          ? "user-supplied-hs-code-with-description"
          : "user-supplied-hs-code",
        rationale: normalizedProductDescription
          ? "Using the supplied HS code and retaining the product description as supporting context."
          : "Using the supplied HS code directly.",
      },
    };
  }

  const classification = resolveClassificationFromDescription(
    normalizedProductDescription || "",
    input.destinationCountry,
  );

  return {
    normalizedHsCode: classification.probableHsCode,
    normalizedProductDescription,
    submittedHsCode: null,
    inputMode: "description",
    classification,
  };
}
