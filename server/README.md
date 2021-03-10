To run the server on your local machine, walk through the following steps:

- Make sure you have PostgreSQL installed.

- Create a database called "SMS".

- Copy the SQL code found in the [`db/schema.ddl`](https://github.com/obadakhalili/SMS/blob/main/server/src/db/schema.ddl) file, and execute it within the "SMS" database. It creates the necessary schema the backend API is expecting to find.

- Add a `.env` file in the root directory. It should look something of the sort:

```sh
PORT=8081 # Server port
PG_HOST=127.0.0.1
PG_PORT=8082 # The port in which your postgres database runs
PG_USER=postgres # Your postgres user
PG_PASSWORD=foobar # The password of your postgres user
PG_DB=SMS # The name of the database to connect to
DEBUG=false # If set to true, it will print
            # useful error messages to the console
```

- Install the necessary dependencies

```sh
yarn add
# OR
npm install
```

- Compile down the source code into JavaScript (since it's built with TypeScript). Then start the server

```sh
yarn build
yarn dev
# OR
npm run build
npm run dev
```
