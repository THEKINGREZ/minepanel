export function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="container flex flex-col items-center justify-between gap-4 px-4 text-center md:flex-row md:text-left">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Tulalandia. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}
