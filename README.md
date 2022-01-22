This is an extension admin dashboard to the [Poster](https://joinposter.com/en) system.

## Technologies

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Requirements

- Node v16.13.2^
- NPM v8.1.2^

## Development

### Before you begin

This project contains a `.nvmrc` file with the desired node version. If you are using NVM and would like a full automation workflow please follow [these instructions](https://stackoverflow.com/questions/57110542/how-to-write-a-nvmrc-file-which-automatically-change-node-version).

### Run the development server

Install dependencies
```bash
npm i
```

Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on `http://localhost:3000/api/<route>`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### Self-deployment Steps

1. Build the project
   ```bash
   npm run build
   ```
   This bundles and minifies the project into the `.next` folder.
2. Serve the app on your server
   ```bash
   npm start
   ```

## Licencing

This software is protected by the MIT Licence. Anyone can fork, modify or distribute this software, however the authours take no responsibility for possible harm, bugs or exploits that this software might cause.

Unwanted change