import React from "react";
import Layout from "./Layout";
import LeftSidebar from "./LeftSidebar";

const LayoutContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Layout>
      <div className="mx-auto max-w-3xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-8 lg:px-8">
        <div className="hidden lg:col-span-3 lg:block xl:col-span-2">
          <LeftSidebar />
        </div>
        <main className="lg:col-span-9 xl:col-span-10">{children}</main>
      </div>
    </Layout>
  );
};

export default LayoutContainer;
