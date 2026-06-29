# Paprika Smart Meal Planner

A beginner-friendly meal planning app for importing recipes from Paprika.

Milestone 3 lets you upload a Paprika `.paprikarecipes` export, save recipes to
Supabase, view the recipe library, and enter available ingredients for the next
matching step.

The frontend is written with React using plain JavaScript and JSX. TypeScript is
currently used only for the Paprika parser and recipe data types.

## Local Setup

### Prerequisites

Install these before starting:

- [Node.js](https://nodejs.org/) version 20 or newer
- npm, which is included with Node.js
- A Paprika `.paprikarecipes` export file for testing
- A Supabase project with `recipes` and `recipe_ingredients` tables

### Install and Run

1. Open a terminal and go to the project folder:

   ```bash
   cd /Users/devennavani/Meal-Planner
   ```

2. Install the project dependencies:

   ```bash
   npm install
   ```

3. Create `.env.local` from `.env.example` and add your Supabase values:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000/import](http://localhost:3000/import) in your
   browser.

To stop the development server, press `Control+C` in the terminal.

## Test the Import Flow

1. Export one or more recipes from Paprika as a `.paprikarecipes` file.
2. Open [http://localhost:3000/import](http://localhost:3000/import).
3. Select **Choose a Paprika export**.
4. Choose your `.paprikarecipes` file.
5. Confirm the imported recipe name, ingredients, and directions appear.
6. Select **Save to recipe library**.
7. Open [http://localhost:3000/recipes](http://localhost:3000/recipes) and
   confirm the saved recipes appear after refreshing.

Imported recipes are parsed in the browser, then saved to Supabase only when you
select **Save to recipe library**.

## Test the Ingredient Input Flow

1. Open [http://localhost:3000/plan](http://localhost:3000/plan).
2. Enter one ingredient per line.
3. Confirm the app shows the normalized ingredient names.
4. Select **Use these ingredients**.
5. Confirm the normalized list appears under **Ingredients ready for Milestone 4**.

## Useful Commands

```bash
# Start the local development server
npm run dev

# Check the code for lint errors
npm run lint

# Create a production build
npm run build

# Run the production build after npm run build
npm run start
```

## Current Scope

Milestone 3 uses Next.js and Supabase. It does not include authentication, AI,
recipe matching, generated meal plans, or grocery list logic.
