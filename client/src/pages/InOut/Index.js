import React, { useState, useEffect, useCallback } from "react";
import {Link} from "react-router-dom";
import "./index.css";
import { Description } from '../../commons/Description';
import { SideNav } from '../../commons/SideNav';
import Breadcrumb from '../../commons/Breadcrumb';
import useAxiosAccTInquiry from "../../api/useAxiosAcctInquiry";
import BankName from '../../hooks/useBankName';

const Index = () => {
  const {apiData}=useAxiosAccTInquiry("http://localhost:3001/api/getAccountList");
  // 은행코드 중복 제거
  const getBankCD = () =>{
    let arr = [];
    apiData.filter((val)=>arr.includes(val?.BANK_CD)===false && arr.push(val?.BANK_CD));
    return arr;
  }

  return (
    <div id="wrap">
      <div className="inner">
        <Breadcrumb />
        <div className="flex">
          <SideNav />
          <section>
            <h3>입출내역조회</h3>
            <Description />
            <div className="form_wrap">
              <ul className="tab flex">
                <li>예금</li>
                <li className="active">대출</li>
              </ul>
              <form className="report_form">
                <ul>
                  <li className="flex">
                    <p className="flex align_center">계좌</p>
                    <div className="flex align_center">
                      <select>
                        <option value="">전체 은행</option>
                        {apiData &&
                          getBankCD().map((ele) => {
                            return (
                              <option value={<BankName bankCD={ele} />}>
                                <BankName bankCD={ele} />
                              </option>
                            );
                          })
                        }
                      </select>
                      <select>
                        <option>전체 계좌</option>
                        <option>청년희망적금&nbsp;1234567890-1234567890</option>
                      </select>
                    </div>
                  </li>
                  <li className="flex">
                    <p className="flex align_center">조회기간</p>
                    <div>
                      <div className="flex align_center">
                        <input type="date" required aria-required="ture" />
                        <b>~</b>
                        <input type="date" required aria-required="ture" />
                      </div>
                      <div className="flex align_center">
                        <span>당일</span>
                        <span>3일</span>
                        <span>1주일</span>
                        <span>1개월</span>
                      </div>
                    </div>
                  </li>
                  <li className="flex">
                    <p className="flex align_center">언어구분</p>
                    <div className="flex align_center">
                      <input type="radio" id="kor" name="lang" checked />
                      <label for="kor">국문</label>
                      <input type="radio" id="eng" name="lang" disabled />
                      <label for="eng">영문</label>
                    </div>
                  </li>
                  <li className="flex">
                    <p className="flex align_center">조회구분</p>
                    <div className="flex align_center">
                      <input type="radio" id="inout" name="sort" checked />
                      <label for="inout">전체</label>
                      <input type="radio" id="in" name="sort" />
                      <label for="in">입금만</label>
                      <input type="radio" id="out" name="sort" />
                      <label for="out">출금만</label>
                    </div>
                  </li>
                  <li className="flex">
                    <p className="flex align_center">조회결과순서</p>
                    <div className="flex align_center">
                      <input type="radio" id="new" name="arrange" checked />
                      <label for="new">최근일로부터</label>
                      <input type="radio" id="old" name="arrange" />
                      <label for="old">과거일로부터</label>
                    </div>
                  </li>
                  <li className="flex">
                    <p className="flex align_center">정렬방식</p>
                    <div className="flex align_center">
                      <input type="radio" id="ten" name="paging" checked />
                      <label for="ten">10건</label>
                      <input type="radio" id="thirty" name="paging" />
                      <label for="thirty">30건</label>
                      <input type="radio" id="fifty" name="paging" />
                      <label for="fifty">50건</label>
                    </div>
                  </li>
                </ul>
                <div className="btn_wrap flex justify_center">
                  <button type="submit">조회</button>
                </div>
              </form>
            </div>
            <div className="result_wrap">
              <div className="account_info">
                <ul>
                  <li className="flex">
                    <div className="title">예금종류</div>
                    <div>기업자유예금</div>
                    <div className="title">계좌별칭</div>
                    <div>1 기업 0987</div>
                  </li>
                  <li className="flex">
                    <div className="title">잔액</div>
                    <div>100,000,000원</div>
                    <div className="title">출금가능금액</div>
                    <div>100,000,000원</div>
                  </li>
                  <li className="flex">
                    <div className="title">조회시작일</div>
                    <div>2023-04-01</div>
                    <div className="title">조회종료일</div>
                    <div>2023-04-18</div>
                  </li>
                </ul>
              </div>
              <div className="result">
                <div className="btn_info flex justify_between align_center">
                  <button>인쇄</button>
                  <p>조회일시 2023-04-18 13:35:12</p>
                </div>
                <div className="result_data">
                  <ul className="column flex">
                    <li className="account">계좌</li>
                    <li className="date">거래일시</li>
                    <li className="memo">적요</li>
                    <li className="withdraw">출금(원)</li>
                    <li className="credit">입금(원)</li>
                    <li className="balance">잔액(원)</li>
                  </ul>
                  <ul className="data flex">
                    <li className="account">
                      <div className="flex align_center">
                        <figure>
                          <img src="" alt="" />
                        </figure>
                        <span>국민은행</span>
                      </div>
                      <div className="flex align_center">
                        12345678901234567890
                      </div>
                    </li>
                    <li className="date flex justify_center align_center">
                      2023.04.05 14:24:14
                    </li>
                    <li className="memo flex justify_center align_center">
                      비플_WeCafe2
                      <br />
                      asdf
                    </li>
                    <li className="withdraw flex justify_end align_center">
                      -1,000
                    </li>
                    <li className="credit flex justify_end align_center">+</li>
                    <li className="balance flex justify_end align_center">
                      100,000,000
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Index;
