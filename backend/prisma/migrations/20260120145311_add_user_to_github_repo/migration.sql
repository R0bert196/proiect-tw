/*
  Warnings:

  - Added the required column `userId` to the `GitHubRepo` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GitHubRepo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "GitHubRepo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_GitHubRepo" ("id", "name", "url") SELECT "id", "name", "url" FROM "GitHubRepo";
DROP TABLE "GitHubRepo";
ALTER TABLE "new_GitHubRepo" RENAME TO "GitHubRepo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
