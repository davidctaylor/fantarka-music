module.exports = {
  "extends": ["react-app"],
  "rules": {
    "additional-rule": "warn"
  },
  "overrides": [
    {
      "files": ["**/*.ts?(x)"],
      "rules": {
        "additional-typescript-only-rule": "warn"
      }
    }
  ]
}
