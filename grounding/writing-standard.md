# Writing standard

## Reader and voice

Write for someone who knows HTML. Define JavaScript, TypeScript, React,
server-rendering, static export, HTTP, CORS, SQL, and serverless terms the first
time they matter. Prefer direct sentences, concrete examples, and second
person. Use sentence case for headings.

## Page structure

For a feature page, explain:

1. What the reader sees or what problem the code solves.
2. Which files own the route, UI, data, and server behavior.
3. The user journey or request sequence.
4. The state, validation, data model, and failure behavior.
5. How to reproduce, change, and verify the behavior.
6. Links to the relevant code tour and reference pages.

For code tours, follow source order and explain declarations, values, types,
functions, conditions, iteration, JSX, and effects. Group repeated utility
classes only after explaining what that class pattern contributes. Point out
when a TypeScript annotation does not validate runtime input.

## Accuracy

Use source paths and exact route names. Keep client checks distinct from server
validation. Explain whether a page is live, static, or a mock. Do not invent
service endpoints or imply a database read path that does not exist. Examples
must use clearly fictional applicant data.

## Mintlify components

Use cards for navigation, Steps for ordered procedures, tabs only when readers
need genuinely different command variants, callouts for material warnings, and
accordions for optional troubleshooting. Prefer plain prose/tables for data
and behavior that needs to be indexed by search. Reusable MDX belongs in
`docs/snippets/` and must be checked in the local build and parent aggregate.

## Review checklist

- Is the source path accurate and still present?
- Does the explanation distinguish browser code from the Pages Function?
- Are sensitive examples fictional and non-secret?
- Does navigation include the page, and do internal links resolve?
- Does the Mintlify CLI build pass?
- Does the multi-repo workflow include the repo and its source navigation?
