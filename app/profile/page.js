import Navbar from "@/components/Navbar";

export default function ProfilePage() {
	return (
		<main className="min-h-screen bg-[#f7fbf8] dark:bg-slate-950">
			<Navbar />
			<section className="max-w-3xl mx-auto px-6 py-12">
				<h1 className="text-3xl font-bold text-slate-900 dark:text-white">Your Profile</h1>
				<p className="mt-2 text-slate-500 dark:text-slate-400">
					Manage your MediLens account details.
				</p>
			</section>
		</main>
	);
}
