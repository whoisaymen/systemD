# Contributing to System D

Follow [the local setup guide](README.md) and work from the repository root.
The frontend and Sanity Studio are npm workspaces with one shared lockfile.

Create a branch, keep changes focused, and follow the conventions in the files
you edit. Include a regression test when fixing behavior covered by the test
suite. Avoid broad formatting changes unrelated to your work.

Before opening a pull request, run:

```sh
npm run check
npm run build
```

The frontend build requires the environment and Sanity access described in the
README. GitHub Actions runs lint, type checking, regression tests, and the Studio
build without private tokens. Vercel validates the frontend build using its own
environment configuration.

For dependency updates, use the pinned Node and npm versions, update dependencies
from the root, and commit the affected manifests together with
`package-lock.json`. Check peer dependencies and release notes before updating a
major version; do not bypass compatibility checks with `--force` or
`--legacy-peer-deps`. After an update, verify `npm ci` and the checks above.

npm 12 also requires explicit approval for dependency installation scripts. The
root `allowScripts` policy records the reviewed native build dependencies. After
updating one of these packages, review its script and run
`npm approve-scripts <package>` from the repository root to update the
version-specific approval.
`npm install-scripts ls` lists pending scripts without changing anything. Commit
the updated policy with the dependency changes and verify a clean `npm ci`.

Keep `.nvmrc`, `.node-version`, root `engines` and `packageManager`, and the runtime
versions in the README and deployment guide consistent when updating Node or npm.
CI reads these pins directly.

Describe the resulting behavior and validation in your pull request. Mention any
environment, hosting, or content migration steps reviewers need to apply. Never
commit credentials or migration backups.
