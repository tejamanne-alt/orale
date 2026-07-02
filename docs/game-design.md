# Together — Game Design Document (Working Title)

**A private, invite-only, time-boxed relationship game for friends and families.**

> One 10-minute ritual a day. No leaderboards. No losers. The only win condition is people talking to each other again.

---

## 1. Vision & Core Principles

**The problem:** Dormant relationships don't die from conflict — friendships die from distance ("we haven't talked since 2019") and family bonds thin from shallowness (frequent contact, surface conversations). The game's job is to _manufacture reasons to talk_.

**The one-line pitch:** _The game that gets the old gang — and the family — back together._

### Non-negotiable design principles

1. **Invite-only, private groups.** A user creates a group and invites friends/family. Only accepted members can play. No public matchmaking, no strangers, ever.
2. **Time-boxed by design, not by timers.** Each day offers exactly one "chest" of content (~10 minutes). When it's done, there is _nothing left to grind_. Screen-time limits are enforced by the game running out of game — never by a scolding timer.
3. **Ego-safe by construction.** No leaderboards, no rankings, no eliminations. Wrong answers produce comedy, not embarrassment. Failure is always _information_, never _blame_. Content flows through positive-only prompts so hurt feelings are structurally impossible rather than moderated after the fact.
4. **Cooperative progression only.** All rewards are collective (group milestones, shared puzzle, group world). Individuals contribute; the _group_ wins.
5. **The real win happens outside the app.** Success = calls, voice notes, memories retold, and reunions that the game triggered. A session ending with someone phoning an old friend is the highest possible score.
6. **Nostalgia is the ignition, current-life discovery is the engine, reunion is the destination.**

### One engine, three group presets

Friends, families, and mixed groups run on the **same mechanics** with different **content decks and pacing**:

| Preset      | Prompt tone                           | Nostalgia depth                 | Special features                              |
| ----------- | ------------------------------------- | ------------------------------- | --------------------------------------------- |
| **Friends** | Spicy, absurd, inside-joke driven     | Deep (college/school era)       | Reunion Meter endgame                         |
| **Family**  | Universal, cross-generational         | Generational (elders hold keys) | Family Archive recordings, Operation Surprise |
| **Mixed**   | Safe-universal auto-tuned to age span | Event-based (weddings, trips)   | Bridge Builder pair-quests                    |

---

## 2. The Core Loop

```
Open app → Treasure Map → Today's Chest (one per day)
   → Play today's mini-game (Roulette / Bubble Blast / Photo Scrub / story turn / colossus strike)
   → Earn puzzle piece(s)
   → Place piece in the group's shared Puzzle World
   → See yesterday's reveals (who guessed what, who appreciated whom)
   → Done. (~10 minutes. Nothing more to do until tomorrow.)
```

- **Daily layer:** the chest + rotating mini-games.
- **Weekly layer:** The Unfolding (story chain) runs as a background thread; The Colossus is the weekly boss the daily chests build toward.
- **Monthly layer:** the shared Puzzle completes; freed colossi accumulate as guardians; the group's world and gallery grow.

---

## 3. The Container: Treasure Hunt / Daily Ritual

**Theme:** The entire app is framed as a treasure map — the group's shared journey.

### How it works

- Each day, **one chest** appears on the map path. Opening it reveals today's activity.
- The map visualizes a **30-day journey** per season; the path winds through themed regions (Memory Marsh, Nostalgia Peaks, etc.).
- Chests occasionally drop **rare relics**: an old memory someone vaulted, a surprise voice note, a bonus challenge, or a golden puzzle piece.
- A suggested weekly rotation (configurable per group):

| Day | Chest contents                          |
| --- | --------------------------------------- |
| Mon | Appreciation Roulette                   |
| Tue | Bubble Blast (Parallel Lives)           |
| Wed | Photo Scrub                             |
| Thu | Appreciation Roulette or story catch-up |
| Fri | Bubble Blast                            |
| Sat | **Colossus strike day**                 |
| Sun | **Colossus finale + week recap reel**   |

### Why it works

- The chest **is** the time-box: one chest, ~10 minutes, done.
- A fixed daily window (e.g., evening reveal) turns it into a ritual — the digital equivalent of the family gathering after dinner.
- Scarcity creates anticipation (Wordle psychology) instead of addiction.

---

## 4. Mini-Game 1: Appreciation Roulette 🎡

**Emotional job:** make expressing affection effortless and awkwardness-free.

### Mechanic

1. Your session opens with a **physical spin**: an outer wheel carrying every member's face. Satisfying tick-tick-tick; wherever it lands, that's your person today.
2. A second **inner ring** spins for mission type:
   - **Compliment** — send a genuine (optionally anonymous) compliment
   - **Memory** — recall and write one shared memory with them
   - **Question** — answer a question about them ("What's Amma's hidden talent?")
   - **Song** — send the song that reminds you of them, no explanation allowed
3. Missions complete privately during the day; **reveals happen together at day's end** (anonymous compliments can batch-reveal weekly for extra drama).

### Design details

- "The wheel chose you" removes all social awkwardness — nobody is _targeting_ anyone with affection; fate did it.
- The wheel is rigged benevolently: it quietly rotates so every member both gives and receives evenly over a cycle, and it biases toward **pairs who interact least** (see Bridge Builder, §10).
- No streaks, no penalties for missing a day. The wheel simply waits.

---

## 5. Mini-Game 2: Bubble Blast → Parallel Lives 🫧

**Emotional job:** rebuild _current_ knowledge of each other through comedy. After years apart, friends have outdated models of each other — wrong guesses become the fun: "YOU do yoga now?!"

### Mechanic

1. Everyone answers one daily question about their **current life**, anonymously ("What's the most-used app on your phone?", "What food could you eat forever?").
2. Answers float on screen as **sealed bubbles**.
3. Tap a bubble to **pop** it — the answer spills out — then **drag it onto the member** you think said it.
4. **Correct:** bubble bursts into confetti with their face. **Wrong:** it wobbles, giggles, and floats back up for the next guess.
5. End of round: full reveal with everyone's guesses shown — the wrongest guesses get affectionate spotlight ("Ravi thought Thatha said 'streamer'").

### Design details

- Popping is inherently relaxing (bubble-wrap psychology) — this is your ASMR-adjacent, low-effort day.
- The wrong-guess animation makes mistakes _funny instead of embarrassing_ — the ego-safety requirement is built into the physics, not the rules.
- Prompt decks auto-tune to the group preset: spicier for friend groups, universal for mixed families.
- Members can submit their own questions to the group deck ("House Rules" flavor).

---

## 6. Mini-Game 3: Photo Scrub 🖼️

**Emotional job:** resurface the group's real past, together, with shared labor.

### Mechanic

1. A member uploads an old photo to the vault (or the game pulls from previously vaulted ones). It appears **blurred/frosted**.
2. Members **scrub it clean with their finger** — but each member can only clear a **limited area per day** (e.g., 15% of the image).
3. The photo fully reveals only after **several members across several days** have rubbed at it — shared labor forces the group to return together.
4. As it clears, everyone guesses in the thread: _whose photo? what year? what's happening?_
5. Once revealed, the **uploader confirms the true story** — often triggering the disputed-memory arguments that are the actual bonding content.

### Design details

- The scrubbing motion is pure tactile relaxation — deliberately the most soothing mini-game in the set.
- Optional **Fossil Record mode:** the group reconstructs a timeline of the friendship/family from revealed photos, voting on disputed memories with dramatic reveals.
- Revealed photos + their confirmed stories accumulate into the group's **permanent archive/gallery** — for families this becomes a genuine heirloom.

---

## 7. Meta-Progression: Cooperative Puzzle World 🧩

**Emotional job:** make every small daily act visibly build something shared and permanent.

### Mechanic

1. Every completed activity anywhere in the app — a spin finished, a bubble matched, a photo scrubbed, a story line added — **mints one puzzle piece** into the group's shared board.
2. **Placing your piece is your daily closing ritual** — a satisfying snap that ends the session.
3. The emerging picture is the group's **own world**: a commissioned illustration of "your gang," or — the killer version — **a mosaic generated from the group's own uploaded photos**, so completing the month literally assembles a portrait of your people.
4. Month's end: the puzzle completes, gets **framed in the group's gallery**, and a new puzzle begins.
5. **Colossus victories mint golden pieces** (special positions or border pieces), so the boss fight feeds the same progression.

### Design details

- Nobody can play "badly" — every contribution visibly adds; missing a day never subtracts.
- The gallery of finished puzzles becomes the group's **visual history** — month by month, season by season.
- Collective milestones replace leaderboards: "Our group completed 30 days together." "Our third puzzle framed."

---

## 8. Weekly Thread: The Unfolding (Picture Story Chain) 📖

**Emotional job:** true interdependence — the story literally cannot advance unless everyone shows up.

### Mechanic

1. A mysterious illustrated scene appears — **only one panel** of it.
2. The first member (turn order set weekly) looks at the panel and adds **one line of story**.
3. Their line **generates/reveals the next panel**, which unlocks only for the next member once the previous turn is done.
4. A stalled panel shows _"waiting for Ravi…"_ with a gentle, comedic nudge button — social pressure as comedy, never guilt.
5. **End of week:** the full illustrated storybook plays back as an **animated reel**, every line credited, saved to the gallery.

### Two flavor decks

- **Absurd mode (friends):** chaotic prompts — "a buffalo has entered the wedding" — pure comedy fuel.
- **Memory mode (families):** the opening panel is a **real old photo from the group's vault**, and the "story" becomes everyone reconstructing what actually happened that day, panel by panel. _This is collaborative memoir disguised as a game — quietly the best family feature in the app._

### Design details

- Runs as a **background thread all week** in parallel with daily chests — your turn arrives whenever the chain reaches you.
- Turn skips are graceful: after 48h, the chain can route around a member (their panel stays openable later) so one busy person never kills the story.

---

## 9. Weekly Boss: The Colossus ⚔️ _(crown jewel)_

**Emotional job:** engineer real coordination conversations between people who haven't talked in years — disguised as monster tactics. Shadow of the Colossus, made asynchronous, cooperative, and kind.

### Mechanic

1. A **weekly colossus rises on the map** — a beautifully weird creature with visible **glowing weak spots** (one per member; a 5-member group faces a 5-spot colossus).
2. Each member receives a **unique weapon for the week** — hammer, bow, harp, lantern, blade. No duplicates. **Your weapon only works on your matching weak spot.**
3. **The weak spots must be struck in a hidden sequence.** The colossus gives subtle tells — the "next" spot pulses faintly.
4. **Strike out of order:** the colossus shrugs it off with a comical animation. No damage taken, no punishment — but the group now _knows_ that spot isn't next. **Failure is information, never blame.**
5. Each member gets **one strike per day** — the time-box, weaponized. A 5-spot colossus takes a minimum of 5 coordinated days: a perfectly paced weekly arc.
6. **The coordination chat IS the game:** "I think lantern goes first — the eye is glowing." "I struck, nothing. Try the harp on the knee." The group must talk to win.
7. **Weapon charging:** daily mini-games during the week earn charge for your weapon — the whole week funnels into the weekend strikes.
8. **Weak-spot keys (relationship twist):** each spot can require a micro-answer about _the member holding that weapon_ — answer something about Priya to charge Priya's spot. Even the boss fight feeds relationship knowledge back into the loop.

### Victory — the positive-only twist

The colossus is never killed. It is **befriended / freed**: it kneels, the corruption lifts, and it joins the group's world as a **guardian**, permanently visible on the map. Colossi can be themed on the group itself — _The Procrastination Beast_, _The Great Wedding Chaos_, _The Distance Dragon_ — so each victory is an inside joke made monument.

### Rewards

- Golden puzzle pieces for the shared board.
- A new guardian in the world (monthly gallery of freed colossi).
- A victory reel of the group's chaotic coordination chat highlights.

---

## 10. Connective Tissue Features

### Bridge Builder (smart pairing)

The game quietly tracks which two members interact least — the uncle and the teenage niece — and feeds them **two-person micro-quests**: "You two must jointly answer this week's question; coordinate however you want." It engineers one-on-one relationships between exactly the people who'd otherwise never talk directly. The Appreciation Roulette wheel is also biased toward low-interaction pairs.

### Ghost Mode (engineered serendipity)

Each week, the game whispers one prompt to **one member only**: "Send Ravi that song you two overplayed in 2016. Don't explain, just send it." Tiny asymmetric acts of nostalgia that feel spontaneous to the receiver. The lightest-touch retention mechanic in the app.

### The Vault / Family Archive

- At group creation, the game **interviews each member privately**: inside jokes, legendary incidents, nicknames, that one trip. Answers seed the vault.
- Vault content powers Photo Scrub, Memory-mode Unfolding, Roulette memory missions, and rare chest relics.
- **Family Archive missions:** "This unlocks only when someone under 25 records Thatha telling the story of how he came to this city." Kids become interviewers; elders become the content; the byproduct is a **permanent recorded family archive** — an heirloom, and a serious emotional moat.

### Operation Surprise (families)

The endgame arc for family groups: the game secretly conspires with everyone-except-one-member — e.g., each records one memory of Amma before her birthday — then compiles the reveal. Rotating targets ensure everyone eventually receives one.

### Reunion Meter (friends)

The endgame arc for friend groups: a collective meter that fills through play and real-world micro-missions ("get one voice note from the group's most unreachable member"), with secret roles (The Planner, The Excuse-Destroyer, The Nostalgia Officer) — the game openly conspiring with the group against their own busyness, toward a **real-world meetup**.

---

## 11. Weekly & Monthly Cadence (full picture)

```
DAILY    ─ 1 chest → 1 mini-game (~10 min) → puzzle piece → done
WEEKLY   ─ The Unfolding chain (background, turn-based)
         ─ The Colossus (charge Mon–Fri, strike Sat–Sun)
         ─ Ghost Mode whisper (1 member)
MONTHLY  ─ Puzzle completes → framed in gallery
         ─ Guardian added to world
         ─ Season recap reel (auto-generated highlights)
LONG ARC ─ Reunion Meter (friends) / Operation Surprise (families)
         ─ Family Archive grows permanently
```

---

## 12. MVP Cut Lines

### v1.0 — the core ritual (ship this first)

- Groups, invites, accept-to-join
- Treasure map + daily chest (time-box container)
- **Appreciation Roulette** (simplest, highest emotional payoff)
- **Bubble Blast / Parallel Lives** (deck of ~60 universal prompts + friend/family variants)
- **Shared Puzzle board** (the meta-glue; static illustration puzzles first, photo-mosaic later)
- End-of-day reveal screen
- Basic group chat / reaction layer

### v1.1 — the retention bomb

- **The Colossus** (weekly boss + weapon charging + hidden sequence engine)
- **Photo Scrub** + the Vault (photo uploads, limited-area scrub, guess thread)

### v1.2 — depth

- **The Unfolding** (async turn engine + panel generation + weekly reel)
- Ghost Mode + Bridge Builder pairing logic
- Photo-mosaic puzzles from group uploads

### v2 — the long arcs

- Family Archive recording missions
- Operation Surprise / Reunion Meter
- Season recaps, guardian gallery, custom colossus theming

### Shared infrastructure to design early (powers everything)

- **Async turn engine** (drives Unfolding, colossus strikes, scrub-area limits)
- **Prompt-deck system** with group-type presets and member-submitted questions
- **Reveal scheduler** (batched end-of-day / weekly reveals)
- **Vault** (media + memory storage, permissioned per group)

---

## 13. Why This Wins (positioning summary)

- **Category of one:** not social media (no feed, no strangers), not a party game (async, daily), not a chat app (structured play). It's a _relationship engine_.
- **Anti-addiction as a feature:** "10 minutes a day, then it sends you back to your life" is a marketable promise parents and burned-out adults actually want.
- **Every mechanic doubles as content:** scrubbed photos, story reels, colossus victories, and completed photo-mosaics are inherently shareable — the group's own memories are the marketing.
- **The heirloom moat:** the Family Archive and gallery mean the longer a group plays, the more irreplaceable the app becomes — retention through accumulated meaning, not streaks and FOMO.
