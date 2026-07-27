const minimum = [22, 13, 0]
const current = process.versions.node.split(".").map(Number)

const compareVersions = (left, right) => {
	for (let index = 0; index < right.length; index += 1) {
		if (left[index] > right[index]) return 1
		if (left[index] < right[index]) return -1
	}

	return 0
}

if (compareVersions(current, minimum) < 0) {
	console.error(
		[
			`This project requires Node.js >=${minimum.join(".")}.`,
			`Current Node.js version: ${process.version}`,
			"",
			"Run one of these before starting dev:",
			"  nvm install && nvm use",
			"  fnm install && fnm use",
			"  mise install && mise use",
		].join("\n"),
	)
	process.exit(1)
}
