"use client";

import DeskButton from "@/components/functional/main/view/desk-button";
import { useStoreData } from "@/hooks/use-store-data";
import { useEffect, useMemo, useState } from "react";

export default function Page() {
  const { userInfo, desks, loading, error } = useStoreData();
  const occupiedDesksCount = useMemo(
    () => desks.filter(desk => desk?.used).length,
    [desks]
  );
  const [dimensions, setDimensions] = useState({ width: 900, height: 700 });

  useEffect(() => {
    const updateDimensions = () => {
      const width = Math.min(900, window.innerWidth - 32);
      const height = width * (7 / 9);
      setDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) {
    return (
      <p>データの読み込みでエラーが発生しました。再度読み込んで下さい。</p>
    );
  }

  return (
    <main className="space-y-4">
      <div className="flex w-full items-center px-4 py-2">
        <div className="w-1/4 text-center">
          <p className="text-sm">Available</p>
          <p className="text-2xl font-bold text-green-600">
            {desks.length - occupiedDesksCount}
          </p>
        </div>
        <div className="w-1/4 text-center">
          <p className="text-sm">Occupied</p>
          <p className="text-2xl font-bold text-red-600">
            {occupiedDesksCount}
          </p>
        </div>
        <div className="w-1/4 text-center">
          <p className="text-sm">Total Seats</p>
          <p className="text-2xl font-bold">{desks.length}</p>
        </div>
        <div className="w-1/4 text-center">
          <p className="text-sm">Occupancy</p>
          <p className="text-2xl font-bold text-indigo-600">
            {Math.round((occupiedDesksCount / desks.length) * 100 || 0)}%
          </p>
        </div>
      </div>
      <div
        className="relative mx-auto overflow-hidden rounded border"
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        {desks.map((desk, index) => (
          <DeskButton
            key={desk.id}
            desk={desk}
            index={index}
            dimensions={dimensions}
            userInfo={userInfo}
          />
        ))}
      </div>
    </main>
  );
}
