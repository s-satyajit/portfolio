import { Container } from "@/components/layout/container";
import { ContactForm } from "@/components/forms/contact-form";
import { PageHeader } from "@/components/ui/page-header";
import { profile } from "@/data/profile";
import { socialLinks } from "@/data/social-links";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Contact",
  description:
    "Contact Satyajit Samal for job opportunities, freelance projects, collaboration, or technical discussions.",
  path: "/contact"
});

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let’s connect with context"
        description="Share role details, project goals, timeline, and constraints. I respond with practical next steps."
      />

      <Container className="grid gap-6 pb-20 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="rounded-2xl border border-border bg-surface-card p-5">
          <h2 className="font-heading text-2xl">Direct Channels</h2>
          <ul className="mt-4 space-y-3 text-sm text-text-secondary">
            <li>
              <span className="text-text-primary">Email:</span> {profile.email}
            </li>
            <li>
              <span className="text-text-primary">Location:</span> {profile.location}
            </li>
          </ul>

          <div className="mt-5 space-y-2 text-sm">
            {socialLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="block text-accent"
              >
                {item.label}
              </a>
            ))}
          </div>
        </aside>

        <ContactForm />
      </Container>
    </>
  );
}
