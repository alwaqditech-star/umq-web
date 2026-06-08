import {
  Brain,
  Cloud,
  Code2,
  Headphones,
  Layers,
  Megaphone,
  Palette,
  Shield,
  Smartphone,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

export const serviceIconMap: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  cloud: Cloud,
  shield: Shield,
  code: Code2,
  brain: Brain,
  headphones: Headphones,
  layers: Layers,
  smartphone: Smartphone,
  palette: Palette,
  megaphone: Megaphone,
  users: Users,
};

/** Gradient backgrounds per icon for carousel cards */
export const serviceGradientMap: Record<string, string> = {
  code: "from-violet-500 via-fuchsia-500 to-pink-500",
  smartphone: "from-blue-500 via-indigo-500 to-violet-500",
  palette: "from-rose-400 via-orange-400 to-amber-400",
  megaphone: "from-emerald-400 via-teal-500 to-cyan-500",
  users: "from-slate-600 via-blue-700 to-indigo-800",
  sparkles: "from-amber-400 via-orange-500 to-rose-500",
  cloud: "from-sky-400 via-blue-500 to-indigo-600",
  shield: "from-red-500 via-rose-600 to-pink-600",
  brain: "from-purple-500 via-violet-600 to-fuchsia-600",
  headphones: "from-green-500 via-emerald-600 to-teal-600",
  layers: "from-gray-500 via-slate-600 to-zinc-700",
};
