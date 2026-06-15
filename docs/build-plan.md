# Build Plan: Paprika Smart Meal Planner

## 1. Build Strategy

Build the app in small milestones.

Do not ask Codex to build the full app at once.

The first goal is to prove the most important technical assumption:

```text
Can the app import a Paprika export file and display recipe data?
```

Use **Next.js only** for Milestone 1.

Add **Supabase** only after Paprika import works.

---

## 2. Architecture Choice

Use **Next.js + Supabase** for the MVP.

For the first milestone:

```text
Next.js only
No Supabase yet
No authentication
No AI
No meal planning yet
```

Later milestones will add Supabase, ingredient matching, meal planning, and missing ingredients.

---

## 3. Milestone 1: Paprika File Import

### Goal

Upload one Paprika `.paprikarecipes` file, parse it, and display the imported recipe.

### User should be able to

- Open an import page
- Upload a Paprika export file
- See the recipe name
- See the recipe ingredients
- See the recipe directions

### Build

Create:

```text
app/import/page.tsx
components/FileUpload.tsx
components/RecipeCard.tsx
lib/paprika-parser.ts
types/recipe.ts
```

### Out of scope

Do not build:

- Supabase storage
- Authentication
- Meal planning
- Ingredient matching
- Grocery list
- AI
- Recipe editing
- Multiple users

### Acceptance criteria

Milestone 1 is complete when:

- User can upload the sample Paprika file
- App displays recipe name
- App displays ingredients
- App displays directions
- No database is required
- App runs locally without errors

---

## 4. Milestone 2: Recipe Library with Supabase

### Goal

Save imported recipes to Supabase and display them in a recipe library.

### User should be able to

- Import a Paprika recipe
- Save recipe data to Supabase
- View saved recipes on a recipe library page

### Build

Create Supabase tables:

```text
recipes
recipe_ingredients
```

Create:

```text
app/recipes/page.tsx
lib/supabase-client.ts
lib/recipe-service.ts
```

### Acceptance criteria

Milestone 2 is complete when:

- Imported recipes are saved to Supabase
- Recipe library page shows saved recipes
- Refreshing the browser does not lose imported recipes

---

## 5. Milestone 3: Available Ingredients Input

### Goal

Let the user enter ingredients they currently have at home.

### User should be able to

- Enter ingredients manually
- Add one ingredient per line
- Save or use the ingredient list for matching

### Build

Create:

```text
components/IngredientInput.tsx
lib/ingredient-normalizer.ts
```

Optional Supabase table:

```text
available_ingredients
```

### Acceptance criteria

Milestone 3 is complete when:

- User can enter available ingredients
- App normalizes ingredient names
- App can pass the ingredient list into matching logic

---

## 6. Milestone 4: Recipe Matching

### Goal

Rank recipes by how well they use the ingredients the user already has.

### User should be able to

- Enter available ingredients
- Click a button to find matching recipes
- See recipes ranked by match score

### Build

Create:

```text
lib/recipe-matcher.ts
components/RecipeMatchList.tsx
```

### Matching logic

Use this simple scoring approach first:

```text
Primary score = number of available ingredients matched
Secondary score = matched ingredients / total recipe ingredients
```

### Acceptance criteria

Milestone 4 is complete when:

- App compares available ingredients to recipe ingredients
- App ranks recipes by match score
- User can see why a recipe matched at a basic level

Example:

```text
Matched ingredients:
- spinach
- rice
- tomatoes
```

---

## 7. Milestone 5: 5-Day Dinner Plan

### Goal

Generate a dinner-only 5-day meal plan.

### User should be able to

- Enter available ingredients
- Generate a 5-day dinner plan
- See one recipe per day

### Build

Create:

```text
app/plan/page.tsx
lib/meal-plan-generator.ts
components/MealPlanCard.tsx
```

Optional Supabase tables:

```text
meal_plans
meal_plan_items
```

### Rules

- Dinner only
- 5 days
- Prioritize recipes that use available ingredients
- No cuisine balancing in version 1
- No leftover logic in version 1

### Acceptance criteria

Milestone 5 is complete when:

- App generates exactly 5 dinner recipes
- Recipes are selected from the highest-ranked matches
- User can clearly see Day 1 through Day 5

---

## 8. Milestone 6: Exclude Recipes

### Goal

Allow the user to exclude recipes they do not feel like cooking this week.

### User should be able to

- Mark a recipe as “not this week”
- Regenerate the plan without excluded recipes
- Replace an excluded recipe with another option

### Build

Create:

```text
components/ExcludeRecipeButton.tsx
lib/exclusion-service.ts
```

Optional Supabase table:

```text
excluded_recipes
```

### Acceptance criteria

Milestone 6 is complete when:

- User can exclude a recipe
- Excluded recipe does not appear in the generated plan
- App can refill the plan with another recipe

---

## 9. Milestone 7: Missing Ingredients List

### Goal

Show only ingredients the user still needs to buy for the 5 selected dinners.

### User should be able to

- Generate a 5-day dinner plan
- See missing ingredients only
- Use the missing ingredients list as a simple grocery list

### Build

Create:

```text
lib/missing-ingredients.ts
components/MissingIngredientsList.tsx
```

### Logic

```text
All ingredients needed for selected recipes
        -
Ingredients user already has
        =
Missing ingredients
```

### Acceptance criteria

Milestone 7 is complete when:

- App compares selected recipe ingredients against available ingredients
- App shows only missing ingredients
- App does not show ingredients the user already has

---

## 10. Milestone 8: Basic Polish

### Goal

Make the app easier to use for a first demo.

### Add

- Simple home page
- Clear navigation
- Empty states
- Error handling for invalid files
- Loading states
- Basic styling
- Beginner-friendly comments in important files

### Acceptance criteria

Milestone 8 is complete when:

- User can understand the flow without explanation
- Upload errors are shown clearly
- The app feels usable enough for a private demo

---

## 11. Codex Prompt for Milestone 1

Use this prompt with Codex:

```text
We are building a beginner-friendly MVP called Paprika Smart Meal Planner.

Read these files first:
- docs/product-brief.md
- docs/architecture.md
- docs/build-plan.md

Architecture decision:
- Use Next.js + Supabase for the MVP.
- But Milestone 1 should be Next.js only.
- Do not add Supabase yet.

Build Milestone 1 only:
Create a page where the user can upload a Paprika .paprikarecipes file.
Parse the uploaded file.
Display the imported recipe name, ingredients, and directions.

Important:
- Keep the implementation simple.
- Do not build authentication.
- Do not build meal planning yet.
- Do not add AI yet.
- Do not add Supabase yet.
- Focus only on proving that a Paprika export file can be imported and displayed.
- Add comments where a beginner should understand the logic.

Please:
1. Inspect the repository.
2. Propose a small implementation plan.
3. Make the minimal code changes.
4. Tell me how to run and test it locally.
```

---

## 12. Codex Working Rules

Use these rules when working with Codex:

1. Give Codex one milestone at a time.
2. Do not ask Codex to build the whole app.
3. Run the app locally after each milestone.
4. Copy errors back into Codex.
5. Ask Codex to fix only the current error.
6. Commit working code before starting the next milestone.
7. Keep documentation updated when architecture or scope changes.

---

## 13. Recommended First Commit Sequence

Suggested first commits:

```text
Commit 1:
Add product brief, architecture, and build plan

Commit 2:
Create initial Next.js app

Commit 3:
Add Paprika file upload page

Commit 4:
Add Paprika parser

Commit 5:
Display imported recipe

Commit 6:
Add Supabase tables and recipe library
```

---

## 14. Definition of Done for Version 1

Version 1 is complete when the user can:

- Import Paprika recipes
- Enter ingredients they already have
- Generate a 5-day dinner-only meal plan
- Exclude recipes they do not want this week
- See only missing ingredients needed for the plan

The final version 1 question the app should answer is:

```text
What should I cook for dinner this week using the ingredients and Paprika recipes I already have?
```
