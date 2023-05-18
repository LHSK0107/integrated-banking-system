import React from "react";
import Breadcrumb from "../../../commons/Breadcrumb";
import Aside from "./Aside";
import "../admin.css";
import useAxiosInterceptor from "../../../hooks/useAxiosInterceptor";
import { useEffect } from "react";
import { useState } from "react";
import BankName from "../../../hooks/useBankName";
import { Link } from "react-router-dom";

const InspectAccount = () => {
  const AuthAxios = useAxiosInterceptor();
  const [userList, setUserList] = useState([]); // 전체 회원 관리
  const [accountList, setAccountList] = useState([]); // 전체 계좌 관리
  const [memberAccountList, setMemberAccountList] = useState([]); // 회원별 계좌 관리
  // 폼에 대한 각 요소 변수 저장
  const [checkedVal, setCheckedVal] = useState([]);

  // 회원 정보 및 계좌 불러오기
  useEffect(() => {
    const controller = new AbortController();
    // 전체 회원 조회
    const getUsers = async () => {
      try {
        const response = await AuthAxios.get(`/api/manager/users`, {
          signal: controller.signal,
        });
        console.log(response);
        if (response.status === 200) {
          setUserList(
            response.data.filter((ele) => ele.userCode === "ROLE_USER")
          );
        }
      } catch (err) {
        console.log(`error 발생: ${err}`);
      }
    };
    // 전체 계좌 조회
    const getAccounts = async () => {
      try {
        const response = await AuthAxios.get(`/api/manager/accounts`, {
          signal: controller.signal,
        });
        console.log(response);
        if (response.status === 200) {
          setAccountList(response.data);
        }
      } catch (err) {
        console.log(`error 발생: ${err}`);
      }
    };
    getUsers();
    getAccounts();
    return () => {
      controller.abort();
    };
  }, [AuthAxios]);
  // console.log(userList);
  // console.log(accountList);

  // 회원별 계좌 리스트 가져오기
  const handleAccountList = async (userNo) => {
    const controller = new AbortController();
    // console.log(userNo);
    try {
      const response = await AuthAxios.get(
        `/api/users/accounts/available/${userNo}`,
        {
          signal: controller.signal,
        }
      );
      console.log(response);
      if (response.status === 200) {
        setMemberAccountList(response.data);
        const checkedAccounts = response.data.map((account) => ({
          acctNo: account.acctNo,
          bankCd: account.bankCd,
        }));
        setCheckedVal(checkedAccounts);
      }
    } catch (err) {
      console.log(`error 발생: ${err}`);
    }
  };
  // console.log(memberAccountList);

  // 회원별 계좌 정보 표 그리기
  // function MemberAccountList({ memberAccountList }) {
  //   const groupedAccounts = {};
  //   memberAccountList.forEach((account) => {
  //     if (groupedAccounts[account.acctDv]) {
  //       groupedAccounts[account.acctDv].push(account);
  //     } else {
  //       groupedAccounts[account.acctDv] = [account];
  //     }
  //   });

  //   return (
  //     <>
  //       {Object.entries(groupedAccounts).map(([acctDv, accounts]) => (
  //         <ul key={acctDv}>
  //           <h4>{acctDv}</h4>
  //           {accounts.map((account) => (
  //             <li key={account.acctNo}>
  //               {account.acctNo} ({account.bankCd})
  //             </li>
  //           ))}
  //         </ul>
  //       ))}
  //     </>
  //   );
  // }

  // 전체 회원 정보 표 그리기
  function UserItems({ userList }) {
    // console.log(userList);
    return (
      <>
        {userList &&
          userList.map((ele) => (
            <li
              className="flex"
              key={ele?.userNo}
              onClick={() => handleAccountList(ele?.userNo)}
            >
              <p className="list_userNo">{ele?.userNo}</p>
              <p className="list_name">{ele?.name}</p>
              <p className="list_dept">{ele?.dept}</p>
              <p className="list_email">{ele?.email}</p>
            </li>
          ))}
        {/* {memberAccountList.length > 0 && (
          <MemberAccountList memberAccountList={memberAccountList} />
        )} */}
      </>
    );
  }

  // 체크박스 핸들러
  const handleCheckboxChange = (event, account) => {
    const { checked } = event.target;
    const { acctNo, bankCd } = account;

    if (checked) {
      // 체크된 경우, 선택된 계좌 정보를 추가
      // setCheckedVal((prevOptionVal) => ({
      //   ...prevOptionVal,
      //   acctNo: [...prevOptionVal.acctNo, acctNo],
      //   bankCd: [...prevOptionVal.bankCd, bankCd],
      // }));
      setCheckedVal((prevCheckedVal) => [
        ...prevCheckedVal,
        { acctNo, bankCd },
      ]);
    } else {
      // 체크가 해제된 경우, 선택된 계좌 정보에서 제거
      // setCheckedVal((prevOptionVal) => ({
      //   ...prevOptionVal,
      //   acctNo: prevOptionVal.acctNo.filter((val) => val !== acctNo),
      //   bankCd: prevOptionVal.bankCd.filter((val) => val !== bankCd),
      // }));
      setCheckedVal((prevCheckedVal) =>
        prevCheckedVal.filter(
          (checkedAccount) =>
            checkedAccount.acctNo !== acctNo || checkedAccount.bankCd !== bankCd
        )
      );
    }
  };
  console.log("checked 값",checkedVal);

  // 전체 계좌 목록 표 그리기 + 
  function AccountItems({ accountList }) {
    const [selectedDv, setSelectedDv] = useState("01");

    const groupedAccounts = {};
    accountList.forEach((account) => {
      if (groupedAccounts[account.acctDv]) {
        groupedAccounts[account.acctDv].push(account);
      } else {
        groupedAccounts[account.acctDv] = [account];
      }
    });
    delete groupedAccounts["04"]; // 04 삭제
    // console.log(groupedAccounts);

    const groupedAccountsByBankCd = {};
    Object.keys(groupedAccounts).forEach((dv) => {
      // dv: 계좌 구분(01, 02, 03)
      groupedAccountsByBankCd[dv] = {};
      groupedAccounts[dv].forEach((account) => {
        if (groupedAccountsByBankCd[dv][account.bankCd]) {
          groupedAccountsByBankCd[dv][account.bankCd].push(account);
        } else {
          groupedAccountsByBankCd[dv][account.bankCd] = [account];
        }
      });
    });
    // console.log(groupedAccountsByBankCd);

    const sortedKeys = Object.keys(groupedAccountsByBankCd).sort();

    // sortedKeys.forEach((key) => {
    // console.log(key);
    // console.log(groupedAccountsByBankCd[key]);
    // });

    // const filterAccounts = () => {
    //   if (selectedDv === null) {
    //     return accountList;
    //   }
    //   return accountList.filter((account) => account.acctDv === selectedDv);
    // };
    // console.log(filterAccounts());

    return (
      <>
        <ul>
          {sortedKeys.map((dv) => (
            <li
              className={selectedDv === dv ? "flex active" : "flex"}
              key={dv}
              onClick={() => setSelectedDv(dv)}
            >
              <p className="list_acctDv">{dv}</p>
              {selectedDv === dv && (
                <ul className="list_acctNo">
                  {Object.keys(groupedAccountsByBankCd[dv])
                    .sort()
                    .map((bankCd) => (
                      <li key={bankCd}>
                        <div className="flex">
                          <figure className="flex justify_center align_center">
                            <img
                              src={require(`../../../assets/images/icon/bank/${bankCd}.png`)}
                              alt="bank img icon"
                            />
                          </figure>
                          <p>
                            <BankName bankCD={bankCd} />
                          </p>
                        </div>
                        <ul>
                          {groupedAccountsByBankCd[dv][bankCd].map(
                            (account) => (
                              <li key={account.acctNo}>
                                <label className="flex align_center">
                                  <input
                                    type="checkbox"
                                    // 클릭한 회원의 계좌목록과 일치하면 체크
                                    // checked={isSelectedAccount(account)}
                                    checked={
                                      // memberAccountList.some(
                                      //   (memberAccount) =>
                                      //     memberAccount.acctNo ===
                                      //     account.acctNo
                                      // ) ||
                                      checkedVal.some((checkedAccount) =>
                                        checkedAccount.acctNo.includes(
                                          account.acctNo
                                        )
                                      )
                                    }
                                    onChange={(event) =>
                                      handleCheckboxChange(event, account)
                                    }
                                    // onChange={() => {}}
                                  ></input>
                                  <span>
                                    {account.acctNo} ({account.acctNickNm})
                                  </span>
                                </label>
                              </li>
                            )
                          )}
                        </ul>
                      </li>
                    ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </>
    );
  }

  // 열람 가능 계좌 추가 및 변경
  const onSubmit = (e) => {};

  return (
    <>
      <div id="wrap">
        <div className="inner">
          <Breadcrumb title={"관리자 페이지"} subMenu={"계좌 열람 권한 관리"} />
          <div className="flex">
            <Aside now={"계좌 열람 권한 관리"} />
            <section className="inspectAccount">
              <h3>계좌 열람 권한 관리</h3>
              <div>
                <form onSubmit={onSubmit}>
                  <div className="flex">
                    <div className="inspectMemberData">
                      <ul className="flex column">
                        <li className="list_userNo">번호</li>
                        <li className="list_name">이름</li>
                        <li className="list_dept">부서</li>
                        <li className="list_email">이메일</li>
                      </ul>
                      <div>
                        <ul>
                          <UserItems userList={userList} />
                        </ul>
                      </div>
                    </div>
                    <div className="inspectAccountData">
                      <ul className="flex column">
                        <li className="list_acctDv">계좌구분</li>
                        <li className="list_acctNo">계좌번호</li>
                      </ul>
                      <div>
                        <AccountItems accountList={accountList} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <button type="submit">수정하기</button>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default InspectAccount;
