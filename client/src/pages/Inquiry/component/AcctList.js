import React from "react";
import { Link } from "react-router-dom";
import Balance from "../../../hooks/useBalance";
import BankName from "../../../hooks/useBankName";
export const AcctList = (acctList) => {
  return acctList.map((ele) => {
    return (
      <li>
        <Link className="flex justify_between align_center" to="">
          <div className="accordian_account flex">
            <figure>
              <img src={require(`../../../assets/images/icon/bank/${ele?.BANK_CD}.png`)} alt="bank img icon" />
            </figure>
            <div>
              <h4>{ele?.LOAN_NM.trim()}</h4>
              <p>{ele?.ACCT_NO}</p>
            </div>
            <div className="accordian_account_bank">
              <p><span><BankName bankCD={ele?.BANK_CD} /></span></p>
            </div>
          </div>
          <div className="accordian_account_bal"><p><Balance balance={ele?.BAL} /></p></div>
          <div className="accordian_detail_btn btn">거래내역</div>
        </Link>
      </li>
    );
  });
};