# Paprika Smart Meal Planner

A beginner-friendly meal planning app for importing recipes from Paprika.

Milestone 1 lets you upload a Paprika `.paprikarecipes` export and view each
recipe's name, ingredients, and directions. The file is parsed locally in your
browser and is not uploaded or saved.

The frontend is written with React using plain JavaScript and JSX. TypeScript is
currently used only for the Paprika parser and recipe data types.

## Local Setup

### Prerequisites

Install these before starting:

- [Node.js](https://nodejs.org/) version 20 or newer
- npm, which is included with Node.js
- A Paprika `.paprikarecipes` export file for testing

### Install and Run

1. Open a terminal and go to the project folder:

   ```bash
   cd /Users/devennavani/Meal-Planner
   ```

2. Install the project dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000/import](http://localhost:3000/import) in your
   browser.

To stop the development server, press `Control+C` in the terminal.

## Test the Import Flow

1. Export one or more recipes from Paprika as a `.paprikarecipes` file.
2. Open [http://localhost:3000/import](http://localhost:3000/import).
3. Select **Choose a Paprika export**.
4. Choose your `.paprikarecipes` file.
5. Confirm the imported recipe name, ingredients, and directions appear.

Imported recipes are kept only in the browser's memory. Refreshing the page
clears them.

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

Milestone 1 uses Next.js only. It does not include Supabase, authentication,
AI, meal planning, ingredient matching, or grocery list logic.
