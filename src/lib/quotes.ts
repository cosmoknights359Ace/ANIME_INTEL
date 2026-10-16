export interface AnimeQuote {
  quote: string;
  japanese?: string;
  character: string;
  anime: string;
  animeId?: number;
}

export const ANIME_QUOTES: AnimeQuote[] = [
  {
    quote: "If you don't fight, you can't win. Fight. Fight!",
    japanese: "戦わなければ勝てない。戦え、戦え。",
    character: "Eren Yeager",
    anime: "Attack on Titan",
    animeId: 16498,
  },
  {
    quote: "Throughout heaven and earth, I alone am the honored one.",
    japanese: "天上天下唯我独尊。",
    character: "Satoru Gojo",
    anime: "Jujutsu Kaisen",
    animeId: 40748,
  },
  {
    quote: "Set your heart ablaze. Go beyond your limits!",
    japanese: "心を燃やせ。限界を超えろ！",
    character: "Kyojuro Rengoku",
    anime: "Demon Slayer: Kimetsu no Yaiba",
    animeId: 101922,
  },
  {
    quote: "Don't believe in the you that believes in me, and don't believe in the me that believes in you. Believe in the you that believes in yourself!",
    japanese: "お前が信じるお前を信じろ！",
    character: "Kamina",
    anime: "Tengen Toppa Gurren Lagann",
    animeId: 2001,
  },
  {
    quote: "My soldiers, rage! My soldiers, scream! My soldiers, FIGHT!",
    japanese: "我が兵士よ怒れ！我が兵士よ叫べ！我が兵士よ戦え！",
    character: "Erwin Smith",
    anime: "Attack on Titan",
    animeId: 16498,
  },
  {
    quote: "Wake up to reality. Nothing ever goes as planned in this accursed world.",
    japanese: "現実に目覚めろ。この呪われた世界では何事も思い通りにはいかない。",
    character: "Madara Uchiha",
    anime: "Naruto: Shippuden",
    animeId: 1735,
  },
  {
    quote: "No one knows what the future holds. That's why its potential is infinite.",
    japanese: "未来がどうなるかなんて誰にも分からない。だから無限の可能性があるんだ。",
    character: "Rintaro Okabe",
    anime: "Steins;Gate",
    animeId: 9253,
  },
  {
    quote: "A lesson without pain is meaningless. For you cannot gain something without sacrificing something else in return.",
    japanese: "痛みを伴わない教訓には意義がない。人は何かの犠牲なしに何も得ることはできない。",
    character: "Edward Elric",
    anime: "Fullmetal Alchemist: Brotherhood",
    animeId: 5114,
  },
  {
    quote: "The only ones who should kill are those who are prepared to be killed.",
    japanese: "撃っていいのは撃たれる覚悟のある奴だけだ。",
    character: "Lelouch vi Britannia",
    anime: "Code Geass: Lelouch of the Rebellion",
    animeId: 1575,
  },
  {
    quote: "It's not about whether I can do it or not. I'm doing it because I want to!",
    japanese: "できるかどうかじゃない。やりたいからやるんだ！",
    character: "Monkey D. Luffy",
    anime: "One Piece",
    animeId: 21,
  },
  {
    quote: "Even if I'm not the strongest, I refuse to look down on myself.",
    japanese: "たとえ一番強くなくても、自分を見下すことだけはしない。",
    character: "Frieren",
    anime: "Frieren: Beyond Journey's End",
    animeId: 154587,
  },
  {
    quote: "I want to be strong enough so no one has to die.",
    japanese: "誰も死なないように、もっと強くなりたい。",
    character: "Yuji Itadori",
    anime: "Jujutsu Kaisen",
    animeId: 40748,
  },
];

export function getRandomQuote(): AnimeQuote {
  const index = Math.floor(Math.random() * ANIME_QUOTES.length);
  return ANIME_QUOTES[index];
}
