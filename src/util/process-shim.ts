// Shim NODE_ENV. Our production build replaces all usages and it gets DCEd.
// Downstream users can use replacers or envifiers achieve the same.
export default { env: { NODE_ENV: "development" } };
