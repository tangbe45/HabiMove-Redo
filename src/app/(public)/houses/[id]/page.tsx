import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  BedDouble,
  Bath,
  Expand,
  Phone,
  Mail,
  User,
} from "lucide-react";
import avatar from "../../../../../public/avatar/avatar.jpg";
import { getHouseById } from "../actions";
import Link from "next/link";

// Simulated session and data (replace with real data or server fetch)
const isLoggedIn = true; // Replace with your auth state

export default async function HouseDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>; // Type params as a Promise
}) {
  const { id: houseId } = await params;

  const house = await getHouseById(houseId);

  if (!house) {
    return <div>House not found</div>;
  }

  return (
    <div className="w-full mx-auto mt-14 space-y-8 pb-4 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* --- Header --- */}
        <div className="space-y-2 mb-6">
          <h1 className="text-2xl font-bold tracking-tight">{house.title}</h1>
          <div className="flex items-center text-slate-200 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            {house.location}
          </div>
        </div>

        {/* --- Image Gallery --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {house.images.map((img, i) => (
            <div
              key={i}
              className="relative w-full h-60 rounded-xl overflow-hidden"
            >
              <Image
                src={img}
                alt={`House image ${i + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* --- Details Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* --- Left: House Details --- */}
          <Card className="lg:col-span-2 flex border-none shadow-lg shadow-slate-800 bg-slate-950 text-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>House Details</span>
                <span className="text-xl font-bold text-red-600">
                  {house.price} CFA
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 flex-1">
              <div className="flex items-center justify-between  text-slate-300 text-sm">
                <span className="flex items-center gap-1">
                  <BedDouble className="w-4 h-4" />
                  {house.bedrooms} Bedrooms
                </span>
                <span className="flex items-center gap-1">
                  <Bath className="w-4 h-4" />
                  {house.bathrooms} Bathrooms
                </span>
                <span className="flex items-center gap-1">
                  <Expand className="w-4 h-4" />
                  {2500} sqft
                </span>
              </div>

              <Separator />

              <p className="text-sm leading-relaxed text-muted-foreground">
                {house.description}
              </p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Link
                href="/houses"
                className="text-gray-300 px-6 py-2 rounded-lg bg-indigo-600"
              >
                Back to House List
              </Link>
            </CardFooter>
          </Card>

          {/* --- Right: Agent Details (conditional) --- */}
          {isLoggedIn && (
            <Card className="lg:col-span-1 bg-slate-950 text-slate-200 border-none shadow-lg shadow-slate-800">
              <CardHeader>
                <CardTitle>Agent Details</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-3">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border">
                  <Image
                    src={avatar}
                    alt={"Agent Avatar"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-center space-y-1">
                  <p className="font-semibold flex items-center justify-center gap-1">
                    <User className="w-4 h-4" /> {"John Doe"}
                  </p>
                  <p className="flex items-center justify-center text-sm text-muted-foreground gap-1">
                    <Phone className="w-4 h-4" /> {"6701248674"}
                  </p>
                  <p className="flex items-center justify-center text-sm text-muted-foreground gap-1">
                    <Mail className="w-4 h-4" /> {"jd@gmail.com"}
                  </p>
                </div>
                <Button variant="secondary" className="mt-3 w-full">
                  Contact Agent
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
