// Imports Start
import React, { useState } from "react";
import { Search as SearchIcon, X } from "lucide-react";
// Imports End

type SearchProps = {
	placeholder?: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	className?: string;
};

const Search = ({
	placeholder = "Search movies...",
	value,
	onChange,
	className = "",
}: SearchProps) => {
	const [isFocused, setIsFocused] = useState(false);

	// Handle Clear Method Start
	const handleClear = () => {
		onChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
	};
	// Handle Clear Method End

	return (
		<div
			className={`relative w-full group transition-all duration-300 ${className}`}
		>
			{/* Search Container Start */}
			<div
				className={`w-full rounded-xl shadow-sm border px-4 py-3 flex items-center gap-3 transition-all duration-300 ${
					isFocused
						? "shadow-lg ring-2 ring-indigo-500/20 dark:ring-indigo-400/20 scale-[1.01]"
						: "shadow-sm hover:shadow-md"
				}`}
				style={{
					background: "var(--background)",
					color: "var(--foreground)",
					borderColor: isFocused ? "rgb(99 102 241 / 0.5)" : "var(--border)",
				}}
			>
				{/* Search Icon Start */}
				<SearchIcon
					className={`w-5 h-5 transition-colors duration-300 ${
						isFocused
							? "text-indigo-500 dark:text-indigo-400"
							: "text-gray-400 dark:text-gray-500"
					}`}
				/>
				{/* Search Icon End */}

				{/* Input Field Start */}
				<input
					type="text"
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					className="w-full bg-transparent outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm font-medium"
					style={{
						color: "var(--foreground)",
					}}
				/>
				{/* Input Field End */}

				{/* Clear Button */}
				{value && (
					<button
						onClick={handleClear}
						className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 opacity-60 hover:opacity-100"
						type="button"
					>
						<X className="w-4 h-4" />
					</button>
				)}
			</div>
			{/* Search Container End */}

			{/* Focus Glow Effect Start */}
			{isFocused && (
				<div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-xl -z-10 animate-pulse" />
			)}
			{/* Focus Glow Effect End */}
		</div>
	);
};

export default Search;
