"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);

	const links = [
		{ name: "Home", href: "/" },
		{ name: "Projects", href: "/projects" },
		{ name: "About", href: "/about" },
	];

	return (
		<header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 min-w-[320px] sm:min-w-[400px]">
			<motion.div
				initial={{ y: -20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.3 }}
				className="h-[6vh] min-h-[48px] px-6 border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-xl shadow-sm flex items-center justify-between gap-6"
			>
				{/* Three Links */}
				<nav className="flex items-center gap-6">
					{links.map((link) => (
						<Link
							key={link.name}
							href={link.href}
							className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
						>
							{link.name}
						</Link>
					))}
				</nav>

				{/* Menu Icon */}
				<button
					onClick={() => setIsOpen((prev) => !prev)}
					className="p-3 rounded-md text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 transition-colors focus:outline-none cursor-pointer"
					aria-label="Toggle Menu"
				>
					{isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
				</button>
			</motion.div>

			{/* Dropdown menu when menu icon is clicked */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: -8, scale: 0.98 }}
						animate={{ opacity: 1, y: 6, scale: 1 }}
						exit={{ opacity: 0, y: -8, scale: 0.98 }}
						transition={{ duration: 0.2 }}
						className="w-full p-4 border border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-xl shadow-lg flex flex-col gap-2"
					>
						{links.map((link) => (
							<Link
								key={link.name}
								href={link.href}
								onClick={() => setIsOpen(false)}
								className="px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
							>
								{link.name}
							</Link>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
}