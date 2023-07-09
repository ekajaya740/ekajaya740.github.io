const greetings = require("greetings");

export async function GreetingsText() {
  return (
    <h2 className={`text-left font-medium text-2xl`}>
      {await greetings()}, My name is
    </h2>
  );
}

export default GreetingsText;
