CREATE TABLE IF NOT EXISTS "mode" (
    id SERIAL PRIMARY KEY,
    title VARCHAR(31),
    "text" VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS game(
    id SERIAL PRIMARY KEY,
    "mode" INTEGER REFERENCES "mode"(id) DEFAULT 1,
    open BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS player(
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid(),
    "state" SMALLINT,
    prefs INTEGER, -- bigint?
    ready BOOLEAN DEFAULT false,
    game INTEGER REFERENCES game(id)
);
CREATE INDEX game_idx ON player(game);

CREATE TABLE IF NOT EXISTS card(
    id SERIAL PRIMARY KEY,
    "mode" INTEGER REFERENCES "mode"(id),
    "state" SMALLINT,
    prefs INTEGER,
    "text" TEXT
);
CREATE INDEX prefs_idx ON card(prefs);


INSERT INTO "mode" (title, "text")
VALUES
    ('croud', 'Everyone for himself'),
    ('team', 'Team game')
;