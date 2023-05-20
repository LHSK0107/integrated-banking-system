import React from "react";
import { Link } from "react-router-dom";
import Balance from "../../../hooks/useBalance";
import BankName from "../../../hooks/useBankName";
export const AcctList = (acctList) => {
  return acctList.map((ele,i) => {
    return (
      <li key={i}>
        <Link className="flex justify_between align_center" to={`/inout/${ele?.bankCd}/${ele?.acctNo}`}>
          <div className="accordian_account flex">
            <figure>
              <img src={require(`../../../assets/images/icon/bank/${ele?.bankCd}.png`)} alt="bank img icon" />
            </figure>
            <div>
              <h4>{ele?.loanNm.trim()}</h4>
              <p>{ele?.acctNo}</p>
            </div>
            <div className="accordian_account_bank">
              <p><span><BankName bankCD={ele?.bankCd} /></span></p>
            </div>
          </div>
          <div className="accordian_account_bal"><p><Balance balance={ele?.bal} /></p></div>
          <div className="accordian_detail_btn btn">거래내역</div>
        </Link>
      </li>
    );
  });
};