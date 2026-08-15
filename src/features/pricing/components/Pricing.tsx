import React from "react";
import Navbar from "@/components/layout/Navbar";
import { PricingTable } from "@clerk/nextjs";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const fallbackPlans = [
  {
    name: "Free",
    description: "Everything you need to organize personal projects.",
    features: ["Kanban boards", "Task priorities", "Due dates"],
  },
  {
    name: "Pro",
    description: "More flexibility for growing teams.",
    features: ["Unlimited boards", "Team collaboration", "Advanced filters"],
  },
  {
    name: "Enterprise",
    description: "Controls and support for larger organizations.",
    features: ["Organization management", "Priority support", "Custom workflows"],
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar className="z-0" />
      <div className="py-6 sm:py-12 container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Choose Your Plan
          </h1>
          <p className="text-sm sm:text-md text-gray-600">
            Select the perfect plan for your needs
          </p>
        </div>
        <div className="max-w-5xl mx-auto">
          {process.env.NEXT_PUBLIC_CLERK_BILLING_ENABLED === "true" ? (
            <PricingTable newSubscriptionRedirectUrl="/dashboard" />
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {fallbackPlans.map((plan) => (
                <Card key={plan.name} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-blue-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    {plan.name === "Free" ? (
                      <Link
                        href="/dashboard"
                        className={cn(buttonVariants(), "w-full")}
                      >
                        Open dashboard
                      </Link>
                    ) : (
                      <Button className="w-full" variant="outline" disabled>
                        Coming soon
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
