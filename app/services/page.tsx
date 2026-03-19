import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/ui/page-header";
import { services } from "@/data/services";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Services",
  description:
    "Freelance and client services offered by Satyajit Samal across full-stack development, dashboards, and AI integration.",
  path: "/services"
});

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Client-focused engineering services"
        description="Clear deliverables for founders, startups, and teams who need practical, production-minded implementation."
      />

      <Container className="pb-20">
        <div className="grid gap-4 md:grid-cols-2">
          {services.map((service) => (
            <article key={service.slug} className="rounded-2xl border border-border bg-surface-card p-5">
              <p className="font-heading text-2xl">{service.title}</p>
              <p className="mt-2 text-sm text-text-secondary">{service.summary}</p>
              <ul className="mt-4 space-y-1 text-sm text-text-secondary">
                {service.deliverables.map((deliverable) => (
                  <li key={deliverable}>• {deliverable}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Container>
    </>
  );
}
