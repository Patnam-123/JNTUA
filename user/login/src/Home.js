function Home() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Welcome to Home</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-200 p-4 rounded">Card 1</div>
        <div className="bg-green-200 p-4 rounded">Card 2</div>
        <div className="bg-yellow-200 p-4 rounded">Card 3</div>
      </div>
    </div>
  );
}

export default Home;
