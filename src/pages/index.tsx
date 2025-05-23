import React, { useEffect, useState } from "react";

import {
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CalendarDateRangePicker } from "@/components/dashboard/date-range-picker";
import { Overview } from "@/components/dashboard/overview";
import { RecentSales } from "@/components/dashboard/alert_message";
import { api } from "@/utils/api";
import { SendCommandButton } from "@/components/dashboard/send_command_button";

export const alertMessages: Record<string, string> = {
  E001: "DHT11 sensor error",
  E002: "Soil moisture sensor error",
  E003: "Both sensors failed",
  S001: "Soil moist enough - No watering needed",
  A001: "Mildly dry soil - Short watering",
  A002: "Dry soil - Medium watering",
  A003: "Very dry soil - Long watering + alert",
  A004: "Extreme heat and dryness - Extra watering",
};

type SensorData = {
  alert_code: string;
  humidity: number;
  id: number;
  soil_moisture: number;
  temperature: number;
  timestamp: string;
};

const Home = () => {
  const { data, isLoading } = api.sensorData.countAlert.useQuery();
  const { data: allData } = api.sensorData.getAll.useQuery();
  const { data: changesData, isLoading: changesDataIsLoading } =
    api.sensorData.getChangesFromSecondLatest.useQuery();

  console.log(changesData);

  const [sensorData, setSensorData] = useState<SensorData>();

  const fetchLiveData = async () => {
    const res = await fetch(
      `https://a4b7-2405-6e00-22ee-fb7-8892-6933-d1ae-31ac.ngrok-free.app/api/latest-data`,
      {
        headers: {
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );

    console.log(res.status);
    return (await res.json()) as {
      alert_code: string;
      humidity: number;
      id: number;
      soil_moisture: number;
      temperature: number;
      timestamp: string;
    };
  };
  /* eslint-disable */
  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchLiveData();
        setSensorData(data);
      } catch (e) {
        console.log(e);
      }
    };

    Promise.all([getData()]).catch();

    const intervalId = setInterval(() => {
      Promise.all([getData()]).catch();
    }, 300000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          {/* <div className="flex items-center space-x-2">
            <CalendarDateRangePicker />
            <Button size="sm">Download</Button>
          </div> */}
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          {/* <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" disabled>
              Reports
            </TabsTrigger>
            <TabsTrigger value="notifications" disabled>
              Notifications
            </TabsTrigger>
          </TabsList> */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tempature
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M14 14.76V3.5a2.5 2.5 0 1 0-5 0v11.26a5 5 0 1 0 5 0Z" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {sensorData ? sensorData.temperature : "Loading "}°C
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {changesDataIsLoading
                      ? "Loading..."
                      : `Detect changed from previous temperature ${changesData?.temperature}%`}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Humidity
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2.69l.94 1.06C16.19 7.24 18 10 18 12.5a6 6 0 0 1-12 0c0-2.5 1.81-5.26 5.06-8.75L12 2.69z" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {sensorData ? sensorData.humidity : "Loading "}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {changesDataIsLoading
                      ? "Loading..."
                      : `Detect changed from previous humidity ${changesData?.humidity}%`}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Soil Moisture
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2C12 2 7 8 7 11a5 5 0 0 0 10 0c0-3-5-9-5-9z" />
                    <line x1="4" y1="20" x2="20" y2="20" />
                    <line x1="6" y1="16" x2="18" y2="16" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {sensorData ? sensorData.humidity : "Loading "}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {changesDataIsLoading
                      ? "Loading..."
                      : `Detect changed from previous soil moisture ${changesData?.soil_moisture}% `}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Alert</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {sensorData ? sensorData.alert_code : "Loading "}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {sensorData
                      ? alertMessages[sensorData.alert_code]
                      : "Loading "}
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview data={allData} />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle> Alert History </CardTitle>
                  <CardDescription>
                    {isLoading
                      ? "data is loading..."
                      : `${data} alerts in the past hour`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8 ">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Pump Control</CardTitle>
                  <div className="text-xs text-muted-foreground">
                    send the command to turn on and off the pump
                  </div>
                </CardHeader>
                <CardContent>
                  <SendCommandButton/>
                 
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
/* eslint-enable */
export default Home;
