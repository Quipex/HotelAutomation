# Hotel Automation (WIP)

[👉 Link to the board 👈](https://github.com/Quipex/HotelAutomation/projects/1)

## Local setup

Run `yarn run setupdev` at the root of the project. This will set up the dev environment and instruct you what to do
next.

After initial setup, run `yarn run start:server` to start the server and `yarn run start:tg` to start telegram bot.

## 🐳 Docker

[➡ Docker README](.docker/README.md)

## 💻 Script commands (for development 👷‍♂️)

> 💡 All the .env paths are specified at [scripts/constants/envsToSetup.mjs](scripts/constants/envsToSetup.mjs)

- `yarn run setupdev` - triggers all the scripts to set up a project: `setupenv`, `createdirs`, `install:all`, `husky install`
- `yarn run checkenv` - compares .env.example files and folders with their .env respective clones. Outputs if there are
  any differences in the set of keys. Useful to test whether the developer has added a new key to .env or .env.example
  that is omitted at its respectful copy.
- `yarn run setupenv` - follows all the specified [⬆](scripts/constants/envsToSetup.mjs) .env paths and creates .env
  files from .env.example.
- `yarn run audit:all` - runs audit for all the modules
- `yarn run install:all` - builds common module and installs all the modules
- `yarn run lint:all` - lints all the modules

## ⛓ Git hooks

> Implemented with husky (`husky install`) and some manual scripting

- `pre-commit` lints all the staged files
- `pre-push` runs `checkenv` and `test`
