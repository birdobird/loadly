export const metadata = {
  title: "Strona nie istnieje | Loadly",
  description: "Żądana strona nie została odnaleziona",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center flex-col gap-4 text-center p-8">
      <h1 className="text-4xl font-bold">
        404 – Strona nie została znaleziona
      </h1>
      <p className="text-muted-foreground">
        Wygląda na to, że ta strona nie istnieje lub została przeniesiona.
      </p>
      <a
        href="/"
        className="mt-4 px-4 py-2 rounded-lg bg-black text-white hover:bg-zinc-900"
      >
        Wróć na stronę główną
      </a>
    </div>
  );
}
