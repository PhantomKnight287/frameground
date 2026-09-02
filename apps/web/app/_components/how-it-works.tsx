const steps = [
  {
    title: "Read the brief",
    body: "Every challenge opens with the problem, the constraints, and the tests it has to satisfy - written the way a ticket would be.",
  },
  {
    title: "Write it in the editor",
    body: "A real workspace boots in your browser: file tree, Monaco, a terminal. Nothing to install, nothing to configure.",
  },
  {
    title: "Run the tests",
    body: "Jest or Vitest runs against your code and tells you exactly what broke. Pass, and the challenge is marked on your profile.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y bg-muted/30">
      <div className="container px-4 py-16 md:px-6">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          How it works
        </h2>
        <ol className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className="flex flex-col gap-3">
              <span
                aria-hidden="true"
                className="flex size-8 items-center justify-center rounded-full border bg-background text-sm font-semibold tabular-nums"
              >
                {i + 1}
              </span>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="text-sm leading-6 text-muted-foreground">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
