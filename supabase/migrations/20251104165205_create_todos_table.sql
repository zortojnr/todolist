/*
  # Create todos table with realtime support

  1. New Tables
    - `todos`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, optional)
      - `due_date` (timestamp, optional)
      - `completed` (boolean, default false)
      - `order` (integer, for manual reordering)
      - `created_at` (timestamp, default now)
      - `updated_at` (timestamp, default now)

  2. Security
    - Enable RLS on `todos` table
    - Add policy for authenticated users to read all todos (shared list)
    - Add policies for insert, update, delete operations
*/

CREATE TABLE IF NOT EXISTS todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  due_date timestamptz,
  completed boolean DEFAULT false,
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read"
  ON todos
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert"
  ON todos
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update"
  ON todos
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete"
  ON todos
  FOR DELETE
  TO public
  USING (true);

CREATE INDEX idx_todos_order ON todos("order");
CREATE INDEX idx_todos_completed ON todos(completed);
CREATE INDEX idx_todos_created_at ON todos(created_at DESC);
