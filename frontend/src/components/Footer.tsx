export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'brainrot-trade-hub');

  return (
    <footer className="border-t border-neon/20 bg-surface py-6 mt-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 font-bold">
          <span className="text-neon">BRAINROT</span>
          <span>TRADE HUB</span>
          <span className="text-muted-foreground/50">©{year}</span>
        </div>
        <p className="text-xs">
          Built with{' '}
          <span className="text-orange" aria-label="love">
            ❤️
          </span>{' '}
          using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neon hover:underline font-semibold"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
