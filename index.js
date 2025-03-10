#!/usr/bin/env node

// Run : npx tasktracker

import inquirer from "inquirer";
import fs from "fs";

const taskfile = "./tasks.txt";

if (!fs.existsSync(taskfile)) {
  fs.writeFileSync(taskfile, JSON.stringify([]));
}

let tasks = JSON.parse(fs.readFileSync(taskfile));
let count = tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) : 0;

const saveTasks = () => {
  fs.writeFileSync(taskfile, JSON.stringify(tasks, null, 2));
};

const addTask = async () => {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "taskinfo",
      message: "Enter the task: ",
      validate: (input) => {
        return input.trim() !== "" ? true : "details cannot be empty";
      },
    },
  ]);

  tasks.push({
    id: ++count,
    description: answers.taskinfo,
    status: "to-do",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  saveTasks();
  console.log("✅ new task added");
};

const updateTask = async () => {
  if (tasks.length == 0) {
    console.log("⚠️ no tasks to update");
    return;
  }

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "taskindex",
      message: "Choose a task to update: ",
      choices: tasks.map((task, index) => ({
        name: task.description,
        value: index,
      })),
    },
    {
      type: "list",
      name: "option",
      message: "Choose a field to update: ",
      choices: ["description", "status"],
    },
  ]);

  const index = answers.taskindex;
  if (index >= 0 && index < tasks.length) {
    if (answers.option == "description") {
      const { update } = await inquirer.prompt([
        {
          type: "input",
          name: "update",
          message: "Enter the new description: ",
          validate: (input) => {
            return input.trim() !== "" ? true : "details cannot be empty";
          },
        },
      ]);
      tasks[index].description = update;
    } else {
      const { update } = await inquirer.prompt([
        {
          type: "list",
          name: "update",
          message: "Choose new status: ",
          choices: ["to-do", "in-progress", "done"],
        },
      ]);
      tasks[index].status = update;
    }
    tasks[index].updatedAt = Date.now();
    saveTasks();
    console.log("✅ updated");
  } else {
    console.log("Invalid index");
    return;
  }
};

const deleteTask = async () => {
  if (tasks.length == 0) {
    console.log("⚠️ no tasks to delete");
    return;
  }

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "taskindex",
      message: "Choose a task to delete: ",
      choices: tasks.map((task, index) => ({
        name: task.description,
        value: index,
      })),
    },
  ]);

  const index = answers.taskindex;
  if (index >= 0 && index < tasks.length) {
    tasks.splice(index, 1);
    saveTasks();
    console.log("🗑️ deleted");
  } else {
    console.log("Invalid index");
    return;
  }
};

const listTasks = async () => {
  if (tasks.length == 0) {
    console.log("⚠️ no tasks present");
    return;
  }

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "status",
      message: "Choose a status-type to list: ",
      choices: ["all", "done", "to-do", "in-progress"],
    },
  ]);

  console.log(
    "\n📌 list of the tasks (✗ => to-do, O => in-progress, ✓ => done): "
  );
  if (answers.status == "all") {
    tasks.forEach((task, index) => {
      let stat =
        task.status == "to-do" ? "✗" : task.status == "done" ? "✓" : "O";
      console.log(`${index + 1}. ${stat} ${task.description}`);
    });
  } else if (answers.status == "done") {
    let filteredTasks = tasks.filter((task) => task.status == "done");
    if (filteredTasks.length === 0) {
      console.log("⚠️ no tasks found in this category");
      return;
    }
    filteredTasks.forEach((task, index) => {
      console.log(`${++index}. ✓ ${task.description}`);
    });
  } else if (answers.status == "to-do") {
    let filteredTasks = tasks.filter((task) => task.status == "to-do");
    if (filteredTasks.length === 0) {
      console.log("⚠️ no tasks found in this category");
      return;
    }
    filteredTasks.forEach((task, index) => {
      console.log(`${++index}. ✗ ${task.description}`);
    });
  } else {
    let filteredTasks = tasks.filter((task) => task.status == "in-progress");
    if (filteredTasks.length === 0) {
      console.log("⚠️ no tasks found in this category");
      return;
    }
    filteredTasks.forEach((task, index) => {
      console.log(`${++index}. O ${task.description}`);
    });
  }
};

const menu = async () => {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "option",
      message: "\nChoose an action: ",
      choices: [
        "add a task",
        "update a task",
        "delete a task",
        "list tasks",
        "exit",
      ],
    },
  ]);

  if (answers.option == "add a task") {
    await addTask();
  } else if (answers.option == "update a task") {
    await updateTask();
  } else if (answers.option == "delete a task") {
    await deleteTask();
  } else if (answers.option == "list tasks") {
    await listTasks();
  } else if (answers.option == "exit") {
    process.exit();
  } else {
    console.log("invalid option");
  }

  menu();
};

menu();
