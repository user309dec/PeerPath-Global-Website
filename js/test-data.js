/* ==========================================================================
   PeerPath Global — TOEFL Reading Placement Test (Version 1)
   Two academic passages with single- and multiple-answer questions.
   All passages are original content written for diagnostic use.
   ========================================================================== */
window.PLACEMENT_TEST = {
  version: "TOEFL Reading Placement Test · v1",
  durationMinutes: 30,
  passages: [
    {
      id: "p1",
      title: "The Domestication of Plants",
      meta: "Anthropology · Academic reading",
      paragraphs: [
        "Roughly twelve thousand years ago, human communities in several parts of the world began a transformation that would reshape almost every aspect of their lives. Instead of relying solely on gathering wild plants and hunting animals, people started to cultivate certain species deliberately, selecting and replanting the seeds of the plants that best served their needs. This gradual process, known as domestication, did not happen overnight. It unfolded over many generations as people noticed which plants grew well near their settlements and which produced larger or more reliable harvests.",
        "Domestication produced visible changes in the plants themselves. Wild cereals, for example, typically scatter their seeds as soon as they ripen, an adaptation that helps the species spread across a landscape. For human harvesters, however, this trait was inconvenient, because seeds that fell to the ground before harvest were difficult to collect. Over time, farmers unintentionally favored rare individual plants whose seeds remained attached to the stalk. By repeatedly harvesting and replanting these plants, early farmers gradually produced varieties that retained their seeds—a quality that was useful to people but would have been a disadvantage in the wild.",
        "The shift toward agriculture had consequences that reached far beyond the fields. Because cultivated plants could support larger populations in a smaller area, communities that adopted farming tended to grow and to settle permanently in one place. Permanent settlement, in turn, allowed people to accumulate possessions, build durable houses, and store surplus food. Yet these benefits came with new difficulties. Dependence on a small number of crops left communities vulnerable to crop failure, and the close quarters of settled life encouraged the spread of certain diseases.",
        "Scholars continue to debate why domestication began when it did. Some emphasize climate change at the end of the last ice age, which may have made wild food sources less predictable and pushed people to experiment with cultivation. Others point to population pressure, arguing that growing communities needed more reliable food supplies. Still others suggest that domestication was less a deliberate strategy than an accidental outcome of behaviors people had practiced for thousands of years. Most likely, no single explanation accounts for every case, since agriculture arose independently in regions as different as the Middle East, China, and Central America."
      ],
      questions: [
        {
          id: "p1q1", type: "single", skill: "Vocabulary",
          prompt: "The word \"deliberately\" in paragraph 1 is closest in meaning to",
          options: ["accidentally", "intentionally", "rapidly", "secretly"],
          answer: 1, points: 1
        },
        {
          id: "p1q2", type: "single", skill: "Detail",
          prompt: "According to paragraph 2, why was the seed-scattering trait of wild cereals a problem for early harvesters?",
          options: [
            "It caused the plants to grow too slowly to be useful.",
            "It made the seeds taste bitter and difficult to eat.",
            "It caused seeds to fall to the ground before they could be collected.",
            "It prevented the plants from growing near human settlements."
          ],
          answer: 2, points: 1
        },
        {
          id: "p1q3", type: "single", skill: "Inference",
          prompt: "It can be inferred from paragraph 2 that the trait of retaining seeds on the stalk",
          options: [
            "made domesticated plants more likely to survive in the wild.",
            "was common among wild cereals before domestication.",
            "would not have helped the plants reproduce without human help.",
            "appeared only after farmers began using metal tools."
          ],
          answer: 2, points: 1
        },
        {
          id: "p1q4", type: "single", skill: "Detail",
          prompt: "According to paragraph 3, all of the following resulted from the shift to agriculture EXCEPT",
          options: [
            "communities grew larger and settled permanently.",
            "people were able to store surplus food.",
            "communities became more vulnerable to crop failure.",
            "people abandoned the practice of gathering wild plants entirely."
          ],
          answer: 3, points: 1
        },
        {
          id: "p1q5", type: "single", skill: "Vocabulary",
          prompt: "The word \"vulnerable\" in paragraph 3 is closest in meaning to",
          options: ["resistant", "exposed to harm", "indifferent", "accustomed"],
          answer: 1, points: 1
        },
        {
          id: "p1q6", type: "multi", skill: "Main Idea",
          prompt: "An introductory sentence for a brief summary of the passage is provided below. Choose the TWO answer choices that express the most important ideas in the passage.",
          hint: "Select 2 answers. Domestication was a gradual process that changed both plants and human societies.",
          options: [
            "Through repeated selection and replanting, early farmers changed the physical traits of the plants they cultivated.",
            "The adoption of agriculture allowed permanent settlement but also introduced new risks such as crop failure and disease.",
            "Wild cereals scatter their seeds in order to spread across a landscape.",
            "Agriculture appeared at exactly the same time in every region of the world.",
            "Most archaeologists now agree on a single cause for the beginning of domestication."
          ],
          answers: [0, 1], points: 2
        }
      ]
    },
    {
      id: "p2",
      title: "Light in the Deep Ocean",
      meta: "Marine biology · Academic reading",
      paragraphs: [
        "Below a depth of about one thousand meters, the ocean enters a region of permanent darkness. Sunlight cannot penetrate so far, and the water remains cold and still. Yet this environment is far from lifeless. Many of the animals that live here produce their own light through a chemical process called bioluminescence. By some estimates, the majority of organisms in the deep sea are capable of generating light, making bioluminescence one of the most common forms of communication in this hidden world.",
        "Bioluminescence is produced when a light-emitting molecule reacts with oxygen in the presence of an enzyme. The reaction releases energy as light rather than as heat, which is why the glow is sometimes described as \"cold light.\" Different species emit light of different colors, although blue and green are the most common in the open ocean. These colors travel farther through seawater than red or yellow light, so they are especially useful for signaling across distance.",
        "The functions of bioluminescence are remarkably varied. Some fish use light to attract prey, dangling a glowing lure in front of their mouths to draw smaller animals close. Others use it for defense: when threatened, certain squid release a cloud of luminous fluid that confuses a predator, much as an octopus uses ink in shallower water. Still other species use patterns of light to recognize members of their own kind or to attract mates in the darkness, where visual signals would otherwise be impossible.",
        "Studying these animals presents serious challenges. The deep ocean is difficult and expensive to reach, and many bioluminescent organisms are fragile, losing their ability to glow when they are brought to the surface. As a result, much of what scientists know comes from observations made by remotely operated vehicles equipped with sensitive cameras. Even so, researchers suspect that countless species remain undiscovered, and that the deep sea still holds many secrets about how life adapts to a world without sunlight."
      ],
      questions: [
        {
          id: "p2q1", type: "single", skill: "Detail",
          prompt: "According to paragraph 1, the deep ocean below one thousand meters is characterized by",
          options: [
            "warm water and abundant sunlight.",
            "permanent darkness and cold, still water.",
            "strong currents and seasonal light.",
            "a complete absence of living organisms."
          ],
          answer: 1, points: 1
        },
        {
          id: "p2q2", type: "single", skill: "Vocabulary",
          prompt: "The word \"penetrate\" in paragraph 1 is closest in meaning to",
          options: ["pass through", "reflect off", "warm up", "disappear"],
          answer: 0, points: 1
        },
        {
          id: "p2q3", type: "single", skill: "Detail",
          prompt: "According to paragraph 2, why is bioluminescence sometimes called \"cold light\"?",
          options: [
            "It is only produced in cold water.",
            "It releases energy as light rather than as heat.",
            "It appears mainly in blue and green colors.",
            "It can only be seen by deep-sea animals."
          ],
          answer: 1, points: 1
        },
        {
          id: "p2q4", type: "single", skill: "Inference",
          prompt: "It can be inferred from paragraph 2 that red light is",
          options: [
            "more common than blue light in the deep ocean.",
            "less able to travel long distances through seawater than blue light.",
            "the only color produced by bioluminescent animals.",
            "easier for predators to detect than green light."
          ],
          answer: 1, points: 1
        },
        {
          id: "p2q5", type: "single", skill: "Detail",
          prompt: "In paragraph 3, the author mentions an octopus's ink in order to",
          options: [
            "explain how octopuses produce bioluminescence.",
            "compare a deep-sea defense to a more familiar one.",
            "argue that squid and octopuses are closely related.",
            "describe how predators hunt in shallow water."
          ],
          answer: 1, points: 1
        },
        {
          id: "p2q6", type: "single", skill: "Detail",
          prompt: "According to paragraph 4, one reason the deep ocean is hard to study is that",
          options: [
            "bioluminescent animals are too large to capture.",
            "remotely operated vehicles cannot reach such depths.",
            "many organisms stop glowing when brought to the surface.",
            "scientists have already discovered nearly all deep-sea species."
          ],
          answer: 2, points: 1
        },
        {
          id: "p2q7", type: "multi", skill: "Main Idea",
          prompt: "Choose the TWO answer choices that best summarize the uses of bioluminescence described in paragraph 3.",
          hint: "Select 2 answers.",
          options: [
            "Attracting prey by using a glowing lure.",
            "Defending against predators, for example by releasing luminous fluid.",
            "Producing heat to survive in cold water.",
            "Increasing the speed at which an animal can swim.",
            "Breaking down food more efficiently in the dark."
          ],
          answers: [0, 1], points: 2
        }
      ]
    }
  ]
};
