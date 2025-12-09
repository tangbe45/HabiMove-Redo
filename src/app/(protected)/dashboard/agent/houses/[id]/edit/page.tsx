"use client";

import React, { useEffect, useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { compressImage } from "@/lib/image/compressImage";
import {
  LoadSchema,
  PropertyCreateInput,
  propertyCreateSchema,
} from "@/lib/db/types/property.types";
import { toastError, toastSuccess } from "@/lib/toast";

// ---- styles used to match shadcn SelectTrigger / input look ----
const sharedInputClasses = `
  w-full
  px-3 py-2
  rounded-md
  border border-input
  bg-background
  text-sm
  ring-offset-background
  placeholder:text-muted-foreground
  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-ring
  focus-visible:ring-offset-2
  disabled:cursor-not-allowed
  disabled:opacity-50
`;

// ---- main component ----
export default function AddHouseForm() {
  const { register, handleSubmit, formState, reset, setValue, watch } =
    useForm<PropertyCreateInput>({
      resolver: zodResolver(
        propertyCreateSchema
      ) as Resolver<PropertyCreateInput>,
      defaultValues: {
        id: "",
        title: "",
        description: "",
        price: undefined as unknown as number,
        location: "",
        bedrooms: 0,
        bathrooms: 0,
        hasInternalToilet: false,
        hasParking: false,
        hasWell: false,
        purpose: "FOR_RENT",
        houseTypeId: "",
        regionId: "",
        divisionId: "",
        subdivisionId: "",
        neighborhoodId: "",
      },
    });

  const { errors, isSubmitting } = formState;

  // lists loaded on mount or dynamically
  const [houseTypes, setHouseTypes] = useState<Array<LoadSchema>>([]);
  const [regions, setRegions] = useState<Array<LoadSchema>>([]);
  const [divisions, setDivisions] = useState<Array<LoadSchema>>([]);
  const [subdivisions, setSubdivisions] = useState<Array<LoadSchema>>([]);
  const [neighborhoods, setNeighborhoods] = useState<Array<LoadSchema>>([]);

  // image previews per input
  const [previews, setPreviews] = useState<(string | null)[]>([
    null,
    null,
    null,
  ]);
  const [files, setFiles] = useState<(File | null)[]>([null, null, null]);

  // watch parent selections for dynamic load
  const watchedRegion = watch("regionId");
  const watchedDivision = watch("divisionId");
  const watchedSubdivision = watch("subdivisionId");

  useEffect(() => {
    // load house types and regions on mount
    async function loadInitial() {
      const [htRes, rRes] = await Promise.all([
        fetch("/api/house-types").then((r) => r.json()),
        fetch("/api/regions").then((r) => r.json()),
      ]);
      setHouseTypes(htRes || []);
      setRegions(rRes || []);
    }
    loadInitial();
  }, []);

  useEffect(() => {
    // load divisions when region changes
    if (!watchedRegion) {
      setDivisions([]);
      setValue("divisionId", "");
      return;
    }
    let mounted = true;
    fetch(`/api/divisions?regionId=${encodeURIComponent(watchedRegion)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        setDivisions(data || []);
        setValue("divisionId", "");
        setSubdivisions([]);
        setNeighborhoods([]);
        setValue("subdivisionId", "");
        setValue("neighborhoodId", "");
      });
    return () => {
      mounted = false;
    };
  }, [watchedRegion, setValue]);

  useEffect(() => {
    // load subdivisions when division changes
    if (!watchedDivision) {
      setSubdivisions([]);
      setValue("subdivisionId", "");
      return;
    }
    let mounted = true;
    fetch(`/api/subdivisions?divisionId=${encodeURIComponent(watchedDivision)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        setSubdivisions(data || []);
        setValue("subdivisionId", "");
        setNeighborhoods([]);
        setValue("neighborhoodId", "");
      });
    return () => {
      mounted = false;
    };
  }, [watchedDivision, setValue]);

  useEffect(() => {
    // load neighborhoods when subdivision changes
    if (!watchedSubdivision) {
      setNeighborhoods([]);
      setValue("neighborhoodId", "");
      return;
    }
    let mounted = true;
    fetch(
      `/api/neighborhoods?subdivisionId=${encodeURIComponent(
        watchedSubdivision
      )}`
    )
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        setNeighborhoods(data || []);
        setValue("neighborhoodId", "");
      });
    return () => {
      mounted = false;
    };
  }, [watchedSubdivision, setValue]);

  // handle image change for individual inputs
  function handleImageChange(index: number, file?: File | null) {
    const newFiles = [...files];
    newFiles[index] = file || null;
    setFiles(newFiles);

    const newPreviews = [...previews];
    if (!file) {
      newPreviews[index] = null;
      setPreviews(newPreviews);
      return;
    }
    const url = URL.createObjectURL(file);
    newPreviews[index] = url;
    setPreviews(newPreviews);
  }

  // remove image at index
  function removeImageAt(index: number) {
    const newFiles = [...files];
    if (previews[index]) URL.revokeObjectURL(previews[index] as string);
    newFiles[index] = null;
    setFiles(newFiles);
    const newPreviews = [...previews];
    newPreviews[index] = null;
    setPreviews(newPreviews);
  }

  // submit handler
  async function onSubmit(data: PropertyCreateInput) {
    try {
      // compress selected images
      const compressedFiles: File[] = [];
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        if (f) {
          const c = await compressImage(f, 1200, 0.78);
          compressedFiles.push(c);
        }
      }

      // build FormData
      const formData = new FormData();
      // append fields (strings) — server uses zod coercions
      Object.entries(data).forEach(([key, val]) => {
        // booleans and numbers will be converted on server; we stringify them here
        formData.append(key, String(val ?? ""));
      });

      // append images individually
      compressedFiles.forEach((f, idx) =>
        formData.append("imageFiles", f, f.name)
      );

      const res = await fetch("/api/houses", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res
          .json()
          .catch(() => ({ message: "Unknown server error" }));
        alert("Server error: " + (err?.message || res.statusText));
        return;
      }

      const json = await res.json();
      toastSuccess(`Property created successfully with id: ${json.id}`);

      reset();
      setFiles([null, null, null]);
      previews.forEach((p) => p && URL.revokeObjectURL(p as string));
      setPreviews([null, null, null]);
    } catch (err: any) {
      console.error(err);
      alert("Error: " + (err?.message || "Submit failed"));
      toastError(`Error: ${err?.message || "Submit failed"}`);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-2 pt-16 space-y-6 overflow-x-hidden">
      <h1 className="text-2xl font-bold">Edit Property</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
        <input type="text" {...register("id")} hidden />
        {/* Purpose (radio buttons) */}
        <div>
          <span className="block text-gray-300 text-sm font-medium">
            Purpose
          </span>
          <div className="flex gap-4 mt-2">
            <label className="inline-flex text-gray-300 items-center gap-2">
              <input
                type="radio"
                value="FOR_RENT"
                {...register("purpose")}
                defaultChecked
              />
              <span>For rent</span>
            </label>

            <label className="inline-flex text-gray-300 items-center gap-2">
              <input type="radio" value="FOR_SALE" {...register("purpose")} />
              <span>For sale</span>
            </label>
          </div>
          {errors.purpose && (
            <p className="text-sm text-red-600">
              {errors.purpose.message?.toString()}
            </p>
          )}
        </div>

        {/* House type (native select styled like shadcn) */}
        <div>
          <label
            className={`block text-gray-300 text-sm font-medium ${
              errors.houseTypeId && "text-red-600"
            }`}
          >
            House type
          </label>
          <div className="relative mt-1">
            <select
              {...register("houseTypeId")}
              className={`${sharedInputClasses} appearance-none pr-10 ${
                errors.houseTypeId && "border-2 border-red-600"
              }`}
            >
              <option value="" disabled>
                Select house type...
              </option>
              {houseTypes.map((ht) => (
                <option key={ht.id} value={ht.id}>
                  {ht.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg
                className="h-4 w-4 opacity-50"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          {errors.houseTypeId && (
            <p className="text-sm text-red-600">
              {errors.houseTypeId.message?.toString()}
            </p>
          )}
        </div>

        {/* Title */}
        <div>
          <label
            className={`block text-gray-300 text-sm font-medium ${
              errors.title && "text-red-600"
            }`}
          >
            Title
          </label>
          <input
            placeholder="Ex: Single Room for Rent"
            {...register("title")}
            className={`${sharedInputClasses} mt-1 ${
              errors.title && "border-2 border-red-600"
            }`}
          />
          {errors.title && (
            <p className="text-sm text-red-600">
              {errors.title.message?.toString()}
            </p>
          )}
        </div>

        {/* Location */}
        <div>
          <label
            className={`block text-gray-300 text-sm font-medium ${
              errors.location && "text-red-600"
            }`}
          >
            Specific Location
          </label>
          <input
            placeholder="Ex: Behind lycee de etoug-ebe"
            {...register("location")}
            className={`${sharedInputClasses} mt-1 ${
              errors.location && "border-2 border-red-600"
            }`}
          />
          {errors.location && (
            <p className="text-sm text-red-600">
              {errors.location.message?.toString()}
            </p>
          )}
        </div>

        {/* Bedrooms & Bathrooms */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              className={cn(
                `block text-gray-300 text-sm font-medium ${
                  errors.bedrooms && "text-red-600"
                }`
              )}
            >
              Bedrooms
            </label>
            <input
              type="number"
              {...register("bedrooms", { valueAsNumber: true })}
              className={cn(
                `${sharedInputClasses} mt-1 ${
                  errors.bedrooms && "border-2 border-red-600"
                }`
              )}
            />
            {errors.bedrooms && (
              <p className="text-sm text-red-600">
                {errors.bedrooms.message?.toString()}
              </p>
            )}
          </div>

          <div>
            <label
              className={`block text-gray-300 text-sm font-medium ${
                errors.bathrooms && "text-red-600"
              }`}
            >
              Bathrooms
            </label>
            <input
              type="number"
              {...register("bathrooms", { valueAsNumber: true })}
              className={`${sharedInputClasses} mt-1 ${
                errors.bathrooms && "border-2 border-red-500"
              }`}
            />
            {errors.bathrooms && (
              <p className="text-sm text-red-600">
                {errors.bathrooms.message?.toString()}
              </p>
            )}
          </div>
        </div>

        {/* Booleans as checkboxes */}
        <div className="flex gap-6">
          <label className="inline-flex text-gray-300 items-center gap-2">
            <input
              type="checkbox"
              {...register("hasInternalToilet")}
              className="h-4 w-4 rounded border"
            />
            <span>Internal toilet</span>
          </label>

          <label className="inline-flex  text-gray-300 items-center gap-2">
            <input
              type="checkbox"
              {...register("hasParking")}
              className="h-4 w-4 rounded border"
            />
            <span>Parking</span>
          </label>

          <label className="inline-flex text-gray-300 items-center gap-2">
            <input
              type="checkbox"
              {...register("hasWell")}
              className="h-4 w-4 rounded border"
            />
            <span>Well</span>
          </label>
        </div>

        {/* Price */}
        <div>
          <label
            className={cn(
              `block text-gray-300 text-sm font-medium ${
                errors.price && "text-red-600"
              }`
            )}
          >
            Price (FCFA)
          </label>
          <input
            type="number"
            {...register("price", { valueAsNumber: true })}
            className={`${sharedInputClasses} mt-1 ${
              errors.price && "border-2 border-red-600"
            }`}
          />
          {errors.price && (
            <p className="text-sm text-red-600">
              {errors.price.message?.toString()}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-300 text-sm font-medium">
            Description
          </label>
          <textarea
            {...register("description")}
            rows={4}
            className={`${sharedInputClasses} mt-1`}
          />
          {errors.description && (
            <p className="text-sm text-red-600">
              {errors.description.message?.toString()}
            </p>
          )}
        </div>
        <hr />
        <p className="text-gray-400">Set Location</p>

        {/* Regions -> Division -> Subdivision -> Neighborhood (native selects, dynamic) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              className={`block text-gray-300 text-sm font-medium ${
                errors.regionId && "text-red-600"
              }`}
            >
              Region
            </label>
            <div className="relative mt-1">
              <select
                {...register("regionId")}
                className={cn(
                  `${sharedInputClasses} appearance-none pr-10`,
                  `${errors.regionId && "border-2 border-red-600"}`
                )}
              >
                <option value="">Select region...</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg
                  className="h-4 w-4 opacity-50"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            {errors.regionId && (
              <p className="text-sm text-red-600">
                {errors.regionId.message?.toString()}
              </p>
            )}
          </div>

          <div>
            <label
              className={`block text-gray-300 text-sm font-medium ${
                errors.divisionId && "text-red-600"
              }`}
            >
              Division
            </label>
            <div className="relative mt-1">
              <select
                {...register("divisionId")}
                disabled={divisions.length === 0}
                className={cn(
                  `${sharedInputClasses} appearance-none pr-10`,
                  `${errors.divisionId && "border-2 border-red-600"}`
                )}
              >
                <option value="">Select division...</option>
                {divisions.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg
                  className="h-4 w-4 opacity-50"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            {errors.divisionId && (
              <p className="text-sm text-red-600">
                {errors.divisionId.message?.toString()}
              </p>
            )}
          </div>

          <div>
            <label
              className={`block text-gray-300 text-sm font-medium ${
                errors.subdivisionId && "text-red-600"
              }`}
            >
              Subdivision
            </label>
            <div className="relative mt-1">
              <select
                disabled={subdivisions.length === 0}
                {...register("subdivisionId")}
                className={cn(
                  `${sharedInputClasses} appearance-none pr-10`,
                  `${errors.subdivisionId && "border-2 border-red-600"}`
                )}
              >
                <option value="">Select subdivision...</option>
                {subdivisions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg
                  className="h-4 w-4 opacity-50"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            {errors.subdivisionId && (
              <p className="text-sm text-red-600">
                {errors.subdivisionId.message?.toString()}
              </p>
            )}
          </div>

          <div>
            <label
              className={`block text-gray-300 text-sm font-medium ${
                errors.neighborhoodId && "text-red-600"
              }`}
            >
              Neighborhood
            </label>
            <div className="relative mt-1">
              <select
                disabled={neighborhoods.length === 0}
                {...register("neighborhoodId")}
                className={cn(
                  `${sharedInputClasses} appearance-none pr-10`,
                  `${errors.neighborhoodId && "border-2 border-red-600"}`
                )}
              >
                <option value="">Select neighborhood...</option>
                {neighborhoods.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg
                  className="h-4 w-4 opacity-50"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            {errors.neighborhoodId && (
              <p className="text-sm text-red-600">
                {errors.neighborhoodId.message?.toString()}
              </p>
            )}
          </div>
        </div>

        <hr />
        <p className="text-gray-400">Select Images</p>

        {/* Three image inputs with individual preview */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Images (up to 3)
          </label>
          <div className="grid grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <div className="w-full h-36 rounded-md border border-dashed flex items-center justify-center overflow-hidden bg-muted">
                  {previews[i] ? (
                    <div className="relative w-full h-full">
                      <img
                        src={previews[i] || ""}
                        alt={`preview-${i}`}
                        className="object-cover w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={() => removeImageAt(i)}
                        className="absolute top-2 right-2 bg-red-500 rounded-full w-6 flex justify-center items-center h-6 p-1 shadow"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center cursor-pointer p-4">
                      <span className="text-sm text-muted-foreground">
                        Click to choose
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0] ?? null;
                          handleImageChange(i, f || null);
                        }}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-end space-x-2 mb-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-white disabled:opacity-60 bg-sky-700"
          >
            {isSubmitting ? "Saving..." : "Create house"}
          </button>
          <button
            onClick={() => reset()}
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-white disabled:opacity-60 bg-gray-800"
          >
            {isSubmitting ? "Saving..." : "Reset"}
          </button>
        </div>
      </form>
    </div>
  );
}
