# Task-Tracker-CLI

Task-Tracker-CLI is a simple command-line tool for managing tasks in a `tasks.txt` file. It allows users to **add, update, delete, and list tasks** with different statuses.

## Features
- 📄 **View tasks** with different statuses
- ✍️ **Add** new tasks
- 🔄 **Update** task description or status
- 🗑️ **Delete** tasks
- ✅ Status options: **to-do, in-progress, done**
- 🛠️ Built with **Node.js, Inquirer.js, and fs module**

## Installation

1. Clone this repository:
   ```sh
   git clone https://github.com/Shrry10/Task-Tracker-CLI.git
   cd tasktracker-cli
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Link the CLI globally:
   ```sh
   npm link
   ```

## Usage

Run the following command to start the CLI:
```sh
 tasktracker
```

### Menu Options

1. **Add Task** - Add a new task to `tasks.txt`.
2. **Update Task** - Update an existing task's description or status.
3. **Delete Task** - Remove a task from the list.
4. **List Tasks** - View tasks filtered by status.
5. **Exit** - Close the CLI.

## Example

```sh
$ tasktracker
? Select an action: (Use arrow keys)
  Add Task
❯ Update Task
  Delete Task
  List Tasks
  Exit
```

If you choose **List Tasks**:
```sh
? Choose a status-type to list: (Use arrow keys)
  All
❯ Done
  Not Done
  In Progress

📌 List of Tasks (✗ => to-do, O => in-progress, ✓ => done):
1. ✗ Buy groceries
2. O Work on project
3. ✓ Submit assignment
```

## File Handling
- The tasks are stored in `tasks.txt` (ignored by Git using `.gitignore`).
- If `tasks.txt` does not exist, it will be created automatically.

## Uninstall
To remove the CLI tool:
```sh
npm unlink
```

<!-- ## License
This project is licensed under the **MIT License**. -->

---
**Happy Tracking! 🚀**

