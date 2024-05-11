import fs from "fs";

const defaultOptions = { encoding: "utf-8", flag: "a", mode: 0o666 };

export const writeToFile = (
  type: string,
  data: string,
  options?: any,
  callback?: (param: any) => void
) => {
  fs.writeFile(
    `${type}.log`,
    data + ",\n",
    options ? options : defaultOptions,
    callback
      ? callback
      : (err) => {
          if (err) {
            console.error(err);
          } else {
            console.log(`${type} logged to file`);
          }
        }
  );
};
