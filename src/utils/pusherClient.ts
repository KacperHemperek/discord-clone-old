import Pusher from "pusher-js";

export const CHANNEL_NAME = "full-earth-494";

export const pusherClient = new Pusher("8c41deb0bd050b586c21", {
  cluster: "eu",
  forceTLS: true,
});
