# Typescript model to JSON server

Generate [json-server](https://github.com/typicode/json-server) databases from typescript models.

## Usage

Let's suppose we have a model like:

```
export interface User {
  id: number;
  username: string;
  password: string;
}
```

Then, we use the cli:

```
model-json user.model.ts --json=db.json --inserts=5 --clean
```

The generated db.json will look like:

```
{
  "user": [
    {
      "id": 956,
      "username": "usern-hdkaw",
      "password": "passw-9nkgs"
    },
    {
      "id": 944,
      "username": "usern-xnj6h",
      "password": "passw-24lyc"
    },
    {
      "id": 743,
      "username": "usern-xkc7p",
      "password": "passw-bvb4m"
    },
    {
      "id": 87,
      "username": "usern-zpriz",
      "password": "passw-c0l9n"
    },
    {
      "id": 220,
      "username": "usern-y2jsd",
      "password": "passw-3petc"
    }
  ]
}
```

## CLI options

```
Options:
  --json, -j     Set json path                              [default: "db.json"]
  --inserts, -i  Set the number of random inserts                   [default: 5]
  --clean, -c    Clean json before generating                          [boolean]
  --help, -h     Show help                                             [boolean]
  --version, -v  Show version number                                   [boolean]

Examples:
  model-json user.model.ts --json=db.json --inserts=5 --clean
  model-json user.model.ts --json=db.json --inserts=3
```

PS: Does not generating depth properties yet(PR are welcome).