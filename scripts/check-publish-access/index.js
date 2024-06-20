#!/usr/bin/env node
const getUnownedPackages = require('../get-unowned-packages');

async function main() {
try {
const { packages, user } = await getUnownedPackages();
if (packages.length > 0) {
console.warn(
`The following packages will fail to publish. Please add access for ${user}:`
);
console.warn(packages.map(pkg => ` - ${pkg.name}`).join('\n'));
process.exit(1);
} else {
console.log('All packages have the necessary access.');
}
} catch (err) {
console.error('An error occurred while checking package ownership:', err);
process.exit(1);
}
}

main();
