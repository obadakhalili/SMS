To run the client on your local machine, run

```sh
yarn install
# OR
npm install
```

then

```sh
yarn start
# OR
npm start
```

**Note**: You might be surprised as to why all of the application is placed within one file (src/SMS.tsx). The reason is that the app deals only with one module, the student module, it can be represented as one main component with very self-contained child components. Hence why it's okay to write it all in one file in such a small app. Though usually, I do separate my client app into several file components.
