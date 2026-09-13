-- NAATI CCL database schema

CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,          -- uuid
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,             -- pbkdf2: salt$hash (hex)
  created_at    INTEGER NOT NULL,
  plan          TEXT NOT NULL DEFAULT 'free',   -- free | pro
  plan_expires  INTEGER,                   -- unix ms, null = lifetime/none
  stripe_customer TEXT
);

-- session tokens
CREATE TABLE IF NOT EXISTS sessions (
  token      TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

-- one row per completed dialogue attempt
CREATE TABLE IF NOT EXISTS attempts (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL,
  dialogue_id  TEXT NOT NULL,
  topic        TEXT NOT NULL,
  lang         TEXT NOT NULL,
  mode         TEXT NOT NULL DEFAULT 'practice',  -- practice | exam
  total_score  INTEGER NOT NULL,
  max_score    INTEGER NOT NULL,
  passed       INTEGER NOT NULL,        -- 0/1
  created_at   INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_attempts_user ON attempts(user_id, created_at);

-- per-segment scores within an attempt (for weak-area analysis)
CREATE TABLE IF NOT EXISTS segment_scores (
  attempt_id  TEXT NOT NULL,
  user_id     TEXT NOT NULL,
  dialogue_id TEXT NOT NULL,
  topic       TEXT NOT NULL,
  segment_id  INTEGER NOT NULL,
  score       INTEGER NOT NULL,
  created_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_segscores_user ON segment_scores(user_id);

-- personal vocabulary deck (missed key terms)
CREATE TABLE IF NOT EXISTS vocab (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL,
  term_en     TEXT NOT NULL,
  term_target TEXT,
  lang        TEXT NOT NULL,
  topic       TEXT,
  box         INTEGER NOT NULL DEFAULT 0,  -- leitner box for spaced repetition
  due_at      INTEGER NOT NULL,
  created_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_vocab_user ON vocab(user_id, due_at);

-- daily free-tier usage counter
CREATE TABLE IF NOT EXISTS usage (
  user_id  TEXT NOT NULL,
  day      TEXT NOT NULL,   -- YYYY-MM-DD
  count    INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, day)
);
