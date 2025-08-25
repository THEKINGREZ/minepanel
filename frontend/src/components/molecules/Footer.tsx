import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="relative z-10 py-4 px-6 border-t border-gray-800/60 bg-black/30 backdrop-blur-md">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <motion.div initial={{ rotate: 0 }} whileHover={{ rotate: 180 }} transition={{ duration: 0.6 }}>
            <Image src="/images/compass.webp" alt="Compass" width={24} height={24} className="opacity-80" />
          </motion.div>
          <p className="text-sm text-gray-300 font-minecraft">&copy; {new Date().getFullYear()} Hecho con ❤️ Ketbome.</p>
        </div>

        <div className="flex space-x-6 text-gray-300">
          <Link href="#" className="text-sm hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-500 rounded-sm"></span>
            Ayuda
          </Link>
          <Link href="https://github.com/Ketbome/minecraft-docker-manager/blob/main/Readme.md" className="text-sm hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-500 rounded-sm"></span>
            Documentación
          </Link>
          <Link href="https://github.com/Ketbome/minecraft-docker-manager" className="text-sm hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-500 rounded-sm"></span>
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}
