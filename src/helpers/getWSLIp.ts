import { env } from "./env";
import { exec } from "child_process";

export default async function getWSLIp() {
  if (!env.ETHERNET_INTERFACE) return `http://127.0.0.1:${env.PORT}/`;

  return new Promise((res, rej) => {
    exec(
      `ifconfig ${env.ETHERNET_INTERFACE} | grep "inet "`,
      (err, stdout, stderr) => {
        if (err) rej(err);

        if (stderr) rej(stderr);

        res(`http://${stdout.split(/ +/)[2]}:${env.PORT}/`);
      }
    );
  });
}
