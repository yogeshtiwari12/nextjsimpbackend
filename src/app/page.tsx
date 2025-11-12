"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";


export default function HomePage() {
	return (
		<main className={cn("min-h-screen bg-background")}>      
			<div className="container mx-auto px-4 py-12 space-y-10">
				<div className="text-center space-y-2">
					<h1 className="text-3xl font-bold tracking-tight">Welcome</h1>
					<p className="text-muted-foreground">Demo of shadcn/ui components.</p>
				</div>

				<Card className="max-w-md mx-auto space-y-4 p-6">
					<div className="space-y-2">
						<Label htmlFor="name">Name</Label>
						<Input id="name" placeholder="Your name" />
					</div>
					<div className="space-y-2">
						<Label htmlFor="bio">Bio</Label>
						<Textarea id="bio" placeholder="Tell us something about yourself" />
					</div>
					<Button type="button" variant="default">Submit</Button>
				</Card>
			</div>
		</main>
	);
}
