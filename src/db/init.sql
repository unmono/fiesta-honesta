CREATE TABLE IF NOT EXISTS "mode" (
    id SERIAL PRIMARY KEY,
    title VARCHAR(31),
    "text" VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS card(
    id SERIAL PRIMARY KEY,
    "mode" INTEGER REFERENCES "mode"(id),
    characteristics SMALLINT,
    abilities INTEGER,
    "text" TEXT
);
CREATE INDEX abilities_idx ON card(abilities);

CREATE TABLE IF NOT EXISTS game(
    id SERIAL PRIMARY KEY,
    "mode" INTEGER REFERENCES "mode"(id) ON DELETE CASCADE,
    "open" BOOLEAN DEFAULT true,
    card INTEGER REFERENCES card(id) ON DELETE SET NULL DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS player(
    id SERIAL PRIMARY KEY,
    name VARCHAR(31),
    characteristics SMALLINT,
    abilities INTEGER, -- bigint?
    ready BOOLEAN DEFAULT false,
    game INTEGER REFERENCES game(id) ON DELETE CASCADE
);
CREATE INDEX game_idx ON player(game);

CREATE OR REPLACE FUNCTION match_players(c1 INTEGER, c2 INTEGER, a1 INTEGER, a2 INTEGER)
RETURNS INTEGER AS $$
BEGIN
    IF ((c1 >> 2) & c2) = 0 OR ((c2 >> 2) & c1) = 0 THEN RETURN 0;
    ELSE RETURN a1 & a2;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Test data
INSERT INTO "mode" (title, "text") VALUES
('Croud', 'Explore various lands and complete quests.'),
('Team', 'Engage in combat with other players or enemies.'),
('Other', 'Solve intricate puzzles to progress.');

INSERT INTO game ("mode", "open", card) VALUES
(1, true, NULL),
(2, true, NULL),
(3, false, NULL);

INSERT INTO player (name, characteristics, abilities, ready, game) VALUES
('Alice', 7, 123456, false, 1),
('Eve', 6, 567890, false, 1),
('Grace', 5, 789012, false, 2),
('Ivy', 6, 901234, false, 2),
('Lara', 7, 1234567, true, 3),
('Mona', 5, 1345678, false, 3),
('Pam', 7, 1678901, true, 1),
('Sara', 6, 1901234, false, 3),

('Bob', 9, 234567, true, 1),
('Carol', 10, 345678, false, 1),
('Dave', 11, 456789, true, 1),
('Frank', 9, 678901, true, 2),
('Hank', 10, 890123, true, 2),
('Jack', 11, 1012345, true, 2),
('Ken', 9, 1123456, false, 3),
('Nate', 10, 1456789, true, 3),
('Oscar', 9, 1567890, false, 3),
('Quinn', 10, 1789012, false, 1),
('Ray', 9, 1890123, true, 2),
('Tom', 10, 2012345, true, 3);

INSERT INTO card ("mode", characteristics, abilities, "text") VALUES
(1, 5, 1, 'Card 1 Text'),
(1, 5, 2, 'Card 2 Text'),
(1, 5, 4, 'Card 3 Text'),
(1, 5, 8, 'Card 4 Text'),
(1, 5, 16, 'Card 5 Text'),
(1, 9, 32, 'Card 6 Text'),
(1, 9, 64, 'Card 7 Text'),
(1, 9, 128, 'Card 8 Text'),
(1, 9, 256, 'Card 9 Text'),
(1, 9, 512, 'Card 10 Text'),
(1, 10, 1024, 'Card 11 Text'),
(1, 10, 2048, 'Card 12 Text'),
(1, 10, 4096, 'Card 13 Text'),
(1, 10, 8192, 'Card 14 Text'),
(1, 10, 16384, 'Card 15 Text'),
(2, 5, 32768, 'Card 16 Text'),
(2, 5, 65536, 'Card 17 Text'),
(2, 5, 131072, 'Card 18 Text'),
(2, 5, 262144, 'Card 19 Text'),
(2, 5, 524288, 'Card 20 Text'),
(2, 5, 1048576, 'Card 21 Text'),
(2, 9, 2097152, 'Card 22 Text'),
(2, 9, 4194304, 'Card 23 Text'),
(2, 9, 8388608, 'Card 24 Text'),
(2, 9, 16777216, 'Card 25 Text'),
(2, 9, 33554432, 'Card 26 Text'),
(2, 10, 67108864, 'Card 27 Text'),
(2, 10, 134217728, 'Card 28 Text'),
(2, 10, 268435456, 'Card 29 Text'),
(2, 10, 536870912, 'Card 30 Text'),
(2, 10, 1073741824, 'Card 31 Text'),
(3, 10, 1, 'Card 32 Text'),
(3, 10, 2, 'Card 33 Text'),
(3, 10, 4, 'Card 34 Text'),
(3, 10, 8, 'Card 35 Text'),
(3, 10, 16, 'Card 36 Text'),
(3, 5, 32, 'Card 37 Text'),
(3, 5, 64, 'Card 38 Text'),
(3, 5, 128, 'Card 39 Text'),
(3, 5, 256, 'Card 40 Text'),
(3, 5, 512, 'Card 41 Text'),
(3, 5, 1024, 'Card 42 Text'),
(3, 9, 2048, 'Card 43 Text'),
(3, 9, 4096, 'Card 44 Text'),
(3, 9, 8192, 'Card 45 Text'),
(3, 9, 16384, 'Card 46 Text'),
(3, 9, 32768, 'Card 47 Text'),
(3, 9, 65536, 'Card 48 Text'),
(3, 9, 131072, 'Card 49 Text'),
(3, 9, 262144, 'Card 50 Text');