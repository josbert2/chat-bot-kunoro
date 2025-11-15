CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`session_id` varchar(255) NOT NULL,
	`role` varchar(20) NOT NULL,
	`content` text NOT NULL,
	`intent` varchar(50),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ip_address` varchar(45) NOT NULL,
	`session_id` varchar(255) NOT NULL,
	`user_agent` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`last_activity` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `sessions_session_id_unique` UNIQUE(`session_id`)
);
--> statement-breakpoint
CREATE INDEX `session_idx` ON `messages` (`session_id`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `messages` (`created_at`);--> statement-breakpoint
CREATE INDEX `ip_idx` ON `sessions` (`ip_address`);--> statement-breakpoint
CREATE INDEX `session_idx` ON `sessions` (`session_id`);