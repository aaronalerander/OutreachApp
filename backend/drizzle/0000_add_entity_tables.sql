CREATE TYPE "public"."entity_type" AS ENUM('COMPANY', 'PERSON');--> statement-breakpoint
CREATE TABLE "companies" (
	"entity_id" text PRIMARY KEY NOT NULL,
	"entity_type" "entity_type" DEFAULT 'COMPANY' NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "companies_entity_type_is_company" CHECK ("companies"."entity_type" = 'COMPANY')
);
--> statement-breakpoint
CREATE TABLE "email_domains" (
	"id" text PRIMARY KEY NOT NULL,
	"company_entity_id" text,
	"domain" text NOT NULL,
	CONSTRAINT "email_domains_domain_unique" UNIQUE("domain")
);
--> statement-breakpoint
CREATE TABLE "email_usernames" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email_domain_id" text NOT NULL,
	"entity_id" text NOT NULL,
	"entity_type" "entity_type" NOT NULL,
	CONSTRAINT "email_usernames_username_emailDomainId_unique" UNIQUE("username","email_domain_id"),
	CONSTRAINT "email_usernames_person_or_company" CHECK ("email_usernames"."entity_type" in ('PERSON', 'COMPANY'))
);
--> statement-breakpoint
CREATE TABLE "employment_history" (
	"id" text PRIMARY KEY NOT NULL,
	"person_entity_id" text NOT NULL,
	"company_entity_id" text NOT NULL,
	"title" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"confirmed_start" date,
	"estimated_start" date NOT NULL,
	"confirmed_end" date,
	"estimated_end" date
);
--> statement-breakpoint
CREATE TABLE "entities" (
	"id" text PRIMARY KEY NOT NULL,
	"type" "entity_type" NOT NULL,
	CONSTRAINT "entities_id_type_unique" UNIQUE("id","type"),
	CONSTRAINT "entities_id_prefix_matches_type" CHECK (("entities"."type" = 'PERSON' and starts_with("entities"."id", 'person_'))
        or ("entities"."type" = 'COMPANY' and starts_with("entities"."id", 'company_')))
);
--> statement-breakpoint
CREATE TABLE "linkedin_profiles" (
	"entity_id" text PRIMARY KEY NOT NULL,
	"entity_type" "entity_type" NOT NULL,
	"linkedin_url" text NOT NULL,
	"json_blob" jsonb,
	CONSTRAINT "linkedin_profiles_linkedinUrl_unique" UNIQUE("linkedin_url"),
	CONSTRAINT "linkedin_profiles_person_or_company" CHECK ("linkedin_profiles"."entity_type" in ('PERSON', 'COMPANY'))
);
--> statement-breakpoint
CREATE TABLE "note_links" (
	"entity_id" text NOT NULL,
	"note_id" text NOT NULL,
	CONSTRAINT "note_links_entity_id_note_id_pk" PRIMARY KEY("entity_id","note_id")
);
--> statement-breakpoint
CREATE TABLE "notes" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"text" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "people" (
	"entity_id" text PRIMARY KEY NOT NULL,
	"entity_type" "entity_type" DEFAULT 'PERSON' NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	CONSTRAINT "people_entity_type_is_person" CHECK ("people"."entity_type" = 'PERSON')
);
--> statement-breakpoint
CREATE TABLE "phones" (
	"id" text PRIMARY KEY NOT NULL,
	"number" text NOT NULL,
	"entity_id" text NOT NULL,
	"entity_type" "entity_type" NOT NULL,
	CONSTRAINT "phones_person_or_company" CHECK ("phones"."entity_type" in ('PERSON', 'COMPANY'))
);
--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_entity_id_entity_type_entities_id_type_fk" FOREIGN KEY ("entity_id","entity_type") REFERENCES "public"."entities"("id","type") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_domains" ADD CONSTRAINT "email_domains_company_entity_id_companies_entity_id_fk" FOREIGN KEY ("company_entity_id") REFERENCES "public"."companies"("entity_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_usernames" ADD CONSTRAINT "email_usernames_email_domain_id_email_domains_id_fk" FOREIGN KEY ("email_domain_id") REFERENCES "public"."email_domains"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_usernames" ADD CONSTRAINT "email_usernames_entity_id_entity_type_entities_id_type_fk" FOREIGN KEY ("entity_id","entity_type") REFERENCES "public"."entities"("id","type") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employment_history" ADD CONSTRAINT "employment_history_person_entity_id_people_entity_id_fk" FOREIGN KEY ("person_entity_id") REFERENCES "public"."people"("entity_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employment_history" ADD CONSTRAINT "employment_history_company_entity_id_companies_entity_id_fk" FOREIGN KEY ("company_entity_id") REFERENCES "public"."companies"("entity_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "linkedin_profiles" ADD CONSTRAINT "linkedin_profiles_entity_id_entity_type_entities_id_type_fk" FOREIGN KEY ("entity_id","entity_type") REFERENCES "public"."entities"("id","type") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "note_links" ADD CONSTRAINT "note_links_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "note_links" ADD CONSTRAINT "note_links_note_id_notes_id_fk" FOREIGN KEY ("note_id") REFERENCES "public"."notes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "people" ADD CONSTRAINT "people_entity_id_entity_type_entities_id_type_fk" FOREIGN KEY ("entity_id","entity_type") REFERENCES "public"."entities"("id","type") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "phones" ADD CONSTRAINT "phones_entity_id_entity_type_entities_id_type_fk" FOREIGN KEY ("entity_id","entity_type") REFERENCES "public"."entities"("id","type") ON DELETE cascade ON UPDATE no action;