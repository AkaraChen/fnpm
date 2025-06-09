wget -O - https://www.schemastore.org/pnpm-workspace.json | jq . > ./generated/pnpm-workspace-spec.json
json2ts -i ./generated/pnpm-workspace-spec.json -o ./generated/pnpm-workspace-spec.ts
