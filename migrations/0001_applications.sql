CREATE TABLE applications (
  id TEXT PRIMARY KEY NOT NULL,
  cycle TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL COLLATE NOCASE,
  reg_no TEXT,
  background TEXT NOT NULL,
  roles TEXT NOT NULL CHECK (json_valid(roles)),
  other_role TEXT,
  motivation TEXT NOT NULL,
  experience TEXT,
  links TEXT NOT NULL CHECK (json_valid(links)),
  hours_per_week REAL NOT NULL CHECK (hours_per_week BETWEEN 3 AND 40),
  consent INTEGER NOT NULL CHECK (consent = 1),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE (cycle, email)
);
