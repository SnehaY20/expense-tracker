import React from "react";
import BackgroundLayout from "../components/BackgroundLayout";
import AppInterface from "../components/AppInterface";

const Dashboard = () => (
  <BackgroundLayout>
    <div className="pt-28 mb-8 max-w-6xl mx-auto px-4 flex flex-col lg:flex-row items-center  min-h-[60vh]">
      {/* <div className="bg-white/10 rounded-xl p-6 text-white shadow-lg w-full lg:w-1/2 mb-8 lg:mb-0">
        
      </div> */}
      <div className="flex justify-end w-full lg:w-auto items-center pr-0 lg:pr-8">
        <AppInterface isVisible={true} />
      </div>
    </div>
  </BackgroundLayout>
);

export default Dashboard;
