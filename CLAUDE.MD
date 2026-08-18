@AGENTS.md

# Stack

- Tanstack Start with Tanstack Router
- TypeScript
- Tailwind CSS
- Netlify deployment

# Rules

- Use Zod for validation
- Use React Hook Form for forms
- Keep components modular
- Prefer composition over prop drilling
- Use react query for api calls
- Use zustand for global state management
- Do not hardcode routes inside component files, instead add them to the ApplicationRoutes object in /src/config/routes (create if it does not exist)
- Create parent route components inside /src/components/pages and import and attach them to the route in /src/routes. Do not create a route's component in the same route file
- Create and export globally used route such as headers and navigation bar in /src/components/global
- API calls are made in /src/services, create a new file for each API services. Example, auth.service.ts. This will contain the code for making calls to auth endpoint such as /signup, /login, /me. It will be written as a class with methods for each API call.
- Type interfaces are created in /src/lib/interfaces. Create a file for each interface class. Example /interfaces/auth.ts for auth interfaces, /interfaces/post.ts for post interfaces
- Zod validation schemas are created in /src/lib/validators. Create a new file for each class of validation schemas. Example, /validators/auth.ts will have zod schemas for signup and login form. /validators/post.ts will contain and export schemas for create post form and edit post form.


# Project specific rules (GymAI)
- Use mobile first development approach for the UI
- Use "Black Ops One" font family for the heading texts

## Routing
- Make use of Tanstack Router file based routing, you will use a mixed Flat and directory routes structure (Documentation)[https://tanstack.com/router/latest/docs/routing/file-based-routing]. 
- Nested routes must be created in a directory, for example "workouts" directory contains three files, `index.tsx` which is /workouts, `$workoutId.tsx` which is /workouts/$workoutId, `$workoutId.edit.tsx` which is /workouts/$workoutId/edit

# Styling

- Use Tailwind only
- Use shadcn/ui components
- Maintain consistent spacing