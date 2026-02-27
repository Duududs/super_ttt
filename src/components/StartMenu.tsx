import marioBg from "@/assets/mario-bg.png";

export type GameMode = "local" | "robot";

interface StartMenuProps {
  onSelectMode: (mode: GameMode) => void;
}

const StartMenu = ({ onSelectMode }: StartMenuProps) => {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${marioBg})` }}
    >
      <div className="mb-8 flex flex-col items-center">
        <h1 className="pixel-shadow text-center text-lg leading-relaxed text-foreground sm:text-2xl md:text-3xl">
          SUPER
        </h1>
        <img
          src="/icons/logo_name.png"
          alt="Tic Tac Toe Mario Edition"
          className="mt-2 w-60 max-w-[80vw] object-contain sm:w-72"
          draggable={false}
        />
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => onSelectMode("local")}
          className="question-block cursor-pointer rounded-lg border-2 border-transparent px-8 py-4 text-sm text-accent-foreground transition-all hover:animate-float hover:scale-110 hover:border-accent hover:brightness-110 hover:shadow-[0_0_0_4px_rgba(255,206,0,0.35)] active:scale-95 sm:text-base"
        >
          LOCAL VS LOCAL
        </button>
        <button
          onClick={() => onSelectMode("robot")}
          className="question-block cursor-pointer rounded-lg border-2 border-transparent px-8 py-4 text-sm text-accent-foreground transition-all hover:animate-float hover:scale-110 hover:border-accent hover:brightness-110 hover:shadow-[0_0_0_4px_rgba(255,206,0,0.35)] active:scale-95 sm:text-base"
        >
          LOCAL VS ROBÔ
        </button>
      </div>

      <p className="mt-6 animate-blink text-xs pixel-shadow text-foreground">
        ESCOLHA O MODO
      </p>

      <div className="brick-pattern fixed bottom-0 left-0 right-0 h-16" />
    </div>
  );
};

export default StartMenu;
