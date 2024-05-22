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
    open BOOLEAN DEFAULT true,
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


INSERT INTO "mode" (title, "text")
VALUES
    ('crowd', 'Everyone for himself'),
    ('team', 'Team game')
;