import {
  BookIcon,
  GitPullRequestIcon,
  MessageSquareIcon,
  TwitterIcon,
} from "lucide-react";
import { FC } from "react";
import Link from "next/link";

export const Footer: FC = () => {
  return (
    <footer className="flex justify-center items-center h-28 gap-3">
      <Link
        href="https://discord.gg/penumbrazone"
        title="The Official Penumbra Discord"
      >
        <MessageSquareIcon className="w-4" />
      </Link>
      <Link
        href="https://guide.penumbra.zone/"
        title="Penumbra User Guide"
      >
        <BookIcon className="w-4" />
      </Link>
      <Link
        href="https://github.com/penumbra-zone/cuiloa"
        title="Cuiloa Source Code"
      >
        <GitPullRequestIcon className="w-4" />
      </Link>
      <Link
        href="https://twitter.com/penumbrazone"
        title="Penumbra's Twitter"
      >
        <TwitterIcon className="w-4" />
      </Link>
    </footer>
  );
};
