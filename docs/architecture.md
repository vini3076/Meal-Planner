# Architecture: Paprika Smart Meal Planner

## 1. Architecture Decision

Use **Next.js + Supabase** for the MVP.

For the first technical milestone, use **Next.js only** to prove that Paprika file import works before adding Supabase.

### Version 1 architecture choice

```text
Frontend: Next.js
Backend logic: Next.js Route Handlers / Server Actions
Database: Supabase Postgres
Hosting: Vercel + Supabase
AI: Not required for version 1
Paprika integration: Paprika export file import
```

### Important decision

Do **not** rely on a Paprika API for version 1.

Version 1 should use Paprika export files as the import source.

---

## 2. System Overview

The app helps current Paprika users generate a 5-day dinner plan from their saved recipes and ingredients they already have at home.

High-level flow:

```text
User uploads Paprika export file
        ↓
App parses recipes
        ↓
App stores recipes
        ↓
User enters available ingredients
        ↓
App matches ingredients to recipes
        ↓
App generates a 5-day dinner plan
        ↓
App shows only missing ingredients
```

---

## 3. Version 1 Scope

Version 1 should support:

- Paprika recipe export file upload
- Recipe import and parsing
- Recipe library display
- Available ingredient entry
- Recipe matching by available ingredients
- Recipe exclusion for the current week
- 5-day dinner-only meal plan generation
- Missing-ingredients-only grocery list

Version 1 should not support:

- Breakfast or lunch planning
- Leftover planning
- Cuisine balancing
- Nutrition tracking
- Full Paprika two-way sync
- Paprika API integration
- Mobile app
- Family accounts
- Payments
- AI-generated recipes
- Grocery delivery integration

---

## 4. Main Technical Flow

```text
1. User uploads .paprikarecipes file
2. Next.js receives the uploaded file
3. Import parser extracts recipe data
4. App displays imported recipes
5. Later, app saves recipes to Supabase
6. User enters ingredients they have
7. App normalizes ingredient names
8. App scores recipes by ingredient match
9. App selects 5 dinner recipes
10. User can exclude recipes and regenerate
11. App calculates missing ingredients
12. App displays the 5-day plan and missing ingredients list
```

---

## 5. Frontend Responsibilities

The Next.js frontend is responsible for the user experience.

It should provide pages/components for:

- Uploading a Paprika export file
- Viewing imported recipes
- Entering ingredients the user currently has
- Viewing ranked recipe matches
- Generating a 5-day dinner plan
- Excluding recipes from the current plan
- Viewing the missing ingredients list

Suggested early pages:

```text
/
  Home page with app summary and upload entry point

/import
  Upload Paprika export file and display parsed recipe

/recipes
  Display imported recipe library

/plan
  Enter available ingredients and generate 5-day dinner plan
```

---

## 6. Backend Responsibilities

In version 1, backend logic should live inside the Next.js app using Route Handlers or Server Actions.

Backend logic is responsible for:

- Receiving Paprika export file uploads
- Parsing recipe data from the uploaded file
- Extracting important recipe fields
- Normalizing ingredient names
- Matching available ingredients to recipe ingredients
- Ranking recipes
- Generating the 5-day dinner plan
- Calculating missing ingredients

Suggested backend modules:

```text
lib/paprika-parser.ts
lib/ingredient-normalizer.ts
lib/recipe-matcher.ts
lib/meal-plan-generator.ts
lib/missing-ingredients.ts
```

---

## 7. Database Responsibilities

Supabase Postgres should be added after the Paprika import milestone works.

Supabase will store:

- Recipes
- Recipe ingredients
- Available ingredients
- Excluded recipes
- Meal plans
- Meal plan items

### Tables

#### recipes

Stores imported Paprika recipes.

Fields:

```text
id
paprika_uid
name
ingredients_raw
directions
servings
prep_time
cook_time
total_time
source
source_url
categories
rating
image_url
created_at
updated_at
```

#### recipe_ingredients

Stores individual ingredient lines from each recipe.

Fields:

```text
id
recipe_id
raw_ingredient_line
normalized_ingredient_name
created_at
```

#### available_ingredients

Stores ingredients the user says they currently have.

Fields:

```text
id
ingredient_name
normalized_ingredient_name
created_at
```

#### excluded_recipes

Stores recipes the user does not want in the current plan.

Fields:

```text
id
recipe_id
reason
created_at
```

#### meal_plans

Stores generated meal plans.

Fields:

```text
id
plan_name
created_at
updated_at
```

#### meal_plan_items

Stores the selected recipes for each day.

Fields:

```text
id
meal_plan_id
day_number
meal_type
recipe_id
match_score
created_at
```

For version 1, `meal_type` should always be:

```text
dinner
```

---

## 8. Paprika Import Flow

Version 1 should import recipes from Paprika export files.

The app should extract:

- Recipe name
- Ingredients
- Directions
- Servings
- Prep time
- Cook time
- Total time
- Source
- Source URL
- Image URL, if available
- Categories
- Rating
- Paprika UID

For the first milestone, only extract and display:

- Recipe name
- Ingredients
- Directions

The parser should be built and tested with a real Paprika export sample before adding database storage.

---

## 9. Ingredient Matching Flow

The user enters ingredients they already have.

Example:

```text
tomatoes
spinach
paneer
rice
potatoes
yogurt
```

The app compares these against imported recipe ingredients.

Paprika ingredients may look like this:

```text
8 ounces strawberries, hulled
2 cups raw cashews
1/2 cup cocoa powder
```

The app should normalize these into core ingredient names:

```text
strawberries
cashews
cocoa powder
```

For version 1, keep normalization simple:

- Lowercase text
- Remove quantities
- Remove common units
- Remove text after commas
- Trim spaces
- Compare normalized text

---

## 10. Recipe Scoring

Version 1 should prioritize recipes that use the most available ingredients.

Simple scoring:

```text
score = number of available ingredients matched
```

Better scoring:

```text
score = available ingredients matched / total recipe ingredients
```

Recommended version 1 approach:

```text
Primary sort: number of available ingredients matched
Secondary sort: match percentage
```

---

## 11. Meal Plan Generation Flow

The app should generate a dinner-only 5-day meal plan.

Rules:

- Select 5 recipes
- Prioritize recipes with the highest ingredient match
- Exclude recipes the user marked as “not this week”
- Do not apply cuisine variety rules in version 1
- Do not apply leftover logic in version 1

Output example:

```text
Day 1: Recipe A
Day 2: Recipe B
Day 3: Recipe C
Day 4: Recipe D
Day 5: Recipe E
```

---

## 12. Missing Ingredients Flow

After the 5-day plan is generated, the app should calculate only missing ingredients.

Flow:

```text
Ingredients needed by selected recipes
        ↓
Subtract ingredients the user already has
        ↓
Display missing ingredients only
```

For version 1, it is acceptable if the missing ingredients list is not perfectly combined by quantity.

---

## 13. Recommended Folder Structure

```text
docs/
  product-brief.md
  architecture.md
  build-plan.md

sample-data/
  chocolate-strawberry-energy-bites.paprikarecipes

app/
  page.tsx
  import/
    page.tsx
  recipes/
    page.tsx
  plan/
    page.tsx

components/
  FileUpload.tsx
  RecipeCard.tsx
  IngredientInput.tsx
  MealPlanCard.tsx
  MissingIngredientsList.tsx

lib/
  paprika-parser.ts
  ingredient-normalizer.ts
  recipe-matcher.ts
  meal-plan-generator.ts
  missing-ingredients.ts

types/
  recipe.ts
  meal-plan.ts
```

---

## 14. First Technical Milestone

The first technical milestone should be Next.js only.

Goal:

```text
Upload one Paprika export file, parse it, and display the recipe name, ingredients, and directions.
```

Do not add Supabase until this works.

Do not add authentication, AI, or meal planning until the import parser works.

---

## 15. Future Architecture Notes

Later versions may add:

- Supabase Auth for user accounts
- Saved meal plans
- Smarter ingredient normalization
- AI-assisted ingredient cleanup
- AI explanations for recipe selection
- Recipe history to avoid recent repeats
- More advanced grocery list grouping
- Optional FastAPI backend if recommendation logic becomes more complex

Do not add these until the version 1 flow is working.
