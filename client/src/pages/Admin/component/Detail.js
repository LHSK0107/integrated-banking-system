import React, { useEffect, useState, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import Breadcrumb from "../../../commons/Breadcrumb";
import { Link } from "react-router-dom";
import useAxiosInterceptor from "../../../hooks/useAxiosInterceptor";
import useAuth from "../../../hooks/useAuth";
import Aside from "./Aside";
import "../admin.css";
import axios from "axios";

const Detail = () => {
  const AuthAxios = useAxiosInterceptor();
  const { setToken2, loggedUserInfo, setIsAuth, setLoggedUserInfo } = useAuth();
  const [member, setMember] = useState(null);
  const [role, setRole] = useState(null);
  const [rename, setRename] = useState(null);
  const [team, setTeam] = useState(null);
  const [dept, setDept] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const checkRole = useRef(null);
  // userNo param
  let userNo = useMemo(() => location.pathname.split("/")[2], [location]);
  // const rerename = member && member.name;
  // const [rerename, setRerename] = useState(null);
  let menuList = JSON.parse(localStorage.getItem("menuClick"));

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
        // console.log(err);
      }
    };
    const getDept = async () => {
      try {
        const response = await AuthAxios.get(`/api/dept`, {
          signal: controller.signal,
        });
        if (response.status === 200) {
          setDept(response.data.map((ele) => ele.dept));
        }
      } catch (err) {
        // console.log(err);
      }
    };
    getUsers(); // 회원 한 명 정보
    getDept(); // 부서 목록
    setRename(rename === member?.name ? null : member?.name); // 이름 변경없으면 null
    // console.log(rename, rerename);
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
  // console.log(rename);
  // console.log(member);
  // 부서 변경 관리
  const handleTeam = (e) => {
    const value = e.target.value;
    if (member?.dept === value) setTeam(null);
    else setTeam(value);
  };

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
      axios
        .delete(
          `https://iam-api.site/api/users/${userNo}`,
          { data: menuList },
          { withCredentials: true }
        )
        .then((res) => {
          if (res.status === 200) {
            alert("탈퇴되었습니다.");
            navigate("/admin");
          }
        })
        // .catch((err) => console.log(err));
    } else {
      return false;
    }
  };

  const handleDelegate = () => {
    /** logout시, context 비우는 함수 */
    const logout = () => {
      setToken2(null);
      setLoggedUserInfo(null);
      setIsAuth(false);
      navigate("/login");
    };
    const delegate = async () => {
      const controller = new AbortController();
      try {
        const response = await AuthAxios.put(`/api/admin/grantAdmin`, {
          userNo: member.userNo,
          userCode: "ROLE_ADMIN",
        });
        if (response.status === 200) {
          alert("위임되었습니다.");
          localStorage.removeItem("jwt");
          localStorage.removeItem("menuClick");
          logout();
        }
      } catch (err) {
        // console.log(err);
      }
    };
    if (window.confirm("위임하시겠습니까?")) {
      delegate();
    }
  };

  /** 위임하기 */
  const changeRole = () => {
    if (
      loggedUserInfo?.userCode === "ROLE_ADMIN" &&
      member?.userCode === "ROLE_MANAGER"
    ) {
      return (
        <button type="button" onClick={handleDelegate}>
          위임하기
        </button>
      );
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
                      <p className="flex align_center">권한</p>
                      <p className="flex align_center">
                        {loggedUserInfo?.userCode === "ROLE_ADMIN" &&
                        member?.userCode === "ROLE_ADMIN" ? (
                          "ROLE_ADMIN"
                        ) : (
                          <select value={role} onChange={handleRole}>
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
                      <p className="flex align_center">이름</p>
                      <p className="flex align_center">
                        <input
                          type="text"
                          value={rename}
                          onChange={handleRename}
                          //   placeholder={member?.name}
                        ></input>
                      </p>
                    </li>
                    <li className="flex">
                      <p className="flex align_center">부서</p>
                      <p className="flex align_center">
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
                  <div className="btn_wrap flex justify_between">
                    <button type="submit">수정하기</button>
                    <div>
                      {changeRole()}
                      {member?.userCode === "ROLE_ADMIN" ? (
                        <></>
                      ) : (
                        <button type="button" onClick={deleteMember}>
                          강제탈퇴
                        </button>
                      )}
                    </div>
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

export default Detail;
