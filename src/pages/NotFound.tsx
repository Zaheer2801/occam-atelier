import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.warn("404: route not found:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="atelier min-h-screen flex flex-col items-center justify-center atelier-grid-bg p-6">
      <div className="text-center max-w-md">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">Error 404</p>
        <h1 className="text-4xl font-semibold mt-4">Page not found</h1>
        <p className="mt-4 text-muted-foreground">
          The path <span className="font-mono">{location.pathname}</span> doesn't exist.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background hover:opacity-90 transition"
        >
          <Home className="h-4 w-4" /> Back to Atelier
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
