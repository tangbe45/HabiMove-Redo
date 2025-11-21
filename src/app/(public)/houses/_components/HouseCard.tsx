import Image from "next/image";
import { HeartIcon, ChartNetworkIcon } from "lucide-react";
import houseUrl from "../../../../../public/house/house.jpg";
import avatarUrl from "../../../../../public/avatar/avatar.jpg";

type HouseCardProps = {
  house: {
    id: string;
    title: string;
    price: number;
    location: string;
    bedrooms: number | null;
    bathrooms: number | null;
    images: {
      url: string;
      id: string;
      createdAt: Date;
      propertyId: string;
    }[];
  };
};

export const HouseCard = ({ house }: HouseCardProps) => {
  const url = house.images.length > 0 ? house.images[0].url : houseUrl;
  return (
    <article
      aria-labelledby={`house-${house.id}-title`}
      className="group card bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
    >
      {/* Thumbnail */}
      <div className="relative w-full h-56 overflow-hidden">
        <div className="absolute inset-0 transform transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-1">
          <Image
            src={url}
            alt={house.title}
            priority
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
              id={`house-${house.id}-title`}
              className="text-sm font-semibold truncate"
            >
              {house.title}
            </h3>
            <p className="mt-1 text-sm text-slate-600 truncate">
              {house.location}
            </p>
            <p className="mt-2 text-sm font-medium text-emerald-600">
              {formatPrice(house.price)}
            </p>
            <div className="mt-2 text-xs text-slate-500 flex gap-3">
              <span>{house.bedrooms} bd</span>
              <span>{house.bathrooms} ba</span>
              <span>{1200} sqft</span>
            </div>
          </div>
          <div className="text-right">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100">
              <Image
                src={avatarUrl}
                alt={"Owner's Avatar"}
                priority
                width={36}
                height={36}
                className="object-cover"
              />
            </div>
            <div className="mt-2 text-xs text-slate-500">
              <div>{2000} views</div>
              <div>
                {timeAgo(
                  new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

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
