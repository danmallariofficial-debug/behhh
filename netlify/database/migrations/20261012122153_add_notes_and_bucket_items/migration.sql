CREATE TABLE "bucket_items" (
	"id" text PRIMARY KEY,
	"emoji" text DEFAULT '💜' NOT NULL,
	"title" text NOT NULL,
	"hint" text DEFAULT '' NOT NULL,
	"done" boolean DEFAULT false NOT NULL,
	"position" serial
);
--> statement-breakpoint
ALTER TABLE "dates" ADD COLUMN "jordan_note" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "dates" ADD COLUMN "rizza_note" text DEFAULT '' NOT NULL;--> statement-breakpoint
INSERT INTO "bucket_items" ("id", "emoji", "title", "hint") VALUES
	('coastal-road', '🌊', 'Coastal Road walk', 'Sunset breeze, no destination.'),
	('coffee-talks', '☕', 'Coffee & long talks', 'Stay until they stack the chairs.'),
	('samal-sunrise', '🌅', 'Sunrise on Samal', 'Early ferry, sleepy smiles.'),
	('mt-apo-view', '⛰️', 'See Mt. Apo up close', 'Even just from a viewpoint.'),
	('kadayawan', '🎉', 'Kadayawan together', 'Street dancing, fruit everywhere.'),
	('cook-dinner', '🍳', 'Cook a full dinner', 'Starter, main, and a dessert attempt.'),
	('stargazing', '✨', 'Stargazing night', 'Somewhere dark, up in the hills.'),
	('rain-walk', '☔', 'Walk in the rain', 'One umbrella, on purpose.'),
	('polaroids', '📸', 'Fill a page of photos', 'Then add them to our album.'),
	('adopt-day', '🐶', 'A day with shelter dogs', 'Walks, belly rubs, silly names.'),
	('letters', '💌', 'Write each other letters', 'Open them on a date, read out loud.'),
	('road-trip', '🚗', 'Little road trip', 'Pick a town we’ve never been to.');
