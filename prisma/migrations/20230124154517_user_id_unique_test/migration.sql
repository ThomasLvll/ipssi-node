/*
  Warnings:

  - A unique constraint covering the columns `[toDoListId]` on the table `ToDoItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `ToDoList` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ToDoItem_toDoListId_key" ON "ToDoItem"("toDoListId");

-- CreateIndex
CREATE UNIQUE INDEX "ToDoList_userId_key" ON "ToDoList"("userId");
