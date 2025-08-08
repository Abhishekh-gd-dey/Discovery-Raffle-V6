/*
  # Create winners table for contest application

  1. New Tables
    - `winners`
      - `id` (uuid, primary key) - Unique identifier for each winner
      - `name` (text) - Winner's full name
      - `department` (text) - Department name (International Messaging, India Messaging, APAC)
      - `supervisor` (text) - Supervisor's name
      - `tickets` (integer) - Number of tickets the winner had
      - `draw_type` (text) - Type of draw ('discovery-70' or 'discovery-80')
      - `draw_date` (timestamptz) - When the draw took place
      - `created_at` (timestamptz) - When the record was created

  2. Security
    - Enable RLS on `winners` table
    - Add policy for authenticated users to read all winner data
    - Add policy for authenticated users to insert new winners
    - Add policy for authenticated users to delete winners (for clearing functionality)

  3. Constraints
    - Check constraint to ensure draw_type is either 'discovery-70' or 'discovery-80'
    - Non-null constraints on required fields
*/

CREATE TABLE IF NOT EXISTS winners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  department text NOT NULL,
  supervisor text NOT NULL,
  tickets integer NOT NULL DEFAULT 0,
  draw_type text NOT NULL,
  draw_date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add check constraint for draw_type
ALTER TABLE winners 
ADD CONSTRAINT winners_draw_type_check 
CHECK (draw_type IN ('discovery-70', 'discovery-80'));

-- Enable Row Level Security
ALTER TABLE winners ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Authenticated users can read winners"
  ON winners
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert winners"
  ON winners
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete winners"
  ON winners
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS winners_draw_type_idx ON winners(draw_type);
CREATE INDEX IF NOT EXISTS winners_draw_date_idx ON winners(draw_date DESC);
CREATE INDEX IF NOT EXISTS winners_department_idx ON winners(department);