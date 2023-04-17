import { NavItem } from "@/types/nav"

interface SiteConfig {
  name: string
  description: string
  mainNav: NavItem[]
  links: {
    twitter: string
    github: string
    docs: string
  }
}

export const siteConfig: SiteConfig = {
  name: "TuneGPT",
  description:
    "Fine Tune GPT Models online",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Train",
      href: "/app",
    },
    {
      title: "Run",
      href: "/run",
    },
  ],
  links: {
    twitter: "https://twitter.com/shrey_ama",
    github: "https://github.com/Amargol/TuneGPT",
    docs: "https://ui.shadcn.com",
  },
}
