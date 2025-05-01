"use client";

import Navbar from "@/components/Navbar";

import Charts from "@/components/Charts";
import {LineBarsChart} from "@/components/LineBarsChart";

export function Analytics() {
  return (
    <>
      <main className="flex h-auto min-h-screen w-full flex-col gap-4 bg-[var(--bg-color-off-white)]">
        <Navbar />

        <div className="p-4">
          <div className="flex justify-between">
            <p className="text-3xl">Analytics</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4  p-4">
            <div className="bg-white border-1 rounded-xl p-6">
              <h2 className="text-m text-gray-400 font-light mb-2">
                CAMPAIGNS CREATED
              </h2>
              <p className="text-2xl">782</p>
            </div>
            <div className="bg-white border-1  rounded-xl p-6">
              <h2 className="text-m text-gray-400 font-light mb-2">
                ACTIVE CAMPAIGNS
              </h2>
              <p className="text-2xl">564</p>
            </div>
            <div className="bg-white border-1 rounded-xl p-6">
              <h2 className="text-m text-gray-400 font-light mb-2">
                PAUSED CAMPAIGNS
              </h2>
              <p className="text-2xl">984</p>
            </div>
            <div className="bg-white border-1 rounded-xl p-6">
              <h2 className="text-m text-gray-400 font-light mb-2">
                COMPLETED CAMPAIGNS
              </h2>
              <p className="text-2xl">984</p>
            </div>
          </div>

          <Charts />

          <div className="grid grid-cols-1 md:grid-cols-4  p-4">
            <div className="bg-white border-1 rounded-xl p-6">
              <h2 className="text-xl text-gray-400 font-light mb-2">
                FREE IMPRESSIONS
              </h2>
              <p className="text-2xl">390.9k</p>
            </div>
            <div className="bg-white border-1  rounded-xl p-6">
              <h2 className="text-xl text-gray-400 font-light mb-2">
                TOTAL COMPLETED ENGAGEMENTS
              </h2>
              <p className="text-2xl">372k</p>
            </div>
            <div className="bg-white border-1 rounded-xl p-6">
              <h2 className="text-xl text-gray-400 font-light mb-2">
                TOTAL UTM LINK CLICKS
              </h2>
              <p className="text-2xl">32k</p>
            </div>
            <div className="bg-white border-1 rounded-xl p-6">
              <h2 className="text-xl text-gray-400 font-light mb-2">
                CLICK THROUGH RATE
              </h2>
              <p className="text-2xl">10%</p>
            </div>
          </div>

          <LineBarsChart/>
        </div>
      </main>
    </>
  );
}
