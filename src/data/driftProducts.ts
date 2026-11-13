// Product data copied from driftretail.com (shop-all / all-products feed)
export interface DriftProduct {
  id: string;
  handle: string;
  title: string;
  price: string;
  compare: string;
  pct: number;
  images: string[];
  /** HTML copied from driftretail.com product page */
  description?: string;
  howToUse?: string;
  formulation?: string;
}

export const SHOP_ALL: DriftProduct[] = [
  {
    "id": "8949395259527",
    "handle": "baddie-too-rare-too-real",
    "title": "BADDIE — Too Rare, Too Real",
    "price": "Rs.1,399",
    "compare": "Rs.1,999",
    "pct": 30,
    "images": [
      "IT1.jpg?v=1793363872",
      "IT2.jpg?v=1793363872",
      "IT3.jpg?v=1793363871"
    ],
    "description": "<p>Bold. Magnetic. Unforgettable.</p>\n<p>BADDIE is a rich, seductive fragrance built around the luscious sweetness of black cherry, elegant jasmine and the sensual warmth of amber.</p>\n<p>Deep, feminine and unapologetically confident, it brings a touch of mystery and sophistication to every moment.</p>\n<p>For the woman who doesn't chase attention. She naturally owns it.</p>\n<p><strong>Working Key Notes:</strong> Jasmine • Tonka • Vanilla</p>",
    "howToUse": "<p>Spray your DRIFT Perfumed Mist onto your preferred pulse points, including your wrists, neck and behind your ears.</p>\n<p>For a personalized fragrance experience, experiment with layering complementary DRIFT fragrances. Start with a light application and allow each fragrance to settle before adding another.</p>",
    "formulation": "<p>DRIFT Perfumed Mists are crafted to deliver an enjoyable fragrance experience designed for everyday wear.</p>\n<p>For external use only. Avoid contact with eyes and irritated skin. If you have sensitive skin, test a small amount before regular use. Discontinue use if irritation occurs.</p>"
  },
  {
    "id": "8949397848199",
    "handle": "it-girl-in-my-element",
    "title": "IT GIRL — In My Element",
    "price": "Rs.1,399",
    "compare": "Rs.1,999",
    "pct": 30,
    "images": [
      "IT1_b941ee24-b4ce-4cae-84b6-aa55ab7973a0.jpg?v=1793364137",
      "IT2_b6b7c519-87c7-4668-be22-772b982e362d.jpg?v=1793364137",
      "IT3_c4635fea-9ee4-429b-82e9-07af7077cd49.jpg?v=1793364137"
    ],
    "description": "<p>Effortless charm with a playful attitude.</p>\n<p>IT GIRL blends the delicate freshness of pear blossom with soft white musk and creamy vanilla to create a fragrance that feels fresh, feminine and irresistibly chic.</p>\n<p>Light, modern and beautifully balanced, it's the kind of scent that feels as effortless as your favorite outfit.</p>\n<p>For the girl who doesn't follow the moment. She is the moment.</p>\n<p><strong>Working Key Notes:</strong> Berry • Praline • Musk</p>",
    "howToUse": "<p>Spray your DRIFT Perfumed Mist onto your preferred pulse points, including your wrists, neck and behind your ears.</p>\n<p>For a personalized fragrance experience, experiment with layering complementary DRIFT fragrances. Start with a light application and allow each fragrance to settle before adding another.</p>",
    "formulation": "<p>DRIFT Perfumed Mists are crafted to deliver an enjoyable fragrance experience designed for everyday wear.</p>\n<p>For external use only. Avoid contact with eyes and irritated skin. If you have sensitive skin, test a small amount before regular use. Discontinue use if irritation occurs.</p>"
  },
  {
    "id": "8818888376455",
    "handle": "hero-rebel-ignite",
    "title": "Hero-Rebel-Ignite",
    "price": "Rs.4,198",
    "compare": "Rs.5,997",
    "pct": 30,
    "images": [
      "HeroRebeIgnite.jpg?v=1789542291"
    ],
    "description": "<p><strong>HERO — Confidence</strong></p>\n<p>Fresh woody confidence that moves with you every day. A grounded, versatile scent built for everyday wear.</p>\n<p><strong>• Key notes:</strong> Bergamot, Cedarwood, Musk</p>\n<p><strong>REBEL — Expression</strong></p>\n<p>Bold, intense fragrance made for unforgettable moments and presence. For those who refuse to go unnoticed.</p>\n<p><strong>• Key notes:</strong> Apple, Vanilla, Amber</p>\n<p><strong>IGNITE — Energy</strong></p>\n<p>Energetic spicy freshness that fuels movement, passion and momentum. Made for those who lead from the front.</p>\n<p><strong>• Key notes:</strong> Citrus, Spicy, Woody</p>",
    "howToUse": "<p>Spray onto pulse points — wrists, neck, behind the ears and inner elbows. The warmth of your skin activates and amplifies the fragrance throughout the day.</p>\n<p>For longer wear, layer two complementary Drift mists to create your own signature scent. Start light and build up, letting each layer settle before adding the next.</p>",
    "formulation": "<p>Drift body mists are formulated to be gentle on skin while delivering a lasting scent experience. Each mist is free from harsh irritants. If you have known fragrance sensitivities, a patch test on the inner wrist is recommended before full application.</p>"
  },
  {
    "id": "8751380398215",
    "handle": "hero-muse",
    "title": "Hero-Muse",
    "price": "Rs.2,799",
    "compare": "Rs.3,998",
    "pct": 30,
    "images": [
      "P2HeroMuse.jpg?v=1785977118"
    ],
    "description": "<p><strong>HERO — Confidence</strong></p>\n<p>Fresh woody confidence that moves with you every day. A grounded, versatile scent built for everyday wear.</p>\n<p><strong>• Key notes:</strong> Bergamot, Cedarwood, Musk</p>\n<p><strong>MUSE — Attraction</strong></p>\n<p>Sweet, magnetic scent that inspires confidence, attraction and connection. Warm, inviting and impossible to ignore.</p>\n<p><strong>• Key notes:</strong> Mandarin, Jasmine, Musk</p>",
    "howToUse": "<p>Spray onto pulse points — wrists, neck, behind the ears and inner elbows. The warmth of your skin activates and amplifies the fragrance throughout the day.</p>\n<p>For longer wear, layer two complementary Drift mists to create your own signature scent. Start light and build up, letting each layer settle before adding the next.</p>",
    "formulation": "<p>Drift body mists are formulated to be gentle on skin while delivering a lasting scent experience. Each mist is free from harsh irritants. If you have known fragrance sensitivities, a patch test on the inner wrist is recommended before full application.</p>"
  },
  {
    "id": "8749472678023",
    "handle": "hero-ignite",
    "title": "Hero-Ignite",
    "price": "Rs.2,799",
    "compare": "Rs.3,998",
    "pct": 30,
    "images": [
      "P2HeroIgnite.jpg?v=1785977049"
    ],
    "description": "<p><strong>HERO — Confidence</strong></p>\n<p>Fresh woody confidence that moves with you every day. A grounded, versatile scent built for everyday wear.</p>\n<p><strong>• Key notes:</strong> Bergamot, Cedarwood, Musk</p>\n<p><strong>IGNITE — Energy</strong></p>\n<p>Energetic spicy freshness that fuels movement, passion and momentum. Made for those who lead from the front.</p>\n<p><strong>• Key notes:</strong> Citrus, Spicy, Woody</p>",
    "howToUse": "<p>Spray onto pulse points — wrists, neck, behind the ears and inner elbows. The warmth of your skin activates and amplifies the fragrance throughout the day.</p>\n<p>For longer wear, layer two complementary Drift mists to create your own signature scent. Start light and build up, letting each layer settle before adding the next.</p>",
    "formulation": "<p>Drift body mists are formulated to be gentle on skin while delivering a lasting scent experience. Each mist is free from harsh irritants. If you have known fragrance sensitivities, a patch test on the inner wrist is recommended before full application.</p>"
  },
  {
    "id": "8751388033159",
    "handle": "ignite-muse",
    "title": "Ignite-Muse",
    "price": "Rs.2,799",
    "compare": "Rs.3,998",
    "pct": 30,
    "images": [
      "P2IgniteMuse.jpg?v=1785977258"
    ],
    "description": "<p><strong>IGNITE — Energy</strong></p>\n<p>Energetic spicy freshness that fuels movement, passion and momentum. Made for those who lead from the front.</p>\n<p><strong>• Key notes:</strong> Citrus, Spicy, Woody</p>\n<p><strong>MUSE — Attraction</strong></p>\n<p>Sweet, magnetic scent that inspires confidence, attraction and connection. Warm, inviting and impossible to ignore.</p>\n<p><strong>• Key notes:</strong> Mandarin, Jasmine, Musk</p>",
    "howToUse": "<p>Spray onto pulse points — wrists, neck, behind the ears and inner elbows. The warmth of your skin activates and amplifies the fragrance throughout the day.</p>\n<p>For longer wear, layer two complementary Drift mists to create your own signature scent. Start light and build up, letting each layer settle before adding the next.</p>",
    "formulation": "<p>Drift body mists are formulated to be gentle on skin while delivering a lasting scent experience. Each mist is free from harsh irritants. If you have known fragrance sensitivities, a patch test on the inner wrist is recommended before full application.</p>"
  },
  {
    "id": "8751410610311",
    "handle": "muse-rebel",
    "title": "Muse-Rebel",
    "price": "Rs.2,799",
    "compare": "Rs.3,998",
    "pct": 30,
    "images": [
      "P2MuseRebel.jpg?v=1785977390"
    ],
    "description": "<p><strong>MUSE — Attraction</strong></p>\n<p>Sweet, magnetic scent that inspires confidence, attraction and connection. Warm, inviting and impossible to ignore.</p>\n<p><strong>• Key notes:</strong> Mandarin, Jasmine, Musk</p>\n<p><strong>REBEL — Expression</strong></p>\n<p>Bold, intense fragrance made for unforgettable moments and presence. For those who refuse to go unnoticed.</p>\n<p><strong>• Key notes:</strong> Apple, Vanilla, Amber</p>",
    "howToUse": "<p>Spray onto pulse points — wrists, neck, behind the ears and inner elbows. The warmth of your skin activates and amplifies the fragrance throughout the day.</p>\n<p>For longer wear, layer two complementary Drift mists to create your own signature scent. Start light and build up, letting each layer settle before adding the next.</p>",
    "formulation": "<p>Drift body mists are formulated to be gentle on skin while delivering a lasting scent experience. Each mist is free from harsh irritants. If you have known fragrance sensitivities, a patch test on the inner wrist is recommended before full application.</p>"
  },
  {
    "id": "8751404908679",
    "handle": "ignite-rebel",
    "title": "Ignite-Rebel",
    "price": "Rs.2,799",
    "compare": "Rs.3,998",
    "pct": 30,
    "images": [
      "P2IgniteRebel.jpg?v=1785977336"
    ],
    "description": "<p><strong>IGNITE — Energy</strong></p>\n<p>Energetic spicy freshness that fuels movement, passion and momentum. Made for those who lead from the front.</p>\n<p><strong>• Key notes:</strong> Citrus, Spicy, Woody</p>\n<p><strong>REBEL — Expression</strong></p>\n<p>Bold, intense fragrance made for unforgettable moments and presence. For those who refuse to go unnoticed.</p>\n<p><strong>• Key notes:</strong> Apple, Vanilla, Amber</p>",
    "howToUse": "<p>Spray onto pulse points — wrists, neck, behind the ears and inner elbows. The warmth of your skin activates and amplifies the fragrance throughout the day.</p>\n<p>For longer wear, layer two complementary Drift mists to create your own signature scent. Start light and build up, letting each layer settle before adding the next.</p>",
    "formulation": "<p>Drift body mists are formulated to be gentle on skin while delivering a lasting scent experience. Each mist is free from harsh irritants. If you have known fragrance sensitivities, a patch test on the inner wrist is recommended before full application.</p>"
  },
  {
    "id": "8751381250183",
    "handle": "hero-rebel",
    "title": "Hero-Rebel",
    "price": "Rs.2,799",
    "compare": "Rs.3,998",
    "pct": 30,
    "images": [
      "P2HeroRebel.jpg?v=1785977195"
    ],
    "description": "<p><strong>HERO — Confidence</strong></p>\n<p>Fresh woody confidence that moves with you every day. A grounded, versatile scent built for everyday wear.</p>\n<p><strong>• Key notes:</strong> Bergamot, Cedarwood, Musk</p>\n<p><strong>REBEL — Expression</strong></p>\n<p>Bold, intense fragrance made for unforgettable moments and presence. For those who refuse to go unnoticed.</p>\n<p><strong>• Key notes:</strong> Apple, Vanilla, Amber</p>",
    "howToUse": "<p>Spray onto pulse points — wrists, neck, behind the ears and inner elbows. The warmth of your skin activates and amplifies the fragrance throughout the day.</p>\n<p>For longer wear, layer two complementary Drift mists to create your own signature scent. Start light and build up, letting each layer settle before adding the next.</p>",
    "formulation": "<p>Drift body mists are formulated to be gentle on skin while delivering a lasting scent experience. Each mist is free from harsh irritants. If you have known fragrance sensitivities, a patch test on the inner wrist is recommended before full application.</p>"
  },
  {
    "id": "8751427125383",
    "handle": "hero-ignite-muse-rebel",
    "title": "Hero-Ignite-Muse-Rebel",
    "price": "Rs.5,597",
    "compare": "Rs.7,996",
    "pct": 30,
    "images": [
      "Packof4.jpg?v=1785977489"
    ],
    "description": "<p><strong>HERO — Confidence</strong></p>\n<p>Fresh woody confidence that moves with you every day. A grounded, versatile scent built for everyday wear.</p>\n<p><strong>• Key notes:</strong> Bergamot, Cedarwood, Musk</p>\n<p><strong>IGNITE — Energy</strong></p>\n<p>Energetic spicy freshness that fuels movement, passion and momentum. Made for those who lead from the front.</p>\n<p><strong>• Key notes:</strong> Citrus, Spicy, Woody</p>\n<p><strong>MUSE — Attraction</strong></p>\n<p>Sweet, magnetic scent that inspires confidence, attraction and connection. Warm, inviting and impossible to ignore.</p>\n<p><strong>• Key notes:</strong> Mandarin, Jasmine, Musk</p>\n<p><strong>REBEL — Expression</strong></p>\n<p>Bold, intense fragrance made for unforgettable moments and presence. For those who refuse to go unnoticed.</p>\n<p><strong>• Key notes:</strong> Apple, Vanilla, Amber</p>",
    "howToUse": "<p>Spray onto pulse points — wrists, neck, behind the ears and inner elbows. The warmth of your skin activates and amplifies the fragrance throughout the day.</p>\n<p>For longer wear, layer two complementary Drift mists to create your own signature scent. Start light and build up, letting each layer settle before adding the next.</p>",
    "formulation": "<p>Drift body mists are formulated to be gentle on skin while delivering a lasting scent experience. Each mist is free from harsh irritants. If you have known fragrance sensitivities, a patch test on the inner wrist is recommended before full application.</p>"
  },
  {
    "id": "8751422800007",
    "handle": "ignite-muse-rebel",
    "title": "Ignite-Muse-Rebel",
    "price": "Rs.4,198",
    "compare": "Rs.5,997",
    "pct": 30,
    "images": [
      "RebelMuseIgnite.png?v=1785977831"
    ],
    "description": "<p><strong>IGNITE — Energy</strong></p>\n<p>Energetic spicy freshness that fuels movement, passion and momentum. Made for those who lead from the front.</p>\n<p><strong>• Key notes:</strong> Citrus, Spicy, Woody</p>\n<p><strong>MUSE — Attraction</strong></p>\n<p>Sweet, magnetic scent that inspires confidence, attraction and connection. Warm, inviting and impossible to ignore.</p>\n<p><strong>• Key notes:</strong> Mandarin, Jasmine, Musk</p>\n<p><strong>REBEL — Expression</strong></p>\n<p>Bold, intense fragrance made for unforgettable moments and presence. For those who refuse to go unnoticed.</p>\n<p><strong>• Key notes:</strong> Apple, Vanilla, Amber</p>",
    "howToUse": "<p>Spray onto pulse points — wrists, neck, behind the ears and inner elbows. The warmth of your skin activates and amplifies the fragrance throughout the day.</p>\n<p>For longer wear, layer two complementary Drift mists to create your own signature scent. Start light and build up, letting each layer settle before adding the next.</p>",
    "formulation": "<p>Drift body mists are formulated to be gentle on skin while delivering a lasting scent experience. Each mist is free from harsh irritants. If you have known fragrance sensitivities, a patch test on the inner wrist is recommended before full application.</p>"
  },
  {
    "id": "8751422177415",
    "handle": "hero-muse-rebel",
    "title": "Hero-Muse-Rebel",
    "price": "Rs.4,198",
    "compare": "Rs.5,997",
    "pct": 30,
    "images": [
      "HeroRebelMuse.png?v=1785978051"
    ],
    "description": "<p><strong>HERO — Confidence</strong></p>\n<p>Fresh woody confidence that moves with you every day. A grounded, versatile scent built for everyday wear.</p>\n<p><strong>• Key notes:</strong> Bergamot, Cedarwood, Musk</p>\n<p><strong>MUSE — Attraction</strong></p>\n<p>Sweet, magnetic scent that inspires confidence, attraction and connection. Warm, inviting and impossible to ignore.</p>\n<p><strong>• Key notes:</strong> Mandarin, Jasmine, Musk</p>\n<p><strong>REBEL — Expression</strong></p>\n<p>Bold, intense fragrance made for unforgettable moments and presence. For those who refuse to go unnoticed.</p>\n<p><strong>• Key notes:</strong> Apple, Vanilla, Amber</p>",
    "howToUse": "<p>Spray onto pulse points — wrists, neck, behind the ears and inner elbows. The warmth of your skin activates and amplifies the fragrance throughout the day.</p>\n<p>For longer wear, layer two complementary Drift mists to create your own signature scent. Start light and build up, letting each layer settle before adding the next.</p>",
    "formulation": "<p>Drift body mists are formulated to be gentle on skin while delivering a lasting scent experience. Each mist is free from harsh irritants. If you have known fragrance sensitivities, a patch test on the inner wrist is recommended before full application.</p>"
  },
  {
    "id": "8751414050951",
    "handle": "hero-ignite-muse",
    "title": "Hero-Ignite-Muse",
    "price": "Rs.4,198",
    "compare": "Rs.5,997",
    "pct": 30,
    "images": [
      "HeroIgniteMuse.png?v=1785977718"
    ],
    "description": "<p><strong>HERO — Confidence</strong></p>\n<p>Fresh woody confidence that moves with you every day. A grounded, versatile scent built for everyday wear.</p>\n<p><strong>• Key notes:</strong> Bergamot, Cedarwood, Musk</p>\n<p><strong>IGNITE — Energy</strong></p>\n<p>Energetic spicy freshness that fuels movement, passion and momentum. Made for those who lead from the front.</p>\n<p><strong>• Key notes:</strong> Citrus, Spicy, Woody</p>\n<p><strong>MUSE — Attraction</strong></p>\n<p>Sweet, magnetic scent that inspires confidence, attraction and connection. Warm, inviting and impossible to ignore.</p>\n<p><strong>• Key notes:</strong> Mandarin, Jasmine, Musk</p>",
    "howToUse": "<p>Spray onto pulse points — wrists, neck, behind the ears and inner elbows. The warmth of your skin activates and amplifies the fragrance throughout the day.</p>\n<p>For longer wear, layer two complementary Drift mists to create your own signature scent. Start light and build up, letting each layer settle before adding the next.</p>",
    "formulation": "<p>Drift body mists are formulated to be gentle on skin while delivering a lasting scent experience. Each mist is free from harsh irritants. If you have known fragrance sensitivities, a patch test on the inner wrist is recommended before full application.</p>"
  },
  {
    "id": "8618895573127",
    "handle": "rebel-expression",
    "title": "REBEL — Freedom",
    "price": "Rs.1,399",
    "compare": "Rs.1,999",
    "pct": 30,
    "images": [
      "p2_1.jpg?v=1785413436",
      "p2_2.jpg?v=1785413437",
      "p2_3.jpg?v=1785413436"
    ],
    "description": "<p>Energetic spicy freshness that fuels movement, passion and momentum. Made for those who lead from the front. </p>\n<p>• Key notes: Citrus, Spicy, Woody </p>",
    "howToUse": "<p>Spray onto pulse points — wrists, neck, behind the ears and inner elbows. The warmth of your skin activates and amplifies the fragrance throughout the day.</p>\n<p>For longer wear, layer two complementary Drift mists to create your own signature scent. Start light and build up, letting each layer settle before adding the next. </p>",
    "formulation": "<p>Drift body mists are formulated to be gentle on skin while delivering a lasting scent experience. Each mist is free from harsh irritants. If you have known fragrance sensitivities, a patch test on the inner wrist is recommended before full application.</p>"
  },
  {
    "id": "8618891903111",
    "handle": "muse-attraction",
    "title": "MUSE — Grace",
    "price": "Rs.1,399",
    "compare": "Rs.1,999",
    "pct": 30,
    "images": [
      "p4_1.jpg?v=1785413472",
      "P4_2.jpg?v=1785413472",
      "p4_3.jpg?v=1785413472"
    ],
    "description": "<p>Sweet, magnetic scent that inspires confidence, attraction and connection. Warm, inviting and impossible to ignore. </p>\n<p>• Key notes: Mandarin, Jasmine, Musk </p>",
    "howToUse": "<p>Spray onto pulse points — wrists, neck, behind the ears and inner elbows. The warmth of your skin activates and amplifies the fragrance throughout the day.</p>\n<p>For longer wear, layer two complementary Drift mists to create your own signature scent. Start light and build up, letting each layer settle before adding the next. </p>",
    "formulation": "<p>Drift body mists are formulated to be gentle on skin while delivering a lasting scent experience. Each mist is free from harsh irritants. If you have known fragrance sensitivities, a patch test on the inner wrist is recommended before full application.</p>"
  },
  {
    "id": "8618890133639",
    "handle": "ignite-energy",
    "title": "IGNITE — Momentum",
    "price": "Rs.1,399",
    "compare": "Rs.1,999",
    "pct": 30,
    "images": [
      "p3_1.jpg?v=1785413503",
      "p3_2.jpg?v=1785413503",
      "p3_3.jpg?v=1785413503"
    ],
    "description": "<p>Bold, intense fragrance made for unforgettable moments and presence. For those who refuse to go unnoticed. </p>\n<p>• Key notes: Apple, Vanilla, Amber </p>",
    "howToUse": "<p>Spray onto pulse points — wrists, neck, behind the ears and inner elbows. The warmth of your skin activates and amplifies the fragrance throughout the day.</p>\n<p>For longer wear, layer two complementary Drift mists to create your own signature scent. Start light and build up, letting each layer settle before adding the next. </p>",
    "formulation": "<p>Drift body mists are formulated to be gentle on skin while delivering a lasting scent experience. Each mist is free from harsh irritants. If you have known fragrance sensitivities, a patch test on the inner wrist is recommended before full application.</p>"
  },
  {
    "id": "8618882433159",
    "handle": "hero-confidence",
    "title": "HERO — Legacy",
    "price": "Rs.1,399",
    "compare": "Rs.1,999",
    "pct": 30,
    "images": [
      "p1_1.jpg?v=1785413541",
      "p1_2.jpg?v=1785413541",
      "p1_3.jpg?v=1785413541"
    ],
    "description": "<p>Fresh woody confidence that moves with you every day. A grounded, versatile scent built for <br>everyday wear. </p>\n<p>• Key notes: Bergamot, Cedarwood, Musk </p>",
    "howToUse": "<p>Spray onto pulse points — wrists, neck, behind the ears and inner elbows. The warmth of your skin activates and amplifies the fragrance throughout the day.</p>\n<p>For longer wear, layer two complementary Drift mists to create your own signature scent. Start light and build up, letting each layer settle before adding the next. </p>",
    "formulation": "<p>Drift body mists are formulated to be gentle on skin while delivering a lasting scent experience. Each mist is free from harsh irritants. If you have known fragrance sensitivities, a patch test on the inner wrist is recommended before full application.</p>"
  }
];
