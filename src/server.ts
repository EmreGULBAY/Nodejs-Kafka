import { createServer } from "./app";

const main = async () => {
  const app = createServer();
  const port = 3000;
  const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
