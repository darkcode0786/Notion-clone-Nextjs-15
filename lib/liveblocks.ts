import { Liveblocks } from "@liveblocks/node";

const key = process.env.NEXT_PUBLIC_LIVEBLOCK_SECRET_KEY;

if (!key) {
    throw new Error("NEXT_PUBLIC_LIVEBLOCK_SECRET_KEY is not set");
}
const liveblocks = new Liveblocks({
    secret: key,
});

export default liveblocks;
