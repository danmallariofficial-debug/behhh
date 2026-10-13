CREATE TABLE "dates" (
	"id" serial PRIMARY KEY,
	"title" text NOT NULL,
	"place" text DEFAULT '' NOT NULL,
	"category" text DEFAULT 'food' NOT NULL,
	"day" text NOT NULL,
	"time" text DEFAULT '' NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"booked_by" text NOT NULL,
	"status" text DEFAULT 'planned' NOT NULL,
	"memory" text DEFAULT '' NOT NULL,
	"rating" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"key" text PRIMARY KEY,
	"value" text NOT NULL
);
