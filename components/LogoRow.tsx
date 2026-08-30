export default function LogoRow({ size = "h-8" }: { size?: string }) {
  const logos = [
    { src: "/logos/kpp-mining.png", alt: "PT Kalimantan Prima Persada" },
    { src: "/logos/ciss.png", alt: "CISS" },
    { src: "/logos/asto.png", alt: "ASTO" },
    { src: "/logos/plant-asto.jpeg", alt: "Plant ASTO" },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {logos.map((logo) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={logo.src}
          src={logo.src}
          alt={logo.alt}
          className={`${size} w-auto object-contain`}
        />
      ))}
    </div>
  );
}
