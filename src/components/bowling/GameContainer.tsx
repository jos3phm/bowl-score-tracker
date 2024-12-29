interface GameContainerProps {
  children: React.ReactNode;
}

export const GameContainer = ({ children }: GameContainerProps) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-8">
          <h1 className="text-3xl font-bold text-center text-gray-800">
            Bowling Scorecard
          </h1>
          {children}
        </div>
      </div>
    </div>
  );
};