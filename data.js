/* Mr. Crab's blog — posts data
 * Bilingual fixtures. CN primary, EN supporting.
 * Each post: id, slug, date (ISO), titleCn, titleEn, dek (lede CN), dekEn,
 *   tag, readMin, hero (optional picsum url), bodyCn, bodyEn.
 * Body is paragraphs separated by \n\n. The reading view renders CN first, then EN.
 */
const POSTS = [
  {
    id: 'p09',
    slug: 'morning-of-a-crab',
    date: '2026-05-18',
    tag: 'notes',
    readMin: 4,
    titleCn: '一只螃蟹的早晨',
    titleEn: "A crab's morning",
    dekCn: '关于慢慢醒来这件小事。',
    dekEn: 'On the small act of waking up slowly.',
    hero: 'https://picsum.photos/id/1067/1600/900',
    bodyCn: `早上六点半，窗外的光是灰蓝色的，像没有泡开的茶。\n\n我没有立刻起床。被子下面的那块温度，是属于一个人的；起来之后，世界就开始要回它的部分了。\n\n后来我坐在桌前，看一只苍蝇在玻璃上走了三十秒——这件事不重要，但我觉得它值得被记住。`,
    bodyEn: `At six-thirty the light outside is a grey-blue, the colour of tea that hasn't yet steeped.\n\nI don't get up right away. The patch of warmth under the blanket belongs to one person; once I stand, the world begins to take its part back.\n\nLater I sit at the desk and watch a fly walk along the window for thirty seconds — it isn't important, but I think it's worth remembering.`
  },
  {
    id: 'p08',
    slug: 'seaweed-week',
    date: '2026-05-11',
    tag: 'cooking',
    readMin: 7,
    titleCn: '只吃海带的一周',
    titleEn: 'A week of only seaweed',
    dekCn: '不是为了减肥，是为了看清楚一种味道。',
    dekEn: "Not for weight. To see a single flavour clearly.",
    hero: 'https://picsum.photos/id/164/1600/900',
    bodyCn: `七天，三餐，只用海带做底。第一天觉得寡淡，第三天发现里面有甜，第七天我能尝出晒得过头的那一批和刚收的那一批，差在哪里。\n\n吃得少，反而比吃得多记得清。`,
    bodyEn: `Seven days, three meals a day, only kelp at the base. Day one tasted thin. By day three there was sweetness inside it. By day seven I could tell the over-dried batch from the freshly hauled one.\n\nEating less, somehow, I remember more.`
  },
  {
    id: 'p07',
    slug: 'balcony-rain',
    date: '2026-05-04',
    tag: 'notes',
    readMin: 3,
    titleCn: '阳台上的下雨天',
    titleEn: 'A rainy day on the balcony',
    dekCn: '雨没下到屋里来，但下进了一下午。',
    dekEn: 'The rain stayed outside. The afternoon, less so.',
    hero: 'https://picsum.photos/id/106/1600/900',
    bodyCn: `搬了张椅子到阳台门口。腿伸出去会淋到，缩回来就还在屋里。我在两者之间坐了整整一下午。\n\n茶续了三次。书翻开了两页就再没动过。`,
    bodyEn: `I dragged a chair to the balcony door. Legs out, they got wet; legs in, I was still inside. I sat between the two for the whole afternoon.\n\nThe tea got refilled three times. The book opened to a page and didn't move from it.`
  },
  {
    id: 'p06',
    slug: 'steeping-tea-unhurried',
    date: '2026-04-27',
    tag: 'tea',
    readMin: 5,
    titleCn: '不慌不忙地泡一杯茶',
    titleEn: 'Steeping tea, unhurried',
    dekCn: '九十度的水，第一泡只算唤醒。',
    dekEn: 'Ninety degrees. The first pour only wakes it.',
    hero: 'https://picsum.photos/id/433/1600/900',
    bodyCn: `水开之后让它在壶里站一分钟。茶不喜欢被烫。\n\n第一泡倒掉，不可惜。第二泡才是茶。`,
    bodyEn: `After the kettle boils, let the water stand a minute. Tea doesn't like to be scalded.\n\nPour the first steep away. The second steep is the tea.`
  },
  {
    id: 'p05',
    slug: 'desk-tidy',
    date: '2026-04-20',
    tag: 'notes',
    readMin: 4,
    titleCn: '书桌上的小整理',
    titleEn: 'A small tidy of the desk',
    dekCn: '没有扔东西，只是换了换位置。',
    dekEn: 'Nothing thrown away. Only moved.',
    hero: null,
    bodyCn: `把笔筒挪到右边，台灯往后退了五厘米。这样写字的时候，光不会落在手背的阴影里。\n\n这种小事说出来很傻，但做完之后会一整天心情都好。`,
    bodyEn: `Moved the pen cup to the right. The lamp went back five centimetres. Now the light no longer falls into the shadow my hand makes.\n\nIt sounds silly written down, but the whole day after feels good.`
  },
  {
    id: 'p04',
    slug: 'how-i-edit',
    date: '2026-04-13',
    tag: 'craft',
    readMin: 8,
    titleCn: '我是怎么剪片的',
    titleEn: 'How I edit a video',
    dekCn: '一段六分钟的视频，背后是三天的安静。',
    dekEn: 'Six minutes on screen, three quiet days behind it.',
    hero: 'https://picsum.photos/id/225/1600/900',
    bodyCn: `先把所有素材按时间顺序铺开。不剪，只看。第二天再开始动剪刀。\n\n大部分时间在删。最后留下来的镜头，是那些"没什么发生"的镜头。`,
    bodyEn: `First I lay all the footage end to end in time order. No cuts — only looking. The next day I start trimming.\n\nMost of the work is deletion. What survives is the footage where nothing seems to happen.`
  },
  {
    id: 'p03',
    slug: 'things-by-the-sea',
    date: '2026-04-06',
    tag: 'walks',
    readMin: 5,
    titleCn: '海边捡到的东西',
    titleEn: 'Things found by the sea',
    dekCn: '一块磨平的玻璃，两枚贝壳，一段木头。',
    dekEn: 'A piece of polished glass, two shells, a piece of wood.',
    hero: 'https://picsum.photos/id/1059/1600/900',
    bodyCn: `海会把所有锋利的东西磨圆。我口袋里的玻璃，本来是一只啤酒瓶。\n\n带回家放在书架上，不知道做什么用——但每次看见，都会想起那天的风。`,
    bodyEn: `The sea rounds anything sharp. The piece of glass in my pocket used to be a beer bottle.\n\nI brought it home and put it on a shelf. I don't know what for — but every time I see it, I remember the wind that day.`
  },
  {
    id: 'p02',
    slug: 'on-not-posting',
    date: '2026-03-30',
    tag: 'craft',
    readMin: 3,
    titleCn: '关于不发新视频的两周',
    titleEn: 'On the two weeks of not posting',
    dekCn: '不是因为没素材，是因为还没想清楚。',
    dekEn: "Not for lack of footage. For lack of a clear thought.",
    hero: null,
    bodyCn: `更新这件事，应该是想说话的时候说话。没有什么要讲，硬讲也只是噪音。\n\n谢谢还在的人。下一集，等它自己来。`,
    bodyEn: `Posting should be the act of speaking when you have something to say. Without that, what comes out is only noise.\n\nThanks to anyone still here. The next one will come when it comes.`
  },
  {
    id: 'p01',
    slug: 'hello-this-is-the-blog',
    date: '2026-03-23',
    tag: 'notes',
    readMin: 2,
    titleCn: '你好，这是博客',
    titleEn: 'Hello, this is the blog',
    dekCn: '视频之外，多一个慢一点的地方。',
    dekEn: 'Beyond the videos, a slower place.',
    hero: 'https://picsum.photos/id/26/1600/900',
    bodyCn: `视频做完之后，常常还有一些话没说完。这里就是放那些话的地方。\n\n不定期，不长，不催。`,
    bodyEn: `After a video is finished, there are often a few words left over. This is where I put them.\n\nIrregular. Short. Without rush.`
  }
];

const TAGS = [
  { id: 'all',     cn: '全部',   en: 'All' },
  { id: 'notes',   cn: '随笔',   en: 'Notes' },
  { id: 'tea',     cn: '茶',     en: 'Tea' },
  { id: 'cooking', cn: '做饭',   en: 'Cooking' },
  { id: 'walks',   cn: '散步',   en: 'Walks' },
  { id: 'craft',   cn: '手艺',   en: 'Craft' },
];

window.POSTS = POSTS;
window.TAGS = TAGS;
