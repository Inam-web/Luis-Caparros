import { cn } from "../utils/cn";

export default function RealBookCover({ product, className, interactive = true }) {
  const { title, slug } = product;
  
  const imageMap = {
    "hijas-del-viento": "/images/books/hijas-del-viento.jpeg",
    "lagrimas-saladas": "/images/books/lagrimas-saladas.jpeg",
    "el-arbol-de-la-memoria": "/images/books/el-arbol-de-la-memoria.jpeg",
    "volver-tras-mis-pasos": "/images/books/volver-tras-mis-pasos.jpeg",
    "lucia-la-romi-lorquina": "/images/books/lucia-la-romi-lorquina.jpeg",
    "suenos-y-recuerdos-de-un-maestro-de-escuela": "/images/books/suenos-y-recuerdos-de-un-maestro-de-escuela.jpeg",
    "urbanismo-mas-alla-de-la-razon": "/images/books/urbanismo-mas-alla-de-la-razon.jpeg",
  };

  const imageSrc = imageMap[slug] || "/images/books/placeholder.jpeg";

  return (
    <div className={cn("@container w-full", className)}>
      <div className={cn("cover-3d w-full", !interactive && "[&_.cover-3d-inner]:!transform-none [&_.cover-3d-inner]:!shadow-none")}>
        <div
          className="cover-3d-inner relative w-full aspect-[2/3] rounded-r-[3px] rounded-l-[6px] overflow-hidden select-none bg-pine-800"
          role="img"
          aria-label={`Cover of ${title}`}
        >
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.08)_0%,transparent_28%,transparent_72%,rgba(0,0,0,0.3)_100%)]" />
          <div className="cover-spine" />
          <div className="cover-pages" />
        </div>
      </div>
    </div>
  );
}