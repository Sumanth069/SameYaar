export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center px-4">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Not the only one who hates that, right?
        </h1>

        <p className="text-gray-600 mb-6">
          Turns out someone else feels the same.
          <br />
          Find your SameYaar.
        </p>

        <a href="/prompts">
  <button className="bg-black text-white px-6 py-3 rounded-lg text-lg">
    Start Now
  </button>
</a>

      </div>
    </main>
  );
}
