
import { db } from "../db";
import { sql } from "drizzle-orm";

async function addPremiumFields() {
  try {
    console.log("Adding premium fields to users table...");
    
    await db.execute(sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS premium_expires_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS premium_promoted_by TEXT
    `);
    
    console.log("Premium fields added successfully!");
  } catch (error) {
    console.error("Error adding premium fields:", error);
    throw error;
  }
}

addPremiumFields()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
