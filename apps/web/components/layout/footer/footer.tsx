"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const SOCIALS = [
	{ name: "GitHub", href: "https://github.com/yourusername", icon: FaGithub },
	{ name: "Twitter", href: "https://twitter.com/yourusername", icon: FaTwitter },
	{ name: "LinkedIn", href: "https://linkedin.com/in/yourusername", icon: FaLinkedin },
] as const;

export default function Footerbar() {
	return (
		<footer className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 min-w-[320px] sm:min-w-[400px]">
			<motion.div
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.3 }}
				className="h-[6vh] min-h-[48px] px-6 border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-xl shadow-sm flex items-center justify-between gap-6"
			>
				<span className="text-xs text-neutral-500 dark:text-neutral-400">
					© {new Date().getFullYear()} Your Name
				</span>

				<div className="flex items-center gap-4">
					{SOCIALS.map(({ name, href, icon: Icon }) => (
						<Link
							key={name}
							href={href}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={name}
							className="text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
						>
							<Icon className="w-4 h-4" />
						</Link>
					))}
				</div>
			</motion.div>
		</footer>
	);
}