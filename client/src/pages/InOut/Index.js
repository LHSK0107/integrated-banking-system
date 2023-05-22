/* eslint-disable */
import "./inout.css";
import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import { useParams } from "react-router-dom";
import { Description } from "../../commons/Description";
import { SideNav } from "../../commons/SideNav";
import Breadcrumb from "../../commons/Breadcrumb";
import BankName from "../../hooks/useBankName";
import useCurrentTime from "../../hooks/useCurrentTime";
import useAxiosInterceptor from "../../hooks/useAxiosInterceptor";
import useAuth from "../../hooks/useAuth";
import ReactPaginate from "react-paginate";

const Index = () => {
  const { bankCD, acctNo } = useParams();
  const AuthAxios = useAxiosInterceptor();
  const { loggedUserInfo } = useAuth();
  const [index, setIndex] = useState(0);
  /** 폼에 대한 각 요소 변수 저장 -> 변수명 차후 변경 */
  const [optionVal, setOptionVal] = useState({
    bankCD: "",
    acctNO: "",
    strDate: "",
    endDate: "",
    lang: "",
    inout: "",
    arrange: "recent",
    paging: "10",
  });
  const [initialData, setInitialData] = useState([]);
  const [apiData, setApiData] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    const getAvailableAcct = async () => {
      try {
        const response = await AuthAxios.get(
          loggedUserInfo?.userCode === "ROLE_ADMIN" ||
            loggedUserInfo?.userCode === "ROLE_MANAGER"
            ? "/api/manager/accounts"
            : `/api/users/accounts/available/${loggedUserInfo?.userNo}`,
          {
            signal: controller.signal,
          }
        );
        setInitialData(response.data);
        setApiData(response.data);
      } catch (err) {
        console.log(`error 발생: ${err}`);
      }
    };
    loggedUserInfo?.userCode && getAvailableAcct();
    return () => {
      controller.abort();
    };
  }, [loggedUserInfo]);

  // 탭 클릭
  const handleTabClick = (value) => {
    setIndex(value);
    if (value === 0) {
      setApiData(initialData?.filter((ele) => ele.acctDv !== "03"));
    } else if (value === 1) {
      setApiData(initialData?.filter((ele) => ele.acctDv === "03"));
    }
  };

  /** 계좌 중, 은행코드 중복 제거 함수 */
  const getBankCD = () => {
    let arr = [];
    apiData?.filter(
      (val) => arr.includes(val?.bankCd) === false && arr.push(val?.bankCd)
    );
    return arr;
  };
  /** 은행별 계좌 요소를 option으로 리턴하는 함수 */
  const bankListOption =
    apiData &&
    getBankCD().map((ele, i) => {
      return (
        <option
          key={i}
          name="bankCD"
          value={ReactDOMServer.renderToString(
            <BankName bankCD={ele} num={0} />
          )}
        >
          <BankName bankCD={ele} />
        </option>
      );
    });
    useEffect(()=>{
      bankListOption && setOptionVal({...optionVal, bankCD: bankCD, acctNO: acctNo});
    },[apiData,bankCD,acctNo]);

  /** 은행명 select 값 handler */
  const handleBankNMSelectOnChange = (e) => {
    setOptionVal({ ...optionVal, bankCD: e.target.value });
  };
  /** 계좌 select 값 handler */
  const handleAcctSelectOnChange = (e) => {
    setOptionVal({ ...optionVal, acctNO: e.target.value });
  };
  /** 페이지 건수 값 handler */


  /** 은행명 select 값에 따른 계좌번호 리스트 변경 */
  const acctListOption = () =>
    apiData &&
    apiData
      ?.filter((ele) => {
        if (optionVal?.bankCD === "") {
          return ele;
        } else if (optionVal?.bankCD === ele?.bankCd) {
          return ele;
        }
      })
      .map((val, i) => {
        return (
          <option key={i} value={val?.acctNo}>
            {/* &nbsp;{val?.ACCT_NO}&nbsp;{val?.loanNm}&nbsp;{val?.acctNickNm} */}
            &nbsp;{val?.acctNo}&nbsp;{val?.acctNickNm}
          </option>
        );
      });

  // input date ref 설정
  const strInputRef = useRef();
  const endInputRef = useRef();
  const handleDateOnChange = (e) => {
    const { name, value } = e.target;
    setOptionVal({ ...optionVal, [name]: value });
    name === "endDate" && setLimitInputValue(value);
  };
  // 현재 date와 date 형식 가져오기
  // 초기 기본 값으로 오늘 날짜로부터 30일간격의 날짜를 input value로 지정
  const { nowDate, currentTime } = useCurrentTime(0);
  const initialDate = useCallback(() => {
    const today = new Date(nowDate);
    const currentStr = `${today.getFullYear()}${(
      "0" +
      (today.getMonth() + 1)
    ).slice(-2)}${("0" + today.getDate()).slice(-2)}`;
    today.setDate(today.getDate() - 29);
    const pastStr = `${today.getFullYear()}${(
      "0" +
      (today.getMonth() + 1)
    ).slice(-2)}${("0" + today.getDate()).slice(-2)}`;
    const setpastDate = `${today.getFullYear()}-${(
      "0" +
      (today.getMonth() + 1)
    ).slice(-2)}-${("0" + today.getDate()).slice(-2)}`;
    setOptionVal({ ...optionVal, strDate: setpastDate, endDate: currentTime });
    setLimitInputValue(currentTime);
    return { currentStr, pastStr };
  }, [nowDate]);
  /** 날짜 범위에 따른 달력 제한 부여 */
  const setLimitInputValue = useCallback((end) => {
    const arr = end.split("-");
    const imsiDate = new Date();
    imsiDate.setFullYear(parseInt(arr[0]), parseInt(arr[1]), parseInt(arr[2]));
    imsiDate.setDate(imsiDate.getDate() - 30);
    const pastStr = `${imsiDate.getFullYear()}-${(
      "0" + imsiDate.getMonth()
    ).slice(-2)}-${("0" + imsiDate.getDate()).slice(-2)}`;
    // setOptionVal({...optionVal, strDate:pastStr, endDate:end});
    strInputRef.current.setAttribute("min", pastStr);
    endInputRef.current.getAttribute("max") === null &&
      endInputRef.current.setAttribute("max", end);
    strInputRef.current.setAttribute("max", end);
  }, []);
  // nowDate가 있을 경우, 날짜 초기화 함수 실행
  useEffect(() => {
    nowDate && initialDate();
  }, []);

  /** radio 버튼에 대한 onChange 핸들러 */
  const handleRadioOnChange = (e) => {
    const { name, value } = e.target;
    setOptionVal({ ...optionVal, [name]: value });
  };
  const [inoutDataList, setInoutDataList] = useState(null);
  const [pageCount, setPageCount] = useState(null);
  /** 조회 버튼 시, 서버 요청*/
  const handleOnSubmit = (e) => {
    e.preventDefault();
    setInoutDataList(null);
    const getData = async () => {
      const data1 = await AuthAxios.post(
        loggedUserInfo?.userCode === "ROLE_ADMIN" ||
          loggedUserInfo?.userCode === "ROLE_MANAGER"
          ? "/api/manager/accounts/inout"
          : "/api/users/accounts/inout",
        {
          isLoan: index, // 예금은 0 => false, 대출은 1 => true
          bankCd: optionVal?.bankCD === "" ? "All" : optionVal?.bankCD,
          acctNo: optionVal?.acctNO === "" ? "All" : optionVal?.acctNO,
          startDt: optionVal?.strDate,
          endDt: optionVal?.endDate,
          inoutDv: optionVal?.inout === "" ? "All" : optionVal?.inout,
          sort: optionVal?.arrange,
          page: 1,
          pageSize: optionVal?.paging,
        }
      );
      return data1;
    };
    getData()
      .then((res) => {
        alert("조회 완료");
        setPageCount(res.data.totalPage);
        setInoutDataList(res.data.list);
      })
      .catch((err) => alert("조회 확인 후, 다시 시도해주시기 바랍니다."));
    return false;
  };

  // pagination
  const handlePageClick = async (event) => {
    // event.selected는 인덱스

    // 데이터를 가져오는 로직
    const fetchData = async (page) => {
      try {
        const data1 = await AuthAxios.post(
          loggedUserInfo?.userCode === "ROLE_ADMIN" ||
            loggedUserInfo?.userCode === "ROLE_MANAGER"
            ? "/api/manager/accounts/inout"
            : "/api/users/accounts/inout",
          {
            isLoan: index,
            bankCd: optionVal?.bankCD === "" ? "All" : optionVal?.bankCD,
            acctNo: optionVal?.acctNO === "" ? "All" : optionVal?.acctNO,
            startDt: optionVal?.strDate,
            endDt: optionVal?.endDate,
            inoutDv: optionVal?.inout === "" ? "All" : optionVal?.inout,
            sort: optionVal?.arrange,
            page: page, // 변경된 페이지 값 사용
            pageSize: optionVal?.paging,
          }
        );
        setPageCount(data1.data.totalPage);
        setInoutDataList(data1.data.list);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("조회 확인 후, 다시 시도해주시기 바랍니다.");
      }
    };

    await fetchData(event.selected + 1);
  };

  return (
    <div id="wrap">
      <div className="inner">
        <Breadcrumb title={"조회"} subMenu={"입출금내역조회"} />
        <div className="inoutPage flex">
          <SideNav now={"입출내역조회"} />
          <section>
            <h3>입출내역조회</h3>
            <Description />
            <div className="form_wrap">
              <ul className="tab flex">
                <li
                  className={index === 0 ? "active" : ""}
                  onClick={() => handleTabClick(0)}
                >
                  예금
                </li>
                <li
                  className={index === 1 ? "active" : "false"}
                  onClick={() => handleTabClick(1)}
                >
                  대출
                </li>
              </ul>
              <form className="report_form" onSubmit={(e) => handleOnSubmit(e)}>
                <div>
                <ul>
                  <li className="flex">
                    <p className="flex align_center">계좌</p>
                    <div className="flex align_center">
                      <select value={optionVal?.bankCD} onChange={handleBankNMSelectOnChange}>
                        <option name="bankCD" value="">
                          전체 은행
                        </option>
                        {bankListOption}
                      </select>
                      <select value={optionVal?.acctNO} onChange={handleAcctSelectOnChange}>
                        <option value="">전체 계좌</option>
                        {acctListOption()}
                      </select>
                    </div>
                  </li>
                  <li className="flex">
                    <p className="flex align_center">조회기간</p>
                    <div>
                      <div className="flex align_center">
                        <input
                          type="date"
                          name="strDate"
                          onKeyDown={(e) => e.preventDefault()}
                          value={optionVal.strDate}
                          required
                          ref={strInputRef}
                          onChange={handleDateOnChange}
                        />
                        <b>~</b>
                        <input
                          type="date"
                          name="endDate"
                          onKeyDown={(e) => e.preventDefault()}
                          value={optionVal.endDate}
                          required
                          ref={endInputRef}
                          onChange={handleDateOnChange}
                        />
                      </div>
                      <div className="flex align_center">
                        <span onClick={dateChangeBtn(0)}>당일</span>
                        <span onClick={dateChangeBtn(1)}>3일</span>
                        <span onClick={dateChangeBtn(2)}>1주일</span>
                        <span onClick={dateChangeBtn(3)}>1개월</span>
                      </div>
                    </div>
                  </li>
                  <li className="flex">
                    <p className="flex align_center">언어구분</p>
                    <div
                      className="flex align_center"
                      onChange={handleRadioOnChange}
                    >
                      <label className="flex align_center">
                        <input
                          type="radio"
                          id="kor"
                          name="lang"
                          value="kr"
                          defaultChecked
                        />
                        국문
                      </label>
                      <label className="flex align_center">
                        <input
                          type="radio"
                          id="eng"
                          name="lang"
                          value="en"
                          disabled
                        />
                        영문
                      </label>
                    </div>
                  </li>
                  <li className="flex">
                    <p className="flex align_center">조회구분</p>
                    <div
                      className="flex align_center"
                      onChange={handleRadioOnChange}
                    >
                      <label className="flex align_center">
                        <input
                          type="radio"
                          id="inout"
                          name="sort"
                          value=""
                          defaultChecked
                        />
                        전체
                      </label>
                      <label className="flex align_center">
                        <input type="radio" id="in" name="sort" value="01" />
                        입금
                      </label>
                      <label className="flex align_center">
                        <input type="radio" id="out" name="sort" value="02" />
                        출금
                      </label>
                    </div>
                  </li>
                  <li className="flex">
                    <p className="flex align_center">조회순서</p>
                    <div
                      className="flex align_center"
                      onChange={handleRadioOnChange}
                    >
                      <label className="flex align_center">
                        <input
                          type="radio"
                          id="new"
                          name="arrange"
                          value="recent"
                          defaultChecked
                        />
                        최근일로부터
                      </label>
                      <label className="flex align_center">
                        <input
                          type="radio"
                          id="old"
                          name="arrange"
                          value="past"
                        />
                        과거일로부터
                      </label>
                    </div>
                  </li>
                  <li className="flex">
                    <p className="flex align_center">정렬방식</p>
                    <div
                      className="flex align_center"
                      onChange={handleRadioOnChange}
                    >
                      <label className="flex align_center">
                        <input
                          value="10"
                          type="radio"
                          id="ten"
                          name="paging"
                          defaultChecked
                        />
                        10건
                      </label>
                      <label className="flex align_center">
                        <input
                          value="30"
                          type="radio"
                          id="thirty"
                          name="paging"
                        />
                        30건
                      </label>
                      <label className="flex align_center">
                        <input
                          value="50"
                          type="radio"
                          id="fifty"
                          name="paging"
                        />
                        50건
                      </label>
                    </div>
                  </li>
                </ul>
                </div>
                
                <div className="btn_wrap flex justify_center">
                  <button type="submit">조회</button>
                </div>
              </form>
            </div>
            {inoutDataList && (
              <>
                <div className="result_wrap">
                  <div className="result">
                    <div className="btn_info flex justify_end align_center">
                      {/* <p>조회일시 {currentTime}</p> */}
                      <p className="dateTime">
                        조회일시{" "}
                        <span>
                          {new Date(new Date().getTime() + 9 * 60 * 60 * 1000)
                            .toISOString()
                            .replace("T", " ")
                            .slice(0, -5)}
                        </span>
                      </p>
                    </div>
                    <div className="result_data">
                      <ul>
                        <li className="flex justify_between">
                          <div className="account">계좌</div>
                          <div className="trscTm">거래일시</div>
                          <div className="rmrk">적요</div>
                          <div className="outMoney">출금(원)</div>
                          <div className="inMoney">입금(원)</div>
                          <div className="bal">잔액(원)</div>
                        </li>
                        {inoutDataList?.map((ele, i) => {
                          return (
                            <li
                              key={i}
                              className="flex justify_between align_center"
                            >
                              <div className="account flex flex_column justify_center">
                                <p>
                                  {ele?.bankCd === null ? (
                                    "없습니다"
                                  ) : (
                                    <BankName bankCD={ele?.bankCd} />
                                  )}
                                </p>
                                <p>
                                  {ele?.acctNo === null
                                    ? "없습니다"
                                    : ele?.acctNo}
                                </p>
                              </div>
                              <div className="trscTm flex flex_column justify_center align_center">
                                {`${ele?.trscDt} ${ele?.trscTm}`}
                              </div>
                              <div className="rmrk flex justify_center align_center">
                                {ele?.rmrk1}
                              </div>
                              <div className="outMoney flex justify_end align_center">
                                {ele?.inoutDv === "2" ? `-${ele?.trscAmt}` : 0}
                              </div>
                              <div className="inMoney flex justify_end align_center">
                                {ele?.inoutDv === "1" ? `+${ele?.trscAmt}` : 0}
                              </div>
                              <div className="mobile">
                              <p className="c_blue">{ele?.inoutDv === "2" ? `-${ele?.trscAmt}원` : ""}</p>
                              <p className="c_red">{ele?.inoutDv === "1" ? `+${ele?.trscAmt}원` : ""}</p>
                              </div>
                              <div className="bal flex justify_end align_center">
                                잔액 {ele?.bal}원
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <div className="pagingBtn flex justify_center">
                      <ReactPaginate
                        pageCount={pageCount}
                        marginPagesDisplayed={3} // 1 2 3 ... ~
                        pageRangeDisplayed={3} // 1 2 3 ... 6 7 8 ... ~
                        itemsPerPage={10}
                        breakLabel="..." // Label for ellipsis.
                        previousLabel="< 이전"
                        nextLabel="다음 >"
                        onPageChange={handlePageClick} // The method to call when a page is changed. Exposes the current page object as an argument.
                        renderOnZeroPageCount={null}
                        className={"flex"}
                        activeClassName={"pagingBtnActive"} // active page
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
  function dateChangeBtn(date) {
    return () => {
      if (date === 0) {
        const date = currentTime;
        setOptionVal({ ...optionVal, strDate: date, endDate: date });
      } else if (date === 1) {
        const date = new Date(nowDate);
        date.setDate(date.getDate() - 2);
        const strDate = `${date.getFullYear()}-${(
          "0" +
          (date.getMonth() + 1)
        ).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;
        setOptionVal({ ...optionVal, strDate: strDate, endDate: currentTime });
      } else if (date === 2) {
        const date = new Date(nowDate);
        date.setDate(date.getDate() - 6);
        const strDate = `${date.getFullYear()}-${(
          "0" +
          (date.getMonth() + 1)
        ).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;
        setOptionVal({ ...optionVal, strDate: strDate, endDate: currentTime });
      } else if (date === 3) {
        const date = new Date(nowDate);
        date.setDate(date.getDate() - 29);
        const strDate = `${date.getFullYear()}-${(
          "0" +
          (date.getMonth() + 1)
        ).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;
        setOptionVal({ ...optionVal, strDate: strDate, endDate: currentTime });
      }
    };
  }
};

export default Index;
