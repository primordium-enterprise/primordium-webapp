import hrefs from "@/config/hrefs";
import { DiscordLogoIcon, GitHubLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const links = [
  {
    icon: (props: any) => <GitHubLogoIcon {...props} />,
    href: hrefs.github_contracts,
  },
  {
    icon: (props: any) => <DiscordLogoIcon {...props} />,
    href: hrefs.discord,
  },
  {
    icon: (props: any) => <TwitterLogoIcon {...props} />,
    href: hrefs.x,
  },
];

export default function Footer() {
  return (
    <footer className="flex items-center justify-center gap-4 p-4 xs:gap-5 sm:gap-6">
      {links.map((link) => {
        return (
          <Link
            key={link.href}
            href={link.href}
            target="_blank"
            className="text-foreground-500 transition-colors hover:text-foreground"
          >
            <link.icon className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6" />
          </Link>
        );
      })}
    </footer>
  );
}
