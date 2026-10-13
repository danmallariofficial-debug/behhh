CREATE TABLE "special_days" (
	"id" serial PRIMARY KEY,
	"emoji" text DEFAULT '💜' NOT NULL,
	"label" text NOT NULL,
	"day" text NOT NULL,
	"yearly" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now()
);
