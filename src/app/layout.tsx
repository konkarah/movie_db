// Imports Start
import Header from "@/app/components/topbar/Header";
import Navbar from "@/app/components/topbar/Navbar";
import Providers from "./components/Theme";
import SearchBox from "./components/searchBox";
import { PrimeReactProvider } from "primereact/api";
import { ClerkProvider } from "@clerk/nextjs";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "./globals.css";
import Footer from "./components/topbar/Footer";
// Imports End

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang="en" suppressHydrationWarning>
				<body suppressHydrationWarning>
					<Providers>
						<PrimeReactProvider>
							<Header />
							<Navbar />
							<main
								className="
									container 
									mx-auto 
									px-4 
									mt-[80px] 
									max-w-screen-sm 
									sm:max-w-screen-md 
									md:max-w-screen-lg 
									lg:max-w-screen-xl 
									xl:max-w-[1400px]
								"
							>
								<SearchBox />
								{children}
							</main>
							<Footer />
						</PrimeReactProvider>
					</Providers>
				</body>
			</html>
		</ClerkProvider>
	);
}
