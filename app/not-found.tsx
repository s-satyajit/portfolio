import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";

export default function NotFound() {
  return (
    <section className="py-24">
      <Container className="max-w-3xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent">404</p>
        <h1 className="mt-4 font-heading text-4xl sm:text-5xl">Page not found</h1>
        <p className="mt-4 text-text-secondary">
          This route does not exist or may have moved during the portfolio rebuild.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink href="/">Back Home</ButtonLink>
          <ButtonLink href="/projects" variant="secondary">
            Browse Projects
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
