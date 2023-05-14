import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import Breadcrumb from "../../../commons/Breadcrumb";
import { Link } from "react-router-dom";
import useAxiosInterceptor from "../../../hooks/useAxiosInterceptor";
import useAuth from "../../../hooks/useAuth";
import Aside from "./Aside";
const Detail = () => {
  const AuthAxios = useAxiosInterceptor();
  const { loggedUserInfo } = useAuth();
  const [member, setMember] = useState(null);
  const [role, setRole] = useState(null);
  const [rename, setRename] = useState(null);
  const [team, setTeam] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  // userNo param
  const userNo = useMemo(() => location.pathname.split("/")[2], [location]);
  // const rerename = member && member.name;
  // const [rerename, setRerename] = useState(null);

  // 회원 한 명 정보 불러오기
  useEffect(() => {
    const controller = new AbortController();
    const getUsers = async () => {
      try {
        const response = await AuthAxios.get(`/api/users/${userNo}`, {
          signal: controller.signal,
        });
        if (response.status === 200) {
          setMember(response.data);
          setRename(response.data.name);
        }
      } catch (err) {
        console.log(`error 발생: ${err}`);
      }
    };
    getUsers();
    // console.log(rename, rerename);
    setRename(rename === member?.name ? null : member?.name);
    return () => {
      controller.abort();
    };
  }, [AuthAxios]);

  // 이용자 식별 코드 변경 관리
  const handleRole = (e) => {
    const value = e.target.value;
    if (member?.userCode === value) setRole(null);
    else setRole(value);
  };
  // 이름 변경 관리
  const handleRename = (e) => {
    const value = e.target.value;
    // if (member?.name === value) setRename(null);
    // else {
    setRename(value);
    // setRerename(value);
    // }
  };
  console.log(rename);
  // 부서 변경 관리
  const handleTeam = (e) => {
    const value = e.target.value;
    if (member?.dept === value) setTeam(null);
    else setTeam(value);
  };
  // 부서 목록 불러오기
  // 임시 방편
  const dept = ["감사", "자금", "IR", "세무", "외환"];

  // 수정사항 보내기
  const onSubmit = (e) => {
    e.preventDefault();
    if (role === null && rename === null && team === null) {
      alert("변경사항이 없습니다.");
    } else {
      const getUsers = async () => {
        try {
          const controller = new AbortController();
          const response = await AuthAxios.put(
            "/api/users",
            {
              userNo: member.userNo,
              userCode: role,
              name: rename,
              dept: team,
            },
            {
              signal: controller.signal,
            }
          );
          if (response.status === 200) {
            alert("회원정보가 수정되었습니다.");
            navigate(`/admin`);
          }
        } catch (err) {
          alert(`error 발생: ${err}`);
          navigate("/admin");
        }
      };
      getUsers();
    }
  };
  /** 탈퇴하기 */
  const deleteMember = () => {
    if (window.confirm("탈퇴하시겠습니까?")) {
      const getUsers = async () => {
        try {
          const controller = new AbortController();
          const response = await AuthAxios.delete(`/api/users/${userNo}`, {
            signal: controller.signal,
          });
          if (response.status === 200) {
            alert("탈퇴되었습니다.");
            navigate("/admin");
          }
        } catch (err) {
          console.log(`error 발생: ${err}`);
        }
      };
      getUsers();
    } else {
      return false;
    }
  };

  /** 위임하기 */
  const changeRole = () => {
    if (
      loggedUserInfo?.userCode === "ROLE_ADMIN" &&
      member?.userCode === "ROLE_MANAGER"
    ) {
      return <button>위임하기</button>;
    }
  };

  return (
    <>
      <div id="wrap">
        <div className="inner">
          <Breadcrumb title={"관리자 페이지"} subMenu={"회원 정보"} />
          <div className="flex">
            <Aside now={"회원 목록"} />
            <section className="admin_detail">
              <h3>회원 정보</h3>
              <div>
                <form onSubmit={onSubmit}>
                  <ul>
                    <li className="flex">
                      <p>권한</p>
                      <p>
                        {loggedUserInfo?.userCode === "ROLE_ADMIN" ? (
                          <select value={role} onChange={handleRole}>
                            <option
                              value="ROLE_ADMIN"
                              selected={
                                member?.userCode === "ROLE_ADMIN" ? true : false
                              }
                            >
                              ROLE_ADMIN
                            </option>
                            <option
                              value="ROLE_MANAGER"
                              selected={
                                member?.userCode === "ROLE_MANAGER"
                                  ? true
                                  : false
                              }
                            >
                              ROLE_MANAGER
                            </option>
                            <option
                              value="ROLE_USER"
                              selected={
                                member?.userCode === "ROLE_USER" ? true : false
                              }
                            >
                              ROLE_USER
                            </option>
                            <option
                              value="ROLE_BLACK"
                              selected={
                                member?.userCode === "ROLE_BLACK" ? true : false
                              }
                            >
                              ROLE_BLACK
                            </option>
                          </select>
                        ) : (
                          <select>
                            <option value="ROLE_BLACK">ROLE_BLACK</option>
                          </select>
                        )}
                      </p>
                    </li>
                    <li className="flex">
                      <p>회원번호</p>
                      <p>{member?.userNo}</p>
                    </li>
                    <li className="flex">
                      <p>ID</p>
                      <p>{member?.id}</p>
                    </li>
                    <li className="flex">
                      <p>이름</p>
                      <p>
                        <input
                          type="text"
                          value={rename}
                          onChange={handleRename}
                          //   placeholder={member?.name}
                        ></input>
                      </p>
                    </li>
                    <li className="flex">
                      <p>부서</p>
                      <p>
                        <select value={team || null} onChange={handleTeam}>
                          {dept.map((ele) => (
                            <option
                              value={ele}
                              key={ele}
                              selected={member?.dept === ele ? true : false}
                            >
                              {ele}
                            </option>
                          ))}
                        </select>
                      </p>
                    </li>
                    <li className="flex">
                      <p>이메일</p>
                      <p>{member?.email}</p>
                    </li>
                    <li className="flex">
                      <p>핸드폰번호</p>
                      <p>{member?.phone}</p>
                    </li>
                    {}
                  </ul>
                  <div>
                    <button type="submit">수정하기</button>
                  </div>
                </form>
              </div>
              <div>
                {changeRole()}
                <button type="button" onClick={deleteMember}>
                  탈퇴하기
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Detail;
