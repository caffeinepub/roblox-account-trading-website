# Specification

## Summary
**Goal:** Build a Roblox account trading platform ("Brainrot Trade Hub") where users can post and browse trade listings exchanging Roblox accounts for Brainrot content items, with a bold meme/gaming visual theme.

**Planned changes:**
- Homepage displaying active trade listings as cards, each showing offered item details, requested item details, poster name, and open/closed status
- Backend data model and API for trade listings with fields: listing ID, poster display name, offered item type/description, requested item type/description, status (open/closed), and creation timestamp; listings persist through upgrades
- "Post a Trade" form with fields for display name, offering description, and wanted description, with basic required-field validation; successful submission adds the listing to the homepage
- Listing detail view showing all fields of a single trade, with a "Mark as Completed" button that sets the listing to closed; closed listings are visually differentiated
- Bold, dark-background visual theme with neon accent colors (e.g., neon green or vivid orange), chunky typography, and card-based layout applied consistently across all pages

**User-visible outcome:** Users can browse open trade listings on the homepage, post new trade offers via a form, view full listing details, and mark trades as completed — all within a meme/gaming-inspired UI.
