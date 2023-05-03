import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router";
import { LogInContext } from "../../../commons/LogInContext";
import decodeJwt from "../../../hooks/decodeJwt";
import axios from "axios";
import Breadcrumb from "../../../commons/Breadcrumb";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

const Detail = () => {
  const { token, setToken, loggedUser, setLoggedUser, loggedIn, setLoggedIn } =
    useContext(LogInContext);
  const [member, setMember] = useState(null);
  const [role, setRole] = useState(null);
  const [rename, setRename] = useState(null);
  const [team, setTeam] = useState(null);
  //   const [rerename, setRerename] = useState(null);
  const rerename = member && member.name;

  const navigate = useNavigate();

  // 로컬스토리지에서 jwt 가져오기
  const savedToken = localStorage.getItem("jwt");
  setToken(savedToken);

  const location = useLocation().pathname.split("/")[2];

  useEffect(() => {
    if (savedToken === null) {
      setLoggedUser({
        id: "",
        name: "",
        exp: "",
        userCode: "",
        userNo: "",
      });
      setLoggedIn(false);
    } else {
      const decodedPayload = decodeJwt(savedToken);
      setLoggedUser({
        id: decodedPayload.sub,
        name: decodedPayload.name,
        exp: decodedPayload.exp,
        userCode: decodedPayload.userCode,
        userNo: decodedPayload.userNo,
      });
      setLoggedIn(true);
      //   memberDetail(); // 회원 한 명 정보 불러오기
      if (member === null) {
        memberDetail();
      }
      if (rename === rerename) setRename(null);
    }
  }, [member]);

  // 회원 한 명 정보 불러오기
  const memberDetail = useCallback(() => {
    axios
      .get(`http://localhost:8080/api/users/${location}`, {
        headers: { Authorization: "Bearer " + savedToken },
      })
      .then((res) => {
        if (res.status === 200) {
          console.log(res);
          setMember(res.data);
          console.log(member);

          setRename(res.data.name);
          //   setRerename(res.data.name);
          const rerename = member && member.name;
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {});
  }, []);

  // 이용자 식별 코드 변경 관리
  const handleRole = (e) => {
    const value = e.target.value;
    if (member.userCode === value) setRole(null);
    else setRole(value);
  };
  console.log(role);
  // 이름 변경 관리
  const handleRename = (e) => {
    const value = e.target.value;
    console.log(value);
    if (value === rerename) setRename(null);
    else setRename(value);
  };
  console.log(rename);
  // 부서 변경 관리
  const handleTeam = (e) => {
    const value = e.target.value;
    if (member.dept === value) setTeam(null);
    else setTeam(value);
  };
  console.log(team);

  // 부서 목록 불러오기
  // 임시 방편
  const dept = ["감사", "자금", "IR", "세무", "외환"];
  //   const [dept, setDept] = useState([]);
  //   const deptList = () => {
  //     axios.get("http://localhost:8080/api/admin/dept").then((res) => {
  //       if (res.status === 200) {
  //         console.log(res);
  //         setDept(res.data);
  //       }
  //     });
  //     console.log(dept);
  //   };

  // 수정사항 보내기
  const onSubmit = (e) => {
    e.preventDefault();

    if (role === null && rename === null && team === null) {
      alert("변경사항이 없습니다.");
    } else {
      console.log(e);
      axios
        .put(
          `http://localhost:8080/api/users`,
          {
            userNo: member.userNo,
            userCode: role,
            name: rename,
            dept: team,
          },
          {
            headers: { Authorization: "Bearer " + savedToken },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            console.log(res);
            alert("회원정보가 수정되었습니다.");
          }
        })
        .catch((err) => console.log(err))
        .finally(() => {});
    }
  };

  // 탈퇴하기
  const deleteMember = () => {
    if (window.confirm("탈퇴하시겠습니까?")) {
      axios
        .delete(`http://localhost:8080/api/users/${location}`, {
          headers: { Authorization: "Bearer " + savedToken },
        })
        .then((res) => {
          if (res.status === 200) {
            console.log(res);
            alert("탈퇴되었습니다.");
            navigate("/admin");
          }
        })
        .catch((err) => console.log(err))
        .finally(() => {});
    } else {
      return false;
    }
  };

  // 위임하기
  const changeRole = () => {
    if (
      loggedUser.userCode === "ROLE_ADMIN" &&
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
            <aside>
              <div className="aside_wrap">
                <h2>관리자 페이지</h2>
                <ul className="aside_nav">
                  <li className="aside_active">
                    <Link to="/admin">회원 목록</Link>
                  </li>
                  <li>
                    <Link to="/">계좌 열람 권한 관리</Link>
                  </li>
                  <li>
                    <Link to="/">로그인 기록 조회</Link>
                  </li>
                  <li>
                    <Link to="/">메뉴 클릭 기록 조회</Link>
                  </li>
                  <li>
                    <Link to="/">부서 관리</Link>
                  </li>
                </ul>
              </div>
            </aside>
            <section className="admin_detail">
              <h3>회원 정보</h3>
              <div>
                <form onSubmit={onSubmit}>
                  <ul>
                    <li className="flex">
                      <p>권한</p>
                      <p>
                        {loggedUser?.userCode === "ROLE_ADMIN" ? (
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
                {/* <button type="button">위임하기</button> */}
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
