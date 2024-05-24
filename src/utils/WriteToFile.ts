import fs from "fs";
const DEFAULT_OPTIONS = { encoding: "utf-8", flag: "a", mode: 0o666 };

export const writeToFile = (
  type: string,
  data: string,
  options: any = DEFAULT_OPTIONS
) => {
  fs.writeFile(`${type}.log`, data + ",\n", options, (err) => {
    if (err) console.error(err);
    console.log(`${type} logged to file`);
  });
};
