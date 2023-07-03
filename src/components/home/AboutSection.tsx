const greetings = require("greetings");

export default function AboutSection() {
  return (
    <section className={"container mx-auto"}>
      <div>
        <h2 className="text-left font-medium text-2xl">
          {greetings()}, My name is
        </h2>
        <h1 className="text-center font-bold text-4xl">
          I Putu Ekajaya Awidya Putra
        </h1>
      </div>
    </section>
  );
}
