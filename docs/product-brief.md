# Product Brief: Paprika Smart Meal Planner

## 1. Product Summary

Paprika Smart Meal Planner is a companion app for current Paprika users who have saved many recipes but struggle to decide what to cook.

The app helps users import their Paprika recipes, enter ingredients they already have at home, and generate a 5-day dinner meal plan that prioritizes using up those ingredients.

The app is not intended to replace Paprika in version 1. It acts as a smart planning layer on top of the user’s existing Paprika recipe collection.

---

## 2. Target User

The first version is for current Paprika users.

These users:

- Already use Paprika to save recipes
- Have many recipes saved
- Feel overwhelmed deciding what to cook
- Want to use ingredients they already have at home
- Want a simple dinner plan for the week
- Do not want to manually search through a large recipe collection

---

## 3. Problem

Paprika is useful for storing and organizing recipes, but users can still struggle with the decision-making step.

The main problem is:

> “I have too many recipes saved and I do not know what to cook this week.”

A related problem is:

> “I want to cook from ingredients I already have, but I do not want to manually search through all my recipes.”

---

## 4. Version 1 Goal

The goal of version 1 is to help a Paprika user generate a 5-day dinner plan using:

- Recipes imported from a Paprika export file
- Ingredients the user currently has at home
- User exclusions for recipes they do not feel like cooking this week

Version 1 should produce:

- A dinner-only 5-day meal plan
- A list of only the missing ingredients needed for those recipes

---

## 5. Main User Flow

1. User uploads a Paprika recipe export file.
2. App imports the recipes.
3. User enters ingredients they currently have.
4. App ranks recipes based on how well they use those ingredients.
5. User can exclude recipes they do not want this week.
6. App generates a 5-day dinner meal plan.
7. App shows a grocery list with only missing ingredients.

---

## 6. MVP Features

### Must Have

- Upload Paprika recipe export file
- Parse imported recipes
- Display imported recipes
- Enter ingredients currently available at home
- Match available ingredients to recipe ingredients
- Generate a 5-day dinner-only meal plan
- Prioritize using up available ingredients
- Allow user to exclude recipes
- Show missing ingredients only

### Nice to Have Later

- Save meal plans
- Recipe ratings
- Cuisine filters
- Cooking time filters
- Leftover logic
- AI-based ingredient matching
- AI explanation for why recipes were selected
- Smarter ingredient normalization
- Recipe history to avoid recent repeats

---

## 7. Out of Scope for Version 1

Version 1 will not include:

- Lunch planning
- Breakfast planning
- Cuisine variety rules
- Leftover planning
- Nutrition tracking
- Calories or macros
- Full Paprika two-way sync
- Mobile app
- Family accounts
- Grocery delivery integration
- Payments or subscriptions
- AI-generated recipes
- Recipe scraping from websites
- Pantry expiration tracking

---

## 8. Paprika Import Approach

Version 1 should use Paprika export files instead of relying on a Paprika API.

A Paprika recipe export file can be used as the source for importing recipes into the app.

The app should extract key recipe fields such as:

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

For version 1, the most important fields are:

- Recipe name
- Ingredients
- Directions
- Categories
- Source URL
- Paprika UID

Photos and nutrition data can be ignored at first unless they are easy to support.

---

## 9. Simplest Technical Architecture

The first version should use Paprika export files instead of relying on direct Paprika API access.

Basic flow:

```text
Paprika export file
        ↓
Import parser
        ↓
Recipe database
        ↓
Ingredient matching logic
        ↓
5-day dinner planner
        ↓
Missing ingredients list
```

Recommended beginner stack:

- Frontend: Next.js
- Backend: Next.js API routes or FastAPI
- Database: Supabase/Postgres
- Hosting: Vercel + Supabase
- AI: Not required for the first working version

---

## 10. Backend/Data Requirements

### Recipe

Stores the imported Paprika recipe.

Fields:

- id
- paprika_uid
- name
- ingredients_raw
- directions
- servings
- prep_time
- cook_time
- total_time
- source
- source_url
- categories
- rating
- image_url
- created_at

### Recipe Ingredient

Stores ingredient lines extracted from each recipe.

Fields:

- id
- recipe_id
- raw_ingredient_line
- normalized_ingredient_name

Example:

```text
Raw ingredient line:
8 ounces strawberries, hulled

Normalized ingredient:
strawberries
```

### Available Ingredient

Stores ingredients the user says they currently have.

Fields:

- id
- ingredient_name
- normalized_ingredient_name
- created_at

### Excluded Recipe

Stores recipes the user does not want included in the current plan.

Fields:

- id
- recipe_id
- reason
- created_at

### Meal Plan

Stores a generated meal plan.

Fields:

- id
- created_at
- plan_name

### Meal Plan Item

Stores the recipes selected for the 5-day dinner plan.

Fields:

- id
- meal_plan_id
- day_number
- meal_type
- recipe_id
- match_score

For version 1, `meal_type` will always be:

```text
dinner
```

---

## 11. Ingredient Matching Logic

Ingredient matching is one of the most important parts of the app.

Paprika ingredients are stored as recipe text, such as:

```text
8 ounces strawberries, hulled
2 cups raw cashews
1/2 cup cocoa powder
```

The app needs to identify the core ingredient names:

```text
strawberries
cashews
cocoa powder
```

For version 1, use simple cleanup rules:

- Lowercase everything
- Remove quantities
- Remove common units
- Remove extra notes after commas
- Trim extra spaces
- Compare the cleaned ingredient names against the user’s available ingredients

Simple scoring option:

```text
Recipe score = number of available ingredients used by recipe
```

Better scoring option:

```text
Recipe score = available ingredients matched / total recipe ingredients
```

For this product, version 1 should prioritize recipes that use the most ingredients the user already has.

---

## 12. First Build Milestone

The first milestone is not the full app.

The first milestone should prove that the Paprika export file can be imported and displayed.

Build this first:

1. Upload one Paprika export file.
2. Extract the recipe name, ingredients, and directions.
3. Display the imported recipe in the app.

This proves the most important technical assumption: Paprika recipe export can be used as the app’s recipe source.

---

## 13. Beginner Build Order

Build the app in this order:

1. Create the product brief.
2. Create a small sample recipe dataset.
3. Build a recipe list page.
4. Build Paprika file import.
5. Display imported recipes.
6. Build ingredient input.
7. Build recipe matching score.
8. Generate a 5-day dinner plan.
9. Add recipe exclusion.
10. Show missing ingredients.

---

## 14. Version 1 Success Criteria

Version 1 is successful if a user can:

- Import Paprika recipes
- Enter ingredients they already have
- Generate a useful 5-day dinner plan
- Remove recipes they do not want
- See only the ingredients they still need to buy

The simplest successful version should answer this question:

> “What should I cook for dinner this week using the ingredients and Paprika recipes I already have?”

---

## 15. Version 1 Product Principle

Keep version 1 narrow.

Do not try to replace Paprika. Do not build a full nutrition or grocery platform.

The first version should do one thing well:

> Turn a user’s existing Paprika recipes and available ingredients into a practical 5-day dinner plan.
