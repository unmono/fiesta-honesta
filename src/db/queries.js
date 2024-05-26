export const newGameQuery = `
  INSERT INTO game("mode") 
  VALUES($1) 
  RETURNING id;
`

export const selectModesQuery = `
  SELECT id, title, "text"
  FROM mode;
`

export const newPlayerQuery = `
  INSERT INTO player(name, characteristics, abilities, game) 
    SELECT $1, $2, $3, game.id
    FROM game 
    WHERE game.id = $4
  RETURNING id
  LIMIT 1;
`

export const fetchOpponentsQuery = `
  SELECT po.* 
  FROM player po 
  JOIN player pi ON pi.game = po.game 
  WHERE pi.id = $1;
`

export const fetchCardByPlayerQuery = `
  SELECT card.text as text 
  FROM player 
  JOIN game ON game.id = player.game 
  JOIN card ON game.card = card.id
  WHERE 
    player.id = $1 
    AND 
    game.card IS NOT NULL
  LIMIT 1;
`

export const playerReadyQuery = `
  UPDATE player 
  SET ready = true 
  FROM game 
  WHERE 
    player.id = $1 
    AND 
    player.game = game.id 
    AND 
    game.open = false
  LIMIT 1;
`

// TODO: test execution time
// This one updates no matter what. The first one only if needed.
// export const playerReadyQuery = `
//   UPDATE player
//   SET ready = NOT game.open
//   FROM game
//   WHERE
//     player.id = $1
//     AND
//     player.game = game.id
//   LIMIT 1;
// `

export const checkPlayersReadynessQuery = `
  SELECT FROM player WHERE game = $1 AND ready = false;
`

export const unreadyPlayersQuery = `
  UPDATE player SET ready = false WHERE game = $1;
`

export const cardQuery = `
  WITH chosen_one AS (
    SELECT id, name, characteristics as ch, abilities as ab 
    FROM player 
    WHERE game = $1 
    ORDER BY RANDOM() 
    LIMIT 1
  ), candidates AS (
    SELECT id, name, characteristics as ch, abilities as ab 
    FROM player
    WHERE game = $1 AND id <> (SELECT id FROM chosen_one)
    ORDER BY RANDOM()
  ), matched_one AS (
    SELECT 
      cand.id,
      cand.name,
      cand.ch,
      cand.ab
    FROM candidates cand 
    WHERE match_players(
        (SELECT ch FROM chosen_one),
        cand.ch,
        (SELECT ab FROM chosen_one),
        cand.ab
      ) > 0
    LIMIT 1
  ), participants AS (
    SELECT 
      co.name as p1, 
      mo.name as p2,
      match_players(co.ch, mo.ch, co.ab, mo.ab) AS ab_agg, 
      ((co.ch & 12) + ((mo.ch & 12) >> 2)) AS ch_agg
    FROM chosen_one co, matched_one mo
  ) 
  SELECT text, p.p1, p.p2
  FROM card, participants p 
  WHERE 
    card.characteristics & CASE p.ch_agg WHEN 6 THEN 9 ELSE p.ch_agg END = card.characteristics 
    AND 
    card.abilities & p.ab_agg = card.abilities 
    AND card.mode = $2
  LIMIT 1;
`