import { createConnection } from 'typeorm';

const main = async () => {
  let retries = 5;
  try {
    while (retries) {
      await createConnection();
      break;
    }
  } catch (e) {
    console.error(e);
    retries -= 1;
    console.log(`retries left: ${retries}`);
    await new Promise((res) => setTimeout(res, 4000));
  }
};

main();
