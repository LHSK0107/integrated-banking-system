import React from "react";
import Breadcrumb from "../../commons/Breadcrumb";
import { SideNav } from "../../commons/SideNav";

const Index = () => {
  return (
    <div id="wrap">
      <div className="inner">
        <Breadcrumb title={"관리자페이지"} subMenu={"입출금내역조회"} />
        <div className="flex">
          <SideNav />
          <section>
            <h3>입출내역조회</h3>
            <div className="form_wrap">
              <form className="admin_form">
                <ul>
                  <li className="flex">
                    <p className="flex align_center">계좌</p>
                    <div className="flex align_center">
                    </div>
                  </li>
                  <li className="flex">
                    <p className="flex align_center">조회기간</p>
                    <div>
                      <div className="flex align_center"></div>
                      <div className="flex align_center"></div>
                    </div>
                  </li>
                </ul>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Index;
