"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  PlusCircle,
  Copy,
  Trash2,
  Edit,
  HeartIcon,
  ChartNetworkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import imageUrl from "../../../../../public/house/house.jpg";
import avatarUrl from "../../../../../public/avatar/avatar.jpg";
import Image, { StaticImageData } from "next/image";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  image: StaticImageData;
  status: string;
  forRent?: boolean;
  forSale?: boolean;
}

interface InviteToken {
  id: string;
  token: string;
  email: string;
  expiresAt: string;
  used: boolean;
}

interface Agent {
  id: string;
  name: string;
  email: string;
}

export default function AgentDashboardPage() {
  // Dummy states (replace with real data fetching)
  const [properties, setProperties] = useState<Property[]>([
    {
      id: "1",
      title: "Modern Apartment",
      location: "Douala",
      price: 450,
      status: "AVAILABLE",
      image: imageUrl,
      forSale: true,
      forRent: false,
    },
    {
      id: "2",
      title: "Villa Beachside",
      location: "Limbe",
      price: 1200,
      status: "RENTED",
      image: imageUrl,
      forSale: false,
      forRent: true,
    },
  ]);

  const [tokens, setTokens] = useState<InviteToken[]>([
    {
      id: "1",
      token: "AGENT-123ABC",
      email: "user1@example.com",
      expiresAt: "2025-11-10",
      used: false,
    },
    {
      id: "2",
      token: "AGENT-XYZ456",
      email: "user2@example.com",
      expiresAt: "2025-11-12",
      used: true,
    },
  ]);

  const deleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
    toast.warning("Property deleted");
  };

  const generateToken = (email: string) => {
    if (!email) return toast.error("Enter a registered user email");
    const newToken = `AGENT-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;
    const newEntry = {
      id: Math.random().toString(),
      token: newToken,
      email,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      used: false,
    };
    setTokens((prev) => [newEntry, ...prev]);
    toast.success("Invitation token generated!");
  };

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast.info("Token copied!");
  };

  const updateStatus = (id: string, status: Property["status"]) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
    toast.success(`Property status updated to ${status}`);
  };

  const [invitedAgents, setInvitedAgents] = useState<Agent[]>([
    { id: "1", name: "John Doe", email: "user1@example.com" },
  ]);

  const deleteToken = (id: string) => {
    setTokens((prev) => prev.filter((t) => t.id !== id));
    toast.warning("Token revoked");
  };

  return (
    <div className=" bg-sky-700 overflow-y-auto pt-4 w-full h-screen">
      <div className="py-12 mx-auto p-4 space-y-8 w-full  md:w-[95%]">
        {/* Analytics Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="pt-0 pb-4 hover:shadow-md gap-4 text-gray-100 overflow-hidden transition">
            <CardHeader className="bg-slate-700 w-full p-2 text-center text-xl font-bold">
              <CardTitle>Total Listings</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0 text-gray-500 text-4xl font-bold">
              {properties.length}
            </CardContent>
          </Card>
          <Card className="pt-0 pb-4 hover:shadow-md gap-4 text-gray-100 overflow-hidden transition">
            <CardHeader className="bg-slate-700 w-full p-2 text-center text-xl font-bold">
              <CardTitle>Sold/Rented</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0 text-gray-500 text-4xl font-bold">
              {properties.filter((p) => p.status !== "AVAILABLE").length}
            </CardContent>
          </Card>
          <Card className="pt-0 pb-4 hover:shadow-md gap-4 text-gray-100 overflow-hidden transition">
            <CardHeader className="bg-slate-700 w-full p-2 text-center text-xl font-bold">
              <CardTitle>Inquiries</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0 text-gray-500 text-4xl font-bold">
              32
            </CardContent>
          </Card>
        </div>
        <Separator />
        {/* Properties Section */}
        <div className="flex flex-col">
          <div className="flex grid-cols-subgrid justify-between items-center mb-4">
            <h2 className="text-2xl text-gray-100 font-bold">
              Your Properties
            </h2>
            <Link
              href="/dashboard/agent/add-house"
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" /> Add Property
            </Link>
          </div>
          <div className="grid grid-cols-1 rounded-2xl sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
            {properties.map((p) => (
              <article
                aria-labelledby={`house-${p.id}-title`}
                className="group card bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                {/* Thumbnail */}
                <div className="relative w-full h-56 overflow-hidden">
                  <div className="absolute inset-0 transform transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-1">
                    <Image
                      src={imageUrl}
                      alt={p.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 360px"
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Action buttons */}
                  <div className="absolute inset-0 flex items-end justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-2">
                      <button className="bg-white/90 hover:bg-white rounded-full p-2 shadow">
                        <HeartIcon size={16} />
                      </button>
                      <button className="bg-white/90 hover:bg-white rounded-full p-2 shadow">
                        <ChartNetworkIcon size={16} />
                      </button>
                    </div>
                    <div className="rounded-md bg-black/80 text-white text-xs px-2 py-0.5">
                      {"12:47"}
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="p-3">
                  <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0">
                      <h3
                        id={`house-${p.id}-title`}
                        className="text-sm font-semibold truncate"
                      >
                        {p.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600 truncate">
                        {p.location}
                      </p>
                      <p className="mt-2 text-sm font-medium text-emerald-600">
                        {formatPrice(p.price)}
                      </p>
                      <div className="mt-2 text-xs text-slate-500 flex gap-3">
                        <span>{2} bd</span>
                        <span>{2} ba</span>
                        <span>{1200} sqft</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100">
                        <Image
                          src={avatarUrl}
                          alt={"Owner's Avatar"}
                          width={36}
                          height={36}
                          className="object-cover"
                        />
                      </div>
                      <div className="mt-2 text-xs text-slate-500">
                        <div>{2000} views</div>
                        <div>
                          {timeAgo(
                            new Date(
                              Date.now() - 2 * 60 * 60 * 1000
                            ).toISOString()
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <Separator />

        {/* Invitation Section */}
        <div className="flex flex-col sm:flex-col md:flex-row gap-2">
          <div className="space-y-4 flex-1">
            {/* Generate Token Input */}
            <div className="flex gap-2 mb-4">
              <Input placeholder="Enter user email" id="invite-email" />
              <Button
                onClick={() => {
                  const emailInput = document.getElementById(
                    "invite-email"
                  ) as HTMLInputElement;
                  generateToken(emailInput.value);
                  emailInput.value = "";
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                <PlusCircle className="h-4 w-4" /> Generate
              </Button>
            </div>

            {/* Token Cards */}
            <ul className="space-y-2">
              {tokens.map((t) => (
                <li
                  key={t.id}
                  className="flex justify-between items-center bg-white p-3 rounded shadow-sm"
                >
                  <div>
                    <p className="font-mono">{t.token}</p>
                    <p className="text-sm text-gray-500">
                      {t.email} • Expires {t.expiresAt} •{" "}
                      {t.used ? "Used" : "Active"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => copyToken(t.token)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteToken(t.id)}
                      disabled={t.used}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* Invited Agents Section */}
          <Card className="p-4 flex-1">
            <CardHeader className="mb-2">
              <CardTitle>Invited Agents</CardTitle>
            </CardHeader>
            <CardContent>
              {invitedAgents.length === 0 ? (
                <p>No invited agents yet.</p>
              ) : (
                <ul className="space-y-2">
                  {invitedAgents.map((a) => (
                    <li key={a.id}>
                      {a.name} ({a.email})
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function formatPrice(p: number) {
  return p >= 1000 ? `$${(p / 1000).toFixed(1)}k` : `$${p}`;
}

function timeAgo(iso: string) {
  const then = new Date(iso);
  const now = new Date();
  const sec = Math.floor((now.getTime() - then.getTime()) / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}
