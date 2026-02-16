/**
 * Curated Quran verses for the daily reflection on the homepage.
 * One verse is shown per day (date-seeded) to reduce cognitive load.
 */

export interface DailyReflectionVerse {
  text: string;
  reference: string;
}

const REFLECTION_VERSES: DailyReflectionVerse[] = [
  {
    text: "Read! In the name of your Lord who created. He created man from a clot. Read! And your Lord is the Most Generous, Who taught by the pen. He taught man that which he knew not.",
    reference: "Quran 96:1-5",
  },
  {
    text: "Do they not contemplate within themselves?",
    reference: "Quran 30:8",
  },
  {
    text: "Indeed, with hardship comes ease.",
    reference: "Quran 94:6",
  },
  {
    text: "And He is with you wherever you are.",
    reference: "Quran 57:4",
  },
  {
    text: "Verily, in the remembrance of Allah do hearts find rest.",
    reference: "Quran 13:28",
  },
  {
    text: "My Lord is near and responsive.",
    reference: "Quran 11:61",
  },
  {
    text: "Allah does not burden a soul beyond that it can bear.",
    reference: "Quran 2:286",
  },
  {
    text: "So remember Me; I will remember you.",
    reference: "Quran 2:152",
  },
  {
    text: "And whoever puts his trust in Allah, then He will suffice him.",
    reference: "Quran 65:3",
  },
  {
    text: "Indeed, Allah is with the patient.",
    reference: "Quran 2:153",
  },
  {
    text: "Say: He is Allah, the One. Allah, the Eternal. He begets not nor was He begotten. And there is none comparable to Him.",
    reference: "Quran 112:1-4",
  },
  {
    text: "And We have certainly made the Quran easy for remembrance. So is there any who will remember?",
    reference: "Quran 54:17",
  },
  {
    text: "Your Lord has not forsaken you, nor does He dislike you.",
    reference: "Quran 93:3",
  },
  {
    text: "So wherever you turn, there is the Face of Allah.",
    reference: "Quran 2:115",
  },
  {
    text: "And when My servants ask you concerning Me—indeed I am near. I respond to the call of the caller when he calls upon Me.",
    reference: "Quran 2:186",
  },
  {
    text: "He knows what is before them and what is behind them, and they cannot encompass Him in knowledge.",
    reference: "Quran 20:110",
  },
  {
    text: "And whoever does a speck of good, will see it. And whoever does a speck of evil, will see it.",
    reference: "Quran 99:7-8",
  },
  {
    text: "Indeed, the mercy of Allah is near to the doers of good.",
    reference: "Quran 7:56",
  },
  {
    text: "And say: My Lord, increase me in knowledge.",
    reference: "Quran 20:114",
  },
  {
    text: "Is not Allah sufficient for His servant?",
    reference: "Quran 39:36",
  },
  {
    text: "So remember your Lord when you forget.",
    reference: "Quran 18:24",
  },
  {
    text: "And We have not sent you except as a mercy to the worlds.",
    reference: "Quran 21:107",
  },
  {
    text: "Indeed, Allah loves those who do good.",
    reference: "Quran 2:195",
  },
  {
    text: "And whoever fears Allah—He will make for him a way out and provide for him from where he does not expect.",
    reference: "Quran 65:2-3",
  },
  {
    text: "No soul knows what it will earn tomorrow, and no soul knows in what land it will die.",
    reference: "Quran 31:34",
  },
  {
    text: "And when you have decided, then rely upon Allah. Indeed, Allah loves those who rely upon Him.",
    reference: "Quran 3:159",
  },
  {
    text: "Our Lord, do not let our hearts deviate after You have guided us.",
    reference: "Quran 3:8",
  },
  {
    text: "And whoever is mindful of Allah, He will make a way out for him and provide for him from where he does not expect.",
    reference: "Quran 65:2",
  },
  {
    text: "So be patient. Indeed, the promise of Allah is truth.",
    reference: "Quran 30:60",
  },
  {
    text: "And He found you lost and guided you.",
    reference: "Quran 93:7",
  },
];

/**
 * Returns the same verse for the whole day (local date). Changes at midnight local time.
 */
function getDaySeed(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.floor(diff / oneDay);
}

/**
 * Returns one Quran reflection verse for the current day. Same verse all day, new verse each day.
 */
export function getDailyReflectionVerse(): DailyReflectionVerse {
  const seed = getDaySeed();
  const index = Math.abs(seed) % REFLECTION_VERSES.length;
  return REFLECTION_VERSES[index];
}
