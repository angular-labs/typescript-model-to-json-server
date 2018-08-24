# Typescript model to JSON server

Generate [json-server](https://github.com/typicode/json-server) databases from typescript models.

## Usage

Install the package
```console
npm install -g typescript-model-to-json-server
```


Let's suppose we have a model like:

```typescript
export interface User {
  id: number;
  username: string;
  password: string;
}
```

Then, we use the cli:

```console
model-json user.model.ts --json=db.json --inserts=5 --clean
```

The generated db.json will look like:

```json
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

### Depth properties

Let's suppose we have two models:

```typescript
import { Player } from './player.model';

export interface Team {
  id: string;
  name: string;
  players: Player[];
}
```

```typescript
import { Team } from './team.model';

export interface Player {
  id: string;
  name: string;
  team: Team;
}
```

hen, we use the cli:

```console
model-json team.model.ts player.model.ts --json=db.json --inserts=5 --clean
```

The generated db.json will look like:

```json
{
  "players": [
    {
      "id": "id-f6bvl",
      "name": "name-xjomw",
      "team": {
        "id": "id-jbg5c",
        "name": "name-kp7yc"
      }
    },
    {
      "id": "id-qu7fw",
      "name": "name-9v44s",
      "team": {
        "id": "id-jbg5c",
        "name": "name-kp7yc"
      }
    },
    {
      "id": "id-b4bfh",
      "name": "name-90nn7",
      "team": {
        "id": "id-1rpyh",
        "name": "name-mxubp"
      }
    },
    {
      "id": "id-jxhpu",
      "name": "name-3b8eq",
      "team": {
        "id": "id-1rpyh",
        "name": "name-mxubp"
      }
    },
    {
      "id": "id-6wrr9",
      "name": "name-rll4f",
      "team": {
        "id": "id-rlubd",
        "name": "name-oi1eb"
      }
    }
  ],
  "teams": [
    {
      "id": "id-jbg5c",
      "name": "name-kp7yc",
      "players": [
        {
          "id": "id-f6bvl",
          "name": "name-xjomw"
        },
        {
          "id": "id-qu7fw",
          "name": "name-9v44s"
        }
      ]
    },
    {
      "id": "id-bqwn7",
      "name": "name-lyyx5",
      "players": []
    },
    {
      "id": "id-1rpyh",
      "name": "name-mxubp",
      "players": [
        {
          "id": "id-b4bfh",
          "name": "name-90nn7"
        },
        {
          "id": "id-jxhpu",
          "name": "name-3b8eq"
        }
      ]
    },
    {
      "id": "id-1v3bs",
      "name": "name-1qe1i",
      "players": []
    },
    {
      "id": "id-rlubd",
      "name": "name-oi1eb",
      "players": [
        {
          "id": "id-6wrr9",
          "name": "name-rll4f"
        }
      ]
    }
  ]
}
```

## CLI options

```console
Options:
  --json, -j     Set json path                              [default: "db.json"]
  --inserts, -i  Set the number of random inserts                   [default: 5]
  --clean, -c    Clean json before generating                          [boolean]
  --replace, -r  Replace objects already generated from model.         [boolean]
  --help, -h     Show help                                             [boolean]
  --version, -v  Show version number                                   [boolean]

Examples:
  model-json player.model.ts team.model.ts --json=db.json --inserts=5 --clean
  model-json team.model.ts --json=db.json --inserts=3
```