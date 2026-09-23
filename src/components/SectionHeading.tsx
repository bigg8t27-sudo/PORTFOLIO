interface SectionHeadingProps {
  number?: string;
  title: string;
  subtitle?: string;
  description?: string;
}

export const SectionHeading = ({
  number,
  title,
  subtitle,
  description,
}: SectionHeadingProps) => {
  return (
    <div className="mb-12 md:mb-16">
      {number && (
        <p className="text-accent text-xs font-grotesk font-semibold tracking-widest mb-4 uppercase">
          {number}
        </p>
      )}
      <div className="max-w-3xl">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-grotesk font-bold mb-4 leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xl text-text-secondary font-grotesk font-semibold">
            {subtitle}
          </p>
        )}
        {description && (
          <p className="text-text-secondary mt-4 text-base leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
