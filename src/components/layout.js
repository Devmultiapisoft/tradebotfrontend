import React from "react";
import Header from "./header";
import SideBar from "./sidebar";

export default function LayoutPage(props) {
  return (
    <div className="layout-wrapper">
      <Header />
      <div className="grid-container" style={{backgroundColor: "#000000"}}>
        <main className="dashboardMain fullpage noScroll p-grid" style={{boxShadow: "0px 0px 17px -8px #fff"}}>
          <SideBar />
          <section className="sectionContent p-col h-100" style={{backgroundColor: "#000000", boxShadow:"-4px 12px 17px -13px #fff"}}>{props.children}</section>
        </main>
      </div>
    </div>
  );
}
