import { ButtonLink } from "./button";

type CourseCardProps = {
  title: string;
  price: string;
  access: string;
  lead: string;
  points: string[];
  cta: string;
  featured?: boolean;
};

export function CourseCard({ title, price, access, lead, points, cta, featured = false }: CourseCardProps) {
  return (
    <div
      className={`flex flex-col rounded-card border bg-surface p-6 shadow-card sm:p-8 ${
        featured ? "border-accent" : "border-line"
      }`}
    >
      <h3 className="font-heading text-xl font-bold sm:text-2xl">{title}</h3>
      <p className="mt-3 text-ink-muted">{lead}</p>
      <div className="mt-6 font-heading text-3xl font-bold">{price}</div>
      <p className="mt-1 text-sm text-ink-muted">{access}</p>
      <ul className="mt-6 flex flex-col gap-3">
        {points.map((point) => (
          <li key={point} className="flex gap-3">
            <span className="mt-2 size-2 shrink-0 rounded-pill bg-accent" aria-hidden="true" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
      <ButtonLink href="#join" className="mt-8 w-full" variant={featured ? "primary" : "secondary"}>
        {cta}
      </ButtonLink>
    </div>
  );
}
