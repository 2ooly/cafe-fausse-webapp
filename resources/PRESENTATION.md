# Café Fausse Web Experience Demo

## Slide 1 – Title & Presenter
- Café Fausse Web Experience
- Presented by: [Your Name]
- Course: Web Application & Interface Design
- Demo Duration: 10–15 minutes

## Slide 2 – Introduction
- Café Fausse: modern bistro blending French cuisine with jazz ambiance
- Project: full-stack web experience supporting reservations and engagement
- Goal: highlight cohesive UX from landing to booking
- Scope: five-page React frontend with Flask API and PostgreSQL database

## Slide 3 – Objectives
- Deliver welcoming digital first impression reflecting café ambiance
- Provide intuitive browsing of menus and events
- Enable seamless reservation and newsletter interactions
- Support staff workflows with reliable data capture
- Ensure accessibility and responsiveness across devices

## Slide 4 – Technologies Used
- React with Vite for modular, component-driven UI
- Flask REST API orchestrating business logic
- PostgreSQL for relational reservation & subscriber data
- CSS Grid & Flexbox for responsive layout system
- AI-assisted coding, debugging, and content refinement tools

## Slide 5 – System Architecture
- React client consumes REST endpoints via Axios fetch layer
- Flask backend handles routing, validation, and ORM queries
- PostgreSQL persists reservations, menu items, subscribers
- JWT-ready session pipeline for future authentication expansion
- Deployment-ready split: static hosting + containerized API

## Slide 6 – UI/UX Design Decisions
- Consistent typography and color palette echoing brand noir-gold theme
- Responsive breakpoints at 320/768/1200px maintain layout integrity
- Component hierarchy supports reusable cards, CTAs, and forms
- Micro-interactions: hover states, smooth scroll cues, subtle animations
- Accessibility: semantic landmarks, aria labels, keyboard-friendly flow

## Slide 7 – Pages Overview
- Main: hero carousel, daily features, CTA buttons
- Menu: categorized dishes with dietary badges and pricing
- Reservations: guided form, availability prompts, confirmation modal
- About Us: story timeline, chef highlights, testimonials carousel
- Gallery: masonry grid with lightbox for ambiance showcase

## Slide 8 – Main Page Highlights
- Hero section sets tone with café imagery and tagline overlay
- Daily specials component rotates featured dishes automatically
- CTA buttons direct to Menu and Reservations for quick actions
- Footer embeds contact info, hours, and social links

## Slide 9 – Menu Page Highlights
- Tabs filter Breakfast, Lunch, Dinner, Desserts, Drinks
- Cards display dish imagery, description, allergens, and price
- Sticky sub-navigation keeps categories accessible while scrolling
- Backend-driven menu allows seasonal updates via admin script

## Slide 10 – Reservations Page Highlights
- Multi-step form captures party size, date, time, and notes
- Inline validation with context-sensitive messaging
- Availability API checks PostgreSQL slots before confirmation
- Success modal provides booking reference and follow-up email cue

## Slide 11 – About Us & Gallery Highlights
- About Us: timeline of Café Fausse legacy, chef bios, mission
- Team cards maintain consistent photo framing and hover states
- Gallery grid uses CSS masonry for varied photo proportions
- Lightbox overlay supports swipe navigation on mobile

## Slide 12 – Reservation System Demo
- User selects date/time; frontend validates required fields
- Axios POST `/api/reservations` sends payload to Flask
- Flask validates availability, writes to PostgreSQL with transaction
- Response returns booking ID and status to display confirmation
- Admin dashboard view lists reservations via protected endpoint

## Slide 13 – Newsletter Signup Demo
- Footer form captures name and email with regex validation
- Debounced input check prevents duplicate submissions
- Axios POST `/api/newsletter` triggers Flask service layer
- Backend upserts subscriber into `subscribers` table with timestamp
- Success toast confirms sign-up; error state prompts corrections

## Slide 14 – AI Tools Utilization
- Prompted AI pair-programming for component scaffolding
- Leveraged AI linting suggestions for consistent styling
- Used AI to draft microcopy and accessibility alt text
- Debugged state management edge cases via AI-assisted tests
- Generated placeholder imagery concepts to guide photoshoot

## Slide 15 – Testing & Responsiveness
- Manual QA on Chrome, Firefox, Safari, and Edge
- Mobile simulations at iPhone SE, Pixel 7, iPad breakpoints
- Lighthouse audits ensure performance and accessibility targets
- Jest/React Testing Library for critical component states
- Flask unit tests validate reservation conflict resolution

## Slide 16 – Conclusion & Next Steps
- Challenges: coordinating design system across React + Flask templates
- Lessons learned: design tokens streamline theming; API contracts matter
- Next steps: implement loyalty program and event ticketing workflows
- Explore integration with POS for real-time table management
- Plan A/B tests on hero messaging and CTA placements

## Slide 17 – ID Verification
- Display government-issued ID beside student ID on camera
- Verbally confirm full name and course enrollment
- Ensure photo matches profile before proceeding
- Maintain FERPA compliance: blur unrelated sensitive details
- Pause recording if additional verification is requested

