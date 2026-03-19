export interface SocialLink {
  label: string;
  href: string;
  username?: string;
}

export const socialLinks: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/s-satyajit",
    username: "s-satyajit"
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/satyajitsamal/"
  },
  {
    label: "X",
    href: "https://twitter.com/satyajitstwt"
  }
];

export const sameAsLinks = socialLinks.map((item) => item.href);
