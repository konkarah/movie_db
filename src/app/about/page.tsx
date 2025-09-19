// Imports Start
import React from "react";
import {
	Play,
	Users,
	Heart,
	Star,
	Award,
	Target,
	Zap,
	Globe,
} from "lucide-react";
import Link from "next/link";
// Imports End

const page = () => {
	// Stats and Values Data Start
	const stats = [
		{ label: "Movies Curated", value: "10,000+", icon: Play },
		{ label: "Happy Users", value: "50K+", icon: Users },
		{ label: "Recommendations Made", value: "1M+", icon: Heart },
		{ label: "Average Rating", value: "4.9", icon: Star },
	];
	const values = [
		{
			icon: Target,
			title: "Personalized Experience",
			description:
				"We believe every movie lover deserves recommendations tailored to their unique taste and preferences.",
		},
		{
			icon: Award,
			title: "Quality Content",
			description:
				"Our team of film enthusiasts carefully curates only the highest quality movies across all genres.",
		},
		{
			icon: Zap,
			title: "Smart Technology",
			description:
				"Advanced algorithms analyze your preferences to deliver increasingly accurate recommendations.",
		},
		{
			icon: Globe,
			title: "Global Community",
			description:
				"Connect with movie lovers worldwide and discover hidden gems from different cultures.",
		},
	];
	// Stats and Values Data End

	return (
		<div className="min-h-screen bg-gradient-to-br">
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* Hero Section Start */}
				<section className="text-center mb-16">
					<h1 className="text-7xl font-black tracking-tight text-[var(--foreground)] mb-6">
						About{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 group-hover:animate-pulse">
							Cine Scope
						</span>
					</h1>
					<p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
						We&apos;re passionate about connecting movie lovers with their
						perfect cinematic experiences. Since 2025, we&apos;ve been
						revolutionizing how people discover and enjoy films.
					</p>
				</section>
				{/* Hero Section End */}

				{/* Stats Section Start*/}
				<section className="mb-20">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
						{stats.map((stat, index) => (
							<div
								key={index}
								className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/10 hover:border-purple-500/50 transition-all duration-300"
							>
								<stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
								<div className="text-3xl font-bold  mb-2">{stat.value}</div>
								<div className="text-gray-400 text-sm">{stat.label}</div>
							</div>
						))}
					</div>
				</section>
				{/* Stats Section End */}

				{/* Mission Section Start */}
				<section className="mb-20">
					<div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/10">
						<div className="max-w-4xl mx-auto text-center">
							<h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
								Our Mission
							</h2>
							<p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
								In a world overflowing with content, we believe finding your
								next favorite movie shouldn&apos;t be overwhelming. Our mission
								is to use cutting-edge technology and human expertise to create
								personalized recommendations that truly resonate with your
								unique taste in cinema.
							</p>
							<div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
								<div className="flex items-center space-x-2">
									<div className="w-3 h-3 bg-purple-400 rounded-full"></div>
									<span className=" font-medium">Discover Hidden Gems</span>
								</div>
								<div className="flex items-center space-x-2">
									<div className="w-3 h-3 bg-pink-400 rounded-full"></div>
									<span className=" font-medium">
										Save Time &amp; Enjoy More
									</span>
								</div>
								<div className="flex items-center space-x-2">
									<div className="w-3 h-3 bg-blue-400 rounded-full"></div>
									<span className=" font-medium">Connect Through Cinema</span>
								</div>
							</div>
						</div>
					</div>
				</section>
				{/* Mission Section End */}

				{/* Values Section Start */}
				<section className="mb-20">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
							What We Stand For
						</h2>
						<p className="text-lg text-gray-300 max-w-2xl mx-auto">
							Our values guide everything we do, from the movies we recommend to
							the experiences we create.
						</p>
					</div>

					<div className="grid md:grid-cols-2 gap-8">
						{values.map((value, index) => (
							<div
								key={index}
								className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300 group"
							>
								<div className="flex items-start space-x-4">
									<div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
										<value.icon className="w-6 h-6 text-white" />
									</div>
									<div>
										<h3 className="text-xl font-bold text-white mb-3">
											{value.title}
										</h3>
										<p className="text-gray-400 leading-relaxed">
											{value.description}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</section>
				{/* Values Section End */}

				{/* Story Section */}
				<section className="mb-20">
					<div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/10">
						<div className="max-w-4xl mx-auto">
							<h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
								Our Story
							</h2>
							<div className="space-y-6  leading-relaxed">
								<p className="text-lg">
									CineMatch was born from a simple frustration: spending more
									time searching for movies than actually watching them. Our
									founder, Sarah, found herself endlessly scrolling through
									streaming platforms, overwhelmed by choice paralysis.
								</p>
								<p className="text-lg">
									What started as a weekend project to solve her own problem
									quickly evolved into something much bigger. By combining
									machine learning algorithms with expert curation, we created a
									platform that doesn&apos;t just recommend movies—it
									understands your taste.
								</p>
								<p className="text-lg">
									Today, we&apos;re proud to serve over 50,000 movie lovers
									worldwide, helping them discover everything from blockbuster
									hits to indie gems they never would have found otherwise. Our
									journey is just beginning, and we&apos;re excited to have you
									along for the ride.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="text-center">
					<div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/10">
						<h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
							Ready to Discover Your Next Favorite?
						</h2>
						<p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
							Join thousands of movie lovers who trust CineMatch to guide their
							cinematic journey.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center space-x-2">
								<Play className="w-5 h-5" />
								<Link
									href="/"
									rel="noopener noreferrer"
									className="text-indigo-600 hover:underline hover:opacity-90 transition-opacity"
								>
									<span>Start Discovering</span>
								</Link>
							</button>
							<button className="border-2 border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:border-purple-500 hover:bg-white/5 transition-all duration-200">
								<Link
									href="https://devkoech.vercel.app/client"
									rel="noopener noreferrer"
									className="text-indigo-600 hover:underline hover:opacity-90 transition-opacity"
								>
									<span> Learn More</span>
								</Link>
							</button>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
};

export default page;
