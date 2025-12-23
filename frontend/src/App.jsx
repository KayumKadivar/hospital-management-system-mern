import React from "react";
import { BrowserRouter } from "react-router-dom";
import Header from "./components/Header";

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Header />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Welcome to MediCare Hospital
            </h1>
            <p className="text-gray-600">
              Your trusted partner in healthcare management
            </p>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;