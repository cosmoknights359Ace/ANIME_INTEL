import Image from "next/image";

export default function GojoLoader({ text = "Loading…" }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <Image
        src="/gojo.gif"
        alt="Loading"
        width={120}
        height={120}
        unoptimized
        className="rounded-full shadow-[0_0_30px_rgba(163,230,53,0.3)]"
      />
      <p className="text-sm text-zinc-400">{text}</p>
    </div>
  );
}
