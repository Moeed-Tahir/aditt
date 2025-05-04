"use client";

import Navbar from "@/components/Navbar";

import Charts from "@/components/Charts";
import { LineBarsChart } from "@/components/LineBarsChart";
import AreaCharts from "./AreaCharts";
import BarCharts from "./BarCharts";
import PieCharts from "./PieCharts";

export function Analytics() {
  return (
    <>
      <main className="flex h-auto min-h-screen w-full flex-col gap-4 bg-[var(--bg-color-off-white)]">
        <Navbar />

        <div className="p-4">
          <div className="flex justify-between">
            <p className="text-3xl">Analytics</p>
          </div>

          <div className="flex flex-col md:flex-row p-4 mt-4 mb-4 bg-white rounded-xl shadow-md">
            <div className="flex-1 p-6">
              <h2 className="text-l text-gray-400 font-light mb-2">
                Campaigns Created
              </h2>
              <p className="text-2xl font-bold text-gray-800">728</p>
            </div>

            <div className="hidden md:block w-px bg-gray-300 mx-4"></div>

            <div className="flex-1 bg-white rounded-xl p-6">
              <h2 className="text-l text-gray-400 font-light mb-2">
                Active Campaigns
              </h2>
              <p className="text-2xl font-bold text-gray-800">564</p>
            </div>

            <div className="hidden md:block w-px bg-gray-300 mx-4"></div>

            <div className="flex-1 bg-white rounded-xl p-6">
              <h2 className="text-l text-gray-400 font-light mb-2">
                Paused Campaigns
              </h2>
              <p className="text-2xl font-bold text-gray-800">984</p>
            </div>
            <div className="hidden md:block w-px bg-gray-300 mx-4"></div>

            <div className="flex-1 bg-white rounded-xl p-6">
              <h2 className="text-l text-gray-400 font-light mb-2">
                Completed Campaigns
              </h2>
              <p className="text-2xl font-bold text-gray-800">984</p>
            </div>
          </div>

          <Charts />

          <div className="flex flex-col md:flex-row p-4 mt-4 mb-4 bg-white rounded-xl shadow-md">
            <div className="flex-1 p-6">
              <h2 className="text-l text-gray-400 font-light mb-2">
                Free Impressions
              </h2>
              <p className="text-2xl font-bold text-gray-800">390.9k</p>
            </div>

            <div className="hidden md:block w-px bg-gray-300 mx-4"></div>

            <div className="flex-1 bg-white rounded-xl p-6">
              <h2 className="text-l text-gray-400 font-light mb-2">
                Total Completed Engagements
              </h2>
              <p className="text-2xl font-bold text-gray-800">372k</p>
            </div>

            <div className="hidden md:block w-px bg-gray-300 mx-4"></div>

            <div className="flex-1 bg-white rounded-xl p-6">
              <h2 className="text-l text-gray-400 font-light mb-2">
                Total UTM Link Clicks
              </h2>
              <p className="text-2xl font-bold text-gray-800">32k</p>
            </div>
            <div className="hidden md:block w-px bg-gray-300 mx-4"></div>

            <div className="flex-1 bg-white rounded-xl p-6">
              <h2 className="text-l text-gray-400 font-light mb-2">
                Click Through Rate
              </h2>
              <p className="text-2xl font-bold text-gray-800">10%</p>
            </div>
          </div>

          <LineBarsChart />

          <div className="flex flex-col md:flex-row p-4 mt-4 mb-4 bg-white rounded-xl shadow-md">
            <div className="flex-1 p-6">
              <h2 className="text-l text-gray-400 font-light mb-2">
                Total Spent
              </h2>
              <p className="text-2xl font-bold text-gray-800">$24,400,00</p>
            </div>

            <div className="hidden md:block w-px bg-gray-300 mx-4"></div>

            <div className="flex-1 bg-white rounded-xl p-6">
              <h2 className="text-l text-gray-400 font-light mb-2">
                Total Available Now
              </h2>
              <p className="text-2xl font-bold text-gray-800">$12,000.00</p>
            </div>

            <div className="hidden md:block w-px bg-gray-300 mx-4"></div>

            <div className="flex-1 bg-white rounded-xl p-6">
              <h2 className="text-l text-gray-400 font-light mb-2">
                Total UTM Link Clicks
              </h2>
              <p className="text-2xl font-bold text-gray-800">32k</p>
            </div>
            <div className="hidden md:block w-px bg-gray-300 mx-4"></div>

            <div className="flex-1 bg-white rounded-xl p-6">
              <h2 className="text-l text-gray-400 font-light mb-2">
                Average Cost Per Engagement
              </h2>
              <p className="text-2xl font-bold text-gray-800">$0.30</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="col-span-1  md:col-span-2 p-6">
              <BarCharts />
            </div>
            <div className="col-span-1  bg-white p-6 rounded-xl border">
              <h3 className="text-gray-600 text-xl font-medium mb-3">
                Financial Overview
              </h3>
              <h3 className="text-gray-500 text-sm font-medium mb-3">
                Track your campaign’s budget & spending
              </h3>
              <PieCharts />
              <div className="grid grid-cols-3 text-sm text-gray-600 w-full max-w-md">
                <div>🟢 Total Spent</div>
                <div>🔵 Available</div>
                <div>🟠 Total</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
