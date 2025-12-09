export function buildHouseWhere(params: Record<string, any>) {
  const where: any = {};

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
    ];
  }

  if (params.houseType) where.houseTypeId = params.houseType;
  if (params.purpose) where.purpose = params.purpose;
  if (params.region) where.regionId = params.region;
  if (params.division) where.divisionId = params.division;
  if (params.subdivision) where.subdivisionId = params.subdivision;
  if (params.neighbourhood) where.neighbourhoodId = params.neighbourhood;

  if (params.amenities) {
    const ids = Array.isArray(params.amenities)
      ? params.amenities
      : String(params.amenities).split(",").filter(Boolean);
    if (ids.length) {
      where.amenities = { some: { id: { in: ids } } };
    }
  }

  return where;
}
